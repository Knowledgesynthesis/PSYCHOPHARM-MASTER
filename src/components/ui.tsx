import { type ReactNode, type ElementType, type ButtonHTMLAttributes } from 'react';
import { AlertTriangle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Level, Severity } from '@/types';
import { referenceMap } from '@/data/references';
import { severityTone } from '@/lib/levels';

export function Card({ className, children, as: As = 'div', ...rest }: { className?: string; children: ReactNode; as?: ElementType; [k: string]: unknown }) {
  return <As className={cn('card p-5', className)} {...rest}>{children}</As>;
}

export type Tone = 'neutral' | 'brand' | 'red' | 'orange' | 'amber' | 'green' | 'violet';
const toneClass: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-muted border-line',
  brand: 'bg-brand/10 text-brand border-brand/30',
  red: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30',
  orange: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
  amber: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30',
  green: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  violet: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium', toneClass[tone], className)}>{children}</span>;
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Badge tone={severityTone[severity]} className="uppercase tracking-wide">{severity}</Badge>;
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5 text-sm',
        variant === 'primary' && 'bg-brand text-brand-fg hover:bg-brand/90',
        variant === 'secondary' && 'border border-line bg-surface hover:bg-surface-2',
        variant === 'ghost' && 'hover:bg-surface-2',
        className,
      )}
      {...props}
    />
  );
}

export function PageHeader({ icon: Icon, eyebrow, title, subtitle, actions }: { icon?: ElementType; eyebrow?: string; title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="mt-1 rounded-xl bg-brand/10 p-2.5 text-brand">
            <Icon className="h-6 w-6" aria-hidden />
          </div>
        )}
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-brand">{eyebrow}</p>}
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted sm:text-base">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function SectionTitle({ children, id, aside }: { children: ReactNode; id?: string; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 id={id} className="scroll-mt-24 text-lg font-semibold tracking-tight">{children}</h2>
      {aside}
    </div>
  );
}

const calloutStyles = {
  info: { cls: 'border-sky-500/30 bg-sky-500/5', icon: Info, ic: 'text-sky-600 dark:text-sky-400' },
  warn: { cls: 'border-amber-500/30 bg-amber-500/5', icon: AlertTriangle, ic: 'text-amber-600 dark:text-amber-400' },
  danger: { cls: 'border-red-500/30 bg-red-500/5', icon: ShieldAlert, ic: 'text-red-600 dark:text-red-400' },
  success: { cls: 'border-emerald-500/30 bg-emerald-500/5', icon: CheckCircle2, ic: 'text-emerald-600 dark:text-emerald-400' },
};
export function Callout({ tone = 'info', title, children, className }: { tone?: keyof typeof calloutStyles; title?: ReactNode; children?: ReactNode; className?: string }) {
  const s = calloutStyles[tone];
  const Icon = s.icon;
  return (
    <div className={cn('flex gap-3 rounded-xl border p-4 text-sm', s.cls, className)}>
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', s.ic)} aria-hidden />
      <div className="min-w-0 space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="text-fg/90">{children}</div>}
      </div>
    </div>
  );
}

export function Bullets({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn('space-y-1.5 text-sm', className)}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/70" aria-hidden />
          <span className="min-w-0">{it}</span>
        </li>
      ))}
    </ul>
  );
}

const LEVEL_LABEL = ['None', 'Low', 'Moderate', 'High'];
const LEVEL_COLOR = ['bg-emerald-500', 'bg-lime-500', 'bg-amber-500', 'bg-red-500'];
export function LevelBar({ level, label }: { level: Level; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm" title={`${label}: ${LEVEL_LABEL[level]}`}>
      <span className="w-32 shrink-0 text-muted">{label}</span>
      <div className="flex flex-1 gap-1" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn('h-2 flex-1 rounded-full', i <= level ? LEVEL_COLOR[level] : 'bg-surface-2')} />
        ))}
      </div>
      <span className="w-16 shrink-0 text-right text-xs font-medium">{LEVEL_LABEL[level]}</span>
    </div>
  );
}
export function RefList({ ids, className }: { ids: string[]; className?: string }) {
  const refs = ids.map((id) => referenceMap[id]).filter(Boolean);
  if (!refs.length) return null;
  return (
    <details className={cn('group rounded-xl border border-line bg-surface-2/50 p-3 text-xs', className)}>
      <summary className="cursor-pointer select-none font-medium text-muted group-open:mb-2">Evidence & sources ({refs.length})</summary>
      <ol className="list-decimal space-y-1 pl-5 text-muted">
        {refs.map((r) => (
          <li key={r.id}>
            {r.url ? <a className="underline decoration-dotted underline-offset-2 hover:text-brand" href={r.url} target="_blank" rel="noreferrer">{r.cite}</a> : r.cite}
          </li>
        ))}
      </ol>
    </details>
  );
}

export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[]; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl border border-line bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn('rounded-lg px-3 py-1.5 text-sm transition-colors', value === o.value ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg')}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, children }: { icon: ElementType; title: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-10 text-center">
      <Icon className="h-10 w-10 text-muted" aria-hidden />
      <p className="font-semibold">{title}</p>
      {children && <div className="max-w-md text-sm text-muted">{children}</div>}
    </div>
  );
}

export function ProgressRing({ value, size = 44 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${Math.round(value * 100)}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--line))" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--brand))" strokeWidth={5} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="fill-fg text-[11px] font-semibold">{Math.round(value * 100)}%</text>
    </svg>
  );
}
