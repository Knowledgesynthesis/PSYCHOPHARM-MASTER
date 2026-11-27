import { describe, expect, it } from 'vitest';
import { allDrugs, drugMap } from '@/data/drugs';
import { coMeds } from '@/data/coMeds';
import { questions } from '@/data/questions';
import { cases } from '@/data/cases';
import { lessons } from '@/data/lessons';
import { referenceMap } from '@/data/references';
import { SIGNS, SYNDROMES } from '@/data/toxidromes';
import { deck } from '@/lib/flashcards';
import { shuffleQuestion } from '@/lib/quiz';

const allAgentIds = new Set([...allDrugs.map((d) => d.id), ...coMeds.map((c) => c.id)]);

describe('drug data integrity', () => {
  it('has unique ids across drugs and co-medications', () => {
    const ids = [...allDrugs.map((d) => d.id), ...coMeds.map((c) => c.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers every clinical module with ≥4 drugs', () => {
    for (const m of ['antidepressants', 'mood-stabilizers', 'antipsychotics', 'anxiety', 'adhd', 'sleep', 'substance-use'] as const) {
      expect(allDrugs.filter((d) => d.module === m).length, m).toBeGreaterThanOrEqual(4);
    }
  });

  it.each(allDrugs.map((d) => [d.id, d] as const))('%s has complete, valid fields', (_, d) => {
    expect(d.name.length).toBeGreaterThan(1);
    expect(d.mechanism.length).toBeGreaterThan(10);
    expect(d.indications.length).toBeGreaterThan(0);
    expect(d.dosing.start && d.dosing.target && d.dosing.max).toBeTruthy();
    expect(d.adverse.common.length + d.adverse.serious.length).toBeGreaterThan(0);
    expect(d.monitoring.length).toBeGreaterThan(0);
    expect(d.pearls.length).toBeGreaterThan(0);
    for (const v of Object.values(d.profile)) expect([0, 1, 2, 3]).toContain(v);
    for (const r of d.refs) expect(referenceMap[r], `${d.id} ref ${r}`).toBeDefined();
    for (const c of d.contraWith ?? []) expect(allAgentIds.has(c.id), `${d.id} contraWith ${c.id}`).toBe(true);
  });

  it('contains no outdated FDA pregnancy letter categories', () => {
    const text = JSON.stringify(allDrugs);
    expect(text).not.toMatch(/Category [ABCDX]\b/);
  });

  it('contains no retired regulatory claims', () => {
    const text = JSON.stringify(allDrugs).toLowerCase();
    expect(text).not.toContain('x-waiver for prescribing');
    expect(text).not.toMatch(/rems (program )?enrollment required/);
    expect(drugMap.naltrexone.boxed ?? []).toHaveLength(0);
    expect(drugMap.bupropion.boxed?.join(' ')).toMatch(/removed in 2016/);
  });

  it('has label-correct MAOI washouts', () => {
    expect(drugMap.fluoxetine.washoutBeforeMaoiDays).toBe(35);
    expect(drugMap.vortioxetine.washoutBeforeMaoiDays).toBe(21);
    expect(drugMap.sertraline.washoutBeforeMaoiDays).toBe(14);
    expect(drugMap.venlafaxine.washoutBeforeMaoiDays).toBe(7);
    expect(drugMap.desvenlafaxine.washoutBeforeMaoiDays).toBe(7);
    expect(drugMap.duloxetine.washoutBeforeMaoiDays).toBe(5);
    for (const d of allDrugs.filter((x) => x.module === 'antidepressants' && x.ix.sero && x.cls !== 'MAOI')) {
      expect(d.washoutBeforeMaoiDays, d.id).toBeDefined();
    }
  });
});

describe('question bank', () => {
  it('has ≥90 questions with unique ids', () => {
    expect(questions.length).toBeGreaterThanOrEqual(90);
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
  });
  it.each(questions.map((q) => [q.id, q] as const))('%s is well-formed', (_, q) => {
    expect(q.options.length).toBeGreaterThanOrEqual(2);
    expect(q.answer).toBeGreaterThanOrEqual(0);
    expect(q.answer).toBeLessThan(q.options.length);
    expect(new Set(q.options).size).toBe(q.options.length);
    expect(q.explanation.length).toBeGreaterThan(20);
    for (const r of q.refs ?? []) expect(referenceMap[r], r).toBeDefined();
  });
  it('covers every lesson module', () => {
    for (const l of lessons) expect(questions.some((q) => q.module === l.id), l.id).toBe(true);
  });
  it('presents correct answers without positional bias after shuffling', () => {
    for (const seed of [1, 42, 2026]) {
      const counts = [0, 0, 0, 0];
      for (const q of questions) {
        const s = shuffleQuestion(q, seed);
        expect(s.options[s.answer]).toBe(q.options[q.answer]);
        counts[s.answer]++;
      }
      expect(Math.max(...counts) / questions.length).toBeLessThan(0.4);
    }
  });
});

describe('cases, lessons, toxidromes, flashcards', () => {
  it.each(cases.map((c) => [c.id, c] as const))('case %s has exactly one correct option per step', (_, c) => {
    for (const s of c.steps) expect(s.options.filter((o) => o.correct)).toHaveLength(1);
    expect(c.takeaways.length).toBeGreaterThan(0);
  });
  it('lessons reference valid drugs and refs', () => {
    for (const l of lessons) {
      for (const id of l.compareIds ?? []) expect(drugMap[id], `${l.id} → ${id}`).toBeDefined();
      for (const r of l.refs) expect(referenceMap[r], `${l.id} ref ${r}`).toBeDefined();
      if (l.table) for (const row of l.table.rows) expect(row.length).toBeLessThanOrEqual(l.table.columns.length);
    }
  });
  it('syndrome weights reference real signs', () => {
    const ids = new Set(SIGNS.map((s) => s.id));
    for (const s of SYNDROMES) for (const k of Object.keys(s.weights)) expect(ids.has(k), `${s.id}:${k}`).toBe(true);
  });
  it('flashcard deck has unique ids and content', () => {
    expect(deck.length).toBeGreaterThan(250);
    expect(new Set(deck.map((c) => c.id)).size).toBe(deck.length);
    for (const c of deck) expect(c.back.join('').length).toBeGreaterThan(0);
  });
});
