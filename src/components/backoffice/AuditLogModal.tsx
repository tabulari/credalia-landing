'use client';

import { CloseIcon, ShieldCheckIcon } from '../icons';

export interface AuditEntry {
  id: string;
  radicado: string;
  actor: string;
  actorRole: string;
  action: string;
  previousState: string;
  newState: string;
  timestamp: string;
  note: string;
}

export function AuditLogModal({
  isOpen,
  onClose,
  entries,
}: {
  isOpen: boolean;
  onClose: () => void;
  entries: AuditEntry[];
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-ink/70 backdrop-blur-sm animate-overlay-in">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-border overflow-hidden animate-dialog-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-soft">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon size={20} className="text-navy" />
            <h3 id="audit-modal-title" className="text-base font-extrabold text-navy">
              Bitácora Inmutable de Auditoría Operator (Ley 1581)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-1.5 text-muted-2 hover:text-navy rounded-lg hover:bg-border transition-colors"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {entries.length === 0 ? (
            <p className="text-xs text-center text-muted-2 py-6">No hay registros de auditoría aún.</p>
          ) : (
            <div className="space-y-3">
              {entries.map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl border border-border bg-bg-soft text-xs space-y-1.5 tabular-nums">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-navy">{log.action}</span>
                    <span className="text-[11px] text-muted-2">{log.timestamp}</span>
                  </div>

                  <p className="text-muted-foreground">
                    Operador: <strong className="text-navy">{log.actor}</strong> ({log.actorRole})
                  </p>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-800 font-semibold">{log.previousState}</span>
                    <span>→</span>
                    <span className="px-2 py-0.5 rounded bg-green-tint text-green-ink font-extrabold">{log.newState}</span>
                  </div>

                  {log.note && (
                    <p className="text-[11px] text-navy italic pt-1 border-t border-border/50">
                      &quot;{log.note}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
