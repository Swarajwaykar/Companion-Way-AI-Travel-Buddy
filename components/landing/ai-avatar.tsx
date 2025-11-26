"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Smile, Heart, Star, Sparkles } from "lucide-react"

export function AiAvatar() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main avatar container */}
      <div
        className={cn(
          "relative w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center transition-all duration-500",
          "bg-gradient-to-br from-primary/30 to-accent/30",
          isHovered ? "scale-110" : "scale-100",
          "float-animation",
        )}
      >
        {/* Inner glow ring */}
        <div
          className={cn(
            "absolute inset-2 rounded-full transition-all duration-500",
            "bg-gradient-to-br from-primary/40 to-accent/40",
            isHovered ? "opacity-100 scale-100" : "opacity-70 scale-95",
          )}
        />

        {/* Core avatar */}
        <div
          className={cn(
            "relative w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all duration-500",
            "glass-card",
            isHovered && "glow-primary",
          )}
        >
          {/* Face */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={cn(
                  "w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary transition-all duration-300",
                  isHovered && "scale-125",
                )}
              />
              <div
                className={cn(
                  "w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary transition-all duration-300",
                  isHovered && "scale-125",
                )}
              />
            </div>
            <div
              className={cn(
                "w-10 h-5 md:w-12 md:h-6 mx-auto rounded-b-full bg-accent/60 transition-all duration-300",
                isHovered ? "scale-110" : "scale-100",
              )}
            />
          </div>
        </div>

        {/* Outer glow */}
        <div
          className={cn(
            "absolute -inset-4 rounded-full blur-xl transition-all duration-500",
            "bg-gradient-to-br from-primary/20 to-accent/20",
            isHovered ? "opacity-100 scale-105" : "opacity-50 scale-100",
          )}
        />
      </div>

      {/* Floating icons */}
      <div
        className={cn(
          "absolute -top-4 -right-4 transition-all duration-500",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
      >
        <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center glow-accent">
          <Smile className="w-5 h-5 text-accent" />
        </div>
      </div>

      <div
        className={cn(
          "absolute -bottom-2 -left-6 transition-all duration-500 delay-100",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
      >
        <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center glow-primary">
          <Heart className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div
        className={cn(
          "absolute top-1/2 -right-10 transition-all duration-500 delay-200",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
        )}
      >
        <div className="w-8 h-8 rounded-full glass-card flex items-center justify-center">
          <Star className="w-4 h-4 text-chart-4" />
        </div>
      </div>

      <div
        className={cn(
          "absolute -top-2 left-0 transition-all duration-500 delay-150",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
      >
        <div className="w-8 h-8 rounded-full glass-card flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-chart-5" />
        </div>
      </div>
    </div>
  )
}
