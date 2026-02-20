export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="20" cy="20" r="20" fill="url(#bgGrad)" />

      {/* Mirror / reflection lines */}
      {/* Left half — solid */}
      <path
        d="M20 8 C14 8, 9 13, 9 20 C9 27, 14 32, 20 32"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="1"
      />
      {/* Right half — dashed (reflection) */}
      <path
        d="M20 8 C26 8, 31 13, 31 20 C31 27, 26 32, 20 32"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="3.5 2.5"
        fill="none"
        opacity="0.6"
      />

      {/* Center vertical axis */}
      <line x1="20" y1="7" x2="20" y2="33" stroke="white" strokeWidth="1.5" opacity="0.4" />

      {/* Four dots — 4 perspectives */}
      <circle cx="14" cy="14" r="2" fill="#f87171" />
      <circle cx="26" cy="14" r="2" fill="#34d399" />
      <circle cx="14" cy="26" r="2" fill="#fbbf24" />
      <circle cx="26" cy="26" r="2" fill="#60a5fa" />

      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}
