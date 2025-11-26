"use client"

import { cn } from "@/lib/utils"

interface VoiceVisualizerProps {
  isActive: boolean
  type: "listening" | "speaking"
}

export function VoiceVisualizer({ isActive, type }: VoiceVisualizerProps) {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-2 rounded-full transition-all duration-150",
            type === "listening" ? "bg-primary" : "bg-accent",
            isActive ? "animate-pulse" : "h-2",
          )}
          style={{
            height: isActive ? `${Math.random() * 40 + 20}px` : "8px",
            animationDelay: `${i * 100}ms`,
            animationDuration: isActive ? `${300 + Math.random() * 200}ms` : "0ms",
          }}
        />
      ))}
    </div>
  )
}
