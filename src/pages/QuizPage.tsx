import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ListChecks, ArrowLeft, ArrowRight, Shuffle, Trophy, RotateCcw } from 'lucide-react';
import type { ModuleId, QuizQuestion } from '@/types';
import { questions } from '@/data/questions';
import { lessons, lessonMap } from '@/data/lessons';
import { useProgress } from '@/store/progress';
import { seededShuffle, shuffleQuestion } from '@/lib/quiz';
import MCQ from '@/components/MCQ';
import { Badge, Button, Callout, Card, PageHeader, Segmented } from '@/components/ui';
import { cn } from '@/utils/cn';

type Mode = 'practice' | 'exam';
type Pool = 'all' | 'unanswered' | 'missed';

function usePool(module: string, pool: Pool) {
  const quiz = useProgress((s) => s.quiz);
  return useMemo(() => questions.filter((q) => (module === 'all' || q.module === module) && (pool === 'all' || (pool === 'unanswered' ? !quiz[q.id] : quiz[q.id] && !quiz[q.id].last))), [module, pool, quiz]);
}

function Practice({ module, pool, seed, shuffle }: { module: string; pool: Pool; seed: number; shuffle: boolean }) {
  const base = usePool(module, pool);
  const [frozen] = useState(() => base);
  const list = useMemo(() => (shuffle ? seededShuffle(frozen, seed) : frozen), [frozen, shuffle, seed]);
  const [i, setI] = useState(0);
  const record = useProgress((s) => s.recordAnswer);
  if (!list.length) return <Callout tone="success" title="Nothing here">No questions match this filter{pool === 'missed' ? ' — no missed questions. Nice work.' : '.'}</Callout>;
  const q = list[Math.min(i, list.length - 1)];
  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <span>Question {i + 1} of {list.length}</span>
        <span className="flex gap-1.5"><Badge tone="brand">{lessonMap[q.module].title}</Badge><Badge>{['', 'Core', 'Applied', 'Advanced'][q.difficulty]}</Badge></span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-brand transition-all" style={{ width: `${((i + 1) / list.length) * 100}%` }} /></div>
      <MCQ key={q.id} question={q} seed={seed} onAnswer={(ok) => record(q.id, ok)} />
      <div className="flex justify-between border-t border-line pt-4">
        <Button variant="secondary" onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0}><ArrowLeft className="h-4 w-4" aria-hidden />Previous</Button>
        <Button onClick={() => setI((x) => Math.min(list.length - 1, x + 1))} disabled={i >= list.length - 1}>Next<ArrowRight className="h-4 w-4" aria-hidden /></Button>
      </div>
    </Card>
  );
}

function Exam({ module, seed }: { module: string; seed: number }) {
  const all = usePool(module, 'all');
  const [n, setN] = useState(20);
  const [list, setList] = useState<QuizQuestion[] | null>(null);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const record = useProgress((s) => s.recordAnswer);

  if (!list) {
    return (
      <Card className="space-y-4">
        <p className="font-semibold">Exam mode</p>
        <p className="text-sm text-muted">Random questions, no feedback until the end — closest to board conditions. Pool: {all.length} questions.</p>
        <Segmented label="Number of questions" value={String(n)} onChange={(v) => setN(Number(v))} options={[10, 20, 40].map((x) => ({ value: String(x), label: `${x}` }))} />
        <Button onClick={() => { setList(seededShuffle(all, seed).slice(0, n)); setI(0); setAnswers({}); }} disabled={!all.length}>Start exam</Button>
      </Card>
    );
  }

  const finished = Object.keys(answers).length === list.length && i >= list.length;
  if (finished) {
    const score = list.filter((q) => answers[q.id] === shuffleQuestion(q, seed).answer).length;
    const pct = Math.round((score / list.length) * 100);
    return (
      <div className="space-y-4">
        <Card className="flex flex-col items-center gap-2 text-center">
          <Trophy className={cn('h-10 w-10', pct >= 85 ? 'text-emerald-500' : pct >= 70 ? 'text-amber-500' : 'text-red-500')} aria-hidden />
          <p className="text-3xl font-bold">{score}/{list.length} · {pct}%</p>
          <p className="text-sm text-muted">{pct >= 85 ? 'Mastery range.' : pct >= 70 ? 'Solid — review the misses below.' : 'Revisit the modules for the topics you missed.'}</p>
          <Button variant="secondary" onClick={() => setList(null)}><RotateCcw className="h-4 w-4" aria-hidden />New exam</Button>
        </Card>
        {list.map((q, k) => {
          const s = shuffleQuestion(q, seed);
          const ok = answers[q.id] === s.answer;
          return (
            <Card key={q.id} className={cn('space-y-2 border-l-4', ok ? 'border-l-emerald-500' : 'border-l-red-500')}>
              <p className="text-sm font-medium"><span className="text-muted">{k + 1}. </span>{q.stem}</p>
              {!ok && <p className="text-sm"><span className="text-red-600 dark:text-red-400">Your answer:</span> {s.options[answers[q.id]]}</p>}
              <p className="text-sm"><span className="text-emerald-600 dark:text-emerald-400">Correct:</span> {s.options[s.answer]}</p>
              <p className="text-sm text-muted">{q.explanation}</p>
            </Card>
          );
        })}
      </div>
    );
  }

  const q = list[i];
  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between text-sm text-muted"><span>Question {i + 1} of {list.length}</span><Badge tone="brand">{lessonMap[q.module].title}</Badge></div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-brand transition-all" style={{ width: `${(i / list.length) * 100}%` }} /></div>
      <MCQ key={q.id} question={q} seed={seed} revealOnAnswer={false} onAnswer={(ok, chosen) => { record(q.id, ok); setAnswers((a) => ({ ...a, [q.id]: chosen })); }} />
      <div className="flex justify-end border-t border-line pt-4">
        <Button onClick={() => setI((x) => x + 1)} disabled={answers[q.id] === undefined}>{i === list.length - 1 ? 'Finish' : 'Next'}<ArrowRight className="h-4 w-4" aria-hidden /></Button>
      </div>
    </Card>
  );
}

export default function QuizPage() {
  const [params, setParams] = useSearchParams();
  const module = params.get('module') ?? 'all';
  const [mode, setMode] = useState<Mode>('practice');
  const [pool, setPool] = useState<Pool>('all');
  const [shuffle, setShuffle] = useState(false);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const quiz = useProgress((s) => s.quiz);

  const stats = lessons.map((l) => {
    const qs = questions.filter((q) => q.module === l.id);
    const ans = qs.filter((q) => quiz[q.id]);
    return { l, total: qs.length, answered: ans.length, correct: ans.filter((q) => quiz[q.id].last).length };
  });

  return (
    <div>
      <PageHeader icon={ListChecks} eyebrow={`${questions.length} questions`} title="Question bank" subtitle="Vignette-based questions with rationales and sources. Answer options are shuffled each session." />
      <Card className="mb-5 flex flex-wrap items-center gap-3 p-4">
        <Segmented label="Mode" value={mode} onChange={setMode} options={[{ value: 'practice', label: 'Practice' }, { value: 'exam', label: 'Exam' }]} />
        <select className="input w-auto" value={module} onChange={(e) => setParams(e.target.value === 'all' ? {} : { module: e.target.value }, { replace: true })} aria-label="Module">
          <option value="all">All modules</option>
          {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
        </select>
        {mode === 'practice' && (
          <>
            <select className="input w-auto" value={pool} onChange={(e) => setPool(e.target.value as Pool)} aria-label="Question pool">
              <option value="all">All questions</option>
              <option value="unanswered">Unanswered</option>
              <option value="missed">Previously missed</option>
            </select>
            <Button variant={shuffle ? 'primary' : 'secondary'} size="sm" onClick={() => { setShuffle(!shuffle); setSeed(Math.floor(Math.random() * 1e9)); }} aria-pressed={shuffle}><Shuffle className="h-4 w-4" aria-hidden />Shuffle</Button>
          </>
        )}
      </Card>
      {mode === 'practice' ? <Practice key={`${module}-${pool}-${shuffle}-${seed}`} module={module} pool={pool} seed={seed} shuffle={shuffle} /> : <Exam key={`${module}-${seed}`} module={module as ModuleId | 'all'} seed={seed} />}

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Performance by module</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {stats.map(({ l, total, answered, correct }) => (
            <button key={l.id} onClick={() => setParams({ module: l.id }, { replace: true })} className="card flex items-center gap-3 p-3 text-left hover:border-brand/50">
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{l.title}</span>
              <span className="text-xs text-muted">{answered}/{total}</span>
              <span className={cn('w-12 text-right text-sm font-semibold', !answered ? 'text-muted' : correct / answered >= 0.85 ? 'text-emerald-600 dark:text-emerald-400' : correct / answered >= 0.7 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400')}>{answered ? `${Math.round((correct / answered) * 100)}%` : '—'}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
