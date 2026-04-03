"use client"

import { motion } from "motion/react"
import { FileText, Copy, Check, Download } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface NotesViewProps {
  notes: string
  title: string
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-text-primary mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-text-primary mt-8 mb-3 tracking-tight">$1</h2>')
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
    .replace(/`(.*?)`/g, '<code class="bg-surface-2 px-1.5 py-0.5 rounded text-sm font-mono text-accent-light">$1</code>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/<\/li>\n<li>/g, "</li><li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul class="space-y-1.5 my-3">$1</ul>')
}

export function NotesView({ notes, title }: NotesViewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(notes)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([notes], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-notes.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-secondary">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Study Notes</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Notes content */}
      <div
        className="markdown-content p-6 rounded-2xl bg-surface-1 border border-border"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(notes) }}
      />
    </motion.div>
  )
}
