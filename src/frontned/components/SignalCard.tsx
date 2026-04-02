interface SignalLinks {
  solscan_tx?: string;
  solscan_token?: string;
  pumpdotfun?: string;
}

export interface Signal {
  type: "whale_in" | "whale_out" | "swap" | "unknown";
  description: string;
  amount?: number;
  tokenSymbol?: string;
  mint?: string;
  txSignature?: string;
  links: SignalLinks;
}

interface SignalCardProps {
  signal: Signal;
  index: number;
}

const TYPE_CONFIG = {
  whale_in:  { icon: "↓", color: "text-green-400", label: "WHALE IN" },
  whale_out: { icon: "↑", color: "text-red-400",   label: "WHALE OUT" },
  swap:      { icon: "⇄", color: "text-yellow-400", label: "SWAP" },
  unknown:   { icon: "·", color: "text-zinc-500",   label: "EVENT" },
};

export default function SignalCard({ signal, index }: SignalCardProps) {
  const config = TYPE_CONFIG[signal.type] ?? TYPE_CONFIG.unknown;

  const tweetText = encodeURIComponent(
    `🐋 Solana Signal\n\n${signal.description}\n\n${signal.links.solscan_tx ?? ""}\n\n#Solana #DeFi`
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  const shortMint = signal.mint
    ? `${signal.mint.slice(0, 6)}...${signal.mint.slice(-4)}`
    : null;

  const shortTx = signal.txSignature
    ? `${signal.txSignature.slice(0, 8)}...`
    : null;

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4 hover:border-zinc-600 transition-colors">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="font-mono text-xs text-zinc-600 mt-0.5 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-lg ${config.color}`}>{config.icon}</span>
            <span className={`font-mono text-xs font-bold ${config.color}`}>
              {config.label}
            </span>
          </div>
          <p className="font-mono text-sm text-zinc-200 leading-relaxed">
            {signal.description}
          </p>
        </div>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3 py-1.5 border border-zinc-700 rounded text-zinc-400 hover:border-zinc-400 hover:text-zinc-100 font-mono text-xs transition-colors"
        >
          Share ↗
        </a>
      </div>

      {/* Meta + Links */}
      <div className="mt-3 flex flex-wrap items-center gap-2 pl-16">
        {shortMint && (
          <span className="font-mono text-xs text-zinc-600">mint: {shortMint}</span>
        )}
        {shortTx && (
          <span className="font-mono text-xs text-zinc-600">tx: {shortTx}</span>
        )}
        {signal.links.solscan_tx && (
          <a href={signal.links.solscan_tx} target="_blank" rel="noopener noreferrer"
            className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-green-400 transition-colors">
            Solscan TX ↗
          </a>
        )}
        {signal.links.solscan_token && (
          <a href={signal.links.solscan_token} target="_blank" rel="noopener noreferrer"
            className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-green-400 transition-colors">
            Token ↗
          </a>
        )}
        {signal.links.pumpdotfun && (
          <a href={signal.links.pumpdotfun} target="_blank" rel="noopener noreferrer"
            className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-green-400 transition-colors">
            Pump.fun ↗
          </a>
        )}
      </div>
    </div>
  );
}