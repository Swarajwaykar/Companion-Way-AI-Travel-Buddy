import type { Emotion } from "@/lib/emotion-context"

const emotionPrompts: Record<Emotion | string, string> = {
  happy: `The user is feeling happy and cheerful. Respond with enthusiasm, energy, and positivity! 
  Use upbeat language, celebrate their good mood, and encourage their positive vibes. 
  Feel free to suggest exciting travel activities or share in their joy.`,

  sad: `The user is feeling sad or down. Respond with warmth, comfort, and gentle support. 
  Be empathetic and understanding. Offer soothing words and reassurance. 
  Suggest calming activities or simply be a caring presence. Avoid being overly cheerful.`,

  angry: `The user is feeling angry or frustrated. Respond with calm, grounding energy. 
  Acknowledge their feelings without judgment. Help them process their frustration. 
  Suggest breathing exercises or calming activities. Be patient and understanding.`,

  fear: `The user is feeling fearful or anxious. Respond with safety, reassurance, and calm. 
  Be a stable, comforting presence. Validate their concerns without amplifying them. 
  Offer practical suggestions and remind them they are safe. Be gentle and supportive.`,

  neutral: `The user is feeling neutral or calm. Respond with clear, informative, and friendly communication. 
  Be helpful and conversational. Provide useful travel tips and engage naturally.`,

  surprise: `The user is feeling surprised or excited. Match their energy with enthusiasm! 
  Be curious about what surprised them and engage with their excitement. 
  Keep the momentum going with interesting suggestions or questions.`,

  disgust: `The user may be feeling uncomfortable or turned off by something. 
  Be understanding and help redirect to more pleasant topics. 
  Offer alternative suggestions and be supportive without dwelling on negatives.`,

  excited: `Your excitement is amazing! I'd love to hear what has you so energized!
  Match their high energy and enthusiasm. Celebrate with them and encourage their excitement.`,

  calm: `I appreciate your calm energy. It's nice to have peaceful moments like this.
  Be gentle and maintain the peaceful atmosphere. Speak softly and reassuringly.`,

  concerned: `I notice you seem a bit worried. I'm here to help however I can.
  Be supportive and offer practical help. Validate their concerns and provide comfort.`,
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, messages, emotion, conversationHistory } = body

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      console.error("[v0] Missing GOOGLE_GENERATIVE_AI_API_KEY")
      return Response.json(
        {
          success: false,
          error: "Google API key is missing. Please add GOOGLE_GENERATIVE_AI_API_KEY in the Vars section.",
          message: null,
        },
        { status: 500 },
      )
    }

    const emotionGuidance = emotion ? emotionPrompts[emotion] || emotionPrompts.neutral : emotionPrompts.neutral

    const systemPrompt = `You are "Companion Way", a warm, friendly, and emotionally intelligent AI travel companion. 
You are NOT a generic assistant - you are a caring companion who understands emotions and provides personalized support.

Current Emotional Context:
${emotionGuidance}

Your Core Personality:
- You are empathetic, warm, and genuinely caring
- You understand the unique challenges of solo travel
- You never sound robotic or generic
- You relate conversations to travel when relevant
- You make the user feel understood, never judged
- You provide gentle suggestions, not demands

Response Style:
- Keep responses conversational and warm (2-4 sentences typically)
- Use appropriate length - longer for emotional support, shorter for quick info
- Always acknowledge their emotional state subtly
- Be a friend, not a service`

    // Build conversation history for Gemini format
    const contents: { role: string; parts: { text: string }[] }[] = []

    // Add system prompt as first user message (Gemini doesn't have system role)
    contents.push({
      role: "user",
      parts: [{ text: `[System Instructions - Follow these for all responses]\n${systemPrompt}` }],
    })
    contents.push({
      role: "model",
      parts: [
        {
          text: "I understand. I am Companion Way, your emotionally intelligent travel companion. I'll follow these guidelines in all my responses.",
        },
      ],
    })

    // Add conversation history
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        if (msg.type === "user" || msg.role === "user") {
          contents.push({ role: "user", parts: [{ text: msg.content }] })
        } else if (msg.type === "ai" || msg.role === "assistant") {
          contents.push({ role: "model", parts: [{ text: msg.content }] })
        }
      }
    }

    if (messages && Array.isArray(messages)) {
      for (const msg of messages) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })
      }
    }

    // Add current message
    if (message && typeof message === "string") {
      contents.push({ role: "user", parts: [{ text: message }] })
    }

    if (contents.length <= 2) {
      return Response.json({
        success: true,
        message: "Hello! I'm your Companion Way travel buddy. How are you feeling today?",
      })
    }

    console.log("[v0] Calling Gemini REST API with", contents.length, "messages")

    // Direct fetch to Gemini REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      },
    )

    const data = await response.json()

    console.log("[v0] Gemini API response status:", response.status)

    if (!response.ok) {
      console.error("[v0] Gemini API error:", JSON.stringify(data))

      if (response.status === 429) {
        return Response.json(
          {
            success: false,
            error: "API rate limit reached. Please wait a moment and try again.",
            message: null,
          },
          { status: 429 },
        )
      }

      if (response.status === 400 && data.error?.message?.includes("API key")) {
        return Response.json(
          {
            success: false,
            error: "Invalid API key. Please check your GOOGLE_GENERATIVE_AI_API_KEY in the Vars section.",
            message: null,
          },
          { status: 400 },
        )
      }

      return Response.json(
        {
          success: false,
          error: data.error?.message || "Failed to get response from Gemini",
          message: null,
        },
        { status: response.status },
      )
    }

    // Extract text from Gemini response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      console.error("[v0] No text in Gemini response:", JSON.stringify(data))
      return Response.json(
        {
          success: false,
          error: "Gemini returned an empty response",
          message: null,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Gemini response received, text length:", generatedText.length)

    return Response.json({
      success: true,
      message: generatedText,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("[v0] Error in chat API:", errorMessage)

    return Response.json(
      {
        success: false,
        error: `Failed to generate response: ${errorMessage}`,
        message: null,
      },
      { status: 500 },
    )
  }
}
