"use client";

import { useEffect, useState } from "react";
import SignalCard, { Signal } from "@/components/SignalCard";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

interface SignalsData {
  wallet: string;
  signals: Signal[];
  txCount: number;
  fetchedAt: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<SignalsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/signals`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch signals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 60_000);
    return () => clearInterval(interval);
  }, []);

  const shortWallet = data?.wallet
    ? `${data.wallet.slice(0, 4)}...${data.wallet.slice(-4)}`
    : "—";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-zinc-100 tracking-tight">
          Whale Signals
        </h1>
        <p className="font-mono text-sm text-zinc-500 mt-1">
          Watching <span className="text-green-400">{shortWallet}</span>
          {data && (
            <>
              {" "}· {data.txCount} txs scanned ·{" "}
              <span className="text-zinc-600">
                {new Date(data.fetchedAt).toLocaleTimeString()}
              </span>
            </>
          )}
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={fetchSignals}
          disabled={loading}
          className="font-mono text-xs px-3 py-1.5 border border-zinc-700 rounded text-zinc-400 hover:border-zinc-400 hover:text-zinc-100 transition-colors disabled:opacity-40"
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {error && (
        <div className="border border-red-800 bg-red-950/50 rounded-lg p-4 font-mono text-sm text-red-400 mb-4">
          ✕ {error}
        </div>
      )}

      {loading && !data && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-zinc-800 bg-zinc-900 rounded-lg p-4 animate-pulse h-20" />
          ))}
        </div>
      )}

      {data && (
        <div className="space-y-3">
          {data.signals.length === 0 ? (
            <div className="text-center py-16 font-mono text-zinc-600">
              No signals detected yet
            </div>
          ) : (
            data.signals.map((signal, i) => (
              <SignalCard key={i} signal={signal} index={i} />
            ))
          )}
        </div>
      )}
    </main>
  );
}