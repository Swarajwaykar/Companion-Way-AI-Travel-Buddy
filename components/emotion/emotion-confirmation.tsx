"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Emotion, type EmotionData, useEmotion } from "@/lib/emotion-context"
import { Check, X, ArrowRight } from "lucide-react"

interface EmotionConfirmationProps {
  emotionData: EmotionData
  onReset: () => void
}

const emotionOptions: { value: Emotion; label: string; emoji: string }[] = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "angry", label: "Angry", emoji: "😠" },
  { value: "fear", label: "Fearful", emoji: "😰" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "surprise", label: "Surprised", emoji: "😲" },
  { value: "disgust", label: "Disgusted", emoji: "🤢" },
]

export function EmotionConfirmation({ emotionData, onReset }: EmotionConfirmationProps) {
  const router = useRouter()
  const { setCurrentEmotion, addToHistory } = useEmotion()
  const [showManualSelect, setShowManualSelect] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion>(emotionData.dominantEmotion)

  const handleConfirm = () => {
    const finalEmotion: EmotionData = {
      ...emotionData,
      dominantEmotion: selectedEmotion,
      timestamp: new Date(),
    }
    setCurrentEmotion(finalEmotion)
    addToHistory(finalEmotion)
    router.push("/voice")
  }

  const handleReject = () => {
    setShowManualSelect(true)
  }

  return (
    <div className="glass-card rounded-2xl p-8 mt-8">
      <h3 className="text-xl font-semibold text-center mb-6">Is this emotion correct?</h3>

      {showManualSelect ? (
        <div className="space-y-6">
          <p className="text-center text-muted-foreground">Please select how you're actually feeling:</p>
          <Select value={selectedEmotion} onValueChange={(v) => setSelectedEmotion(v as Emotion)}>
            <SelectTrigger className="w-full rounded-xl h-14 text-lg">
              <SelectValue placeholder="Select your emotion" />
            </SelectTrigger>
            <SelectContent>
              {emotionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-lg py-3">
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <span>{option.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setShowManualSelect(false)} className="flex-1 rounded-xl py-6">
              Back
            </Button>
            <Button onClick={handleConfirm} className="flex-1 rounded-xl py-6 glow-primary">
              Continue to Voice Companion
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleConfirm} size="lg" className="rounded-xl px-8 py-6 glow-primary">
            <Check className="w-5 h-5 mr-2" />
            Yes, Start Voice Companion
          </Button>
          <Button onClick={handleReject} variant="outline" size="lg" className="rounded-xl px-8 py-6 bg-transparent">
            <X className="w-5 h-5 mr-2" />
            No, Choose Manually
          </Button>
        </div>
      )}

      <div className="mt-6 text-center">
        <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
          Take Another Photo
        </Button>
      </div>
    </div>
  )
}
