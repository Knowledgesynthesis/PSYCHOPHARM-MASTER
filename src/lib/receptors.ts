import type { Receptor, RxVal } from '@/types';

export type RxAction = 'inhibitor' | 'antagonist' | 'partial agonist' | 'agonist';

export function parseRx(receptor: Receptor, v: RxVal): { affinity: number; action: RxAction } {
  const affinity = Number(v[0]);
  if (v.endsWith('p')) return { affinity, action: 'partial agonist' };
  if (v.endsWith('a')) return { affinity, action: 'agonist' };
  return { affinity, action: ['SERT', 'NET', 'DAT'].includes(receptor) ? 'inhibitor' : 'antagonist' };
}

export const AFFINITY_LABEL = ['', 'Weak', 'Moderate', 'Strong', 'Very strong'];
