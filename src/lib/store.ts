import type { LectureSession } from "./types"

// In-memory store for hackathon demo
// In production, this would be a database
const sessions = new Map<string, LectureSession>()

export function getSession(id: string): LectureSession | undefined {
  return sessions.get(id)
}

export function setSession(session: LectureSession): void {
  sessions.set(session.id, session)
}

export function updateSession(id: string, updates: Partial<LectureSession>): LectureSession | undefined {
  const session = sessions.get(id)
  if (!session) return undefined
  const updated = { ...session, ...updates }
  sessions.set(id, updated)
  return updated
}

export function getAllSessions(): LectureSession[] {
  return Array.from(sessions.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function deleteSession(id: string): boolean {
  return sessions.delete(id)
}
