"use client";

import { useState } from "react";
import type { ThinkResult, Perspective } from "@/types";

const COLOR_MAP: Record<string, string> = {
  devil: "var(--devil)",
  expand: "var(--expand)",
  weakness: "var(--weakness)",
  wildcard: "var(--wildcard)",
};

const BG_MAP: Record<string, string> = {
  devil: "rgba(248, 113, 113, 0.06)",
  expand: "rgba(52, 211, 153, 0.06)",
  weakness: "rgba(251, 191, 36, 0.06)",
  wildcard: "rgba(96, 165, 250, 0.06)",
};

interface Props {
  result: ThinkResult;
  thought: string;
}

export default function ResultGrid({ result, thought }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = `ThinkMirror Analysis: "${thought}"\n\n` +
      Object.entries(result.perspectives)
        .map(([, p]) => `${p.emoji} ${p.title}\n${p.points.map(pt => `• ${pt}`).join("\n")}`)
        .join("\n\n") +
      `\n\n💡 Key Question: ${result.question}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const order: Array<keyof typeof result.perspectives> = ["devil", "expand", "weakness", "wildcard"];

  return (
    <div style={{ animation: "fadeInUp 0.5s ease" }}>
      {/* Summary banner */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "1rem 1.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
        }}
      >
        <span style={{ fontSize: "1.2rem", flexShrink: 0, marginTop: "0.1rem" }}>🪞</span>
        <div>
          <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Core Idea
          </p>
          <p style={{ color: "var(--text)", fontSize: "1rem", lineHeight: 1.6 }}>
            {result.summary}
          </p>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {order.map((key, i) => (
          <PerspectiveCard
            key={key}
            perspective={result.perspectives[key]}
            colorKey={key}
            delay={i * 80}
          />
        ))}
      </div>

      {/* Key question */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(124, 106, 247, 0.1), rgba(167, 139, 250, 0.05))",
          border: "1px solid rgba(124, 106, 247, 0.3)",
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
          marginBottom: "1rem",
          display: "flex",
          gap: "0.75rem",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>💡</span>
        <div>
          <p style={{ color: "var(--accent2)", fontSize: "0.75rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            The Question You Should Ask
          </p>
          <p style={{ color: "var(--text)", fontSize: "1rem", lineHeight: 1.6, fontStyle: "italic" }}>
            &ldquo;{result.question}&rdquo;
          </p>
        </div>
      </div>

      {/* Copy button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleCopy}
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "0.6rem 1.4rem",
            color: copied ? "var(--expand)" : "var(--muted)",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          {copied ? "✓ Copied!" : "Copy Analysis"}
        </button>
      </div>
    </div>
  );
}

function PerspectiveCard({
  perspective,
  colorKey,
  delay,
}: {
  perspective: Perspective;
  colorKey: string;
  delay: number;
}) {
  const color = COLOR_MAP[colorKey];
  const bg = BG_MAP[colorKey];

  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${color}33`,
        borderRadius: "14px",
        padding: "1.25rem",
        animation: `fadeInUp 0.5s ease ${delay}ms both`,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = `0 8px 24px ${color}22`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "1rem",
          paddingBottom: "0.75rem",
          borderBottom: `1px solid ${color}22`,
        }}
      >
        <span
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          {perspective.emoji}
        </span>
        <span
          style={{
            color,
            fontWeight: 700,
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {perspective.title}
        </span>
      </div>

      {/* Points */}
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {perspective.points.map((point, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              gap: "0.5rem",
              color: "var(--text)",
              fontSize: "0.9rem",
              lineHeight: 1.55,
            }}
          >
            <span style={{ color, flexShrink: 0, marginTop: "0.15rem" }}>›</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
