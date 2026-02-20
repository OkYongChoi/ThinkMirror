import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const svgBuffer = readFileSync(join(root, "public", "logo.svg"));

const sizes = [
  { name: "logo-16.png",    size: 16 },
  { name: "logo-32.png",    size: 32 },
  { name: "logo-64.png",    size: 64 },
  { name: "logo-128.png",   size: 128 },
  { name: "logo-256.png",   size: 256 },
  { name: "logo-512.png",   size: 512 },
  { name: "logo-1024.png",  size: 1024 },
  { name: "favicon.png",    size: 32 },
];

mkdirSync(join(root, "public", "logos"), { recursive: true });

for (const { name, size } of sizes) {
  const outPath = name === "favicon.png"
    ? join(root, "public", name)
    : join(root, "public", "logos", name);

  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(outPath);

  console.log(`✓ ${outPath.replace(root, ".")}  (${size}x${size})`);
}

// Also export OG image size (1200x630) with logo centered on dark bg
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0a0a0f"/>
  <!-- Subtle grid -->
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3730a3"/>
      <stop offset="50%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(124,106,247,0.25)"/>
      <stop offset="100%" stop-color="rgba(124,106,247,0)"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <ellipse cx="600" cy="315" rx="320" ry="280" fill="url(#glow)"/>

  <!-- Logo centered -->
  <g transform="translate(470, 115)">
    <circle cx="100" cy="100" r="100" fill="url(#bgGrad)"/>
    <circle cx="100" cy="100" r="88" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" fill="none"/>
    <path d="M100 36 C67 36, 44 65, 44 100 C44 135, 67 164, 100 164" stroke="white" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M100 36 C133 36, 156 65, 156 100 C156 135, 133 164, 100 164" stroke="white" stroke-width="7" stroke-linecap="round" stroke-dasharray="14 10" fill="none" opacity="0.55"/>
    <line x1="100" y1="32" x2="100" y2="168" stroke="white" stroke-width="3" opacity="0.25" stroke-linecap="round"/>
    <circle cx="68" cy="68" r="10" fill="#f87171"/>
    <circle cx="132" cy="68" r="10" fill="#34d399"/>
    <circle cx="68" cy="132" r="10" fill="#fbbf24"/>
    <circle cx="132" cy="132" r="10" fill="#60a5fa"/>
  </g>

  <!-- Title -->
  <text x="600" y="360" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="68" font-weight="800" letter-spacing="-2" fill="white">ThinkMirror</text>

  <!-- Subtitle -->
  <text x="600" y="410" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="26" fill="rgba(255,255,255,0.45)" letter-spacing="0.5">See your idea through 4 lenses.</text>

  <!-- 4 colored labels -->
  <g font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18">
    <circle cx="365" cy="476" r="6" fill="#f87171"/>
    <text x="378" y="482" fill="rgba(255,255,255,0.5)">Devil&#x27;s Advocate</text>
    <circle cx="520" cy="476" r="6" fill="#34d399"/>
    <text x="533" y="482" fill="rgba(255,255,255,0.5)">Expand</text>
    <circle cx="636" cy="476" r="6" fill="#fbbf24"/>
    <text x="649" y="482" fill="rgba(255,255,255,0.5)">Blind Spots</text>
    <circle cx="771" cy="476" r="6" fill="#60a5fa"/>
    <text x="784" y="482" fill="rgba(255,255,255,0.5)">Wild Card</text>
  </g>
</svg>`;

await sharp(Buffer.from(ogSvg))
  .resize(1200, 630)
  .png()
  .toFile(join(root, "public", "og-image.png"));

console.log("✓ ./public/og-image.png  (1200x630) — OG image");
console.log("\n🎉 All logo files exported successfully!");
