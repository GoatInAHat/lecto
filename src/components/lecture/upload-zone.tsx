"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "motion/react"
import { Upload, FileAudio, X, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
  onUpload: (file: File, title: string) => void
  isUploading: boolean
}

export function UploadZone({ onUpload, isUploading }: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const f = acceptedFiles[0]
      setFile(f)
      if (!title) {
        setTitle(f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "))
      }
    }
  }, [title])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a", ".ogg", ".flac", ".webm"],
      "video/*": [".mp4", ".webm", ".mov"],
    },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024,
    disabled: isUploading,
  })

  const handleSubmit = () => {
    if (file) {
      onUpload(file, title || "Untitled Lecture")
    }
  }

  const removeFile = () => {
    setFile(null)
    setTitle("")
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Title input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <label className="block text-sm font-medium text-text-secondary mb-2 tracking-wide uppercase">
          Lecture Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Intro to Machine Learning — Week 5"
          className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 text-sm"
          disabled={isUploading}
        />
      </motion.div>

      {/* Drop zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div
          {...getRootProps()}
          className={cn(
            "relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer group",
            "hover:border-accent/50 hover:bg-accent-muted/5",
            isDragActive
              ? "border-accent bg-accent-muted/10 scale-[1.02]"
              : "border-border",
            isUploading && "opacity-50 cursor-not-allowed",
            "transition-all duration-200"
          )}
        >
          <input {...getInputProps()} />
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent-muted flex items-center justify-center">
                  <FileAudio className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <p className="text-text-primary font-semibold text-lg">{file.name}</p>
                  <p className="text-text-muted text-sm mt-1">{formatSize(file.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                  className="flex items-center gap-1.5 text-sm text-text-muted hover:text-error transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface-2 group-hover:bg-accent-muted flex items-center justify-center transition-colors">
                  <Upload className="w-8 h-8 text-text-muted group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <p className="text-text-primary font-semibold text-lg">
                    {isDragActive ? "Drop it here!" : "Drop your lecture file"}
                  </p>
                  <p className="text-text-muted text-sm mt-1">
                    MP3, WAV, M4A, MP4, WebM — up to 25MB
                  </p>
                </div>
                <span className="text-xs text-text-muted">
                  or click to browse files
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex justify-center"
      >
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!file}
          loading={isUploading}
          className="w-full max-w-xs"
        >
          <Mic className="w-5 h-5" />
          Process Lecture
        </Button>
      </motion.div>
    </div>
  )
}
