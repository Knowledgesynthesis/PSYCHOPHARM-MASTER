import type { ModuleId } from '@/types';
import { allDrugs } from '@/data/drugs';
import { lessons } from '@/data/lessons';
import type { CardRecord } from '@/store/progress';

export interface Flashcard {
  id: string;
  module: ModuleId;
  front: string;
  back: string[];
  tag: 'mechanism' | 'boxed' | 'monitoring' | 'pearl' | 'concept' | 'interaction';
  drugId?: string;
}

function buildDeck(): Flashcard[] {
  const deck: Flashcard[] = [];
  for (const d of allDrugs) {
    deck.push({ id: `${d.id}:mech`, module: d.module, drugId: d.id, tag: 'mechanism', front: `${d.name}: mechanism of action?`, back: [d.mechanism] });
    if (d.boxed?.length) deck.push({ id: `${d.id}:boxed`, module: d.module, drugId: d.id, tag: 'boxed', front: `${d.name}: boxed warning(s)?`, back: d.boxed });
    deck.push({ id: `${d.id}:monitor`, module: d.module, drugId: d.id, tag: 'monitoring', front: `${d.name}: what must you monitor?`, back: d.monitoring.slice(0, 4) });
    if (d.contraWith?.length || d.interactions.length) {
      deck.push({ id: `${d.id}:ix`, module: d.module, drugId: d.id, tag: 'interaction', front: `${d.name}: the interactions that matter?`, back: d.interactions.slice(0, 3) });
    }
    if (d.pearls.length) deck.push({ id: `${d.id}:pearls`, module: d.module, drugId: d.id, tag: 'pearl', front: `${d.name}: the clinical pearls?`, back: d.pearls });
  }
  for (const l of lessons) {
    l.concepts.forEach((c, i) => deck.push({ id: `${l.id}:concept:${i}`, module: l.id, tag: 'concept', front: `${l.title} — ${c.title}: explain.`, back: [c.body, ...(c.bullets ?? [])] }));
  }
  return deck;
}

export const deck: Flashcard[] = buildDeck();

/** Due cards first (oldest due), then unseen cards. */
export function dueCards(cards: Flashcard[], records: Record<string, CardRecord>, now = Date.now()): Flashcard[] {
  const due = cards.filter((c) => records[c.id] && records[c.id].due <= now).sort((a, b) => records[a.id].due - records[b.id].due);
  const fresh = cards.filter((c) => !records[c.id]);
  return [...due, ...fresh];
}
