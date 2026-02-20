"use client";

import { useState, useRef } from "react";
import Logo from "@/components/Logo";
import ThinkInput from "@/components/ThinkInput";
import ResultGrid from "@/components/ResultGrid";
import type { ThinkResult } from "@/types";

export default function Home() {
  const [result, setResult] = useState<ThinkResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentThought, setCurrentThought] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(thought: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    setStreamText("");
    setCurrentThought(thought);

    try {
      const res = await fetch("/api/think", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thought }),
      });

      if (!res.ok) throw new Error("API request failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              try {
                const parsed = JSON.parse(accumulated) as ThinkResult;
                setResult(parsed);
                setTimeout(() => {
                  resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              } catch {
                setError("Failed to parse response. Please try again.");
              }
              break;
            }
            try {
              const { text, error: errMsg } = JSON.parse(data);
              if (errMsg) {
                setError(errMsg);
                break;
              }
              if (text) {
                accumulated += text;
                setStreamText(accumulated);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <header
        style={{
          width: "100%",
          maxWidth: "900px",
          padding: "2rem 1.5rem 0",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Logo size={36} />
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          ThinkMirror
        </span>
      </header>

      {/* Hero */}
      <section
        style={{
          width: "100%",
          maxWidth: "900px",
          padding: "3rem 1.5rem 2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #e8e8f0 0%, #a78bfa 60%, #7c6af7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          See your idea
          <br />
          through 4 lenses.
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "1.1rem",
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
          }}
        >
          Type any thought. ThinkMirror reflects it back with counterarguments,
          expansions, blind spots, and wildcard angles — instantly.
        </p>

        <ThinkInput onSubmit={handleSubmit} loading={loading} />
      </section>

      {/* Results */}
      {(loading || result || error) && (
        <section
          ref={resultRef}
          style={{
            width: "100%",
            maxWidth: "900px",
            padding: "0 1.5rem 4rem",
          }}
        >
          {loading && !result && (
            <LoadingState streamText={streamText} thought={currentThought} />
          )}
          {error && <ErrorState message={error} />}
          {result && <ResultGrid result={result} thought={currentThought} />}
        </section>
      )}

      {/* Footer */}
      {!loading && !result && (
        <footer
          style={{
            marginTop: "auto",
            padding: "2rem",
            color: "var(--muted)",
            fontSize: "0.8rem",
            textAlign: "center",
          }}
        >
          Powered by OpenAI · Think deeper, not harder
        </footer>
      )}
    </main>
  );
}

function LoadingState({ streamText, thought }: { streamText: string; thought: string }) {
  const progress = Math.min(streamText.length / 8, 95);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)",
          margin: "0 auto 1.5rem",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: "var(--muted)", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
        Analyzing: &ldquo;{thought.slice(0, 60)}{thought.length > 60 ? "…" : ""}&rdquo;
      </p>
      <div
        style={{
          height: "4px",
          background: "var(--border)",
          borderRadius: "2px",
          overflow: "hidden",
          maxWidth: "300px",
          margin: "1rem auto 0",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, var(--accent), var(--accent2))",
            borderRadius: "2px",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      style={{
        background: "rgba(248, 113, 113, 0.1)",
        border: "1px solid rgba(248, 113, 113, 0.3)",
        borderRadius: "12px",
        padding: "1.5rem",
        color: "var(--devil)",
        textAlign: "center",
      }}
    >
      ⚠️ {message}
    </div>
  );
}
