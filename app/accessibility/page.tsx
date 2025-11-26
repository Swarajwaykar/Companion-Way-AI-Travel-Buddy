"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, Type, Contrast, Volume2, MousePointer, Keyboard } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AccessibilityPage() {
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [fontSize, highContrast])

  const features = [
    {
      icon: Eye,
      title: "Screen Reader Support",
      description: "All interactive elements include proper ARIA labels and roles for screen reader compatibility.",
    },
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Navigate the entire app using only your keyboard. Tab, Enter, and Arrow keys are fully supported.",
    },
    {
      icon: MousePointer,
      title: "Large Click Targets",
      description: "Buttons and interactive elements are sized for easy clicking and tapping on any device.",
    },
    {
      icon: Volume2,
      title: "Voice Interaction",
      description: "Use voice commands to interact with the AI companion without needing to type.",
    },
  ]

  return (
    <main className="min-h-screen pb-16">
      <Navigation />

      <div className="pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
              <span className="gradient-text">Accessibility</span> Options
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Companion Way is designed to be accessible to everyone. Customize your experience below.
            </p>
          </div>

          {/* Controls */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Font size control */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Font Size
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">A</span>
                  <Slider
                    value={[fontSize]}
                    onValueChange={([value]) => setFontSize(value)}
                    min={80}
                    max={150}
                    step={10}
                    className="flex-1 mx-4"
                  />
                  <span className="text-xl font-bold">A</span>
                </div>
                <p className="text-sm text-muted-foreground text-center">Current: {fontSize}%</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFontSize(80)}
                    className={cn("flex-1 rounded-xl", fontSize === 80 && "bg-primary text-primary-foreground")}
                  >
                    Small
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFontSize(100)}
                    className={cn("flex-1 rounded-xl", fontSize === 100 && "bg-primary text-primary-foreground")}
                  >
                    Normal
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFontSize(130)}
                    className={cn("flex-1 rounded-xl", fontSize === 130 && "bg-primary text-primary-foreground")}
                  >
                    Large
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* High contrast toggle */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Contrast className="w-5 h-5" />
                  High Contrast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast" className="flex-1">
                    Enable high contrast mode for better visibility
                  </Label>
                  <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Increases contrast between text and background for easier reading.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Accessibility Features</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index} className="glass-card border-0">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Statement */}
          <Card className="glass-card border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold mb-4">Our Commitment</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We believe technology should be accessible to everyone. Companion Way follows WCAG 2.1 guidelines and
                continuously improves accessibility. If you encounter any barriers, please contact us—we want to help.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
