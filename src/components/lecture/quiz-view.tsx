"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ClipboardCheck, ChevronRight, RotateCcw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QuizQuestion } from "@/lib/types"
import { cn } from "@/lib/utils"

interface QuizViewProps {
  quiz: QuizQuestion[]
}

export function QuizView({ quiz }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz.length).fill(null))
  const [isComplete, setIsComplete] = useState(false)

  const current = quiz[currentIndex]
  const total = quiz.length

  const handleSelect = (optionIndex: number) => {
    if (showExplanation) return
    setSelectedOption(optionIndex)
    setShowExplanation(true)

    const newAnswers = [...answers]
    newAnswers[currentIndex] = optionIndex
    setAnswers(newAnswers)

    if (optionIndex === current.correctIndex) {
      setScore((s) => s + 1)
    }
  }

  const goNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedOption(null)
      setShowExplanation(false)
    } else {
      setIsComplete(true)
    }
  }

  const restart = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setShowExplanation(false)
    setScore(0)
    setAnswers(new Array(quiz.length).fill(null))
    setIsComplete(false)
  }

  if (isComplete) {
    const percentage = Math.round((score / total) * 100)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          className="w-24 h-24 rounded-3xl bg-accent-muted flex items-center justify-center"
        >
          <Trophy className="w-12 h-12 text-accent" />
        </motion.div>
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-text-primary tracking-tight"
          >
            {score}/{total}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-text-secondary mt-2"
          >
            {percentage >= 80
              ? "Excellent! You've mastered this material 🎉"
              : percentage >= 60
              ? "Good job! Review the ones you missed 📝"
              : "Keep studying — you'll get there! 💪"}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button onClick={restart}>
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-secondary">
          <ClipboardCheck className="w-4 h-4" />
          <span className="text-sm font-medium">
            Question {currentIndex + 1} of {total}
          </span>
        </div>
        <span className="text-sm text-accent font-medium">
          Score: {score}/{answers.filter((a) => a !== null).length}
        </span>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light"
          animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <p className="text-lg font-semibold text-text-primary leading-relaxed">
            {current.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {current.options.map((option, i) => {
              const isSelected = selectedOption === i
              const isCorrect = i === current.correctIndex
              const showResult = showExplanation

              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i)}
                  whileHover={!showExplanation ? { x: 4 } : {}}
                  whileTap={!showExplanation ? { scale: 0.99 } : {}}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border text-sm font-medium cursor-pointer",
                    "flex items-center gap-3",
                    showResult && isCorrect
                      ? "border-success/40 bg-success/10 text-success"
                      : showResult && isSelected && !isCorrect
                      ? "border-error/40 bg-error/10 text-error"
                      : isSelected
                      ? "border-accent/40 bg-accent-muted/10 text-text-primary"
                      : "border-border bg-surface-1 text-text-secondary hover:border-border-hover hover:text-text-primary",
                    showExplanation && "cursor-default"
                  )}
                  disabled={showExplanation}
                >
                  <span
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                      showResult && isCorrect
                        ? "bg-success/20 text-success"
                        : showResult && isSelected && !isCorrect
                        ? "bg-error/20 text-error"
                        : "bg-surface-2 text-text-muted"
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </motion.button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-xl bg-surface-2/50 border border-border"
              >
                <p className="text-sm text-text-secondary leading-relaxed">
                  <span className="font-semibold text-text-primary">Explanation: </span>
                  {current.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <Button onClick={goNext}>
            {currentIndex === total - 1 ? "See Results" : "Next Question"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
