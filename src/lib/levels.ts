import type { Level, Severity } from '@/types';

const LEVEL_LABEL = ['None', 'Low', 'Moderate', 'High'];

export type ToneName = 'neutral' | 'brand' | 'red' | 'orange' | 'amber' | 'green' | 'violet';
export const severityTone: Record<Severity, ToneName> = { contraindicated: 'red', major: 'orange', moderate: 'amber', minor: 'neutral' };
export const levelCellClass = (l: Level | undefined) =>
  l === undefined ? 'bg-surface-2 text-muted' : ['bg-emerald-500/15 text-emerald-800 dark:text-emerald-200', 'bg-lime-500/20 text-lime-900 dark:text-lime-200', 'bg-amber-500/25 text-amber-900 dark:text-amber-200', 'bg-red-500/25 text-red-900 dark:text-red-200'][l];
export const levelLabel = (l: Level | undefined) => (l === undefined ? '—' : LEVEL_LABEL[l]);

