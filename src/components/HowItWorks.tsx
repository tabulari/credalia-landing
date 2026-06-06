import { CalculatorIcon, DocUploadIcon, ClockIcon, RefreshCheckIcon, BankIcon } from './icons';

const STEPS = [
  {
    icon: <CalculatorIcon size={26} className="text-navy" />,
    title: 'Simula tu crédito',
    text: 'Conoce tu cuota y tasa en segundos.',
  },
  {
    icon: <DocUploadIcon size={26} className="text-navy" />,
    title: 'Sube tus documentos',
    text: 'Cédula y un soporte. 100% en línea.',
  },
  {
    icon: <ClockIcon size={26} className="text-navy" />,
    title: 'Análisis en minutos',
    text: 'Evaluamos tu solicitud automáticamente.',
  },
  {
    icon: <RefreshCheckIcon size={26} className="text-navy" />,
    title: 'Recibe tu decisión',
    text: 'Te avisamos por WhatsApp y correo.',
  },
  {
    icon: <BankIcon size={26} className="text-navy" />,
    title: 'Recibe tu dinero',
    text: 'Desembolso directo a tu cuenta.',
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="hiw-heading" className="py-16 lg:py-24 bg-bg-soft">
      <div className="mx-auto max-w-container px-6">
        <div className="reveal mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-2">Cómo funciona</p>
          <h2 id="hiw-heading" className="text-2xl lg:text-3xl font-display tracking-tight text-navy">
            Un proceso claro en 5 pasos.
          </h2>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 reveal d1">
          {STEPS.map((s, i) => (
            <li key={i} className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-navy">
                {s.icon}
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white text-xs font-bold">
                  {i + 1}
                </span>
              </div>
              <h4 className="text-base font-bold text-navy">{s.title}</h4>
              <p className="text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
