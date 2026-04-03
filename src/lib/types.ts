export interface Flashcard {
  front: string
  back: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface LectureSession {
  id: string
  title: string
  transcript: string
  notes: string | null
  flashcards: Flashcard[] | null
  quiz: QuizQuestion[] | null
  chatHistory: ChatMessage[]
  createdAt: string
  duration: number | null
  status: "uploading" | "transcribing" | "generating" | "ready" | "error"
  error: string | null
}

export interface ProcessingProgress {
  stage: "uploading" | "transcribing" | "notes" | "flashcards" | "quiz" | "complete"
  progress: number
  message: string
}
