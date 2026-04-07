"use client";

import { motion } from "framer-motion";
import { Activity, Zap, Cpu, TrendingUp, ArrowUpRight, Shield } from "lucide-react";
import { useEffect, useState } from "react";

interface Signal {
  type: "whale_in" | "whale_out" | "swap" | "unknown";
  description: string;
  amount?: number;
  tokenSymbol?: string;
  mint?: string;
  txSignature?: string;
}

interface FeedItem {
  type: "WHALE" | "TECH";
  title: string;
  time: string;
  value: string;
  link?: string;
}

import { ThemePreset } from "../page";

export default function DashboardPanel({ isFocused, theme }: { isFocused: boolean; theme: ThemePreset }) {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    alphas: "0",
    nodes: "128",
    latency: "14ms",
  });

  const fetchSignals = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/signals");
      const data = await response.json();
      if (data.signals) {
        const mappedFeed: FeedItem[] = data.signals.map((s: Signal) => {
          let type: "WHALE" | "TECH" = "TECH";
          let title = s.description;
          let value = s.amount ? s.amount.toLocaleString() : "";

          if (s.type === "whale_in" || s.type === "whale_out") {
            type = "WHALE";
            title = s.type === "whale_in" ? "Whale Inflow" : "Whale Outflow";
            value = `${s.type === "whale_in" ? "+" : "-"}${s.amount?.toLocaleString()} tokens`;
          } else if (s.type === "swap") {
            type = "TECH";
            title = "DEX Swap";
            value = `${s.amount?.toLocaleString()} ${s.tokenSymbol || "tokens"}`;
          }

          return {
            type,
            title,
            time: "Just now",
            value,
            link: `https://solscan.io/tx/${s.txSignature}`,
          };
        });
        setFeed(mappedFeed);
        setStats((prev) => ({ ...prev, alphas: mappedFeed.length.toString() }));
      }
    } catch (error) {
      console.error("Failed to fetch signals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: isFocused ? "2.5rem" : "1.5rem", height: "100%", overflowY: "auto", color: theme.textMain }}>
      <header style={{ marginBottom: isFocused ? "2.5rem" : "1rem" }}>
        <h1 style={{ fontSize: isFocused ? "2rem" : "1.2rem", fontWeight: 900, letterSpacing: "-0.04em" }}>
          Sentinel <span style={{ color: theme.textMuted }}>Terminal</span>
        </h1>
        {isFocused && (
          <p style={{ color: theme.textMuted, fontSize: "0.85rem", marginTop: "0.5rem" }}>
            Real-time Solana Alphas · ElizaOS Core
          </p>
        )}
      </header>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: isFocused ? "repeat(3, 1fr)" : "1fr", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Alphas", value: stats.alphas, icon: <Zap size={16} /> },
          { label: "Nodes", value: stats.nodes, icon: <Cpu size={16} /> },
          { label: "Latency", value: stats.latency, icon: <Shield size={16} /> },
        ].slice(0, isFocused ? 3 : 1).map((card) => (
          <div key={card.label} style={{
            padding: isFocused ? "1.5rem" : "1rem",
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: 20,
          }}>
            <div style={{ color: theme.primary, marginBottom: "0.5rem" }}>{card.icon}</div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: theme.textMuted, textTransform: "uppercase" }}>{card.label}</div>
            <div style={{ fontSize: isFocused ? "1.75rem" : "1.25rem", fontWeight: 900 }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "0.9rem", fontWeight: 800 }}>Intelligence Feed</h2>
          {isFocused && (
            <div style={{ 
              fontSize: "0.6rem", 
              color: theme.primary, 
              fontWeight: 900, 
              background: theme.bg, 
              padding: "2px 6px", 
              borderRadius: "4px",
              border: `1px solid ${theme.border}`
            }}>LIVE</div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {feed.slice(0, isFocused ? 20 : 5).map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ borderColor: theme.primary }}
              onClick={() => item.link && window.open(item.link, "_blank")}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "1rem",
                borderRadius: 16,
                background: theme.isLight ? "#fff" : "rgba(255,255,255,0.02)",
                border: `1px solid ${theme.border}`,
                cursor: "pointer",
                boxShadow: theme.isLight ? "0 2px 8px rgba(0,0,0,0.02)" : "none"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: 8, 
                  background: theme.bg, 
                  display: "flex", alignItems: "center", justifyContent: "center" 
                }}>
                  {item.type === "WHALE" ? (
                    <TrendingUp size={14} color={theme.primary} />
                  ) : (
                    <Activity size={14} color={theme.isLight ? theme.primary : "#60a5fa"} />
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: isFocused ? "0.9rem" : "0.75rem" }}>{item.title}</div>
                  {isFocused && <div style={{ fontSize: "0.65rem", color: theme.textMuted }}>{item.time}</div>}
                </div>
              </div>
              {isFocused && <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{item.value}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
