"use client";

import { useState, useRef, KeyboardEvent } from "react";

const EXAMPLES = [
  "AI will replace most jobs in 10 years",
  "We should work only 4 days a week",
  "Social media does more harm than good",
  "Remote work is better than office work",
];

interface Props {
  onSubmit: (thought: string) => void;
  loading: boolean;
}

export default function ThinkInput({ onSubmit, loading }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    if (value.trim() && !loading) {
      onSubmit(value.trim());
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleExample(ex: string) {
    setValue(ex);
    textareaRef.current?.focus();
  }

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      {/* Input area */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Drop a thought, idea, or belief…"
          rows={3}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            padding: "1.25rem 1.25rem 0.75rem",
            color: "var(--text)",
            fontSize: "1.05rem",
            lineHeight: 1.6,
            resize: "none",
            fontFamily: "inherit",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1.25rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
            ⌘ + Enter to analyze
          </span>
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || loading}
            style={{
              background: value.trim() && !loading
                ? "linear-gradient(135deg, var(--accent), var(--accent2))"
                : "var(--border)",
              color: value.trim() && !loading ? "white" : "var(--muted)",
              border: "none",
              borderRadius: "10px",
              padding: "0.6rem 1.4rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: value.trim() && !loading ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            {loading ? "Thinking…" : "Reflect →"}
          </button>
        </div>
      </div>

      {/* Example prompts */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginTop: "1rem",
          justifyContent: "center",
        }}
      >
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => handleExample(ex)}
            style={{
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "0.35rem 0.9rem",
              color: "var(--muted)",
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "var(--accent)";
              (e.target as HTMLButtonElement).style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "var(--border)";
              (e.target as HTMLButtonElement).style.color = "var(--muted)";
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
