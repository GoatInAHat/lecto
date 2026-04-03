import { NextResponse } from "next/server"
import { getAllSessions } from "@/lib/store"

export async function GET() {
  const sessions = getAllSessions()
  // Return lightweight list (no full transcripts/notes)
  const list = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    status: s.status,
    createdAt: s.createdAt,
    duration: s.duration,
    hasNotes: !!s.notes,
    hasFlashcards: !!s.flashcards?.length,
    hasQuiz: !!s.quiz?.length,
  }))
  return NextResponse.json(list)
}
