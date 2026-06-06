import Link from 'next/link';
import { config } from '@/lib/config';
import { LockKeyholeIcon, DocumentIcon, ShieldCheckIcon, SearchCheckIcon } from './icons';

const CARDS = [
  {
    icon: <LockKeyholeIcon size={26} className="text-green" />,
    title: 'Datos cifrados',
    text: 'Tu información viaja y se almacena cifrada, protegida de extremo a extremo.',
  },
  {
    icon: <DocumentIcon size={26} className="text-green" />,
    title: 'Tratamiento conforme a la ley',
    text: 'Tratamos tus datos personales según la Ley 1581 de 2012 (Habeas Data).',
  },
  {
    icon: <ShieldCheckIcon size={26} className="text-green" />,
    title: 'Entidad vigilada',
    text: `Operamos bajo la supervisión de la ${config.regulatorName}.`,
    regulatorOnly: true,
  },
  {
    icon: <SearchCheckIcon size={26} className="text-green" />,
    title: 'Simular no afecta tu historial',
    text: 'La simulación es informativa y no genera consultas en centrales de riesgo.',
  },
];

export function Security() {
  return (
    <section id="seguridad" aria-labelledby="sec-heading" className="py-16 lg:py-24">
      <div className="mx-auto max-w-container px-6">
        <div className="reveal text-center mb-10">
          <p className="text-sm font-semibold text-green-ink mb-2">Seguridad</p>
          <h2 id="sec-heading" className="text-2xl lg:text-3xl font-extrabold text-navy mb-3">
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
