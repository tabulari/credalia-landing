interface SectionDividerProps {
  to?: string;
  shape?: 'wave' | 'curve' | 'slant';
  flip?: boolean;
  className?: string;
}

const PATHS = {
  wave: {
    viewBox: '0 0 1440 60',
    d: 'M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z',
  },
  curve: {
    viewBox: '0 0 1440 48',
    d: 'M0 48 C360 48 720 0 1080 0 C1260 0 1380 24 1440 48 Z',
  },
  slant: {
    viewBox: '0 0 1440 40',
    d: 'M0 40 C480 20 960 10 1440 0 V40 H0 Z',
  },
};

export function SectionDivider({ to = '#f7f9fa', shape = 'wave', flip = false, className = '' }: SectionDividerProps) {
  const { viewBox, d } = PATHS[shape];

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
