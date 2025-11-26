"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { VoiceMessage } from "@/components/voice/voice-message"
import { VoiceVisualizer } from "@/components/voice/voice-visualizer"
import { EmotionBadge } from "@/components/chat/emotion-badge"
import { useEmotion } from "@/lib/emotion-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, MicOff, Square, MessageCircle, Send, Volume2, VolumeX, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance
    webkitSpeechRecognition: new () => SpeechRecognitionInstance
  }
}

export default function VoicePage() {
  const { currentEmotion } = useEmotion()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI travel companion. I can sense your emotions and respond accordingly. Try speaking to me!",
      timestamp: new Date(),
    },
  ])
  const [textInput, setTextInput] = useState("")
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [sttSupported, setSttSupported] = useState(false)
  const [hasWelcomed, setHasWelcomed] = useState(false) // NEW: track welcome
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const emotion = currentEmotion?.dominantEmotion || "neutral"

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          emotion: emotion,
          conversationHistory: messages,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success && data.message) {
        return data.message
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("[v0] AI response generation failed:", error)
      toast.error("Failed to get AI response. Please try again.")
      return "I'm sorry, I'm having trouble responding right now. Please try again."
    }
  }

  const handleUserMessage = async (content: string) => {
    if (!content.trim()) return

    setIsProcessing(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    try {
      const aiResponse = await generateAIResponse(content)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])

      // Auto-speak the response
      if (autoSpeak) {
        speakMessage(aiResponse)
      }
    } catch (error) {
      console.error("Error generating AI response:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const speakMessage = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)

      // Adjust voice based on emotion
      const emotion = currentEmotion?.dominantEmotion
      if (emotion === "happy" || emotion === "surprise") {
        utterance.rate = 1.1
        utterance.pitch = 1.2
      } else if (emotion === "sad") {
        utterance.rate = 0.85
        utterance.pitch = 0.9
      } else {
        utterance.rate = 0.95
        utterance.pitch = 1.0
      }
      utterance.volume = 0.9

      utterance.onend = () => {
        setIsSpeaking(false)
        setPlayingId(null)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
        setPlayingId(null)
      }

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      setPlayingId(null)
    }
  }

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null

    if (SpeechRecognition) {
      setSttSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex
        const result = event.results[current]
        const transcriptText = result[0].transcript

        setTranscript(transcriptText)

        if (result.isFinal) {
          setIsListening(false)
          setTranscript("")
          if (transcriptText.trim()) {
            handleUserMessage(transcriptText)
          }
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false)
        toast.error(`Speech recognition error: ${event.error}`)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    // Initialize speech synthesis
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  // --- NEW: Welcome on emotion detected, start voice conversation ---
  useEffect(() => {
    // Conditions to run welcome:
    // 1. We have a detected emotion
    // 2. We haven't welcomed yet
    // 3. Only default system message exists (messages length === 1)
    if (!currentEmotion || hasWelcomed || messages.length > 1) return

    const doWelcome = async () => {
      setHasWelcomed(true)
      setIsProcessing(true)

      try {
        const emotion = currentEmotion.dominantEmotion

        // Prepare system-style prompt similar to ChatPage
        const prompt = `[System: User has just arrived feeling ${emotion}. Give them a warm, personalized welcome that acknowledges their emotional state. Keep it brief and friendly.]`

        // Reuse generateAIResponse but call it directly so it uses your existing function
        const aiText = await generateAIResponse(prompt)

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: aiText,
          timestamp: new Date(),
        }

        // Insert the welcome message
        setMessages((prev) => [...prev, aiMessage])

        // Auto-speak the welcome message if enabled
        if (autoSpeak) {
          speakMessage(aiText)
        }

        // Start listening for user's reply if STT is supported and recognition initialized
        // small timeout to allow speech to start/end gracefully
        if (sttSupported && recognitionRef.current) {
          // Wait for a bit if we're auto-speaking so we don't interrupt
          const waitForSpeak = autoSpeak ? 1200 : 0
          setTimeout(() => {
            try {
              // only start if recognition isn't already listening
              if (recognitionRef.current && !isListening) {
                recognitionRef.current.start()
                setIsListening(true)
              }
            } catch (err) {
              console.warn("Failed to auto-start recognition:", err)
            }
          }, waitForSpeak)
        }
      } catch (err) {
        console.error("Error generating/playing welcome message:", err)
      } finally {
        setIsProcessing(false)
      }
    }

    doWelcome()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEmotion, hasWelcomed, messages.length, sttSupported, autoSpeak])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("")
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (textInput.trim() && !isProcessing) {
      handleUserMessage(textInput)
      setTextInput("")
    }
  }

  const handlePlayback = (id: string, content: string) => {
    if (playingId === id) {
      stopSpeaking()
    } else {
      stopSpeaking()
      setPlayingId(id)
      speakMessage(content)
    }
  }

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      stopSpeaking()
      startListening()
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 pt-24 pb-4 px-4 flex flex-col max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="glass-card rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Voice Companion</h1>
                <EmotionBadge emotion={currentEmotion?.dominantEmotion || null} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setAutoSpeak(!autoSpeak)} className="rounded-xl">
                {autoSpeak ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                Auto-speak {autoSpeak ? "On" : "Off"}
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-xl bg-transparent">
                <Link href="/chat">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Text Chat
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main voice interface */}
        <div className="flex-1 flex flex-col">
          {/* Conversations */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px]">
            {messages.length === 1 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 float-animation">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-3">Voice Companion Mode</h2>
                <p className="text-muted-foreground max-w-md mb-4">
                  Speak naturally and I'll respond with emotion-matched voice.
                  {!sttSupported && " (Speech recognition not supported in this browser)"}
                </p>
                {!currentEmotion && (
                  <Button asChild variant="outline" className="rounded-xl bg-transparent">
                    <Link href="/emotion-detection">Detect My Emotion First</Link>
                  </Button>
                )}
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <VoiceMessage
                    key={msg.id}
                    role={msg.type === "ai" ? "assistant" : "user"}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    onPlayback={msg.type === "ai" ? () => handlePlayback(msg.id, msg.content) : undefined}
                    isPlaying={playingId === msg.id}
                  />
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Voice controls */}
          <div className="glass-card rounded-2xl p-6">
            {/* Current transcript */}
            {isListening && transcript && (
              <div className="mb-4 p-3 rounded-xl bg-primary/10 text-sm">
                <span className="text-muted-foreground">Hearing: </span>
                <span>{transcript}</span>
              </div>
            )}

            {/* Visualizer */}
            <div className="mb-6">
              <VoiceVisualizer isActive={isListening || isSpeaking} type={isListening ? "listening" : "speaking"} />
            </div>

            {/* Status text */}
            <p className="text-center text-sm text-muted-foreground mb-4">
              {isListening
                ? "Listening..."
                : isSpeaking
                  ? "Speaking..."
                  : isProcessing
                    ? "Thinking..."
                    : "Tap the microphone to speak"}
            </p>

            {/* Main control buttons */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {isSpeaking && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={stopSpeaking}
                  className="rounded-2xl h-14 px-6 bg-transparent"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop
                </Button>
              )}

              <Button
                size="lg"
                disabled={!sttSupported || isProcessing}
                onClick={handleMicClick}
                className={cn(
                  "rounded-full w-20 h-20 transition-all duration-300",
                  isListening ? "bg-red-500 hover:bg-red-600 glow-primary scale-110" : "glow-primary",
                )}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                <span className="sr-only">{isListening ? "Stop listening" : "Start listening"}</span>
              </Button>
            </div>

            {/* Text fallback */}
            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or type your message..."
                disabled={isProcessing}
                className="rounded-xl"
              />
              <Button type="submit" disabled={!textInput.trim() || isProcessing} className="rounded-xl px-4">
                <Send className="w-4 h-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
