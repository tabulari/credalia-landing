import { ShieldCheckIcon, HelpIcon } from '../icons';

export function ReassuranceChips() {
  return (
    <div className="flex flex-wrap gap-2.5 mt-6">
      <span className="inline-flex items-center gap-[7px] bg-green-tint border border-green/30 rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-green-ink">
        <ShieldCheckIcon size={14} className="text-green-ink" />
        No afecta tu historial
      </span>
      <span className="inline-flex items-center gap-[7px] bg-green-tint border border-green/30 rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-green-ink">
        <HelpIcon size={14} className="text-green-ink" />
        Costo total claro, sin sorpresas
      </span>
    </div>
  );
}
