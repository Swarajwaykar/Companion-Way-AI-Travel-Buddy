"use client"

import type { Emotion } from "@/lib/emotion-context"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { RefreshCw } from "lucide-react"

interface EmotionBadgeProps {
  emotion: Emotion | null
}

const emotionConfig: Record<Emotion, { emoji: string; label: string; color: string }> = {
  happy: { emoji: "😊", label: "Happy", color: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" },
  sad: { emoji: "😢", label: "Sad", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
  angry: { emoji: "😠", label: "Angry", color: "bg-red-500/20 text-red-600 dark:text-red-400" },
  fear: { emoji: "😰", label: "Fearful", color: "bg-purple-500/20 text-purple-600 dark:text-purple-400" },
  neutral: { emoji: "😐", label: "Neutral", color: "bg-gray-500/20 text-gray-600 dark:text-gray-400" },
  surprise: { emoji: "😲", label: "Surprised", color: "bg-teal-500/20 text-teal-600 dark:text-teal-400" },
  disgust: { emoji: "🤢", label: "Disgusted", color: "bg-green-500/20 text-green-600 dark:text-green-400" },
}

export function EmotionBadge({ emotion }: EmotionBadgeProps) {
  if (!emotion) {
    return (
      <Link
        href="/emotion-detection"
        className="inline-flex items-center gap-2 px-3 py-2.5 rounded-full glass-card text-sm hover:bg-secondary transition-colors"
      >
        <span>No emotion detected</span>
        <RefreshCw className="w-3 h-3" />
      </Link>
    )
  }

  const config = emotionConfig[emotion]

  return (
    <Link
      href="/emotion-detection"
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105",
        config.color,
      )}
    >
      <span>{config.emoji}</span>
      <span>Feeling {config.label}</span>
      <RefreshCw className="w-3 h-3 opacity-60" />
    </Link>
  )
}
