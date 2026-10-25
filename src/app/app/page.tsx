
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUp,
  Atom,
  BookOpen,
  Bookmark,
  ChevronDown,
  Code2,
  FileText,
  FlaskConical,
  Folder,
  GraduationCap,
  Image as ImageIcon,
  LayoutGrid,
  LoaderCircle,
  MessageCircle,
  Moon,
  Plus,
  Settings,
  Sparkles,
  Sun,
  Upload,
  X,
  Lightbulb,
} from "lucide-react";

const suggestions = [
  { label: "Solve this problem", icon: FileText, prompt: "Solve this problem step by step: " },
  { label: "Explain this image", icon: ImageIcon, prompt: "Explain this image clearly, step by step." },
  { label: "Summarize this PDF", icon: FileText, prompt: "Summarize this document into important points." },
  { label: "Create study notes", icon: BookOpen, prompt: "Create organized study notes about " },
  { label: "Give step-by-step solution", icon: Lightbulb, prompt: "Give a detailed step-by-step solution for " },
];

const subjects = [
  { name: "Mathematics", icon: "math", color: "violet", prompt: "Teach me mathematics with simple explanations and worked examples." },
  { name: "Physics", icon: "physics", color: "purple", prompt: "Explain a physics concept using simple examples." },
  { name: "Chemistry", icon: "chemistry", color: "pink", prompt: "Explain a chemistry concept step by step." },
  { name: "Computer Science", icon: "code", color: "green", prompt: "Teach me a computer science topic with examples." },
  { name: "Engineering", icon: "engineering", color: "orange", prompt: "Explain an engineering concept clearly with practical examples." },
  { name: "General Knowledge", icon: "book", color: "blue", prompt: "Teach me an interesting general knowledge topic." },
];

const examples = [
  { title: "Explain a concept", description: "Explain recursion in simple words with an example.", icon: FileText, color: "blue", prompt: "Explain recursion in simple words with a working example." },
  { title: "Solve a problem", description: "Solve this math problem step by step.", icon: Code2, color: "purple", prompt: "Show me how to solve a mathematics problem step by step. Give an example." },
  { title: "Understand an image", description: "Explain this diagram.", icon: ImageIcon, color: "green", prompt: "Explain my uploaded diagram in detail." },
  { title: "Summarize a file", description: "Summarize my notes and make key points.", icon: FileText, color: "pink", prompt: "Summarize my uploaded notes and extract the most important points." },
];

type ChatMessage = {
  question: string;
  answer: string;
  fileName?: string;
};

const DEMO_ACCESS_KEY = "edugenie-demo-access";

export default function Home() {
  const router = useRouter();
  const [sessionReady, setSessionReady] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasDemoAccess =
      sessionStorage.getItem(DEMO_ACCESS_KEY) === "active" ||
      localStorage.getItem(DEMO_ACCESS_KEY) === "active";

    if (!hasDemoAccess) {
      router.replace("/login");
      return;
    }

    const readyTimer = window.setTimeout(() => setSessionReady(true), 0);
    return () => window.clearTimeout(readyTimer);
  }, [router]);

  function choosePrompt(value: string) {
    setPrompt(value);
    promptRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function sendPrompt(value = prompt) {
    const question = value.trim();

    if ((!question && !file) || loading) return;

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("prompt", question);

      if (file) data.append("file", file);

      const response = await fetch("/api/chat", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to get an answer.");
      }

      setMessages((previous) => [
        ...previous,
        {
          question: question || "Explain the uploaded file.",
          answer: result.answer,
          fileName: file?.name,
        },
      ]);

      setPrompt("");
      setFile(null);

      window.setTimeout(() => {
        answerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetHome() {
    setMessages([]);
    setPrompt("");
    setFile(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function signOut() {
    sessionStorage.removeItem(DEMO_ACCESS_KEY);
    localStorage.removeItem(DEMO_ACCESS_KEY);
    router.replace("/login");
  }

  if (!sessionReady) {
    return (
      <main className="auth-check" aria-live="polite">
        <span className="auth-check-mark"><Sparkles size={18} /></span>
        <p>Preparing your study space...</p>
      </main>
    );
  }

  return (
    <div className={`edu-app ${dark ? "dark-theme" : ""}`}>
      <aside className="sidebar">
        <button className="brand" onClick={resetHome} aria-label="EduGenie home">
          <span className="brand-symbol"><Sparkles size={23} fill="currentColor" /></span>
          <span>EduGenie</span>
        </button>

        <div className="sidebar-menu">
          <button className="nav-item active" onClick={resetHome}>
            <LayoutGrid size={19} /> <span>Home</span>
          </button>
          <button className="nav-item" onClick={() => promptRef.current?.focus()}>
            <MessageCircle size={19} /> <span>Chat</span>
          </button>
          <button className="nav-item" onClick={() => document.getElementById("examples")?.scrollIntoView({ behavior: "smooth" })}>
            <BookOpen size={19} /> <span>Study Hub</span>
          </button>
          <button className="nav-item" onClick={() => document.getElementById("subjects")?.scrollIntoView({ behavior: "smooth" })}>
            <Folder size={19} /> <span>Subjects</span>
          </button>
          <button className="nav-item" onClick={() => choosePrompt("What useful study tools can you help me with?")}>
            <Settings size={19} /> <span>Tools</span>
          </button>
          <button className="nav-item" onClick={() => setError("Saved conversations will be available when chat persistence is added.")}>
            <Bookmark size={19} /> <span>Saved</span>
          </button>
        </div>

        <div className="sidebar-divider" />

        <div className="recent-heading">Recent</div>
        <div className="recent-list">
          {[
            "Explain DSA with example",
            "Solve this math problem",
            "Summarize PDF notes",
            "How to learn React?",
            "Explain this image",
          ].map((item) => (
            <button
              className="recent-item"
              key={item}
              onClick={() => choosePrompt(item)}
              title={item}
            >
              <FileText size={15} />
              <span>{item}</span>
            </button>
          ))}
          <button className="recent-item show-more" onClick={() => document.getElementById("examples")?.scrollIntoView({ behavior: "smooth" })}>
            <ChevronDown size={15} />
            <span>Show more</span>
          </button>
        </div>

        <div className="upgrade-card">
          <div className="upgrade-top">
            <Sparkles size={20} />
            <strong>Upgrade to Pro</strong>
            <ArrowRight size={16} className="upgrade-arrow" />
          </div>
          <p>Get faster answers, more features, and higher limits.</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand">
            <Sparkles size={21} /> EduGenie
          </div>
          <div className="topbar-actions">
            <button className="upgrade-button" onClick={() => setError("Subscription plans are not configured yet.")}>
              <Sparkles size={15} /> Upgrade
            </button>
            <button
              className="icon-button"
              aria-label="Toggle theme"
              onClick={() => setDark((previous) => !previous)}
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button className="avatar-button" aria-label="Sign out" title="Sign out" onClick={signOut}>A</button>
          </div>
        </header>

        <div className="workspace">
          <section className="hero-section">
            <div className="gemini-badge">
              <Sparkles size={16} />
              <span>Powered by Google Gemini</span>
              <ArrowRight size={14} />
            </div>

            <h1 className="hero-title">
              Your AI <span>Education Assistant</span>
            </h1>
            <p className="hero-subtitle">
              Get clear, accurate and personalized answers based on your instructions.
              <br className="desktop-break" />
              Study smarter, solve problems, and learn anything.
            </p>

            <form
              className="prompt-box"
              onSubmit={(event) => {
                event.preventDefault();
                void sendPrompt();
              }}
            >
              <textarea
                ref={promptRef}
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendPrompt();
                  }
                }}
                placeholder="Ask anything or give instructions..."
                rows={2}
                aria-label="Ask EduGenie a question"
              />

              {file && (
                <div className="attached-file">
                  <FileText size={17} />
                  <span>{file.name}</span>
                  <button
                    type="button"
                    aria-label="Remove attachment"
                    onClick={() => {
                      setFile(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                hidden
                onChange={(event) => {
                  const selected = event.target.files?.[0] ?? null;
                  if (!selected) return;

                  const allowed = [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "application/pdf",
                  ];

                  if (!allowed.includes(selected.type)) {
                    setError("Choose a JPEG, PNG, WebP image, or PDF.");
                    event.target.value = "";
                    return;
                  }

                  if (selected.size > 8 * 1024 * 1024) {
                    setError("Choose a file smaller than 8 MB.");
                    event.target.value = "";
                    return;
                  }

                  setError("");
                  setFile(selected);
                }}
              />

              <div className="prompt-toolbar">
                <div className="toolbar-left">
                  <button
                    className="add-file-button"
                    type="button"
                    aria-label="Add attachment"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    className="tool-button"
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    <ImageIcon size={16} /> Upload Image
                  </button>
                  <button
                    className="tool-button"
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload size={16} /> Upload File
                  </button>
                </div>

                <button
                  className="send-button"
                  type="submit"
                  disabled={loading || (!prompt.trim() && !file)}
                  aria-label="Send question"
                >
                  {loading ? <LoaderCircle size={20} className="spin" /> : <ArrowUp size={22} />}
                </button>
              </div>
            </form>

            <div className="suggestion-row">
              {suggestions.map(({ label, icon: Icon, prompt: value }) => (
                <button
                  key={label}
                  className="suggestion-chip"
                  onClick={() => choosePrompt(value)}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </section>

          {error && (
            <div className="error-message" role="alert">
              <span>{error}</span>
              <button aria-label="Dismiss error" onClick={() => setError("")}>
                <X size={16} />
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-card">
              <LoaderCircle size={21} className="spin" />
              <span>Gemini is thinking about your question...</span>
            </div>
          )}

          {messages.length > 0 && (
            <section className="answers-section" ref={answerRef}>
              <div className="section-heading">
                <h2>Your conversation</h2>
                <button className="view-all" onClick={() => setMessages([])}>
                  Clear <X size={15} />
                </button>
              </div>
              {messages.map((message, index) => (
                <article className="answer-card" key={`${index}-${message.question}`}>
                  <div className="question-heading">
                    <div className="question-icon"><MessageCircle size={17} /></div>
                    <div>
                      <strong>{message.question}</strong>
                      {message.fileName && <p>Attachment: {message.fileName}</p>}
                    </div>
                  </div>
                  <div className="answer-heading">
                    <Sparkles size={18} />
                    <strong>EduGenie&apos;s answer</strong>
                  </div>
                  <div className="answer-text">{message.answer}</div>
                  <button className="ask-followup" onClick={() => choosePrompt("Explain the previous answer in more detail, with examples.")}>
                    Ask a follow-up <ArrowRight size={15} />
                  </button>
                </article>
              ))}
            </section>
          )}

          <section className="subjects-section" id="subjects">
            <div className="section-heading">
              <h2>Explore by Subject</h2>
              <button className="view-all" onClick={() => setShowAllSubjects((previous) => !previous)}>
                {showAllSubjects ? "Show less" : "View all"} <ArrowRight size={15} />
              </button>
            </div>

            <div className="subject-grid">
              {subjects.slice(0, showAllSubjects ? subjects.length : 6).map((subject) => (
                <button
                  key={subject.name}
                  className="subject-card"
                  onClick={() => choosePrompt(subject.prompt)}
                >
                  <span className={`subject-icon ${subject.color}`}>
                    {subject.icon === "math" && <span className="math-symbol">√x</span>}
                    {subject.icon === "physics" && <Atom size={27} />}
                    {subject.icon === "chemistry" && <FlaskConical size={27} />}
                    {subject.icon === "code" && <Code2 size={27} />}
                    {subject.icon === "engineering" && <Settings size={27} />}
                    {subject.icon === "book" && <BookOpen size={27} />}
                  </span>
                  <span>{subject.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="examples-section" id="examples">
            <div className="section-heading">
              <h2><Sparkles size={19} /> Try these examples</h2>
            </div>
            <div className="example-grid">
              {examples.map(({ title, description, icon: Icon, color, prompt: value }) => (
                <button
                  key={title}
                  className="example-card"
                  onClick={() => choosePrompt(value)}
                >
                  <Icon className={`example-icon ${color}`} size={24} />
                  <div className="example-copy">
                    <strong>{title}</strong>
                    <p>{description}</p>
                  </div>
                  <ArrowRight size={16} className="example-arrow" />
                </button>
              ))}
            </div>
          </section>

          <footer className="page-footer">
            <GraduationCap size={17} /> EduGenie · Your personal learning assistant
          </footer>
        </div>
      </main>
    </div>
  );
}
