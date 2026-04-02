import { ChatMessage as ChatMessageType } from "@/hooks/useElizaChat";

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-lg px-4 py-3 font-mono text-sm leading-relaxed ${
          isUser
            ? "bg-green-400 text-zinc-950"
            : "bg-zinc-800 text-zinc-100 border border-zinc-700"
        }`}
      >
        {!isUser && (
          <div className="text-green-400 text-xs mb-1 font-bold">◈ AGENT</div>
        )}
        <p>{message.text}</p>
        <div className={`text-xs mt-1 ${isUser ? "text-zinc-700" : "text-zinc-500"}`}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}
