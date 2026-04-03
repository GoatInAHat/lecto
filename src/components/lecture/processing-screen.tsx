"use client"

import { motion } from "motion/react"
import { Loader2, Headphones, Brain, Check } from "lucide-react"

interface ProcessingScreenProps {
  status: "uploading" | "transcribing" | "generating" | "ready" | "error"
}

const stages = [
  {
    key: "transcribing",
    label: "Transcribing audio",
    description: "Whisper is converting speech to text...",
    icon: Headphones,
  },
  {
    key: "generating",
    label: "Generating study materials",
    description: "Creating notes, flashcards, and quiz...",
    icon: Brain,
  },
  {
    key: "ready",
    label: "Ready!",
    description: "Your study materials are prepared",
    icon: Check,
  },
]

export function ProcessingScreen({ status }: ProcessingScreenProps) {
  const currentStageIndex = stages.findIndex((s) => s.key === status)

  return (
    <div className="w-full max-w-lg mx-auto py-12">
      {/* Animated brain icon */}
      <motion.div
        className="flex justify-center mb-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative">
          <motion.div
            className="w-24 h-24 rounded-3xl bg-accent-muted flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 0px rgba(124, 92, 252, 0.0)",
                "0 0 60px rgba(124, 92, 252, 0.3)",
                "0 0 0px rgba(124, 92, 252, 0.0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {status === "ready" ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Check className="w-12 h-12 text-success" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-12 h-12 text-accent" />
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Stage list */}
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const isActive = stage.key === status
          const isComplete = index < currentStageIndex
          const isPending = index > currentStageIndex
          const Icon = stage.icon

          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.4 }}
              className={`flex items-center gap-4 p-4 rounded-xl border ${
                isActive
                  ? "border-accent/30 bg-accent-muted/10"
                  : isComplete
                  ? "border-success/20 bg-success/5"
                  : "border-border bg-surface-1/50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? "bg-accent-muted"
                    : isComplete
                    ? "bg-success/10"
                    : "bg-surface-2"
                }`}
              >
                {isActive && status !== "ready" ? (
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                ) : isComplete || status === "ready" ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <Icon
                    className={`w-5 h-5 ${
                      isPending ? "text-text-muted" : "text-text-secondary"
                    }`}
                  />
                )}
              </div>
              <div>
                <p
                  className={`font-semibold text-sm ${
                    isActive
                      ? "text-text-primary"
                      : isComplete
                      ? "text-success"
                      : "text-text-muted"
                  }`}
                >
                  {stage.label}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-text-secondary mt-0.5"
                  >
                    {stage.description}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Encouraging message */}
      {status !== "ready" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-text-muted text-sm mt-8"
        >
          This usually takes 30–90 seconds depending on lecture length
        </motion.p>
      )}
    </div>
  )
}
