"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { FileText, Layers, ClipboardCheck, MessageCircle, ScrollText, Clock } from "lucide-react"
import { NotesView } from "./notes-view"
import { FlashcardsView } from "./flashcards-view"
import { QuizView } from "./quiz-view"
import { ChatView } from "./chat-view"
import type { LectureSession, ChatMessage } from "@/lib/types"
import { formatDuration } from "@/lib/utils"

interface ResultsDashboardProps {
  session: LectureSession
  onChatUpdate: (messages: ChatMessage[]) => void
}

const tabs = [
  { id: "notes", label: "Notes", icon: FileText },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "quiz", label: "Quiz", icon: ClipboardCheck },
  { id: "chat", label: "Ask AI", icon: MessageCircle },
  { id: "transcript", label: "Transcript", icon: ScrollText },
]

export function ResultsDashboard({ session, onChatUpdate }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState("notes")

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          {session.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-text-muted">
          {session.duration && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(session.duration)}
            </span>
          )}
          <span>
            {new Date(session.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative flex gap-1 p-1 bg-surface-1 rounded-xl border border-border overflow-x-auto"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const isDisabled =
            (tab.id === "notes" && !session.notes) ||
            (tab.id === "flashcards" && (!session.flashcards || session.flashcards.length === 0)) ||
            (tab.id === "quiz" && (!session.quiz || session.quiz.length === 0))

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && setActiveTab(tab.id)}
              disabled={isDisabled}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg z-10 whitespace-nowrap cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                isActive ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-bg"
                  className="absolute inset-0 bg-surface-2 rounded-lg border border-border-hover"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "notes" && session.notes && (
          <NotesView notes={session.notes} title={session.title} />
        )}
        {activeTab === "flashcards" && session.flashcards && (
          <FlashcardsView flashcards={session.flashcards} />
        )}
        {activeTab === "quiz" && session.quiz && <QuizView quiz={session.quiz} />}
        {activeTab === "chat" && (
          <ChatView
            sessionId={session.id}
            chatHistory={session.chatHistory}
            onNewMessage={onChatUpdate}
          />
        )}
        {activeTab === "transcript" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-2xl bg-surface-1 border border-border"
          >
            <div className="flex items-center gap-2 text-text-secondary mb-4">
              <ScrollText className="w-4 h-4" />
              <span className="text-sm font-medium">Full Transcript</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
              {session.transcript}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
