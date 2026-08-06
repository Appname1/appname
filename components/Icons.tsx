interface IconProps {
  size?: number
}

// The brand mark itself — one path lit at the tip. Used for: Start New Project (literally starting a new branch).
export function BranchIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 32 V22 M20 22 L12 14 M20 22 L28 14 M12 14 L7 8 M12 14 L15 8 M28 14 L25 8 M28 14 L33 8"
        stroke="var(--ink)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="7" cy="8" r="2.6" fill="var(--ink)" />
      <circle cx="15" cy="8" r="2.6" fill="var(--ink)" />
      <circle cx="25" cy="8" r="2.6" fill="var(--ink)" />
      <circle cx="20" cy="32" r="2.8" fill="var(--ink)" />
      <circle cx="33" cy="8" r="3.4" fill="var(--accent)" />
    </svg>
  )
}

// Isometric stacked cards — each finished project as a physical layer. Used for: Projects.
export function StackedCardsIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 6 L32 12 L20 18 L8 12 Z" fill="var(--ink)" />
      <path d="M8 18 L20 24 L32 18 L32 12 L20 18 L8 12 Z" fill="var(--ink)" fillOpacity="0.65" />
      <path d="M8 24 L20 30 L32 24 L32 18 L20 24 L8 18 Z" fill="var(--ink)" fillOpacity="0.35" />
    </svg>
  )
}

// Shield with a check — an earned credential. Used for: Portfolio.
export function BadgeIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 6 L32 10 V20 C32 28 27 33 20 35 C13 33 8 28 8 20 V10 Z" fill="var(--ink)" />
      <path d="M14 20 L18 24 L27 14" stroke="var(--paper)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

// Split progress ring. Used for: credit balance / progress stats.
export function ProgressRingIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="15" stroke="var(--ink)" strokeWidth="3" fill="none" strokeOpacity="0.5" />
      <path d="M20 5 A15 15 0 0 1 34 22" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}