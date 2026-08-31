interface LogoProps {
  size?: number
  showWordmark?: boolean
  color?: string
}

export default function Logo({ size = 32, showWordmark = false, color }: LogoProps) {
  const lineColor = color ?? 'var(--ink)'
  const dotColor = color ?? 'var(--accent)'
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <path
          d="M20 32 V22 M20 22 L12 14 M20 22 L28 14 M12 14 L7 8 M12 14 L15 8 M28 14 L25 8 M28 14 L33 8"
          stroke={lineColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="7" cy="8" r="2.6" fill={lineColor} />
        <circle cx="15" cy="8" r="2.6" fill={lineColor} />
        <circle cx="25" cy="8" r="2.6" fill={lineColor} />
        <circle cx="20" cy="32" r="2.8" fill={lineColor} />
        <circle cx="33" cy="8" r="3.2" fill={dotColor} />
      </svg>

      {showWordmark && (
        <span className="relative inline-block" style={{ height: '1.4em', lineHeight: 1 }}>
          <span
            aria-hidden="true"
            className="absolute select-none"
            style={{
              left: '10px',
              top: '-2px',
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 800,
              fontSize: '1.1em',
              color: 'var(--accent)',
              opacity: 0.55,
              whiteSpace: 'nowrap',
            }}
          >
            burnout
          </span>
          <span
            className="relative"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 800,
              fontSize: '1.1em',
              color: 'var(--ink)',
              whiteSpace: 'nowrap',
            }}
          >
            bornout
          </span>
        </span>
      )}
    </div>
  )
}