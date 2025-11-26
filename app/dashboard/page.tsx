"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useEmotion } from "@/lib/emotion-context"
import { useChat } from "@/lib/chat-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Smile, MessageCircle, Mic, ArrowRight, Clock, BarChart3, History } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const emotionEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  fear: "😰",
  neutral: "😐",
  surprise: "😲",
  disgust: "🤢",
}

export default function DashboardPage() {
  const { currentEmotion, emotionHistory } = useEmotion()
  const { messages } = useChat()

  const quickActions = [
    { href: "/emotion-detection", label: "Detect Emotion", icon: Smile, color: "bg-chart-1/10 text-chart-1" },
    { href: "/chat", label: "Open Chat", icon: MessageCircle, color: "bg-chart-2/10 text-chart-2" },
    { href: "/voice", label: "Voice Mode", icon: Mic, color: "bg-primary/10 text-primary" },
  ]

  return (
    <main className="min-h-screen pb-16">
      <Navigation />

      <div className="pt-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Your emotional journey at a glance</p>
          </div>

          {/* Quick actions */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Card className="glass-card border-0 hover:scale-105 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", action.color)}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{action.label}</h3>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Stats grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Current emotion */}
            <Card className="glass-card border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Smile className="w-4 h-4" />
                  Current Emotion
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentEmotion ? (
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{emotionEmojis[currentEmotion.dominantEmotion]}</span>
                    <div>
                      <p className="text-2xl font-bold capitalize">{currentEmotion.dominantEmotion}</p>
                      <p className="text-sm text-muted-foreground">
                        Detected {format(currentEmotion.timestamp, "h:mm a")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    <p>No emotion detected yet</p>
                    <Button asChild variant="link" className="p-0 h-auto">
                      <Link href="/emotion-detection">Detect now</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat summary */}
            <Card className="glass-card border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{messages.length}</p>
                <p className="text-sm text-muted-foreground">Messages in this session</p>
                {messages.length > 0 && (
                  <Button asChild variant="link" className="p-0 h-auto mt-2">
                    <Link href="/chat">Continue chatting</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Emotion history count */}
            <Card className="glass-card border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Emotion Checks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{emotionHistory.length}</p>
                <p className="text-sm text-muted-foreground">Emotions detected this session</p>
              </CardContent>
            </Card>
          </div>

          {/* Emotion history */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Emotion History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {emotionHistory.length > 0 ? (
                <div className="space-y-3">
                  {emotionHistory.slice(0, 5).map((emotion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{emotionEmojis[emotion.dominantEmotion]}</span>
                        <div>
                          <p className="font-medium capitalize">{emotion.dominantEmotion}</p>
                          <p className="text-sm text-muted-foreground">
                            {emotion.scores[emotion.dominantEmotion].toFixed(1)}% confidence
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {format(emotion.timestamp, "h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No emotion history yet</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link href="/emotion-detection">Start detecting emotions</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
