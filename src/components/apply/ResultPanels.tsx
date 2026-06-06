'use client';

import { CheckIcon, AlertCircleIcon } from '../icons';

export function ApplicationSuccess({ radicado }: { radicado: string }) {
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center py-8">
      <div className="w-[72px] h-[72px] rounded-full bg-green flex items-center justify-center mb-5 shadow-lg animate-[popIn_0.4s_cubic-bezier(0.2,1.4,0.4,1)] motion-reduce:animate-none">
        <CheckIcon size={40} className="text-white" />
      </div>
      <h2 className="text-xl font-extrabold text-navy">¡Solicitud enviada!</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-[380px]">Recibimos tu solicitud y la estamos evaluando. Te contactaremos por WhatsApp en los próximos minutos.</p>
      <div className="mt-4 bg-bg-soft border border-border rounded-lg px-4 py-2.5 text-sm text-muted-foreground">Radicado <b className="text-navy font-extrabold">{radicado}</b></div>
    </section>
  );
}

export function ApplicationError() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center py-8">
      <div className="w-[72px] h-[72px] rounded-full bg-destructive flex items-center justify-center mb-5 shadow-lg animate-[popIn_0.4s_cubic-bezier(0.2,1.4,0.4,1)] motion-reduce:animate-none">
        <AlertCircleIcon size={38} className="text-white" />
      </div>
      <h2 className="text-xl font-extrabold text-navy">No pudimos enviar tu solicitud</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-[380px]">Ocurrió un problema de conexión. Tus datos siguen guardados — puedes reintentar el envío.</p>
    </section>
  );
}
