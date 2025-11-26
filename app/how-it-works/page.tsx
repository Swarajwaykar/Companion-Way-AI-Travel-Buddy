import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Camera, Cpu, MessageCircle, Mic, Heart, Shield, Globe, Accessibility, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Camera,
    title: "Emotion Detection",
    description:
      "Our system uses Face++ Meghali API to analyze your facial expressions through your camera. We detect 7 emotions: happy, sad, angry, fearful, neutral, surprised, and disgusted.",
    color: "bg-chart-1/10 text-chart-1",
  },
  {
    icon: Cpu,
    title: "AI Processing",
    description:
      "Google Gemini processes your detected emotion and adapts its personality accordingly. Happy mood? Get enthusiastic responses. Feeling down? Receive gentle, supportive guidance.",
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    icon: MessageCircle,
    title: "Emotional Chat",
    description:
      "Chat naturally with an AI that truly understands how you feel. Our companion provides travel-specific emotional guidance when you mention trips, loneliness, airports, or adventures.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Mic,
    title: "Voice Companion",
    description:
      "Speak naturally and receive voice responses that match your emotional state. The AI adjusts its speaking pace and tone—slower and gentler when you're sad, brighter when you're happy.",
    color: "bg-accent/10 text-accent",
  },
]

const benefits = [
  {
    icon: Heart,
    title: "Emotional Support",
    description:
      "Feel understood, not judged. Our AI companion provides genuine emotional support tailored to your current state.",
  },
  {
    icon: Globe,
    title: "Travel Focused",
    description:
      "Specifically designed for solo travelers who may feel lonely, lost, or confused during their adventures.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your images are processed instantly and never stored. Your conversations are private and secure.",
  },
  {
    icon: Accessibility,
    title: "Accessible",
    description:
      "Built with accessibility in mind, featuring high contrast options, large text, and screen reader support.",
  },
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen pb-16">
      <Navigation />

      <div className="pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
              How <span className="gradient-text">Companion Way</span> Works
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A friendly, step-by-step guide to your emotionally intelligent travel companion
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6 mb-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="glass-card border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${step.color}`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        {index < steps.length - 1 && <div className="w-0.5 h-8 bg-border mt-4" />}
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-xl font-semibold mb-2">
                          Step {index + 1}: {step.title}
                        </h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Why Choose Companion Way?</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <Card key={index} className="glass-card border-0">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Begin?</h2>
            <p className="text-muted-foreground mb-6">
              Start your emotionally intelligent travel companion experience now
            </p>
            <Button asChild size="lg" className="rounded-2xl px-8 glow-primary">
              <Link href="/emotion-detection">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
