import type { Drug, ModuleId } from '@/types';
import { antidepressants } from './antidepressants';
import { moodStabilizers } from './moodStabilizers';
import { antipsychotics } from './antipsychotics';
import { anxietyAgents } from './anxiety';
import { adhdAgents } from './adhd';
import { sleepAgents } from './sleep';
import { substanceUseAgents } from './substanceUse';

export const allDrugs: Drug[] = [
  ...antidepressants,
  ...moodStabilizers,
  ...antipsychotics,
  ...anxietyAgents,
  ...adhdAgents,
  ...sleepAgents,
  ...substanceUseAgents,
];

export const drugMap: Record<string, Drug> = Object.fromEntries(allDrugs.map((d) => [d.id, d]));

export function getDrug(id: string | undefined): Drug | undefined {
  return id ? drugMap[id] : undefined;
}

/** Drugs whose home module is `id`, plus cross-listed drugs. */
export function drugsForModule(id: ModuleId): Drug[] {
  return allDrugs.filter((d) => d.module === id || d.alsoIn?.includes(id));
}
