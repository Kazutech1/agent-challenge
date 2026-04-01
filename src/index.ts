import { type Plugin, type Action, type IAgentRuntime, type Memory, type State, type HandlerCallback } from "@elizaos/core";
import fetch from "node-fetch";

const SHYFT_BASE = "https://api.shyft.to/sol/v1";
const NETWORK = "mainnet-beta";

// ── Shyft helpers ──────────────────────────────────────────────

async function getWalletPortfolio(wallet: string, apiKey: string) {
  const res = await fetch(
    `${SHYFT_BASE}/wallet/all_tokens?network=${NETWORK}&wallet=${wallet}`,
    { headers: { "x-api-key": apiKey } }
  );
  const data = await res.json() as any;
  if (!data.success) throw new Error(`Portfolio fetch failed: ${data.message}`);
  return data.result;
}

async function getRecentTransactions(wallet: string, apiKey: string, limit = 10) {
  const res = await fetch(
    `${SHYFT_BASE}/transaction/history?network=${NETWORK}&account=${wallet}&limit=${limit}`,
    { headers: { "x-api-key": apiKey } }
  );
  const data = await res.json() as any;
  console.log("Data: ", data);
  if (!data.success) throw new Error(`Tx fetch failed: ${data.message}`);
  return data.result;
}

// ── Signal detection logic ─────────────────────────────────────

function detectSignals(txs: any[]): string[] {
  const signals: string[] = [];

  for (const tx of txs) {
    // Detect swaps with real token names from actions
    if (tx.type === "SWAP" || tx.type === "SWAP2") {
      const swapAction = tx.actions?.find((a: any) => a.type === "SWAP" || a.type === "SWAP2");
      const swapped = swapAction?.info?.tokens_swapped;

      if (swapped) {
        const inAmount = swapped.in?.amount ?? 0;
        const inSymbol = swapped.in?.symbol ?? "?";
        const outAmount = swapped.out?.amount ?? 0;
        const outSymbol = swapped.out?.symbol ?? "?";
        const sig = tx.signatures?.[0]?.slice(0, 8);

        signals.push(
          `Swap: ${inAmount.toFixed(2)} ${inSymbol} → ${outAmount.toFixed(2)} ${outSymbol} (${sig}...)`
        );
      }
    }

    // Detect large token balance changes (whale threshold: >100k units)
    const largeChanges = tx.token_balance_changes?.filter(
      (c: any) => Math.abs(c.change_amount) > 100_000_000_000 // raw units, adjust per token decimals
    );

    if (largeChanges?.length > 0) {
      for (const change of largeChanges) {
        signals.push(
          `Large balance change: ${(change.change_amount / 1e9).toFixed(2)} tokens on mint ${change.mint.slice(0, 8)}...`
        );
      }
    }
  }

  return signals.length > 0 ? signals : ["No significant signals in recent transactions"];
}

// ── Action definition ──────────────────────────────────────────

const fetchSolanaSignalsAction: Action = {
  name: "FETCH_SOLANA_SIGNALS",
  description: "Fetches recent Solana on-chain activity for a wallet and detects significant DeFi signals like whale moves and large swaps.",
  similes: [
    "CHECK_WALLET",
    "SCAN_CHAIN",
    "GET_SIGNALS",
    "MONITOR_SOLANA",
    "DEFI_CHECK",
  ],

  validate: async (runtime: IAgentRuntime) => {
    const hasShyft = !!runtime.getSetting("SHYFT_API_KEY");
    if (!hasShyft) console.warn("SHYFT_API_KEY not set — FETCH_SOLANA_SIGNALS disabled");
    return hasShyft;
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    _options?: any,
    callback?: HandlerCallback
  ) => {
    const apiKey = runtime.getSetting("SHYFT_API_KEY")!;

    // Extract wallet address from the message if provided, else use env default
    const walletMatch = (message.content.text as string)?.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/);
    const wallet = (walletMatch?.[0] ?? runtime.getSetting("WATCHED_WALLET")) as string;

    if (!wallet) {
      await callback?.({
        text: "No wallet address found. Please provide a Solana wallet address or set WATCHED_WALLET in your config.",
      });
      return;
    }

    try {
      await callback?.({ text: `Scanning wallet ${wallet.slice(0, 8)}... on Solana mainnet...` });

      const [portfolio, txs] = await Promise.all([
        getWalletPortfolio(wallet as string, apiKey as string),
        getRecentTransactions(wallet as string, apiKey as string, 20),
      ]);

      const signals = detectSignals(txs);

      const topTokens = portfolio
        .slice(0, 5)
        .map((t: any) => `${t.symbol ?? "?"}: ${Number(t.balance).toFixed(2)}`)
        .join(", ");

      const summary = [
        `Wallet: ${wallet.slice(0, 8)}...`,
        `Top holdings: ${topTokens}`,
        `Signals (last 20 txs):`,
        ...signals.map(s => `  - ${s}`),
      ].join("\n");

      await callback?.({ text: summary });

    } catch (err: any) {
      await callback?.({ text: `Error scanning wallet: ${err.message}` });
    }
  },

  examples: [
    [
      {
        name: "{{user1}}",
        content: { text: "Check wallet 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU" },
      },
      {
        name: "SolanaIntel",
        content: { text: "Scanning wallet 7xKXtg2... on Solana mainnet..." },
      },
    ],
    [
      {
        name: "{{user1}}",
        content: { text: "Any whale activity today?" },
      },
      {
        name: "SolanaIntel",
        content: { text: "Scanning wallet..." },
      },
    ],
  ],
};

// ── Plugin export ──────────────────────────────────────────────

export const customPlugin: Plugin = {
  name: "solana-defi-plugin",
  description: "Monitors Solana on-chain activity and detects DeFi signals",
  actions: [fetchSolanaSignalsAction],
  providers: [],
  evaluators: [],
};

export default customPlugin;

