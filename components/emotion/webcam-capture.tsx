"use client"

import { useRef, useState, useCallback } from "react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface WebcamCaptureProps {
  onCapture: (imageBase64: string) => void
  isLoading: boolean
}

export function WebcamCapture({ onCapture, isLoading }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")

  const handleUserMedia = useCallback(() => {
    setHasPermission(true)
  }, [])

  const handleUserMediaError = useCallback(() => {
    setHasPermission(false)
  }, [])

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        onCapture(imageSrc)
      }
    }
  }, [onCapture])

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }, [])

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: facingMode,
  }

  if (hasPermission === false) {
    return (
      <div className="aspect-video rounded-2xl glass-card flex flex-col items-center justify-center p-8 text-center">
        <Camera className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Camera Access Required</h3>
        <p className="text-muted-foreground mb-4">
          Please enable camera access in your browser settings to detect emotions.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Camera container */}
      <div className="relative aspect-video rounded-2xl overflow-hidden glass-card">
        {hasPermission === null && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Requesting camera access...</p>
            </div>
          </div>
        )}

        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
          className="w-full h-full object-cover"
          mirrored={facingMode === "user"}
        />

        {/* Overlay guides */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-8 border-2 border-primary/30 rounded-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary/50 rounded-full" />
        </div>

        {/* Camera switch button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCamera}
          className="absolute top-4 right-4 rounded-xl glass-card"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="sr-only">Switch camera</span>
        </Button>
      </div>

      {/* Capture button */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={capture}
          disabled={isLoading || !hasPermission}
          size="lg"
          className={cn("rounded-2xl px-8 py-6 text-lg", !isLoading && "glow-primary")}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              Capture My Emotion
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
