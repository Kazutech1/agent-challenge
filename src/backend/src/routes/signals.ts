import { Router, Request, Response } from "express";
import fetch from "node-fetch";

const router = Router();

const SHYFT_BASE = "https://api.shyft.to/sol/v1";
const NETWORK = "mainnet-beta";

function detectSignals(txs: any[]): string[] {
  const signals: string[] = [];

  for (const tx of txs) {
    if (tx.type === "SWAP" || tx.type === "SWAP2") {
      const swapAction = tx.actions?.find(
        (a: any) => a.type === "SWAP" || a.type === "SWAP2"
      );
      const swapped = swapAction?.info?.tokens_swapped;

      if (swapped) {
        const inAmount = Number(swapped.in?.amount ?? 0).toFixed(2);
        const inSymbol = swapped.in?.symbol ?? "?";
        const outAmount = Number(swapped.out?.amount ?? 0).toFixed(2);
        const outSymbol = swapped.out?.symbol ?? "?";
        const sig = tx.signatures?.[0]?.slice(0, 8);
        signals.push(
          `Swap: ${inAmount} ${inSymbol} → ${outAmount} ${outSymbol} (${sig}...)`
        );
      }
    }

    const largeChanges = tx.token_balance_changes?.filter(
      (c: any) => Math.abs(c.change_amount) > 100_000_000_000
    );

    if (largeChanges?.length > 0) {
      for (const change of largeChanges) {
        const amount = (Math.abs(change.change_amount) / 1e9).toFixed(2);
        const direction = change.change_amount > 0 ? "received" : "sent";
        signals.push(
          `Whale ${direction} ${amount} tokens — mint ${change.mint.slice(0, 8)}...`
        );
      }
    }
  }

  return signals.length > 0 ? signals : ["No significant signals detected"];
}

router.get("/", async (_req: Request, res: Response) => {
  const apiKey = process.env.SHYFT_API_KEY;
  const wallet = process.env.WATCHED_WALLET;

  if (!apiKey || !wallet) {
    res.status(500).json({ error: "SHYFT_API_KEY or WATCHED_WALLET not configured" });
    return;
  }

  try {
    const response = await fetch(
      `${SHYFT_BASE}/transaction/history?network=${NETWORK}&account=${wallet}&limit=20`,
      { headers: { "x-api-key": apiKey } }
    );

    const data = await response.json() as any;

    if (!data.success) {
      res.status(502).json({ error: "Shyft API error", detail: data.message });
      return;
    }

    const signals = detectSignals(data.result);

    res.json({
      wallet,
      signals,
      txCount: data.result.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Signals error:", err.message);
    res.status(500).json({ error: "Failed to fetch signals", detail: err.message });
  }
});

export default router;