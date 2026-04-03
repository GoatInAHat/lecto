# Lecto — AI Lecture Companion

## Devpost Writeup

### Inspiration

As college students, we spend hours in lectures — but research shows passive listening leads to poor retention. Active learning techniques like flashcard drilling, self-testing, and concept Q&A are proven to be 2-3x more effective for long-term retention. The problem? Creating these study materials manually takes almost as long as the lecture itself.

We built Lecto to bridge this gap: one upload turns any lecture into a complete active learning toolkit.

### What it does

Lecto transforms lecture recordings into comprehensive study materials using AI:

1. **Upload** any lecture recording (audio or video, up to 25MB)
2. **Transcribe** — OpenAI Whisper converts speech to text with high accuracy across accents and technical jargon
3. **Generate** four types of study materials simultaneously:
   - **📝 Structured Notes** — organized with headers, key terms bolded, and a Key Takeaways summary
   - **🃏 Flashcards** — Anki-style question/answer cards designed for active recall practice, with "Got It" / "Don't Know" tracking
   - **✅ Practice Quiz** — 10 multiple-choice questions with instant feedback and explanations for each answer
   - **💬 Lecture Q&A** — chat interface where you can ask questions about the lecture and get AI answers grounded in what was actually said

### How we built it

**Frontend:** Next.js 15 with App Router, Tailwind CSS v4, and Motion (Framer Motion) for fluid animations. The UI features a dark academic theme with purple accents, glass effects, noise texture overlays, and orchestrated entrance animations. Custom components built from scratch — no template used.

**Backend:** Next.js API routes handle the entire pipeline:
1. File upload → OpenAI Whisper API for transcription
2. Transcript → GPT-4o generates notes, flashcards, and quiz in parallel (Promise.allSettled for resilience)
3. Chat endpoint maintains conversation history per session with the transcript as grounding context

**AI Architecture:**
- **Whisper** — `whisper-1` model with verbose JSON response for duration metadata
- **GPT-4o** — specialized system prompts for each output type (notes, flashcards, quiz, chat), with temperature tuning (0.3 for notes, 0.4 for quiz/flashcards, 0.5 for chat)
- **Prompt Engineering** — each prompt includes specific output format rules to ensure consistent, parseable JSON for flashcards and quiz, and well-structured markdown for notes

**Processing:** Background processing with polling — the upload returns immediately with a session ID, and the client polls for status updates. All three generation tasks run in parallel for speed.

### Challenges we ran into

- **File size limits** — Whisper's 25MB limit required careful file validation and clear user feedback
- **JSON parsing from LLM output** — GPT-4o sometimes wraps JSON in markdown code blocks; we use regex extraction to handle edge cases
- **Motion type strictness** — The Motion (Framer Motion) library has strict TypeScript types for animation variants, requiring careful typing of easing curves and transition properties
- **Parallel generation resilience** — Using `Promise.allSettled` instead of `Promise.all` ensures that if one generation fails (e.g., quiz), the others still complete successfully

### Accomplishments that we're proud of

- **End-to-end in under 90 seconds** — upload to full study materials, including transcription
- **Polished UI** — dark theme, animated transitions, glass effects, responsive design — looks production-ready, not hacky
- **Interactive flashcard review** — full Anki-style flow with flip animations, known/unknown tracking, and progress bar
- **Quiz with explanations** — not just right/wrong, but why each answer is correct
- **Grounded chat** — the Q&A is grounded in the actual transcript, so it won't make up content that wasn't in the lecture

### What we learned

- **Prompt engineering matters enormously** — the difference between a vague "make flashcards" prompt and our structured prompts with format rules, examples, and quality criteria is night and day
- **Background processing + polling** is the right pattern for long-running AI operations in serverless environments
- **Motion library** (Framer Motion rebrand) is incredibly powerful for creating polished, orchestrated animations that make an app feel premium
- **Tailwind CSS v4's** new CSS-first configuration with `@theme` blocks makes design system setup much cleaner

### What's next for Lecto

- **Audio recording** — record directly in the browser instead of uploading
- **Longer lectures** — chunk processing for files over 25MB
- **Spaced repetition** — schedule flashcard reviews using Ebbinghaus forgetting curve
- **Export** — export flashcards to Anki, notes to Notion, quiz to Google Forms
- **Multi-lecture** — combine materials from multiple lectures in the same course
- **Collaborative** — share study materials with classmates
- **Real-time** — live transcription and note-taking during lectures

### Built With

- Next.js 15
- TypeScript
- Tailwind CSS v4
- Motion (Framer Motion)
- OpenAI Whisper API
- OpenAI GPT-4o
- Lucide React
- React Dropzone

### Try It Out

- **GitHub:** https://github.com/GoatInAHat/lecto
- **Demo Video:** (to be recorded)
