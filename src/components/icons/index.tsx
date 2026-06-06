import { cn } from '@/lib/utils';

interface IconProps {
  size?: number;
  className?: string;
}

export function ShieldCheckIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z" />
      <path d="M9 12 l2 2 4-4.5" />
    </svg>
  );
}

export function LockIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11 V7 a4 4 0 0 1 8 0 v4" />
    </svg>
  );
}

export function LockKeyholeIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11 V7 a4 4 0 0 1 8 0 v4" />
      <circle cx="12" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CalendarIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="6" width="18" height="15" rx="2" />
      <path d="M3 10 h18 M8 3 v6 M16 3 v6" />
    </svg>
  );
}

export function ClockIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7 v5 l3.5 2" />
    </svg>
  );
}

export function HelpIcon({ size = 15, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.5 9 a2.5 2.5 0 1 1 3.5 2.3 c-.8.4-1 .8-1 1.7 M12 17 h.01" />
    </svg>
  );
}

export function CheckIcon({ size = 17, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12 l4 4 L19 7" />
    </svg>
  );
}

export function CloseIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <path d="M6 6 l12 12 M18 6 l-12 12" />
    </svg>
  );
}

export function PencilIcon({ size = 17, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20 h9" />
      <path d="M16.5 3.5 a2.1 2.1 0 0 1 3 3 L7 19 l-4 1 1-4 Z" />
    </svg>
  );
}

export function LightningIcon({ size = 13, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13 2 L4 14 h6 l-1 8 9-12 h-6 z" />
    </svg>
  );
}

export function HomeIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 9 l9-7 9 7 v11 a2 2 0 0 1-2 2 H5 a2 2 0 0 1-2-2 Z" />
      <path d="M9 22 V12 h6 v10" />
    </svg>
  );
}

export function DocumentIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2 H6 a2 2 0 0 0-2 2 v16 a2 2 0 0 0 2 2 h12 a2 2 0 0 0 2-2 V8 Z" />
      <path d="M14 2 v6 h6 M16 13 H8 M16 17 H8 M10 9 H8" />
    </svg>
  );
}

export function DocumentCheckIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2 H6 a2 2 0 0 0-2 2 v16 a2 2 0 0 0 2 2 h12 a2 2 0 0 0 2-2 V8 Z" />
      <path d="M14 2 v6 h6" />
      <path d="M9 15 l2 2 4-4.5" />
    </svg>
  );
}

export function SearchCheckIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21 l-4.35-4.35" />
      <path d="M8 11 l2 2 4-4" />
    </svg>
  );
}

export function VerifiedCircleIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="10" fill="var(--green)" />
      <path d="M8 12 l2.5 2.5 L16 9" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CredaliaLogo({ size = 48, className }: IconProps) {
  const s = size / 48;
  return (
    <svg width={size} height={30 * s} viewBox="0 0 48 30" className={className}>
      <path d="M2 2 L11 2 L20 15 L11 28 L2 28 L11 15 Z" fill="var(--green)" />
      <path d="M16 2 L25 2 L34 15 L25 28 L16 28 L25 15 Z" fill="var(--orange)" />
      <path d="M30 2 L39 2 L48 15 L39 28 L30 28 L39 15 Z" fill="var(--navy)" />
    </svg>
  );
}

export function MinusIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className}>
      <path d="M5 12 h14" />
    </svg>
  );
}

export function PlusIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className}>
      <path d="M12 5 v14 M5 12 h14" />
    </svg>
  );
}

export function HamburgerIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <path d="M4 7 h16 M4 12 h16 M4 17 h16" />
    </svg>
  );
}

export function PersonIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21 a8 8 0 0 0-16 0" />
    </svg>
  );
}

export function IdCardIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="12" r="2.5" />
      <path d="M14 9 h4 M14 12 h4 M14 15 h3" />
    </svg>
  );
}

export function CreditCardIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10 h20" />
      <path d="M6 15 h4" />
    </svg>
  );
}

export function CalculatorIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6 h8 M8 10 h2 M14 10 h2 M8 14 h2 M14 14 h2 M8 18 h2 M14 18 h2" />
    </svg>
  );
}

export function DocUploadIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2 H6 a2 2 0 0 0-2 2 v16 a2 2 0 0 0 2 2 h12 a2 2 0 0 0 2-2 V8 Z" />
      <path d="M14 2 v6 h6" />
      <path d="M12 18 v-6 M9 15 l3-3 3 3" />
    </svg>
  );
}

export function RefreshCheckIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12 a9 9 0 0 1-15.4 6.4" />
      <path d="M3 12 a9 9 0 0 1 15.4-6.4" />
      <path d="M21 3 v6 h-6 M3 21 v-6 h6" />
      <path d="M9 12 l2 2 4-4" />
    </svg>
  );
}

export function BankIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 21 h18 M3 10 h18" />
      <path d="M5 10 v8 M9 10 v8 M15 10 v8 M19 10 v8" />
      <path d="M3 10 L12 3 L21 10" />
    </svg>
  );
}

export function AlertCircleIcon({ size = 40, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8 v5 M12 17 h.01" />
    </svg>
  );
}

export function ReturnArrowIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12 a9 9 0 1 0 9-9" />
      <path d="M3 4 v4 h4" />
    </svg>
  );
}

export { cn, type IconProps };
