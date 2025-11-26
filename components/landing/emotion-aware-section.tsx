"use client"

import { cn } from "@/lib/utils"

const emotions = [
  {
    emoji: "😊",
    label: "Happy",
    color: "from-yellow-400 to-orange-400",
    description: "Cheerful, enthusiastic responses",
  },
  { emoji: "😢", label: "Sad", color: "from-blue-400 to-indigo-400", description: "Comforting, supportive guidance" },
  { emoji: "😠", label: "Angry", color: "from-red-400 to-pink-400", description: "Grounding, soothing presence" },
  { emoji: "😰", label: "Anxious", color: "from-purple-400 to-violet-400", description: "Reassuring, safe space" },
  { emoji: "😐", label: "Neutral", color: "from-gray-400 to-slate-400", description: "Clear, informative support" },
  { emoji: "🤩", label: "Excited", color: "from-green-400 to-teal-400", description: "Energetic, hype-filled energy" },
]

export function EmotionAwareSection() {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Emotion-Aware Interactions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI adapts its personality based on how you're feeling, providing the right kind of support at the right
            time
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {emotions.map((emotion, index) => (
            <div
              key={index}
              className={cn(
                "group relative p-6 rounded-2xl glass-card",
                "hover:scale-105 transition-all duration-300 cursor-pointer",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300",
                  `bg-gradient-to-br ${emotion.color}`,
                )}
              />

              <div className="relative z-10">
                <span className="text-5xl mb-4 block">{emotion.emoji}</span>
                <h3 className="text-xl font-semibold mb-2">{emotion.label}</h3>
                <p className="text-muted-foreground">{emotion.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
