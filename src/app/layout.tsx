import type { Metadata } from "next"
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Lecto — AI Lecture Companion",
  description:
    "Transform lectures into study materials. Upload or record a lecture and get AI-generated notes, flashcards, quizzes, and an interactive Q&A chatbot.",
  keywords: [
    "AI",
    "lecture",
    "notes",
    "flashcards",
    "quiz",
    "study",
    "transcription",
    "OpenAI",
    "Whisper",
  ],
  openGraph: {
    title: "Lecto — AI Lecture Companion",
    description:
      "Transform lectures into study materials with AI-powered transcription, notes, flashcards, and quizzes.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body className="noise-overlay gradient-mesh">{children}</body>
    </html>
  )
}
