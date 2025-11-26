"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Emotion } from "@/lib/emotion-context"

interface UseSpeechSynthesisOptions {
  onEnd?: () => void
  emotion?: Emotion
}

export function useSpeechSynthesis({ onEnd, emotion }: UseSpeechSynthesisOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSupported("speechSynthesis" in window)
    }
  }, [])

  const getVoiceSettings = useCallback((emotion?: Emotion) => {
    // Adjust voice settings based on emotion
    switch (emotion) {
      case "happy":
      case "surprise":
        return { rate: 1.1, pitch: 1.15 } // Bright, energetic
      case "sad":
      case "fear":
        return { rate: 0.85, pitch: 0.9 } // Slow, gentle
      case "angry":
        return { rate: 0.9, pitch: 0.95 } // Slow-paced, grounding
      case "neutral":
      default:
        return { rate: 1.0, pitch: 1.0 } // Clear, steady
    }
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text) return

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const settings = getVoiceSettings(emotion)

      utterance.rate = settings.rate
      utterance.pitch = settings.pitch
      utterance.volume = 1

      // Try to get a good voice
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice =
        voices.find((v) => v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Alex")) ||
        voices.find((v) => v.lang.startsWith("en"))

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        onEnd?.()
      }
      utterance.onerror = () => setIsSpeaking(false)

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [isSupported, emotion, getVoiceSettings, onEnd],
  )

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
  }
}
