import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'dark' | 'light';
export type Grade = 'again' | 'good' | 'easy';

export interface QuizRecord { attempts: number; correct: number; last: boolean; at: number }
export interface CardRecord { box: number; due: number; seen: number }
export interface CaseRecord { score: number; total: number; at: number }

interface ProgressState {
  theme: Theme;
  lessonsDone: Record<string, number>;
  quiz: Record<string, QuizRecord>;
  cards: Record<string, CardRecord>;
  cases: Record<string, CaseRecord>;
  bookmarks: string[];
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  toggleLesson: (id: string) => void;
  recordAnswer: (qid: string, correct: boolean) => void;
  gradeCard: (cardId: string, grade: Grade) => void;
  recordCase: (id: string, score: number, total: number) => void;
  toggleBookmark: (drugId: string) => void;
  reset: () => void;
}

/** Leitner intervals (days) for boxes 1–5 */
export const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 16, 35];
const DAY = 86_400_000;

export function applyTheme(t: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', t === 'dark');
  document.documentElement.style.colorScheme = t;
}

const empty = { lessonsDone: {}, quiz: {}, cards: {}, cases: {}, bookmarks: [] as string[] };

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      ...empty,
      setTheme: (theme) => { applyTheme(theme); set({ theme }); },
      toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
      toggleLesson: (id) =>
        set((s) => {
          const next = { ...s.lessonsDone };
          if (next[id]) delete next[id];
          else next[id] = Date.now();
          return { lessonsDone: next };
        }),
      recordAnswer: (qid, correct) =>
        set((s) => {
          const prev = s.quiz[qid] ?? { attempts: 0, correct: 0, last: false, at: 0 };
          return { quiz: { ...s.quiz, [qid]: { attempts: prev.attempts + 1, correct: prev.correct + (correct ? 1 : 0), last: correct, at: Date.now() } } };
        }),
      gradeCard: (cardId, grade) =>
        set((s) => {
          const prev = s.cards[cardId] ?? { box: 1, due: 0, seen: 0 };
          const box = grade === 'again' ? 1 : Math.min(5, prev.box + (grade === 'easy' ? 2 : 1));
          const due = grade === 'again' ? Date.now() + 10 * 60_000 : Date.now() + BOX_INTERVAL_DAYS[box] * DAY;
          return { cards: { ...s.cards, [cardId]: { box, due, seen: prev.seen + 1 } } };
        }),
      recordCase: (id, score, total) => set((s) => ({ cases: { ...s.cases, [id]: { score, total, at: Date.now() } } })),
      toggleBookmark: (drugId) =>
        set((s) => ({ bookmarks: s.bookmarks.includes(drugId) ? s.bookmarks.filter((b) => b !== drugId) : [...s.bookmarks, drugId] })),
      reset: () => set({ ...empty, lessonsDone: {}, quiz: {}, cards: {}, cases: {}, bookmarks: [] }),
    }),
    {
      name: 'psychopharm-progress',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => applyTheme(state?.theme ?? 'dark'),
    },
  ),
);
