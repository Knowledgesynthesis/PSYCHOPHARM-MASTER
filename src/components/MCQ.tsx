import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { QuizQuestion } from '@/types';
import { shuffleQuestion } from '@/lib/quiz';
import { cn } from '@/utils/cn';
import { RefList } from './ui';

/** A single multiple-choice question with shuffled options and immediate feedback. */
export default function MCQ({
  question, seed, onAnswer, revealOnAnswer = true, showRefs = true, number,
}: { question: QuizQuestion; seed: number; onAnswer?: (correct: boolean, chosen: number) => void; revealOnAnswer?: boolean; showRefs?: boolean; number?: string }) {
  const { options, answer } = useMemo(() => shuffleQuestion(question, seed), [question, seed]);
  const [chosen, setChosen] = useState<number | null>(null);
  const done = chosen !== null;
  const correct = chosen === answer;

  const pick = (i: number) => {
    if (done) return;
    setChosen(i);
    onAnswer?.(i === answer, i);
  };

  return (
    <div className="space-y-4">
      <p className="font-medium leading-relaxed">
        {number && <span className="mr-2 text-muted">{number}</span>}
        {question.stem}
      </p>
      <div className="grid gap-2" role="group" aria-label="Answer options">
        {options.map((opt, i) => {
          const isAnswer = i === answer;
          const isChosen = i === chosen;
          const show = done && revealOnAnswer;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={done}
              aria-pressed={isChosen}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors',
                !done && 'hover:border-brand/60 hover:bg-surface-2',
                show && isAnswer && 'border-emerald-500/60 bg-emerald-500/10',
                show && isChosen && !isAnswer && 'border-red-500/60 bg-red-500/10',
                done && !revealOnAnswer && isChosen && 'border-brand bg-brand/10',
              )}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line text-[11px] font-semibold text-muted">{String.fromCharCode(65 + i)}</span>
              <span className="flex-1">{opt}</span>
              {show && isAnswer && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-label="Correct answer" />}
              {show && isChosen && !isAnswer && <XCircle className="h-5 w-5 shrink-0 text-red-500" aria-label="Your answer" />}
            </button>
          );
        })}
      </div>
      {done && revealOnAnswer && (
        <div className={cn('animate-fade-in rounded-xl border p-4 text-sm', correct ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/5')} aria-live="polite">
          <p className={cn('mb-1 font-semibold', correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300')}>{correct ? 'Correct' : `Incorrect — answer: ${String.fromCharCode(65 + answer)}`}</p>
          <p className="leading-relaxed">{question.explanation}</p>
          {showRefs && question.refs && <RefList ids={question.refs} className="mt-3" />}
        </div>
      )}
    </div>
  );
}
