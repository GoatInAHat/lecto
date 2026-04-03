import { NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"
import { getSession, updateSession } from "@/lib/store"
import { CHAT_SYSTEM_PROMPT, buildChatPrompt } from "@/lib/prompts"
import type { ChatMessage } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message } = await request.json()

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: "sessionId and message are required" },
        { status: 400 }
      )
    }

    const session = getSession(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    if (!session.transcript) {
      return NextResponse.json(
        { error: "No transcript available yet" },
        { status: 400 }
      )
    }

    // Add user message to history
    const userMessage: ChatMessage = { role: "user", content: message }
    const updatedHistory = [...session.chatHistory, userMessage]

    // Build messages for the API call
    const apiMessages = [
      { role: "system" as const, content: CHAT_SYSTEM_PROMPT },
      {
        role: "user" as const,
        content: buildChatPrompt(session.transcript, ""),
      },
      ...updatedHistory.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ]

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: apiMessages,
      temperature: 0.5,
      max_tokens: 1024,
    })

    const assistantContent =
      response.choices[0]?.message?.content || "I couldn't generate a response."
    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: assistantContent,
    }

    updateSession(sessionId, {
      chatHistory: [...updatedHistory, assistantMessage],
    })

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process message",
      },
      { status: 500 }
    )
  }
}
