import { PersonIcon, IdCardIcon, CreditCardIcon, DocumentIcon } from './icons';

const REQS = [
  {
    icon: <PersonIcon size={22} className="text-green" />,
    label: 'Ser mayor de edad',
  },
  {
    icon: <IdCardIcon size={22} className="text-green" />,
    label: 'Cédula colombiana',
  },
  {
    icon: <CreditCardIcon size={22} className="text-green" />,
    label: 'Una cuenta bancaria a tu nombre',
  },
  {
    icon: <DocumentIcon size={22} className="text-green" />,
    label: 'Un soporte de ingresos',
  },
];

export function Requirements() {
  return (
    <section id="requisitos-band" aria-labelledby="req-heading" className="py-16 lg:py-24">
      <div className="mx-auto max-w-container px-6">
        <div className="reveal mb-10 text-center">
          <h2 id="req-heading" className="text-2xl lg:text-3xl font-extrabold text-navy mb-3">
            ¿Qué necesitas para aplicar?
          </h2>
          <p className="text-muted-foreground">
            Requisitos simples. Si cumples con esto, puedes solicitar tu crédito.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 reveal d1">
          {REQS.map((r) => (
            <div
              key={r.label}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card text-center hover:shadow-md transition-shadow"
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-green-tint text-green">
                {r.icon}
              </span>
              <span className="text-sm font-semibold text-foreground">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
