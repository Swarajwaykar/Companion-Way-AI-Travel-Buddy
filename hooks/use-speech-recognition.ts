"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
}

export function useSpeechRecognition({ onResult, onError }: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any | null>(null)

  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)

  // Keep refs updated
  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onresult = (event: any) => {
          const current = event.resultIndex
          const result = event.results[current]
          const transcriptResult = result[0].transcript

          setTranscript(transcriptResult)

          if (result.isFinal) {
            onResultRef.current?.(transcriptResult)
          }
        }

        recognition.onerror = (event: any) => {
          setIsListening(false)
          onErrorRef.current?.(event.error)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      recognitionRef.current?.stop()
    }
  }, []) // Empty dependency array - callbacks accessed via refs

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("")
      recognitionRef.current.start()
      setIsListening(true)
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  }
}
