import Link from 'next/link';
import { config } from '@/lib/config';

const CARDS = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10 V7 a4 4 0 0 1 8 0 v3" />
        <circle cx="12" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: 'Datos cifrados',
    text: 'Tu información viaja y se almacena cifrada, protegida de extremo a extremo.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3 H7 a2 2 0 0 0-2 2 v14 a2 2 0 0 0 2 2 h10 a2 2 0 0 0 2-2 V8 Z M14 3 v5 h5" />
        <path d="M9 13 h6 M9 16.5 h4" />
      </svg>
    ),
    title: 'Tratamiento conforme a la ley',
    text: 'Tratamos tus datos personales según la Ley 1581 de 2012 (Habeas Data).',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
        <path d="M9 12 l2 2 4-4.5" />
      </svg>
    ),
    title: 'Entidad vigilada',
    text: 'Operamos bajo la supervisión de la Superintendencia Financiera de Colombia.',
    regulatorOnly: true,
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21 l-4.3-4.3" />
        <path d="M8.5 11 l1.8 1.8 3.2-3.4" />
      </svg>
    ),
    title: 'Simular no afecta tu historial',
    text: 'La simulación es informativa y no genera consultas en centrales de riesgo.',
  },
];

export function Security() {
  return (
    <section id="seguridad" className="py-16 lg:py-24">
      <div className="mx-auto max-w-container px-6">
        <div className="reveal text-center mb-10">
          <p className="text-sm font-semibold text-green-ink mb-2">Seguridad</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-navy mb-3">
            Tu información está protegida en cada paso.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cuidamos tus datos con estándares de la industria financiera y los
            tratamos conforme a la ley colombiana.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal d1">
          {CARDS.filter((c) => !c.regulatorOnly || config.regulatorVerified).map((c) => (
            <div
              key={c.title}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card text-center"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-tint text-green">
                {c.icon}
              </div>
              <h4 className="text-base font-bold text-navy">{c.title}</h4>
              <p className="text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
        <p className="reveal text-center text-sm text-muted-foreground mt-8">
          ¿Quieres saber más sobre cómo cuidamos tus datos? Lee nuestra{' '}
          <Link href="/legal/privacidad" className="text-navy font-semibold hover:underline">
            Política de Privacidad
          </Link>.
        </p>
      </div>
    </section>
  );
}
