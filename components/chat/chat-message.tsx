"use client"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { User, Bot } from "lucide-react"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  emotion?: string
}

const emotionEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  fear: "😰",
  neutral: "😐",
  surprise: "😲",
  disgust: "🤢",
}

export function ChatMessage({ role, content, timestamp, emotion }: ChatMessageProps) {
  const isUser = role === "user"
  const emoji = emotion ? emotionEmojis[emotion] || "💬" : "💬"

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          isUser ? "bg-primary/20" : "bg-accent/20 glow-accent",
        )}
      >
        {isUser ? <User className="w-5 h-5 text-primary" /> : <Bot className="w-5 h-5 text-accent" />}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser ? "bg-primary text-primary-foreground rounded-tr-sm" : "glass-card rounded-tl-sm",
        )}
      >
        {/* Emotion indicator for assistant */}
        {!isUser && emotion && (
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <span>{emoji}</span>
            <span className="capitalize">Responding to your {emotion} mood</span>
          </div>
        )}

        {/* Message content */}
        <p className="whitespace-pre-wrap">{content}</p>

        {/* Timestamp */}
        <p className={cn("text-xs mt-2", isUser ? "text-primary-foreground/60" : "text-muted-foreground")}>
          {format(timestamp, "h:mm a")}
        </p>
      </div>
    </div>
  )
}
