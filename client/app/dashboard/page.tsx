"use client";

import { motion } from 'framer-motion';
import styles from '../dashboard.module.css';
import { 
  Activity, 
  Shield, 
  Zap, 
  TrendingUp, 
  Search, 
  Settings, 
  LogOut, 
  Cpu, 
  Bell,
  ChevronRight,
  Globe,
  Database,
  X,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

const SidebarItem = ({ icon, label, active = false, href = "#" }: { icon: any, label: string, active?: boolean, href?: string }) => (
  <Link href={href}>
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-red-600/20 text-red-500 border border-red-500/20' : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}`}>
      {icon}
      <span className="font-bold tracking-tight">{label}</span>
    </div>
  </Link>
);

const StatCard = ({ title, value, change, icon }: { title: string, value: string, change: string, icon: any }) => (
  <div className={styles.dashCard}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
        {icon}
      </div>
      <div className="px-2 py-1 rounded-lg bg-red-600/10 text-red-500 text-xs font-bold font-mono">
        {change}
      </div>
    </div>
    <h3>{title}</h3>
    <div className={styles.dashValue}>{value}</div>
  </div>
);

const FeedItem = ({ type, title, time, value }: { type: string, title: string, time: string, value: string }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-red-600/30 transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
         {type === 'WHALE' ? <TrendingUp className="w-6 h-6 text-red-600" /> : <Activity className="w-6 h-6 text-blue-500" />}
      </div>
      <div>
        <h4 className="font-bold text-white group-hover:text-red-500 transition-colors">{title}</h4>
        <span className="text-xs text-zinc-500 font-mono">{time}</span>
      </div>
    </div>
    <div className="text-right">
       <div className="font-bold text-white mb-1">{value}</div>
       <div className="text-[10px] text-zinc-600 font-mono flex items-center gap-1 justify-end">
          VIEW_SCAN <ArrowUpRight className="w-3 h-3" />
       </div>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/20">
            <div className="w-5 h-2 bg-white/40 rounded-full" />
          </div>
          <span className="font-black text-2xl tracking-tighter">IQ-5<span className="text-red-600">AI</span></span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
           <SidebarItem icon={<Activity className="w-5 h-5" />} label="Live Sentinel" active href="/dashboard" />
           <SidebarItem icon={<Sparkles className="w-5 h-5" />} label="Sentinel Voice" href="/chat" />
           <SidebarItem icon={<Database className="w-5 h-5" />} label="Intelligence Base" />
           <SidebarItem icon={<X className="w-5 h-5" />} label="Auto-X Console" />
           <SidebarItem icon={<Globe className="w-5 h-5" />} label="Network Grid" />
           <SidebarItem icon={<Settings className="w-5 h-5" />} label="Terminal Config" />
        </nav>

        <div className="pt-8 border-t border-zinc-900">
           <Link href="/">
              <SidebarItem icon={<LogOut className="w-5 h-5" />} label="Disconnect" />
           </Link>
        </div>
      </aside>

      <main className={styles.dashMain}>
        <header className="flex justify-between items-center mb-12">
           <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">Sentinel Terminal</h1>
              <p className="text-zinc-500 font-medium">Monitoring Solana Mainnet under ElizaOS Alpha Protocol.</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
                 <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                 <span className="text-sm font-bold text-zinc-400 font-mono tracking-tighter">SYNC_STABLE</span>
              </div>
              <button className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors relative">
                 <Bell className="w-5 h-5" />
                 <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-black" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden">
                 <img src="https://ui-avatars.com/api/?name=IQ5&background=DC2626&color=fff" />
              </div>
           </div>
        </header>

        <div className="grid grid-cols-4 gap-6">
           <StatCard title="Real-time Surveillance" value="1.4M" change="+12.4%" icon={<Search className="w-6 h-6" />} />
           <StatCard title="Alpha Detected" value="24" change="+4" icon={<Zap className="w-6 h-6" />} />
           <StatCard title="Nosana GPU Nodes" value="128" change="+12" icon={<Cpu className="w-6 h-6" />} />
           <StatCard title="Inference Latency" value="14ms" change="-2ms" icon={<Shield className="w-6 h-6" />} />
        </div>

        <div className="mt-12 grid grid-cols-3 gap-12">
           <div className="col-span-2">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black tracking-tight">Intelligence Feed</h2>
                 <button className="text-red-500 text-sm font-bold flex items-center gap-1 hover:underline">
                    LIVE_RAW_DATA <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
              <div className="space-y-4">
                 <FeedItem type="WHALE" title="Solana Whale Inflow detected" time="2m ago • Signature Ending in ...4s3Z" value="+45,000 SOL" />
                 <FeedItem type="TECH" title="New Liquidity Pool: $REDLINE / USDC" time="5m ago • Raydium V3" value="$120k Initial" />
                 <FeedItem type="WHALE" title="Binance Cold Wallet -> Hot Wallet" time="12m ago • Institutional Flow" value="+2.4M USDC" />
                 <FeedItem type="TECH" title="Inference Spike: Nosana Grid Expansion" time="24m ago • Node Cluster #4" value="7.4T/OPS" />
              </div>
           </div>

           <div>
              <h2 className="text-2xl font-black tracking-tight mb-8">Sentinel Status</h2>
              <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 border-dashed relative overflow-hidden text-center">
                 <div className="w-24 h-24 rounded-full bg-red-600/10 border border-red-500/20 mx-auto flex items-center justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center animate-pulse">
                       <Zap className="w-6 h-6 text-red-600" />
                    </div>
                 </div>
                 <h4 className="text-xl font-bold mb-2">Sentinel Beta 1.4</h4>
                 <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                    AI agent is currently monitoring and broadcasting signals to the Auto-X Console.
                 </p>
                 <button className="w-full py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
                   <Settings className="w-5 h-5" /> Tune Sensitivity
                 </button>
                 
                 {/* Visual Polish */}
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/5 rounded-full blur-3xl" />
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
