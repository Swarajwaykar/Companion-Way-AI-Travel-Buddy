import { type NextRequest, NextResponse } from "next/server"

const FACEPP_API_KEY = process.env.FACEPP_API_KEY
const FACEPP_API_SECRET = process.env.FACEPP_API_SECRET

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json()

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Check if Face++ credentials are available
    if (!FACEPP_API_KEY || !FACEPP_API_SECRET) {
      // Return simulated emotion data for demo purposes
      console.log("[v0] Face++ API keys not configured, using simulated data")
      const emotions = ["happy", "sad", "angry", "fear", "neutral", "surprise", "disgust"]
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]

      const simulatedScores = {
        happy: Math.random() * 100,
        sad: Math.random() * 100,
        angry: Math.random() * 100,
        fear: Math.random() * 100,
        neutral: Math.random() * 100,
        surprise: Math.random() * 100,
        disgust: Math.random() * 100,
      }

      // Make the random emotion dominant
      simulatedScores[randomEmotion as keyof typeof simulatedScores] = 70 + Math.random() * 30

      // Normalize to sum to 100
      const total = Object.values(simulatedScores).reduce((a, b) => a + b, 0)
      Object.keys(simulatedScores).forEach((key) => {
        simulatedScores[key as keyof typeof simulatedScores] =
          (simulatedScores[key as keyof typeof simulatedScores] / total) * 100
      })

      const dominantEmotion = Object.entries(simulatedScores).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

      return NextResponse.json({
        success: true,
        data: {
          dominantEmotion,
          scores: simulatedScores,
          isSimulated: true,
        },
      })
    }

    // Call Face++ API
    const formData = new FormData()
    formData.append("api_key", FACEPP_API_KEY)
    formData.append("api_secret", FACEPP_API_SECRET)
    formData.append("image_base64", imageBase64.replace(/^data:image\/\w+;base64,/, ""))
    formData.append("return_attributes", "emotion")

    const response = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (result.error_message) {
      console.error("[v0] Face++ API error:", result.error_message)
      return NextResponse.json({ error: result.error_message }, { status: 400 })
    }

    if (!result.faces || result.faces.length === 0) {
      return NextResponse.json({ error: "No face detected in the image" }, { status: 400 })
    }

    const emotionData = result.faces[0].attributes.emotion

    // Map Face++ emotion names to our format
    const scores = {
      happy: emotionData.happiness || 0,
      sad: emotionData.sadness || 0,
      angry: emotionData.anger || 0,
      fear: emotionData.fear || 0,
      neutral: emotionData.neutral || 0,
      surprise: emotionData.surprise || 0,
      disgust: emotionData.disgust || 0,
    }

    // Find dominant emotion
    const dominantEmotion = Object.entries(scores).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

    return NextResponse.json({
      success: true,
      data: {
        dominantEmotion,
        scores,
        isSimulated: false,
      },
    })
  } catch (error) {
    console.error("[v0] Error detecting emotion:", error)
    return NextResponse.json({ error: "Failed to detect emotion" }, { status: 500 })
  }
}
