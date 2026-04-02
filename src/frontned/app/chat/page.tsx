"use client";

import { useState, useRef, useEffect } from "react";
import { useElizaChat } from "@/hooks/useElizaChat";
import ChatMessage from "@/components/ChatMessage";

export default function ChatPage() {
  const { messages, connected, loading, sendMessage } = useElizaChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="flex flex-col h-[calc(100vh-57px)] bg-zinc-950">
      {/* Connection status */}
      <div className="px-6 py-2 border-b border-zinc-800 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-zinc-600"}`}
        />
        <span className="font-mono text-xs text-zinc-500">
          {connected ? "Agent connected" : "Connecting..."}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-20 font-mono text-zinc-600 text-sm">
            <div className="text-3xl mb-3">◈</div>
            Ask the agent anything about on-chain activity
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 font-mono text-sm text-zinc-400">
              <span className="text-green-400 text-xs font-bold block mb-1">◈ AGENT</span>
              <span className="animate-pulse">thinking...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950">
        <div className="flex gap-3 items-center max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about whale activity, tokens, swaps..."
            disabled={!connected}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-green-400 disabled:opacity-40 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!connected || !input.trim()}
            className="px-5 py-3 bg-green-400 text-zinc-950 font-mono font-bold text-sm rounded-lg hover:bg-green-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
