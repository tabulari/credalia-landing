interface SectionDividerProps {
  to?: string;
  amplitude?: 'soft' | 'medium' | 'bold';
  flip?: boolean;
  className?: string;
}

const WAVES = {
  soft: {
    viewBox: '0 0 1440 40',
    d: 'M0 40V28C240 16 480 16 720 28C960 40 1200 40 1440 28V40H0Z',
  },
  medium: {
    viewBox: '0 0 1440 60',
    d: 'M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z',
  },
  bold: {
    viewBox: '0 0 1440 80',
    d: 'M0 80V40C360 0 720 0 1080 40C1260 60 1380 80 1440 40V80H0Z',
  },
};

export function SectionDivider({ to = '#f7f9fa', amplitude = 'medium', flip = false, className = '' }: SectionDividerProps) {
  const { viewBox, d } = WAVES[amplitude];

  return (
    <div className={`relative -mt-px ${className}`} aria-hidden="true">
      <svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full block"
        preserveAspectRatio="none"
        style={{ marginBottom: '-1px', ...(flip ? { transform: 'scaleX(-1)' } : {}) }}
      >
        <path d={d} fill={to} />
      </svg>
    </div>
  );
}
