import { NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"
import { setSession, updateSession } from "@/lib/store"
import type { LectureSession } from "@/lib/types"
import {
  NOTES_SYSTEM_PROMPT,
  FLASHCARDS_SYSTEM_PROMPT,
  QUIZ_SYSTEM_PROMPT,
  buildNotesPrompt,
  buildFlashcardsPrompt,
  buildQuizPrompt,
} from "@/lib/prompts"
import { v4 as uuidv4 } from "uuid"

export const maxDuration = 300 // 5 min timeout for large files

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const title = (formData.get("title") as string) || "Untitled Lecture"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = [
      "audio/mpeg", "audio/mp3", "audio/wav", "audio/webm", "audio/ogg",
      "audio/flac", "audio/m4a", "audio/mp4",
      "video/mp4", "video/webm", "video/ogg", "video/quicktime",
    ]
    
    const isValid = validTypes.some(t => file.type.startsWith(t.split("/")[0]))
    if (!isValid && file.type !== "") {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Please upload an audio or video file.` },
        { status: 400 }
      )
    }

    // Check file size (max 25MB for Whisper API)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 25MB." },
        { status: 400 }
      )
    }

    const sessionId = uuidv4()

    // Create session
    const session: LectureSession = {
      id: sessionId,
      title,
      transcript: "",
      notes: null,
      flashcards: null,
      quiz: null,
      chatHistory: [],
      createdAt: new Date().toISOString(),
      duration: null,
      status: "transcribing",
      error: null,
    }
    setSession(session)

    // Start processing in background (don't await — return immediately)
    processLecture(sessionId, file, title).catch((err) => {
      console.error("Processing error:", err)
      updateSession(sessionId, {
        status: "error",
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      })
    })

    return NextResponse.json({ sessionId, status: "transcribing" })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    )
  }
}

async function processLecture(sessionId: string, file: File, title: string) {
  // Step 1: Transcribe with Whisper
  updateSession(sessionId, { status: "transcribing" })

  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: "whisper-1",
    response_format: "verbose_json",
  })

  const transcript = transcription.text
  const duration = transcription.duration || null

  updateSession(sessionId, {
    transcript,
    duration,
    status: "generating",
  })

  // Step 2: Generate notes, flashcards, and quiz in parallel
  const [notesResult, flashcardsResult, quizResult] = await Promise.allSettled([
    generateNotes(transcript),
    generateFlashcards(transcript),
    generateQuiz(transcript),
  ])

  const notes = notesResult.status === "fulfilled" ? notesResult.value : null
  const flashcards = flashcardsResult.status === "fulfilled" ? flashcardsResult.value : null
  const quiz = quizResult.status === "fulfilled" ? quizResult.value : null

  updateSession(sessionId, {
    notes,
    flashcards,
    quiz,
    status: "ready",
  })
}

async function generateNotes(transcript: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: NOTES_SYSTEM_PROMPT },
      { role: "user", content: buildNotesPrompt(transcript) },
    ],
    temperature: 0.3,
    max_tokens: 4096,
  })
  return response.choices[0]?.message?.content || ""
}

async function generateFlashcards(transcript: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: FLASHCARDS_SYSTEM_PROMPT },
      { role: "user", content: buildFlashcardsPrompt(transcript) },
    ],
    temperature: 0.4,
    max_tokens: 4096,
  })
  const content = response.choices[0]?.message?.content || "[]"
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : []
  } catch {
    console.error("Failed to parse flashcards:", content)
    return []
  }
}

async function generateQuiz(transcript: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: QUIZ_SYSTEM_PROMPT },
      { role: "user", content: buildQuizPrompt(transcript) },
    ],
    temperature: 0.4,
    max_tokens: 4096,
  })
  const content = response.choices[0]?.message?.content || "[]"
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : []
  } catch {
    console.error("Failed to parse quiz:", content)
    return []
  }
}
