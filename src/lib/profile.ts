import type { ProfileKey } from '@/types';

export const PROFILE_LABELS: Record<ProfileKey, string> = {
  sedation: 'Sedation',
  activation: 'Activation',
  weight: 'Weight gain',
  sexual: 'Sexual dysfunction',
  gi: 'GI effects',
  qt: 'QTc',
  orthostasis: 'Orthostasis',
  anticholinergic: 'Anticholinergic',
  eps: 'EPS',
  prolactin: 'Prolactin ↑',
  discontinuation: 'Discontinuation',
  dependence: 'Misuse/dependence',
};
