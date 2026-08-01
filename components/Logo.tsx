interface LogoProps {
  size?: number
  showWordmark?: boolean
}

export default function Logo({ size = 32, showWordmark = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        {/* Branch lines - full strength ink, no fading */}
        <path
          d="M20 32 V22 M20 22 L12 14 M20 22 L28 14 M12 14 L7 8 M12 14 L15 8 M28 14 L25 8 M28 14 L33 8"
          stroke="var(--ink)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Unlit branch-end nodes - solid ink, fully opaque */}
        <circle cx="7" cy="8" r="2.6" fill="var(--ink)" />
        <circle cx="15" cy="8" r="2.6" fill="var(--ink)" />
        <circle cx="25" cy="8" r="2.6" fill="var(--ink)" />
        {/* Root node */}
        <circle cx="20" cy="32" r="2.8" fill="var(--ink)" />
        {/* The lit tip - the one path that got chosen, in accent color */}
        <circle cx="33" cy="8" r="3.2" fill="var(--accent)" />
      </svg>
      {showWordmark && (
        <span
          className="text-lg font-bold"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          bornout
        </span>
      )}
    </div>
  )
}