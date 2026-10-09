/** Fixed SVG geometry avoids font baseline drift inside circular avatars. */
export function SamAvatar() {
  return (
    <span className="demo-sam-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M17.5 6.8C16.5 5.5 14.8 5 12.3 5C9.3 5 7.2 6.5 7.2 8.6C7.2 13.8 17 10.1 17 15.4C17 17.6 14.9 19 11.8 19C9.5 19 7.5 18.2 6.5 16.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function InitialAvatar({ initials, className = "applicant-avatar" }: { initials: string; className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 40 40">
        <text x="20" y="21" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontFamily="system-ui, sans-serif" fontSize={initials.length > 1 ? 14 : 16} fontWeight="500">{initials}</text>
      </svg>
    </span>
  );
}
