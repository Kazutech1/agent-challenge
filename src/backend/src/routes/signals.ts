import { Router, Request, Response } from "express";
import fetch from "node-fetch";

const router = Router();
const SHYFT_BASE = "https://api.shyft.to/sol/v1";
const NETWORK = "mainnet-beta";

export interface Signal {
  type: "whale_in" | "whale_out" | "swap" | "unknown";
  description: string;
  amount?: number;
  tokenSymbol?: string;
  mint?: string;
  txSignature?: string;
  links: {
    solscan_tx?: string;
    solscan_token?: string;
    pumpdotfun?: string;
  };
}

function buildLinks(txSignature?: string, mint?: string) {
  return {
    ...(txSignature && {
      solscan_tx: `https://solscan.io/tx/${txSignature}`,
    }),
    ...(mint && {
      solscan_token: `https://solscan.io/token/${mint}`,
      pumpdotfun: `https://pump.fun/${mint}`,
    }),
  };
}

function detectSignals(txs: any[]): Signal[] {
  const signals: Signal[] = [];

  for (const tx of txs) {
    const txSignature: string | undefined = tx.signatures?.[0];

    // --- SWAP signals ---
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
        const mint = swapped.out?.mint ?? swapped.in?.mint;

        signals.push({
          type: "swap",
          description: `Swapped ${inAmount} ${inSymbol} → ${outAmount} ${outSymbol}`,
          amount: Number(outAmount),
          tokenSymbol: outSymbol,
          mint,
          txSignature,
          links: buildLinks(txSignature, mint),
        });
      }
    }

    // --- Whale move signals ---
    const largeChanges = tx.token_balance_changes?.filter(
      (c: any) => Math.abs(c.change_amount) > 100_000_000_000
    );

    if (largeChanges?.length > 0) {
      for (const change of largeChanges) {
        const amount = Math.abs(change.change_amount) / 1e9;
        const direction = change.change_amount > 0 ? "whale_in" : "whale_out";
        const mint: string = change.mint;

        signals.push({
          type: direction,
          description: `Whale ${direction === "whale_in" ? "received" : "sent"} ${amount.toFixed(2)} tokens`,
          amount,
          mint,
          txSignature,
          links: buildLinks(txSignature, mint),
        });
      }
    }
  }

  return signals;
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

    const data = (await response.json()) as any;

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

