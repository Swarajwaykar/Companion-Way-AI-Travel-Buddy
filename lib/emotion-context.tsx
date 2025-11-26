"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Emotion = "happy" | "sad" | "angry" | "fear" | "neutral" | "surprise" | "disgust"

export interface EmotionScores {
  happy: number
  sad: number
  angry: number
  fear: number
  neutral: number
  surprise: number
  disgust: number
}

export interface EmotionData {
  dominantEmotion: Emotion
  scores: EmotionScores
  timestamp: Date
}

interface EmotionContextType {
  currentEmotion: EmotionData | null
  setCurrentEmotion: (emotion: EmotionData | null) => void
  emotionHistory: EmotionData[]
  addToHistory: (emotion: EmotionData) => void
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined)

export function EmotionProvider({ children }: { children: ReactNode }) {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null)
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([])

  const addToHistory = (emotion: EmotionData) => {
    setEmotionHistory((prev) => [emotion, ...prev].slice(0, 10))
  }

  return (
    <EmotionContext.Provider value={{ currentEmotion, setCurrentEmotion, emotionHistory, addToHistory }}>
      {children}
    </EmotionContext.Provider>
  )
}

export function useEmotion() {
  const context = useContext(EmotionContext)
  if (context === undefined) {
    throw new Error("useEmotion must be used within an EmotionProvider")
  }
  return context
}
