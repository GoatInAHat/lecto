# 🎓 Lecto — AI Lecture Companion

Transform lectures into study superpowers. Upload or record a lecture and get AI-generated notes, flashcards, quizzes, and an interactive Q&A chatbot — in under a minute.

![Lecto](https://img.shields.io/badge/HackNation%202026-Submission-7c5cfc?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![OpenAI](https://img.shields.io/badge/OpenAI-Whisper%20%2B%20GPT--4o-412991?style=flat-square)

## 🚀 What It Does

1. **Upload** a lecture recording (audio or video)
2. **Transcribe** — OpenAI Whisper converts speech to text with high accuracy
3. **Generate Study Materials** — GPT-4o creates:
   - 📝 **Structured Notes** — organized with headers, key terms, and takeaways
   - 🃏 **Flashcards** — Anki-style cards for active recall practice
   - ✅ **Practice Quiz** — multiple choice with explanations
4. **Chat** — ask questions about the lecture content and get AI-powered answers

## 🎯 The Problem

Students spend hours rewatching lectures, taking incomplete notes, and creating study materials manually. Passive listening leads to poor retention. Active learning techniques (flashcards, self-testing) are proven to be far more effective, but creating these materials is time-consuming.

## 💡 The Solution

Lecto bridges the gap between passive lecture consumption and active studying. One upload gives you everything you need to master the material — notes to review, flashcards to drill, quizzes to test yourself, and a chatbot to clarify concepts.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), Tailwind CSS v4, Motion (Framer Motion) |
| **Backend** | Next.js API Routes |
| **Transcription** | OpenAI Whisper API |
| **AI Generation** | OpenAI GPT-4o |
| **UI Components** | Custom components with Lucide icons |

## 🏃 Getting Started

```bash
# Clone the repo
git clone https://github.com/bennetttv/lecto.git
cd lecto

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start using Lecto.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── transcribe/    # Audio upload + Whisper + GPT-4o pipeline
│   │   ├── chat/          # Q&A chat endpoint
│   │   ├── session/[id]/  # Session retrieval
│   │   └── sessions/      # Session listing
│   ├── layout.tsx         # App layout with fonts + metadata
│   ├── page.tsx           # Main app (landing, upload, processing, results)
│   └── globals.css        # Design tokens, dark theme, markdown styles
├── components/
│   ├── lecture/
│   │   ├── upload-zone.tsx        # Drag & drop file upload
│   │   ├── processing-screen.tsx  # Animated processing stages
│   │   ├── results-dashboard.tsx  # Tab-based results view
│   │   ├── notes-view.tsx         # Rendered study notes
│   │   ├── flashcards-view.tsx    # Interactive flashcard review
│   │   ├── quiz-view.tsx          # Multiple choice quiz
│   │   └── chat-view.tsx          # Lecture Q&A chat
│   └── ui/
│       ├── button.tsx     # Animated button component
│       └── card.tsx       # Glass-effect card component
└── lib/
    ├── openai.ts          # OpenAI client
    ├── prompts.ts         # AI prompt templates
    ├── store.ts           # In-memory session store
    ├── types.ts           # TypeScript types
    └── utils.ts           # Utility functions
```

## 🎨 Design

- **Dark mode** — easy on the eyes for late-night study sessions
- **Purple accent** — distinctive and academic
- **Animated transitions** — smooth, orchestrated entrances with Motion
- **Glass effects** — backdrop blur, translucent surfaces, layered depth
- **Responsive** — works on desktop and mobile

## 🏆 Built For

**HackNation: 5th Global AI Hackathon** — April 2026
- $28,500 prize pool
- Theme: Build with AI

## 📄 License

MIT
