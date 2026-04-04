"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../chat.module.css';
import { 
  Send, 
  User, 
  Cpu, 
  Activity, 
  Database, 
  Globe, 
  X, 
  LogOut, 
  Settings, 
  ArrowLeft,
  Search,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  time: string;
}

const SidebarItem = ({ icon, label, active = false, href = "#" }: { icon: any, label: string, active?: boolean, href?: string }) => (
  <Link href={href}>
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-red-600/20 text-red-500 border border-red-500/20' : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}`}>
      {icon}
      <span className="font-bold tracking-tight">{label}</span>
    </div>
  </Link>
);

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'agent', content: "Sentinel protocol established. I am IQ-5 AI. Monitoring Solana mainnet for institutional flows and whale maneuvers. How can I assist your strategy today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulated Agent Logic
    setTimeout(() => {
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: `Analyzing chain telemetry for "${input}"... I've detected a significant liquidity migration in the Raydium V3 pools. Sentinel logic suggests a 78% confidence in a sell-side pressure event. Recommend monitoring wallet ending in ...4z3P.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className={styles.chatLayout}>
      <aside className={styles.sidebar}>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/20">
            <div className="w-5 h-2 bg-white/40 rounded-full" />
          </div>
          <span className="font-black text-2xl tracking-tighter">IQ-5<span className="text-red-600">AI</span></span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
           <SidebarItem icon={<Activity className="w-5 h-5" />} label="Live Sentinel" href="/dashboard" />
           <SidebarItem icon={<Sparkles className="w-5 h-5" />} label="Sentinel Voice" active href="/chat" />
           <SidebarItem icon={<Database className="w-5 h-5" />} label="Intelligence Base" />
           <SidebarItem icon={<X className="w-5 h-5" />} label="Auto-X Console" />
           <SidebarItem icon={<Globe className="w-5 h-5" />} label="Network Grid" />
           <SidebarItem icon={<Settings className="w-5 h-5" />} label="Terminal Config" />
        </nav>

        <div className="pt-8 border-t border-zinc-900">
           <SidebarItem icon={<LogOut className="w-5 h-5" />} label="Disconnect" href="/" />
        </div>
      </aside>

      <main className={styles.chatMain}>
        <header className={styles.chatHeader}>
          <div className="flex items-center gap-6">
             <Link href="/dashboard" className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
             </Link>
             <div>
                <h1 className="text-2xl font-black tracking-tight">Sentinel Voice</h1>
                <div className={styles.statusIndicator}>
                   <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                   {isTyping ? "Analyzing Chain Ingress..." : "Ready for Commands"}
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className="text-xs font-bold text-zinc-700 font-mono tracking-tighter">PROTOCOL_V2.5</div>
                <div className="text-xs font-bold text-zinc-500 font-mono tracking-tighter">SECURE_SYNC</div>
             </div>
             <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-red-600" />
             </div>
          </div>
        </header>

        <div className={styles.messageArea} ref={scrollRef}>
           <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
              {messages.map((msg) => (
                <div key={msg.id} className={msg.role === 'agent' ? styles.agentMessage + ' ' + styles.messageBubble : styles.userMessage + ' ' + styles.messageBubble}>
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-8 h-8 rounded-lg bg-zinc-900/50 flex items-center justify-center border border-zinc-800">
                        {msg.role === 'agent' ? <Cpu className="w-4 h-4 text-red-600" /> : <User className="w-4 h-4 text-zinc-400" />}
                     </div>
                     <span className="text-xs font-black tracking-widest uppercase opacity-40">
                        {msg.role === 'agent' ? "Sentinel Agent" : "Authorized User"}
                     </span>
                     <span className="text-[10px] font-mono opacity-30 ml-auto">{msg.time}</span>
                  </div>
                  <div className="font-medium text-[1.05rem] leading-relaxed">
                     {msg.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className={styles.agentMessage + ' ' + styles.messageBubble}
                >
                   <div className="flex gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                   </div>
                </motion.div>
              )}
           </div>
        </div>

        <div className={styles.inputArea}>
           <div className={styles.inputWrapper}>
              <button className="absolute left-6 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-red-500 transition-colors">
                 <Search className="w-5 h-5" />
              </button>
              <input 
                 type="text" 
                 placeholder="Enter Sentinel command or query chain alpha..." 
                 className={styles.chatInput + " pl-16"}
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className={styles.sendButton} onClick={handleSend}>
                 <Send className="w-6 h-6" />
              </button>
           </div>
           <div className="mt-4 text-center">
              <p className="text-[10px] text-zinc-700 font-mono tracking-widest">
                 ALL COMMANDS ARE PROCESSED ON THE NOSANA DECENTRALIZED GPU GRID
              </p>
           </div>
        </div>
      </main>
    </div>
  );
}
