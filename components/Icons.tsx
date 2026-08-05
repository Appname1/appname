interface IconProps {
  size?: number
}

// Spark — "the moment a prompt turns into a working project." Used for: Start New Project.
export function SparkIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 6 L23 17 L34 20 L23 23 L20 34 L17 23 L6 20 L17 17 Z" fill="var(--accent)" />
      <circle cx="31" cy="9" r="2" fill="var(--ink)" />
    </svg>
  )
}

// Stacked isometric cards — "every finished project becomes a physical layer in your stack." Used for: Projects.
export function StackedCardsIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 6 L32 12 L20 18 L8 12 Z" fill="var(--accent)" />
      <path d="M8 18 L20 24 L32 18 L32 12 L20 18 L8 12 Z" fill="var(--ink)" fillOpacity="0.7" />
      <path d="M8 24 L20 30 L32 24 L32 18 L20 24 L8 18 Z" fill="var(--ink)" fillOpacity="0.4" />
    </svg>
  )
}

// Shield badge with a check — "an earned credential, not a participation sticker." Used for: Portfolio.
export function BadgeIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 6 L32 10 V20 C32 28 27 33 20 35 C13 33 8 28 8 20 V10 Z" fill="var(--accent)" />
      <path d="M14 20 L18 24 L27 14" stroke="var(--paper)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

// Progress ring, split two-tone — "a build, always mid-way and moving." Used for: credit/progress stats.
export function ProgressRingIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="15" stroke="var(--border)" strokeWidth="3" fill="none" />
      <path d="M20 5 A15 15 0 0 1 34 22" stroke="var(--accent)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}