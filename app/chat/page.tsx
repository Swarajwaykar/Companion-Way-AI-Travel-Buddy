"use client"
import { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import { TypingIndicator } from "@/components/chat/typing-indicator"
import { EmotionBadge } from "@/components/chat/emotion-badge"
import { useEmotion } from "@/lib/emotion-context"
import { useChat } from "@/lib/chat-context"
import { Button } from "@/components/ui/button"
import { MessageCircle, Trash2, Mic, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const { currentEmotion } = useEmotion()
  const { addMessage, clearMessages } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasWelcomed, setHasWelcomed] = useState(false)

  const generateAIResponse = async (userMessage: string, allMessages: Message[]): Promise<string> => {
    const emotion = currentEmotion?.dominantEmotion || "neutral"

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          emotion: emotion,
          conversationHistory: allMessages.map((m) => ({
            type: m.role === "assistant" ? "ai" : "user",
            content: m.content,
          })),
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Welcome message on first load with emotion
  useEffect(() => {
    if (currentEmotion && !hasWelcomed && messages.length === 0) {
      setHasWelcomed(true)
      handleWelcomeMessage()
    }
  }, [currentEmotion, hasWelcomed, messages.length])

  const handleWelcomeMessage = async () => {
    if (!currentEmotion) return

    setIsLoading(true)
    const emotion = currentEmotion.dominantEmotion

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[System: User has just arrived feeling ${emotion}. Give them a warm, personalized welcome that acknowledges their emotional state. Keep it brief and friendly.]`,
          emotion: emotion,
          conversationHistory: [],
        }),
      })

      const data = await response.json()

      if (data.success && data.message) {
        const welcomeMsg: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        }
        setMessages([welcomeMsg])
        addMessage({ role: "assistant", content: data.message, emotion })
      }
    } catch (error) {
      console.error("Error generating welcome message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    addMessage({ role: "user", content })

    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(content, updatedMessages)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      addMessage({
        role: "assistant",
        content: aiResponse,
        emotion: currentEmotion?.dominantEmotion,
      })
    } catch (error) {
      console.error("Error generating AI response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([])
    clearMessages()
    setHasWelcomed(false)
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 pt-24 pb-4 px-4 flex flex-col max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="glass-card rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center glow-accent">
                <MessageCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">AI Chat Companion</h1>
                <EmotionBadge emotion={currentEmotion?.dominantEmotion || null} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="rounded-xl bg-transparent">
                <Link href="/voice">
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Mode
                </Link>
              </Button>
              {messages.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClear} className="rounded-xl text-muted-foreground">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[400px]">
          {messages.length === 0 && !isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 float-animation">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Welcome to Your Travel Companion</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                {currentEmotion
                  ? `I can see you're feeling ${currentEmotion.dominantEmotion}. I'm here to support you—just start chatting!`
                  : "Start a conversation and I'll adapt to your emotional needs. For personalized support, detect your emotion first."}
              </p>
              {!currentEmotion && (
                <Button asChild variant="outline" className="rounded-xl bg-transparent">
                  <Link href="/emotion-detection">Detect My Emotion First</Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                  emotion={message.role === "assistant" ? currentEmotion?.dominantEmotion : undefined}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div className="sticky bottom-4">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </main>
  )
}
