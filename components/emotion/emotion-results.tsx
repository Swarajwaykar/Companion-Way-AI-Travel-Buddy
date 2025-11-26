"use client"

import type { EmotionScores, Emotion } from "@/lib/emotion-context"
import { cn } from "@/lib/utils"

interface EmotionResultsProps {
  dominantEmotion: Emotion
  scores: EmotionScores
}

const emotionConfig: Record<Emotion, { emoji: string; color: string; bgColor: string }> = {
  happy: { emoji: "😊", color: "text-yellow-500", bgColor: "bg-yellow-500/20" },
  sad: { emoji: "😢", color: "text-blue-500", bgColor: "bg-blue-500/20" },
  angry: { emoji: "😠", color: "text-red-500", bgColor: "bg-red-500/20" },
  fear: { emoji: "😰", color: "text-purple-500", bgColor: "bg-purple-500/20" },
  neutral: { emoji: "😐", color: "text-gray-500", bgColor: "bg-gray-500/20" },
  surprise: { emoji: "😲", color: "text-teal-500", bgColor: "bg-teal-500/20" },
  disgust: { emoji: "🤢", color: "text-green-500", bgColor: "bg-green-500/20" },
}

export function EmotionResults({ dominantEmotion, scores }: EmotionResultsProps) {
  const config = emotionConfig[dominantEmotion]

  return (
    <div className="space-y-8">
      {/* Dominant emotion display */}
      <div className="text-center">
        <div
          className={cn(
            "inline-flex items-center justify-center w-32 h-32 rounded-full mb-4",
            config.bgColor,
            "glow-primary float-animation",
          )}
        >
          <span className="text-7xl">{config.emoji}</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">
          You appear to be feeling <span className={cn("capitalize", config.color)}>{dominantEmotion}</span>
        </h3>
        <p className="text-muted-foreground">Confidence: {scores[dominantEmotion].toFixed(1)}%</p>
      </div>

      {/* Emotion scores grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(Object.entries(scores) as [Emotion, number][])
          .sort((a, b) => b[1] - a[1])
          .map(([emotion, score]) => {
            const emotionCfg = emotionConfig[emotion]
            const isDominant = emotion === dominantEmotion
            return (
              <div
                key={emotion}
                className={cn(
                  "p-4 rounded-2xl text-center transition-all duration-300",
                  isDominant ? "glass-card glow-primary" : "bg-secondary/50",
                  "hover:scale-105",
                )}
              >
                <span className="text-3xl mb-2 block">{emotionCfg.emoji}</span>
                <p className={cn("text-sm font-medium capitalize mb-1", isDominant && emotionCfg.color)}>{emotion}</p>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isDominant ? "bg-primary" : "bg-muted-foreground/30",
                    )}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{score.toFixed(1)}%</p>
              </div>
            )
          })}
      </div>
    </div>
  )
}
