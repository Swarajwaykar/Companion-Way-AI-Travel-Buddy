"use client"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { User, Bot, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceMessageProps {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  onPlayback?: () => void
  isPlaying?: boolean
}

export function VoiceMessage({ role, content, timestamp, onPlayback, isPlaying }: VoiceMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          isUser ? "bg-primary/20" : "bg-accent/20",
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
        <p className="whitespace-pre-wrap">{content}</p>

        <div className="flex items-center justify-between gap-4 mt-2">
          <p className={cn("text-xs", isUser ? "text-primary-foreground/60" : "text-muted-foreground")}>
            {format(timestamp, "h:mm a")}
          </p>

          {!isUser && onPlayback && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPlayback}
              className={cn("h-6 px-2 rounded-lg", isPlaying && "bg-accent/20")}
            >
              <Volume2 className={cn("w-3 h-3", isPlaying && "animate-pulse")} />
              <span className="ml-1 text-xs">{isPlaying ? "Playing" : "Play"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
