import type { QuizQuestion } from '@/types';

/** Deterministic PRNG (mulberry32) so a shuffled order is stable for a given seed. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Shuffle answer options (removing authoring position bias) and remap the correct index. */
export function shuffleQuestion(q: QuizQuestion, sessionSeed: number): { options: string[]; answer: number } {
  const order = seededShuffle(q.options.map((_, i) => i), hashString(q.id) ^ sessionSeed);
  return { options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
}
