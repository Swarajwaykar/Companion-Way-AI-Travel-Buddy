"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Globe, Users, Clock, Compass } from "lucide-react"

const benefits = [
  {
    icon: Globe,
    title: "Always With You",
    description: "24/7 emotional support no matter your timezone or location",
  },
  {
    icon: Users,
    title: "Combat Loneliness",
    description: "A friendly companion when you're far from home and loved ones",
  },
  {
    icon: Clock,
    title: "Instant Support",
    description: "Get immediate emotional guidance when you need it most",
  },
  {
    icon: Compass,
    title: "Navigate Uncertainty",
    description: "Feel grounded even when exploring unfamiliar territories",
  },
]

export function SoloTravelerSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Perfect for <span className="gradient-text">Solo Travelers</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Traveling alone can be liberating, but sometimes you just need someone who understands. Companion Way is
              designed specifically for solo adventurers who want emotional support without judgment.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <Card key={index} className="glass-card border-0">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl glass-card p-8 flex items-center justify-center">
              <div className="relative">
                {/* Central globe */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center glow-primary float-animation">
                  <Globe className="w-16 h-16 text-primary" />
                </div>

                {/* Orbiting elements */}
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass-card flex items-center justify-center float-animation"
                  style={{ animationDelay: "-1s" }}
                >
                  <span className="text-2xl">✈️</span>
                </div>
                <div
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass-card flex items-center justify-center float-animation"
                  style={{ animationDelay: "-2s" }}
                >
                  <span className="text-2xl">🌍</span>
                </div>
                <div
                  className="absolute top-1/2 -left-8 -translate-y-1/2 w-12 h-12 rounded-full glass-card flex items-center justify-center float-animation"
                  style={{ animationDelay: "-3s" }}
                >
                  <span className="text-2xl">💭</span>
                </div>
                <div
                  className="absolute top-1/2 -right-8 -translate-y-1/2 w-12 h-12 rounded-full glass-card flex items-center justify-center float-animation"
                  style={{ animationDelay: "-4s" }}
                >
                  <span className="text-2xl">❤️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
