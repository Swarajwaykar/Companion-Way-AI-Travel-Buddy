"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WebcamCapture } from "@/components/emotion/webcam-capture"
import { EmotionResults } from "@/components/emotion/emotion-results"
import { EmotionConfirmation } from "@/components/emotion/emotion-confirmation"
import type { EmotionData, EmotionScores, Emotion } from "@/lib/emotion-context"
import { toast } from "sonner"
import { Smile, Sparkles } from "lucide-react"

export default function EmotionDetectionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null)

  const handleCapture = async (imageBase64: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/detect-emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to detect emotion")
      }

      if (result.data.isSimulated) {
        toast.info("Demo Mode: Using simulated emotion data. Add Face++ API keys for real detection.")
      }

      setEmotionData({
        dominantEmotion: result.data.dominantEmotion as Emotion,
        scores: result.data.scores as EmotionScores,
        timestamp: new Date(),
      })

      toast.success("Emotion detected successfully!")
    } catch (error) {
      console.error("[v0] Error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to detect emotion")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setEmotionData(null)
  }

  return (
    <main className="min-h-screen pb-16">
      <Navigation />

      <div className="pt-32 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Face++ Emotion Detection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
              How Are You <span className="gradient-text">Feeling Today?</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Let us detect your emotion through facial expression analysis. Position your face in the frame and capture
              your mood.
            </p>
          </div>

          {/* Main content */}
          {!emotionData ? (
            <WebcamCapture onCapture={handleCapture} isLoading={isLoading} />
          ) : (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-8">
                <EmotionResults dominantEmotion={emotionData.dominantEmotion} scores={emotionData.scores} />
              </div>
              <EmotionConfirmation emotionData={emotionData} onReset={handleReset} />
            </div>
          )}

          {/* Info section */}
          <div className="mt-12 glass-card rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Smile className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">How It Works</h3>
                <p className="text-sm text-muted-foreground">
                  We use advanced facial recognition technology to analyze your expression and detect seven different
                  emotions. Your privacy is protected—images are processed instantly and not stored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
