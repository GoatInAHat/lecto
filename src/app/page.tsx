"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { GraduationCap, Sparkles, FileText, Layers, ClipboardCheck, MessageCircle, Zap } from "lucide-react"
import { UploadZone } from "@/components/lecture/upload-zone"
import { ProcessingScreen } from "@/components/lecture/processing-screen"
import { ResultsDashboard } from "@/components/lecture/results-dashboard"
import { Button } from "@/components/ui/button"
import type { LectureSession, ChatMessage } from "@/lib/types"

type AppView = "landing" | "upload" | "processing" | "results"

export default function Home() {
  const [view, setView] = useState<AppView>("landing")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [session, setSession] = useState<LectureSession | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File, title: string) => {
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setIsUploading(false)
        return
      }

      setSessionId(data.sessionId)
      setView("processing")
      setIsUploading(false)
    } catch {
      setError("Failed to upload file. Please try again.")
      setIsUploading(false)
    }
  }

  // Poll for session status
  const pollSession = useCallback(async () => {
    if (!sessionId) return

    try {
      const response = await fetch(`/api/session/${sessionId}`)
      const data = await response.json()

      if (data.error) return

      setSession(data)

      if (data.status === "ready") {
        setView("results")
      } else if (data.status === "error") {
        setError(data.error || "Processing failed")
        setView("upload")
      }
    } catch {
      // Ignore polling errors
    }
  }, [sessionId])

  useEffect(() => {
    if (view !== "processing" || !sessionId) return

    const interval = setInterval(pollSession, 2000)
    pollSession() // Initial poll

    return () => clearInterval(interval)
  }, [view, sessionId, pollSession])

  const handleChatUpdate = (messages: ChatMessage[]) => {
    if (session) {
      setSession({ ...session, chatHistory: messages })
    }
  }

  const goHome = () => {
    setView("landing")
    setSessionId(null)
    setSession(null)
    setError(null)
  }

  return (
    <main className="min-h-screen relative">
      {/* Navigation */}
      {view !== "landing" && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 backdrop-blur-xl bg-surface-0/80 border-b border-border"
        >
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={goHome} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-accent" />
              </div>
              <span className="font-bold text-text-primary tracking-tight text-lg">Lecto</span>
            </button>
            {view === "results" && (
              <Button variant="secondary" size="sm" onClick={() => { setView("upload"); setSession(null); setSessionId(null); }}>
                <Sparkles className="w-4 h-4" />
                New Lecture
              </Button>
            )}
          </div>
        </motion.nav>
      )}

      <AnimatePresence mode="wait">
        {/* Landing Page */}
        {view === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage onGetStarted={() => setView("upload")} />
          </motion.div>
        )}

        {/* Upload */}
        {view === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-6 py-16"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-text-primary tracking-tight">
                Upload your lecture
              </h2>
              <p className="text-text-secondary mt-2">
                Drop an audio or video file and we&apos;ll do the rest
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm"
              >
                {error}
              </motion.div>
            )}

            <UploadZone onUpload={handleUpload} isUploading={isUploading} />
          </motion.div>
        )}

        {/* Processing */}
        {view === "processing" && session && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-6 py-16"
          >
            <ProcessingScreen status={session.status} />
          </motion.div>
        )}

        {/* Processing (before first poll) */}
        {view === "processing" && !session && (
          <motion.div
            key="processing-initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-6 py-16"
          >
            <ProcessingScreen status="transcribing" />
          </motion.div>
        )}

        {/* Results */}
        {view === "results" && session && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-6 py-8"
          >
            <ResultsDashboard session={session} onChatUpdate={handleChatUpdate} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

/* ──────────────────── Landing Page ──────────────────── */

function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const features = [
    {
      icon: FileText,
      title: "Smart Notes",
      description: "AI-generated structured notes with headers, key terms, and takeaways",
    },
    {
      icon: Layers,
      title: "Flashcards",
      description: "Anki-style cards created automatically for active recall studying",
    },
    {
      icon: ClipboardCheck,
      title: "Practice Quiz",
      description: "Multiple choice questions with explanations to test comprehension",
    },
    {
      icon: MessageCircle,
      title: "Lecture Q&A",
      description: "Ask questions about the lecture and get answers grounded in what was said",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Ambient gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 20%, rgba(124, 92, 252, 0.12) 0%, transparent 60%)",
            "radial-gradient(ellipse at 70% 30%, rgba(124, 92, 252, 0.12) 0%, transparent 60%)",
            "radial-gradient(ellipse at 40% 60%, rgba(124, 92, 252, 0.12) 0%, transparent 60%)",
            "radial-gradient(ellipse at 30% 20%, rgba(124, 92, 252, 0.12) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Hero */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative z-10"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent-muted flex items-center justify-center glow-accent">
            <GraduationCap className="w-7 h-7 text-accent" />
          </div>
          <span className="text-3xl font-bold tracking-tight text-text-primary">Lecto</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold text-center tracking-tighter leading-[1.05] max-w-4xl"
        >
          Turn lectures into
          <br />
          <span className="bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent">
            study superpowers
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-text-secondary text-center max-w-2xl mt-6 leading-relaxed"
        >
          Upload a lecture recording. Get AI-generated notes, flashcards, quizzes,
          and an interactive Q&A — in under a minute.
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={onGetStarted} className="text-base px-10">
            <Zap className="w-5 h-5" />
            Try It Free
          </Button>
          <Button variant="secondary" size="lg" className="text-base">
            See How It Works
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-sm text-text-muted"
        >
          Powered by OpenAI Whisper &amp; GPT-4o • No sign-up required
        </motion.p>
      </motion.div>

      {/* Features grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-surface-1/60 border border-border backdrop-blur-sm hover:border-border-hover group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-muted/60 group-hover:bg-accent-muted flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-bold text-text-primary tracking-tight text-lg">{feature.title}</h3>
              <p className="text-text-secondary text-sm mt-1.5 leading-relaxed">{feature.description}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Footer */}
      <div className="border-t border-border py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-text-muted">
          <span>Built for HackNation 2026</span>
          <span>Made with ♥ and AI</span>
        </div>
      </div>
    </div>
  )
}
