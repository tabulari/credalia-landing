interface SectionDividerProps {
  from?: string;
  to?: string;
  className?: string;
}

export function SectionDivider({ from = '#ffffff', to = '#f7f9fa', className = '' }: SectionDividerProps) {
  return (
    <div className={`relative -mt-px ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ marginBottom: '-1px' }}>
        <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill={to} />
        <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill={from} opacity="0" />
      </svg>
    </div>
  );
}
