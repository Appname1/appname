interface BackLinkProps {
  href: string
  label?: string
}

export default function BackLink({ href, label = 'Back' }: BackLinkProps) {
  const linkStyle = { color: 'var(--muted)' }
  return (
    <a href={href} className="inline-flex items-center gap-1 text-xs font-medium mb-6" style={linkStyle}>
      ← {label}
    </a>
  )
}