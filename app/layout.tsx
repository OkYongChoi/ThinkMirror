import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThinkMirror — See Your Ideas Differently",
  description:
    "AI-powered cognitive expansion engine. Drop a thought, get 4 radical perspectives instantly.",
  icons: {
    icon: "/favicon.png",
    apple: "/logos/logo-128.png",
  },
  openGraph: {
    title: "ThinkMirror",
    description: "See your ideas through 4 different lenses. AI-powered cognitive expansion.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ThinkMirror" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ThinkMirror",
    description: "See your idea through 4 lenses. AI-powered cognitive expansion.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
