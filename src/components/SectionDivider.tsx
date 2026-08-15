'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface SectionDividerProps {
  from?: string;
  to?: string;
  amplitude?: 'soft' | 'medium' | 'bold';
  flip?: boolean;
  className?: string;
}

const WAVES = {
  soft: {
    viewBox: '0 0 1440 40',
    d: 'M-100 80V28C200 16 500 16 720 28C940 40 1240 40 1540 28V80H-100Z',
    dSecondary: 'M-100 80V32C280 20 600 22 960 32C1180 38 1340 34 1540 30V80H-100Z',
  },
  medium: {
    viewBox: '0 0 1440 60',
    d: 'M-100 100V30C200 0 500 0 720 30C940 60 1240 60 1540 30V100H-100Z',
    dSecondary: 'M-100 100V38C260 12 540 8 860 36C1080 54 1300 48 1540 34V100H-100Z',
  },
  bold: {
    viewBox: '0 0 1440 80',
    d: 'M-100 130V48C200 18 460 18 720 44C980 70 1240 70 1540 40V130H-100Z',
    dSecondary: 'M-100 130V56C240 28 500 26 760 52C1020 74 1260 70 1540 48V130H-100Z',
  },
};

export function SectionDivider({
  from,
  to = '#f7f9fa',
  amplitude = 'medium',
  flip = false,
  className = '',
}: SectionDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<SVGPathElement>(null);
  const secondaryWaveRef = useRef<SVGPathElement>(null);
  const { viewBox, d, dSecondary } = WAVES[amplitude];

  const isDarkTo = to === '#0a2150' || to?.includes('0a2150') || to?.includes('042851');

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !containerRef.current) return;

    const el = containerRef.current;
    const wave = waveRef.current;
    const secondaryWave = secondaryWaveRef.current;

    // Pin transform origin to bottom center so scaleY only undulates upward into 'from' color
    // and NEVER lifts the bottom edge away from the following section.
    if (wave) {
      gsap.fromTo(
        wave,
        { x: flip ? 14 : -14, scaleY: 1, transformOrigin: '50% 100%' },
        {
          x: flip ? -14 : 14,
          scaleY: 1.08,
          transformOrigin: '50% 100%',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      );
    }

    if (secondaryWave) {
      gsap.fromTo(
        secondaryWave,
        { x: flip ? -20 : 20, scaleY: 1, transformOrigin: '50% 100%' },
        {
          x: flip ? 20 : -20,
          scaleY: 1.06,
          transformOrigin: '50% 100%',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );
    }
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={`relative -mt-px overflow-hidden pointer-events-none select-none z-10 ${className}`}
      aria-hidden="true"
      style={from ? { backgroundColor: from } : undefined}
    >
      <svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full block transform-gpu will-change-transform"
        preserveAspectRatio="none"
        style={{
          marginBottom: '-4px',
          ...(flip ? { transform: 'scaleX(-1)' } : {}),
        }}
      >
        {/* Subtle organic secondary wave layer */}
        <path
          ref={secondaryWaveRef}
          d={dSecondary}
          fill={isDarkTo ? '#1e9e55' : to}
          opacity={isDarkTo ? '0.2' : '0.35'}
        />
        {/* Primary solid wave path */}
        <path
          ref={waveRef}
          d={d}
          fill={to}
        />
      </svg>
    </div>
  );
}
