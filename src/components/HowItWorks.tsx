'use client';

import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { config } from '@/lib/config';
import {
  CheckCircleIcon,
  WhatsAppIcon,
  SparklesIcon,
  ClockIcon,
  BoltIcon,
  UserIcon,
} from './icons';
import { ApplyButton } from './ApplyButton';

export function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const trackFillRef = useRef<HTMLDivElement>(null);
  const pulseOrbRef = useRef<HTMLDivElement>(null);
  const mobileTrackFillRef = useRef<HTMLDivElement>(null);
  const mobilePulseOrbRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const eyebrow = containerRef.current?.querySelector('[data-hiw="eyebrow"]');
    const heading = containerRef.current?.querySelector('[data-hiw="heading"]');
    const subtitle = containerRef.current?.querySelector('[data-hiw="subtitle"]');
    const cards = containerRef.current?.querySelectorAll('[data-hiw="step"]');
    const badges = containerRef.current?.querySelectorAll('[data-hiw="badge"]');
    const cta = containerRef.current?.querySelector('[data-hiw="cta"]');
    
    const card1Scan = containerRef.current?.querySelector('[data-hiw="scan-beam"]');
    const card2Ping = containerRef.current?.querySelector('[data-hiw="wa-bubble"]');
    const card3Voucher = containerRef.current?.querySelector('[data-hiw="voucher-amount"]');

    const trackFill = trackFillRef.current;
    const pulseOrb = pulseOrbRef.current;
    const mobileTrackFill = mobileTrackFillRef.current;
    const mobilePulseOrb = mobilePulseOrbRef.current;

    // Master Scroll-Linked Symmetrical Circuit Pipeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 82%',
        end: 'bottom 75%',
        scrub: 0.6,
      },
    });

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 0: Header reveal (0% - 15% scroll)
    // ─────────────────────────────────────────────────────────────────────────
    if (eyebrow) tl.fromTo(eyebrow, { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.15 }, 0);
    if (heading) tl.fromTo(heading, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.2 }, 0.05);
    if (subtitle) tl.fromTo(subtitle, { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.15 }, 0.1);

    // Initial resting state for all 3 cards (Equal baseline)
    if (cards && cards.length) {
      tl.fromTo(
        cards,
        { y: 25, autoAlpha: 0.4, scale: 0.97 },
        { y: 0, autoAlpha: 0.8, scale: 0.98, duration: 0.2, stagger: 0.05 },
        0.1,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 1: STEP 01 IGNITION (15% - 38% scroll)
    // ─────────────────────────────────────────────────────────────────────────
    if (cards && cards[0]) {
      tl.to(
        cards[0],
        {
          y: -6,
          autoAlpha: 1,
          scale: 1.02,
          borderColor: '#1e9e55',
          boxShadow: '0 12px 28px -6px rgba(30, 158, 85, 0.16)',
          duration: 0.2,
          ease: 'power2.out',
        },
        0.18,
      );
    }
    if (badges && badges[0]) {
      tl.to(
        badges[0],
        {
          scale: 1.12,
          backgroundColor: '#1e9e55',
          color: '#ffffff',
          borderColor: '#137038',
          duration: 0.15,
        },
        0.2,
      );
    }
    if (card1Scan) {
      tl.fromTo(
        card1Scan,
        { x: '-100%', autoAlpha: 0 },
        { x: '120%', autoAlpha: 1, duration: 0.25, ease: 'power1.inOut' },
        0.22,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 2: RELAY 01 ➔ 02: Energy Orb travels along pipeline (38% - 65% scroll)
    // ─────────────────────────────────────────────────────────────────────────
    if (cards && cards[0]) {
      tl.to(
        cards[0],
        {
          y: 0,
          scale: 1,
          borderColor: 'rgba(30, 158, 85, 0.4)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
          duration: 0.2,
        },
        0.38,
      );
    }
    if (badges && badges[0]) {
      tl.to(badges[0], { scale: 1, duration: 0.15 }, 0.38);
    }

    if (trackFill) {
      tl.fromTo(trackFill, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 0.5, duration: 0.25, ease: 'none' }, 0.35);
    }
    if (mobileTrackFill) {
      tl.fromTo(mobileTrackFill, { scaleY: 0, transformOrigin: 'top center' }, { scaleY: 0.5, duration: 0.25, ease: 'none' }, 0.35);
    }

    if (pulseOrb) {
      tl.fromTo(
        pulseOrb,
        { left: '0%', autoAlpha: 0, scale: 0.8 },
        { left: '50%', autoAlpha: 1, scale: 1.2, duration: 0.25, ease: 'power1.inOut' },
        0.35,
      );
    }
    if (mobilePulseOrb) {
      tl.fromTo(
        mobilePulseOrb,
        { top: '0%', autoAlpha: 0, scale: 0.8 },
        { top: '50%', autoAlpha: 1, scale: 1.2, duration: 0.25, ease: 'power1.inOut' },
        0.35,
      );
    }

    if (cards && cards[1]) {
      tl.to(
        cards[1],
        {
          y: -6,
          autoAlpha: 1,
          scale: 1.02,
          borderColor: '#1e9e55',
          boxShadow: '0 12px 28px -6px rgba(30, 158, 85, 0.16)',
          duration: 0.2,
          ease: 'power2.out',
        },
        0.48,
      );
    }
    if (badges && badges[1]) {
      tl.to(
        badges[1],
        {
          scale: 1.12,
          backgroundColor: '#1e9e55',
          color: '#ffffff',
          borderColor: '#137038',
          duration: 0.15,
        },
        0.5,
      );
    }
    if (card2Ping) {
      tl.fromTo(
        card2Ping,
        { scale: 0.94, y: 3 },
        { scale: 1, y: 0, duration: 0.2, ease: 'back.out(1.5)' },
        0.52,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 3: RELAY 02 ➔ 03: Energy Orb reaches Card 03 (65% - 90% scroll)
    // ─────────────────────────────────────────────────────────────────────────
    if (cards && cards[1]) {
      tl.to(
        cards[1],
        {
          y: 0,
          scale: 1,
          borderColor: 'rgba(30, 158, 85, 0.4)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
          duration: 0.2,
        },
        0.65,
      );
    }
    if (badges && badges[1]) {
      tl.to(badges[1], { scale: 1, duration: 0.15 }, 0.65);
    }

    if (trackFill) {
      tl.to(trackFill, { scaleX: 1, duration: 0.25, ease: 'none' }, 0.65);
    }
    if (mobileTrackFill) {
      tl.to(mobileTrackFill, { scaleY: 1, duration: 0.25, ease: 'none' }, 0.65);
    }

    if (pulseOrb) {
      tl.to(
        pulseOrb,
        { left: '100%', scale: 1.2, duration: 0.25, ease: 'power1.inOut' },
        0.65,
      );
    }
    if (mobilePulseOrb) {
      tl.to(
        mobilePulseOrb,
        { top: '100%', scale: 1.2, duration: 0.25, ease: 'power1.inOut' },
        0.65,
      );
    }

    if (cards && cards[2]) {
      tl.to(
        cards[2],
        {
          y: -6,
          autoAlpha: 1,
          scale: 1.02,
          borderColor: '#1e9e55',
          boxShadow: '0 12px 28px -6px rgba(30, 158, 85, 0.16)',
          duration: 0.2,
          ease: 'power2.out',
        },
        0.75,
      );
    }
    if (badges && badges[2]) {
      tl.to(
        badges[2],
        {
          scale: 1.12,
          backgroundColor: '#1e9e55',
          color: '#ffffff',
          borderColor: '#137038',
          duration: 0.15,
        },
        0.78,
      );
    }
    if (card3Voucher) {
      tl.fromTo(
        card3Voucher,
        { scale: 0.94, y: 3 },
        { scale: 1, y: 0, duration: 0.2, ease: 'back.out(1.5)' },
        0.8,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 4: CTA Reveal (90% - 100% scroll)
    // ─────────────────────────────────────────────────────────────────────────
    if (cta) {
      tl.fromTo(cta, { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.15 }, 0.88);
    }
  }, { scope: containerRef });

  // 3D Parallax Mouse Tilt Handler for Desktop
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.2,
      ease: 'power1.out',
    });
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.45,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section
      ref={containerRef}
      id="como-funciona"
      aria-labelledby="hiw-heading"
      className="py-14 sm:py-16 lg:py-20 bg-green-soft relative overflow-hidden"
    >
      <div className="mx-auto max-w-container px-6">
        {/* Section Header */}
        <div className="mb-10 lg:mb-12 text-center max-w-2xl mx-auto space-y-2">
          <p
            data-hiw="eyebrow"
            className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-1"
          >
            Cómo funciona
          </p>
          <h2
            data-hiw="heading"
            id="hiw-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display tracking-tight text-navy leading-[1.12]"
          >
            De la solicitud a tu cuenta en <span className="text-orange">3 pasos</span>
          </h2>
          <p
            data-hiw="subtitle"
            className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed"
          >
            Sin fiador, sin trámites notariales y con desembolso directo a tu cuenta.
          </p>
        </div>

        {/* 3-Step Connected Living Circuit Pipeline (2026 Fintech Standard) */}
        <div className="relative max-w-5xl mx-auto">
          {/* Desktop Connecting Wire & Traveling Orb */}
          <div
            className="hidden md:block absolute top-[52px] left-[14%] right-[14%] h-[3px] bg-border/70 rounded-full z-0 overflow-visible"
            aria-hidden="true"
          >
            <div
              ref={trackFillRef}
              className="h-full w-full bg-gradient-to-r from-green/50 via-green to-emerald-500 rounded-full"
            />
            <div
              ref={pulseOrbRef}
              className="absolute -top-[5.5px] w-3.5 h-3.5 -ml-[7px] rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_14px_#25D366] z-20 will-change-transform"
            />
          </div>

          {/* Mobile Connecting Wire & Traveling Orb */}
          <div
            className="block md:hidden absolute left-[38px] top-[48px] bottom-[48px] w-[3px] bg-border/70 rounded-full z-0 overflow-visible"
            aria-hidden="true"
          >
            <div
              ref={mobileTrackFillRef}
              className="w-full h-full bg-gradient-to-b from-green/50 via-green to-emerald-500 rounded-full"
            />
            <div
              ref={mobilePulseOrbRef}
              className="absolute -left-[5.5px] w-3.5 h-3.5 -mt-[7px] rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_14px_#25D366] z-20 will-change-transform"
            />
          </div>

          {/* Cards Grid: Symmetrical 3-Column Architecture with Emotional Fintech Artifacts */}
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* ───────────────────────────────────────────────────────────── */}
            {/* STEP 1: Solicitud & Identidad (Digital Cédula Artifact)       */}
            {/* ───────────────────────────────────────────────────────────── */}
            <li
              data-hiw="step"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="group relative rounded-2xl bg-white p-6 sm:p-7 shadow-xs border-2 border-border/80 hover:-translate-y-2 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full space-y-5 transform-gpu will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Header: Number & Tag */}
              <div className="flex items-center justify-between w-full">
                <span
                  data-hiw="badge"
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-green-tint text-green-ink border border-green/30 font-bold text-sm shrink-0 tabular-nums shadow-2xs transition-all duration-200 z-10"
                >
                  <span className="sr-only">Paso </span>01
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-ink bg-green-soft px-2.5 py-1 rounded-md">
                  <CheckCircleIcon size={13} className="text-green-ink" />
                  Sin fiador
                </span>
              </div>

              {/* High-Emotion Artifact: Colombian Digital Cédula Verification */}
              <div className="relative rounded-xl bg-gradient-to-br from-bg-soft via-white to-green-soft/30 border border-border/70 p-3.5 space-y-2.5 overflow-hidden group-hover:border-green/40 transition-colors shadow-2xs">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold text-navy uppercase tracking-wider text-[10px]">Cédula Digital · Colombia</span>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-green-ink bg-green-tint px-1.5 py-0.5 rounded border border-green/20">
                    Vigente
                  </span>
                </div>

                {/* Simulated Holographic ID Card */}
                <div className="relative flex items-center gap-3 bg-white rounded-lg p-2.5 border border-border/60 shadow-2xs overflow-hidden">
                  <div
                    data-hiw="scan-beam"
                    className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-green/35 to-transparent pointer-events-none"
                  />
                  <div className="w-9 h-10 rounded-md bg-navy/10 flex items-center justify-center shrink-0 border border-navy/10">
                    <UserIcon size={18} className="text-navy" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="h-2.5 w-4/5 rounded bg-navy/20" />
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-1/2 rounded bg-navy/10" />
                      <span className="text-[9px] font-mono text-muted-2">C.C. 1.024.***</span>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-green/15 flex items-center justify-center shrink-0">
                    <CheckCircleIcon size={14} className="text-green" />
                  </div>
                </div>
              </div>

              {/* Step Copy */}
              <div className="space-y-1.5 text-left flex-1">
                <h3 className="text-lg font-bold text-navy group-hover:text-green-ink transition-colors">
                  Ingresa tu solicitud
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Solo necesitas tu cédula de ciudadanía vigente y soporte básico de ingresos. Sin fiadores ni filas.
                </p>
              </div>

              {/* Bottom Context Tag */}
              <div className="pt-2 border-t border-border/50">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-2">
                  <ClockIcon size={13} className="text-muted-2" />
                  Toma menos de 3 minutos
                </span>
              </div>
            </li>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* STEP 2: Evaluación & WhatsApp Approval (Human Relief Moment)  */}
            {/* ───────────────────────────────────────────────────────────── */}
            <li
              data-hiw="step"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="group relative rounded-2xl bg-white p-6 sm:p-7 shadow-xs border-2 border-border/80 hover:-translate-y-2 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full space-y-5 transform-gpu will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Header: Number & Tag */}
              <div className="flex items-center justify-between w-full">
                <span
                  data-hiw="badge"
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-green-tint text-green-ink border border-green/30 font-bold text-sm shrink-0 tabular-nums shadow-2xs transition-all duration-200 z-10"
                >
                  <span className="sr-only">Paso </span>02
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#128c7e] bg-[#e7f7f4] px-2.5 py-1 rounded-md">
                  <WhatsAppIcon size={13} className="text-[#25D366]" />
                  Respuesta oficial
                </span>
              </div>

              {/* High-Emotion Artifact: Authentic WhatsApp Official Approval Bubble */}
              <div
                data-hiw="wa-bubble"
                className="relative rounded-xl bg-[#eef7f3] border border-[#cbe5dc] p-3 space-y-2 group-hover:border-[#25D366]/50 transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-bold text-[#075e54]">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                    Credalia Oficial ✓
                  </div>
                  <span className="text-[10px] text-muted-2">Ahora mismo</span>
                </div>

                <div className="bg-white rounded-lg p-2.5 border border-[#d6ebe3] shadow-2xs space-y-1 text-left">
                  <p className="text-xs font-semibold text-navy leading-snug">
                    ¡Tu crédito ha sido <span className="text-green-ink font-bold">Aprobado</span>!
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Revisa las condiciones y confirma el desembolso en 1 clic.
                  </p>
                </div>
              </div>

              {/* Step Copy */}
              <div className="space-y-1.5 text-left flex-1">
                <h3 className="text-lg font-bold text-navy group-hover:text-green-ink transition-colors">
                  Validación inteligente
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nuestro motor analiza tu perfil de forma automática y te confirma la aprobación oficial por WhatsApp.
                </p>
              </div>

              {/* Bottom Context Tag */}
              <div className="pt-2 border-t border-border/50">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-2">
                  <BoltIcon size={13} className="text-green-ink" />
                  Respuesta en tiempo real
                </span>
              </div>
            </li>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* STEP 3: Fondos Acreditados (Nequi / DaviPlata Liquidity Moment)*/}
            {/* ───────────────────────────────────────────────────────────── */}
            <li
              data-hiw="step"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="group relative rounded-2xl bg-white p-6 sm:p-7 shadow-xs border-2 border-border/80 hover:-translate-y-2 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full space-y-5 transform-gpu will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Header: Number & Tag */}
              <div className="flex items-center justify-between w-full">
                <span
                  data-hiw="badge"
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-green-tint text-green-ink border border-green/30 font-bold text-sm shrink-0 tabular-nums shadow-2xs transition-all duration-200 z-10"
                >
                  <span className="sr-only">Paso </span>03
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-ink bg-green-soft px-2.5 py-1 rounded-md">
                  <SparklesIcon size={13} className="text-green" />
                  Desembolso ágil
                </span>
              </div>

              {/* High-Emotion Artifact: Colombian Liquidity Transfer Push Card */}
              <div className="relative rounded-xl bg-gradient-to-br from-green-tint via-emerald-50/50 to-white border border-green/30 p-3 space-y-2 group-hover:border-green/50 transition-colors shadow-2xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[10px] font-bold text-green-ink uppercase tracking-wider">
                    Transferencia Exitosa
                  </span>
                  <span className="text-[9px] font-extrabold text-white bg-green px-2 py-0.5 rounded-full">
                    Acreditado
                  </span>
                </div>

                <div
                  data-hiw="voucher-amount"
                  className="bg-white rounded-lg p-2.5 border border-green/20 shadow-2xs space-y-1.5"
                >
                  <div className="text-base font-extrabold text-navy tracking-tight flex items-baseline justify-between">
                    <span>+$1.500.000</span>
                    <span className="text-[10px] font-semibold text-muted-2">COP</span>
                  </div>

                  {/* Iconic Colombian Fintech Identity Chips */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[9px] font-bold text-[#f00078] bg-[#fce4ec] px-1.5 py-0.5 rounded border border-[#f48fb1]/30">
                      Nequi
                    </span>
                    <span className="text-[9px] font-bold text-[#b71c1c] bg-[#ffebee] px-1.5 py-0.5 rounded border border-[#ef9a9a]/30">
                      DaviPlata
                    </span>
                    <span className="text-[9px] font-bold text-navy bg-navy/10 px-1.5 py-0.5 rounded">
                      Bancos
                    </span>
                  </div>
                </div>
              </div>

              {/* Step Copy */}
              <div className="space-y-1.5 text-left flex-1">
                <h3 className="text-lg font-bold text-navy group-hover:text-green-ink transition-colors">
                  Fondos disponibles
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {config.disbursementTime
                    ? `Aceptas las condiciones y transferimos los fondos en ${config.disbursementTime} a tu cuenta Nequi, DaviPlata o banco.`
                    : 'Aceptas las condiciones y transferimos los fondos directamente a tu cuenta Nequi, DaviPlata o banco nacional.'}
                </p>
              </div>

              {/* Bottom Context Tag */}
              <div className="pt-2 border-t border-border/50">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-ink font-semibold">
                  <SparklesIcon size={13} className="text-green" />
                  Disponibilidad inmediata
                </span>
              </div>
            </li>
          </ol>
        </div>

        {/* Primary Action CTA */}
        <div data-hiw="cta" className="mt-10 lg:mt-12 text-center">
          <ApplyButton origin="hiw" size="lg" className="min-h-[48px] px-7 shadow-sm">
            Pedir mi crédito ahora <span aria-hidden="true">→</span>
          </ApplyButton>
        </div>
      </div>
    </section>
  );
}
