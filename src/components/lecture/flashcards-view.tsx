"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { RotateCcw, ChevronLeft, ChevronRight, Check, X, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Flashcard } from "@/lib/types"

interface FlashcardsViewProps {
  flashcards: Flashcard[]
}

export function FlashcardsView({ flashcards }: FlashcardsViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [known, setKnown] = useState<Set<number>>(new Set())
  const [unknown, setUnknown] = useState<Set<number>>(new Set())

  const current = flashcards[currentIndex]
  const total = flashcards.length
  const goNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1)
      setIsFlipped(false)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
      setIsFlipped(false)
    }
  }

  const markKnown = () => {
    setKnown((prev) => new Set([...prev, currentIndex]))
    setUnknown((prev) => {
      const next = new Set(prev)
      next.delete(currentIndex)
      return next
    })
    goNext()
  }

  const markUnknown = () => {
    setUnknown((prev) => new Set([...prev, currentIndex]))
    setKnown((prev) => {
      const next = new Set(prev)
      next.delete(currentIndex)
      return next
    })
    goNext()
  }

  const reset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnown(new Set())
    setUnknown(new Set())
  }

  if (!current) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-secondary">
          <Layers className="w-4 h-4" />
          <span className="text-sm font-medium">
            Card {currentIndex + 1} of {total}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-success">
            ✓ {known.size} known
          </span>
          <span className="text-error">
            ✗ {unknown.size} to review
          </span>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Flashcard */}
      <div className="flex justify-center">
        <div
          className="w-full max-w-xl perspective-1000 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentIndex}-${isFlipped}`}
              initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`min-h-[280px] rounded-2xl border p-8 flex flex-col items-center justify-center text-center ${
                isFlipped
                  ? "bg-accent-muted/10 border-accent/20"
                  : "bg-surface-1 border-border"
              }`}
            >
              <span className="text-xs font-medium uppercase tracking-widest text-text-muted mb-4">
                {isFlipped ? "Answer" : "Question"}
              </span>
              <p className={`text-lg leading-relaxed ${isFlipped ? "text-text-primary" : "text-text-primary font-semibold"}`}>
                {isFlipped ? current.back : current.front}
              </p>
              <span className="text-xs text-text-muted mt-6">
                {isFlipped ? "Click to see question" : "Click to reveal answer"}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation & marking */}
      <div className="flex items-center justify-center gap-3">
        <Button variant="secondary" size="sm" onClick={goPrev} disabled={currentIndex === 0}>
          <ChevronLeft className="w-4 h-4" />
          Prev
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={markUnknown}
          className="min-w-[100px]"
        >
          <X className="w-4 h-4" />
          Don&apos;t Know
        </Button>

        <Button
          size="sm"
          onClick={markKnown}
          className="min-w-[100px] bg-success/90 hover:bg-success text-surface-0"
        >
          <Check className="w-4 h-4" />
          Got It
        </Button>

        <Button variant="secondary" size="sm" onClick={goNext} disabled={currentIndex === total - 1}>
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
