'use client';

import { ScrollButton } from './ScrollButton';
import { ApplyButton } from './ApplyButton';
import { PhoneChat } from './PhoneChat';
import { ShieldCheckIcon, LockIcon } from './icons';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20 overflow-hidden bg-white"
    >
      <div className="mx-auto max-w-container px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* LEFT COLUMN: Original High-Converting Value Proposition       */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 z-10">
          {/* Display H1 with Electric Institutional Orange Highlight */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-display tracking-tight text-navy leading-[1.12]"
          >
            Crédito digital <br className="hidden sm:inline" />
            hasta <span className="text-orange">$1.000.000</span>
          </h1>

          {/* 3-Beat Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-normal">
            Respuesta en minutos. Tasa clara. Sin papeles.
          </p>

          {/* Action Buttons - Clean, Zero Arrows */}
          <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto pt-1">
            <ScrollButton
              variant="default"
              size="lg"
              target="#simula"
              className="w-full sm:w-auto min-h-[48px] px-8 rounded-xl font-bold bg-navy text-white hover:bg-navy-deep shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Simular mi crédito
            </ScrollButton>

            <ApplyButton
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-h-[48px] px-7 rounded-xl font-bold border-border/80 hover:bg-bg-soft text-navy transition-all active:scale-[0.98]"
            >
              Solicitar crédito
            </ApplyButton>
          </div>

          {/* Institutional Trust Badges */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs font-semibold text-muted-2">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheckIcon size={16} className="text-green shrink-0" />
              Estudio 100% digital y gratuito
            </span>
            <span className="hidden sm:inline text-border" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <LockIcon size={16} className="text-green shrink-0" />
              Datos cifrados y protegidos
            </span>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* RIGHT COLUMN: Interactive 3D Phone with Mouse Tilt            */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          <PhoneChat />
        </div>
      </div>
    </section>
  );
}
