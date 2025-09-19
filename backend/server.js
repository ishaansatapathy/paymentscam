import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Mock AI classification function (fallback when no OpenAI API key)
function mockClassifyUPI(upiId) {
  // Simple heuristic-based classification for demo
  const suspiciousPatterns = [
    /fake/i,
    /scam/i,
    /fraud/i,
    /test123/i,
    /admin/i,
    /system/i,
    /[0-9]{10,}/, // Very long numbers
    /(.)\1{4,}/, // Repeated characters (aaaaa, 11111)
  ]

  const isSuspicious = suspiciousPatterns.some((pattern) => pattern.test(upiId))

  return {
    safe: !isSuspicious,
    message: isSuspicious
      ? "UPI ID contains suspicious patterns that may indicate fraudulent activity."
      : "UPI ID appears to follow standard naming conventions and looks safe.",
  }
}

// AI-powered classification function
async function classifyUPIWithAI(upiId) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: `Analyze this UPI ID for safety: "${upiId}"

Please classify it as either SAFE or SUSPICIOUS based on these criteria:
- SUSPICIOUS: Contains obvious fake names, suspicious patterns, very long numbers, repeated characters, admin/system keywords, or anything that looks like a scam
- SAFE: Follows normal UPI naming conventions (name@bank format), looks legitimate

Respond with exactly one word: SAFE or SUSPICIOUS

Then on a new line, provide a brief explanation (max 50 words) of your reasoning.`,
      maxOutputTokens: 100,
      temperature: 0.1,
    })

    const lines = text.trim().split("\n")
    const classification = lines[0].toUpperCase()
    const explanation = lines.slice(1).join(" ").trim()

    return {
      safe: classification === "SAFE",
      message:
        explanation ||
        (classification === "SAFE"
          ? "UPI ID appears legitimate and follows standard conventions."
          : "UPI ID shows suspicious characteristics that warrant caution."),
    }
  } catch (error) {
    console.error("AI classification error:", error)
    // Fallback to mock classification
    return mockClassifyUPI(upiId)
  }
}

// POST /check endpoint
app.post("/check", async (req, res) => {
  try {
    const { upiId } = req.body

    // Validate input
    if (!upiId || typeof upiId !== "string") {
      return res.status(400).json({
        error: "Invalid input. Please provide a valid upiId string.",
      })
    }

    // Basic UPI format validation
    if (!upiId.includes("@") || upiId.length < 5) {
      return res.json({
        safe: false,
        message: "Invalid UPI ID format. UPI IDs should contain '@' and be properly formatted.",
      })
    }

    // Check if OpenAI API key is available
    const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0

    let result
    if (hasOpenAIKey) {
      console.log(`Classifying UPI ID with AI: ${upiId}`)
      result = await classifyUPIWithAI(upiId)
    } else {
      console.log(`Classifying UPI ID with mock AI: ${upiId}`)
      result = mockClassifyUPI(upiId)
    }

    // Log the result
    console.log(`Classification result for ${upiId}:`, result)

    res.json(result)
  } catch (error) {
    console.error("Server error:", error)
    res.status(500).json({
      error: "Internal server error occurred while processing the request.",
    })
  }
})

// Health check endpoint
app.get("/health", (req, res) => {
  const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0
  res.json({
    status: "healthy",
    aiMode: hasOpenAIKey ? "OpenAI API" : "Mock Classification",
    timestamp: new Date().toISOString(),
  })
})

// Start server
app.listen(PORT, () => {
  const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0
  console.log(`🚀 UPI Checker API running on port ${PORT}`)
  console.log(`🤖 AI Mode: ${hasOpenAIKey ? "OpenAI API" : "Mock Classification"}`)
  console.log(`📋 Endpoints:`)
  console.log(`   POST /check - Classify UPI ID safety`)
  console.log(`   GET /health - Health check`)

  if (!hasOpenAIKey) {
    console.log(`⚠️  No OPENAI_API_KEY found. Using mock classification.`)
    console.log(`   Add OPENAI_API_KEY to .env file to enable AI classification.`)
  }
})
