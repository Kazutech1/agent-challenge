"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const ELIZA_URL = process.env.NEXT_PUBLIC_ELIZA_URL ?? "http://localhost:3000";
const AGENT_ID = process.env.NEXT_PUBLIC_ELIZA_AGENT_ID ?? "";
const CHANNEL_ID = process.env.NEXT_PUBLIC_ELIZA_CHANNEL_ID ?? "";

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: Date;
}

export function useElizaChat() {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = io(ELIZA_URL, {
      transports: ["websocket"],
      auth: {
        entityId: crypto.randomUUID(),
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      // Register this client to the channel
      socket.emit("subscribe", { channelId: CHANNEL_ID });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    // ElizaOS broadcasts agent responses via this event
    socket.on("messageBroadcast", (data: { senderId: string; text?: string; content?: string }) => {
      // Only show messages from the agent, not echoes of our own messages
      if (data.senderId === AGENT_ID || data.senderId !== "user") {
        const agentText = data.text ?? data.content ?? "";
        if (!agentText) return;

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "agent",
            text: agentText,
            timestamp: new Date(),
          },
        ]);
        setLoading(false);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !socketRef.current) return;

    // Optimistically add user message to UI
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        text,
        timestamp: new Date(),
      },
    ]);
    setLoading(true);

    // Send via REST to ElizaOS messaging API
    try {
      await fetch(
        `${ELIZA_URL}/api/messaging/channels/${CHANNEL_ID}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     content: text,
        //     author_id: "user",
        //     source_type: "api",
        //   }),
          body: JSON.stringify({
            channel_id: CHANNEL_ID,
            message_server_id: "00000000-0000-0000-0000-000000000000",
            content: text,
            author_id: "00000000-0000-0000-0000-000000000001",
            source_type: "api",
            raw_message: text,
          }),
        }
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      setLoading(false);
    }
  }, []);

  return { messages, connected, loading, sendMessage };
}
