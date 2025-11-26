"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Smile, MessageCircle, Mic, Map, Heart, Shield } from "lucide-react"

const features = [
  {
    icon: Smile,
    title: "Emotion Detection",
    description: "Advanced facial recognition detects your emotional state in real-time using Face++ API",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    icon: MessageCircle,
    title: "AI Chat Companion",
    description: "Google Gemini-powered conversations that adapt to your emotional needs",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    icon: Mic,
    title: "Voice Companion",
    description: "Speak naturally and receive emotion-matched voice responses",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    icon: Map,
    title: "Travel Support",
    description: "Specialized guidance for solo travelers feeling lonely or lost",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    icon: Heart,
    title: "Emotional Intelligence",
    description: "Responses adapt to whether you're happy, sad, excited, or anxious",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Safe & Supportive",
    description: "A judgment-free companion that makes you feel understood",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Your Travel Buddy Does</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powered by cutting-edge AI to provide emotional support wherever your journey takes you
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="glass-card border-0 group hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div
                    className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
