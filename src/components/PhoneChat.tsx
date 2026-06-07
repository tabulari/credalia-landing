'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { config } from '@/lib/config';
import { calculatePayment, fmtCOP } from '@/lib/credit';
import './phone-chat.css';

const phoneSim = calculatePayment(
  config.simulator.defaultAmount,
  config.simulator.defaultTerm,
  'monthly',
);

const SCROLL_AFTER = [0, 0, 60, 120, 170, 240, 300, 360, 420, 480, 540];

function startMeditativeFloat(shell: HTMLElement) {
  gsap.to(shell, {
    y: 3,
    rotateX: 0.8,
    duration: 2.25,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
  gsap.to(shell, {
    y: -3,
    rotateX: -0.8,
    duration: 2.25,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 2.25,
  });
}

function startMouseTilt(
  shell: HTMLElement,
  wrapper: HTMLElement,
): () => void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 980px)').matches;
  if (reduceMotion || !isDesktop) return () => {};

  const setTilt = gsap.quickTo(shell, 'rotateY', { duration: 0.6, ease: 'power2.out' });
  const setTiltX = gsap.quickTo(shell, 'rotateX', { duration: 0.6, ease: 'power2.out' });

  const onMove = (e: MouseEvent) => {
    const rect = wrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt(x * 3);
    setTiltX(-y * 2);
  };

  let rafId: number;
  const onRafMove = (e: MouseEvent) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => onMove(e));
  };

  window.addEventListener('mousemove', onRafMove);
  return () => {
    window.removeEventListener('mousemove', onRafMove);
    cancelAnimationFrame(rafId);
  };
}

export function PhoneChat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const mouseCleanupRef = useRef<(() => void) | null>(null);

  useGSAP(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shell = shellRef.current;
    const chatBody = chatBodyRef.current;
    if (!shell || !chatBody) return;

    const bubbles = Array.from(chatBody.querySelectorAll('[data-phone^="b"]'));
    const typing = chatBody.querySelector('[data-phone="typing"]');
    const waBtns = chatBody.querySelector('[data-phone="wa-btns"]');

    if (reduceMotion) {
      bubbles.forEach(b => gsap.set(b, { autoAlpha: 1, x: 0, scale: 1 }));
      if (typing) gsap.set(typing, { autoAlpha: 0 });
      if (waBtns) gsap.set(waBtns, { autoAlpha: 1, y: 0 });
      chatBody.scrollTop = chatBody.scrollHeight;
      return;
    }

    gsap.set(bubbles, { autoAlpha: 0 });
    gsap.set(bubbles.filter((_, i) => [0, 2, 6].includes(i)), { x: -12 });
    gsap.set(bubbles.filter((_, i) => [1, 3, 7].includes(i)), { x: 12 });
    gsap.set(bubbles[4] || [], { scale: 0.92 });
    if (typing) gsap.set(typing, { autoAlpha: 0 });
    if (waBtns) gsap.set(waBtns, { autoAlpha: 0, y: 10 });

    const tl = gsap.timeline({ delay: 1.0 });

    const showTyping = (pos: string) => {
      if (!typing) return;
      tl.to(typing, { autoAlpha: 1, duration: 0.15 }, pos);
    };
    const hideTyping = () => {
      if (!typing) tl.to(typing, { autoAlpha: 0, duration: 0.15 });
    };
    const scrollTo = (idx: number) => {
      const target = SCROLL_AFTER[Math.min(idx, SCROLL_AFTER.length - 1)];
      if (chatBody) tl.to(chatBody, { scrollTop: target, duration: 0.3, ease: 'power2.out' }, '-=0.15');
    };

    const b = (idx: number) => bubbles[idx];
    if (!b(0)) return;

    tl.to(b(0), { x: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0);

    showTyping('+=0.3');
    tl.to({}, { duration: 0.6 });
    hideTyping();
    tl.to(b(1), { x: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
    scrollTo(2);

    tl.to(b(2), { x: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, '+=0.15');
    scrollTo(3);

    showTyping('+=0.2');
    tl.to({}, { duration: 0.5 });
    hideTyping();
    tl.to(b(3), { x: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
    scrollTo(4);

    showTyping('+=0.15');
    tl.to({}, { duration: 0.4 });
    hideTyping();
    tl.to(b(4), { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.4)' });
    scrollTo(5);

    tl.to(b(5), { autoAlpha: 1, duration: 0.3 }, '+=0.08');
    scrollTo(6);

    tl.to(b(6), { x: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, '+=0.2');
    scrollTo(7);

    showTyping('+=0.15');
    tl.to({}, { duration: 0.3 });
    hideTyping();
    tl.to(b(7), { x: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' });
    scrollTo(8);

    if (typing) tl.set(typing, { autoAlpha: 0 }, '+=0.2');

    if (waBtns) {
      const btns = waBtns.querySelectorAll('.wa-btn');
      tl.to(waBtns, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '+=0.15');
      tl.from(btns, { y: 6, stagger: 0.1, duration: 0.3, ease: 'power2.out' }, '<');
      tl.to(chatBody, { scrollTop: chatBody.scrollHeight, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    }

    tl.call(() => {
      gsap.set(shell, { clearProps: 'transform' });
      startMeditativeFloat(shell);
      if (containerRef.current) {
        mouseCleanupRef.current = startMouseTilt(shell, containerRef.current);
      }
    }, undefined, '+=0.5');

    return () => {
      mouseCleanupRef.current?.();
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="phone-wrapper" aria-hidden="true">
      <div ref={shellRef} className="phone" data-phone="shell">
        <div className="phone-body">
          <div className="phone-shine" aria-hidden="true" />
          <div className="phone-screen">
            <div className="phone-island" aria-hidden="true" />
            <div className="status-bar">
              <span>10:33</span>
              <span className="status-icons">
                <svg width="17" height="11" viewBox="0 0 17 11" fill="#fff">
                  <rect x="0" y="7" width="3" height="4" rx="1" />
                  <rect x="4.5" y="4.5" width="3" height="6.5" rx="1" />
                  <rect x="9" y="2" width="3" height="9" rx="1" />
                  <rect x="13.5" y="0" width="3" height="11" rx="1" />
                </svg>
                <svg width="16" height="11" viewBox="0 0 16 11" fill="#fff">
                  <path d="M8 2.2C10.5 2.2 12.7 3.2 14.3 4.8L13 6.1C11.7 4.8 10 4 8 4S4.3 4.8 3 6.1L1.7 4.8C3.3 3.2 5.5 2.2 8 2.2Z" />
                  <path d="M8 5.6C9.2 5.6 10.3 6.1 11.1 6.9L8 10 4.9 6.9C5.7 6.1 6.8 5.6 8 5.6Z" />
                </svg>
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                  <rect x="1" y="1" width="20" height="10" rx="3" stroke="#fff" strokeWidth="1" opacity=".4" />
                  <rect x="2.5" y="2.5" width="15" height="7" rx="1.5" fill="#fff" />
                  <rect x="22" y="4" width="1.5" height="4" rx="1" fill="#fff" opacity=".5" />
                </svg>
              </span>
            </div>
            <div className="chat-header">
              <span className="back">‹</span>
              <div className="avatar">
                <svg viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/>
                </svg>
              </div>
              <div className="header-info">
                <div className="who">
                  {config.brandName}
                  <svg className="verified" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.5 14.5l-4-4 1.4-1.4 2.6 2.6 6.6-6.6 1.4 1.4-8 8z" fill="#53bdeb"/>
                  </svg>
                </div>
                <div className="online">en línea</div>
              </div>
              <div className="header-actions">
                <svg viewBox="0 0 24 24" fill="#fff">
                  <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 10-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1114 9.5 4.5 4.5 0 019.5 14z"/>
                </svg>
                <svg viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 7a2 2 0 102 2 2 2 0 00-2-2zm0 8a2 2 0 102 2 2 2 0 00-2-2zm0-4a2 2 0 102 2 2 2 0 00-2-2z"/>
                </svg>
              </div>
            </div>
            <div className="chat-wallpaper">
              <div ref={chatBodyRef} className="chat-body">
                <div data-phone="typing" className="typing-indicator">
                  <span /><span /><span />
                </div>
                <div data-phone="b0" className="bubble them">
                  ¡Hola! Soy Laura, necesito {fmtCOP(phoneSim.amount).replace('$', '$')} para una emergencia. ¿En qué me pueden ayudar?
                  <div className="t">10:30</div>
                </div>
                <div data-phone="b1" className="bubble me">
                  ¡Hola Laura! 👋 Con gusto te ayudamos. ¿Cuál monto necesitas?
                  <div className="t">10:30 <span className="checks">✓✓</span></div>
                </div>
                <div data-phone="b2" className="bubble them">
                  Necesito {fmtCOP(phoneSim.amount)}
                  <div className="t">10:30</div>
                </div>
                <div data-phone="b3" className="bubble me">
                  Perfecto Laura. Te comparto tu simulación personalizada…
                  <div className="t">10:31 <span className="checks">✓✓</span></div>
                </div>
                <div data-phone="b4" className="bubble me" style={{ maxWidth: '88%' }}>
                  <div className="sim-title">Tu simulación</div>
                  <div className="sim-row">💲 Monto: {fmtCOP(phoneSim.amount)}</div>
                  <div className="sim-row">📅 Plazo: {phoneSim.term} meses</div>
                  <div className="sim-row">💳 Cuota: {fmtCOP(phoneSim.payment)}{phoneSim.unit}</div>
                  <div className="t">10:31 <span className="checks">✓✓</span></div>
                </div>
                <div data-phone="b5" className="bubble note" style={{ maxWidth: '88%' }}>
                  <div className="ph">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5d6b82" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 11 v5 M12 8 h.01" strokeLinecap="round" />
                    </svg>
                    Simulación, no aprobación
                  </div>
                  La decisión final depende de la validación. Simular no afecta tu historial.
                  <div className="t">10:31 <span className="checks">✓✓</span></div>
                </div>
                <div data-phone="b6" className="bubble them">
                  ¿Cómo inicio mi solicitud?
                  <div className="t">10:32</div>
                </div>
                <div data-phone="b7" className="bubble me">
                  Te guío paso a paso desde aquí 👇
                  <div className="t">10:32 <span className="checks">✓✓</span></div>
                </div>
                <div data-phone="wa-btns" className="wa-buttons">
                  <span className="wa-btn">Iniciar solicitud</span>
                  <span className="wa-btn wa-btn--secondary">Chatear por WhatsApp</span>
                </div>
              </div>
            </div>
            <div className="chat-input">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#5d6b82">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
              <div className="field">Escribe un mensaje</div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#5d6b82">
                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6h-1.5v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6H16.5z"/>
              </svg>
              <span className="send">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.41 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                </svg>
              </span>
            </div>
            <div className="phone-home" />
          </div>
        </div>
        <div className="phone-glow" aria-hidden="true" />
      </div>
    </div>
  );
}
