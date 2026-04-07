"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../dashboard.module.css";
import DashboardPanel from "./components/DashboardPanel";
import ChatPanel from "./components/ChatPanel";
import { Maximize2, Palette } from "lucide-react";

type FocusState = "dashboard" | "chat" | "balanced";

export interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  glow: string;
  bg: string; // Accent background (low alpha primary)
  appBg: string;
  panelBg: string;
  textMain: string;
  textMuted: string;
  border: string;
  isLight?: boolean;
}

const THEMES: ThemePreset[] = [
  { 
    id: "sentinel", name: "Sentinel", primary: "#dc2626", glow: "rgba(220, 38, 38, 0.4)", bg: "rgba(220, 38, 38, 0.08)",
    appBg: "#000000", panelBg: "rgba(255, 255, 255, 0.02)", textMain: "#ffffff", textMuted: "rgba(255, 255, 255, 0.4)", border: "rgba(255, 255, 255, 0.05)"
  },
  { 
    id: "quantum", name: "Quantum", primary: "#06b6d4", glow: "rgba(6, 182, 212, 0.4)", bg: "rgba(6, 182, 212, 0.08)",
    appBg: "#020617", panelBg: "rgba(30, 41, 59, 0.4)", textMain: "#f1f5f9", textMuted: "rgba(148, 163, 184, 0.6)", border: "rgba(30, 41, 59, 0.6)"
  },
  { 
    id: "nebula", name: "Nebula", primary: "#2563eb", glow: "rgba(37, 99, 235, 0.2)", bg: "rgba(37, 99, 235, 0.06)",
    appBg: "#f8fafc", panelBg: "#ffffff", textMain: "#0f172a", textMuted: "#64748b", border: "#e2e8f0", isLight: true
  },
  { 
    id: "matrix", name: "Matrix", primary: "#22c55e", glow: "rgba(34, 197, 94, 0.4)", bg: "rgba(34, 197, 94, 0.08)",
    appBg: "#000000", panelBg: "rgba(0, 20, 0, 0.4)", textMain: "#22c55e", textMuted: "rgba(34, 197, 94, 0.5)", border: "rgba(34, 197, 94, 0.2)"
  },
  { 
    id: "sol", name: "Sol", primary: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)", bg: "rgba(245, 158, 11, 0.08)",
    appBg: "#0a0a05", panelBg: "rgba(40, 30, 10, 0.3)", textMain: "#fbbf24", textMuted: "rgba(251, 191, 36, 0.5)", border: "rgba(251, 191, 36, 0.2)"
  },
];

export default function DashboardPage() {
  const [focus, setFocus] = useState<FocusState>("balanced");
  const [activeTheme, setActiveTheme] = useState<ThemePreset>(THEMES[0]);
  const [showThemePanel, setShowThemePanel] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sentinel_theme");
    if (saved) {
      const theme = THEMES.find(t => t.id === saved);
      if (theme) setActiveTheme(theme);
    }
  }, []);

  const selectTheme = (theme: ThemePreset) => {
    setActiveTheme(theme);
    localStorage.setItem("sentinel_theme", theme.id);
  };

  const getFlexBasis = (panel: "dashboard" | "chat") => {
    if (focus === "balanced") return "50%";
    if (focus === panel) return "82%";
    return "18%";
  };

  return (
    <div className={styles.dashboardWrapper} style={{ background: activeTheme.appBg, color: activeTheme.textMain }}>
      {/* Floating Theme Switcher */}
      <div className={styles.themeSwitcherBox}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowThemePanel(!showThemePanel)}
          className={styles.themeButton}
          style={{ 
            borderColor: activeTheme.border, 
            background: activeTheme.panelBg,
            color: activeTheme.primary,
            boxShadow: activeTheme.isLight ? "0 4px 12px rgba(0,0,0,0.05)" : "none"
          }}
        >
          <Palette size={18} />
        </motion.button>
        
        <AnimatePresence>
          {showThemePanel && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={styles.themeDropdown}
              style={{ background: activeTheme.panelBg, borderColor: activeTheme.border }}
            >
              <div className="text-[10px] font-bold tracking-widest uppercase mb-3 px-2" style={{ color: activeTheme.textMuted }}>Neural Profiles</div>
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => selectTheme(theme)}
                  className={`${styles.themeOption}`}
                  style={{ 
                    background: activeTheme.id === theme.id ? theme.bg : "transparent",
                    color: activeTheme.textMain
                  }}
                >
                  <div className={styles.colorCircle} style={{ background: theme.primary, boxShadow: `0 0 10px ${theme.glow}` }} />
                  <span className={styles.themeName} style={{ color: activeTheme.id === theme.id ? theme.primary : activeTheme.textMain }}>{theme.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dashboard Panel */}
      <motion.div
        layout
        initial={false}
        animate={{ 
          flexBasis: getFlexBasis("dashboard"),
        }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className={`${styles.panelContainer} ${focus === "dashboard" ? styles.panelFocused : ""} ${focus === "chat" ? styles.crushed : ""}`}
        style={{ 
          background: activeTheme.panelBg, 
          borderColor: activeTheme.isLight && focus === "dashboard" ? activeTheme.primary : activeTheme.border,
          boxShadow: activeTheme.isLight ? "0 10px 40px rgba(0,0,0,0.03)" : "none"
        }}
        onClick={() => setFocus(focus === "dashboard" ? "balanced" : "dashboard")}
      >
        <div className={styles.weightIndicator} style={{ color: activeTheme.textMuted }}>MTL_EXPR_DASH_01</div>
        <DashboardPanel isFocused={focus !== "chat"} theme={activeTheme} />
        
        {focus === "chat" && (
          <div className={styles.crushedOverlay} style={{ background: activeTheme.isLight ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
            <Maximize2 size={24} color={activeTheme.textMuted} />
          </div>
        )}
      </motion.div>

      {/* Chat Panel */}
      <motion.div
        layout
        initial={false}
        animate={{ 
          flexBasis: getFlexBasis("chat"),
        }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className={`${styles.panelContainer} ${focus === "chat" ? styles.panelFocused : ""} ${focus === "dashboard" ? styles.crushed : ""}`}
        style={{ 
          background: activeTheme.panelBg, 
          borderColor: activeTheme.isLight && focus === "chat" ? activeTheme.primary : activeTheme.border,
          boxShadow: activeTheme.isLight ? "0 10px 40px rgba(0,0,0,0.03)" : "none"
        }}
        onClick={() => setFocus(focus === "chat" ? "balanced" : "chat")}
      >
        <div className={styles.weightIndicator} style={{ color: activeTheme.textMuted }}>MTL_EXPR_CORE_02</div>
        <ChatPanel isFocused={focus !== "dashboard"} theme={activeTheme} />

        {focus === "dashboard" && (
          <div className={styles.crushedOverlay} style={{ background: activeTheme.isLight ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
            <Maximize2 size={24} color={activeTheme.textMuted} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
