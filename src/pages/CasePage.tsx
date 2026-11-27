import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Lightbulb, RotateCcw } from 'lucide-react';
import { cases } from '@/data/cases';
import { useProgress } from '@/store/progress';
import { seededShuffle } from '@/lib/quiz';
import { Badge, Bullets, Button, Card } from '@/components/ui';
import { cn } from '@/utils/cn';
import NotFoundPage from './NotFoundPage';

export default function CasePage() {
  const { id } = useParams();
  const c = cases.find((x) => x.id === id);
  const recordCase = useProgress((s) => s.recordCase);
  const [step, setStep] = useState(0);
  const [tried, setTried] = useState<number[]>([]);
  const [firstTry, setFirstTry] = useState<boolean[]>([]);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const shuffled = useMemo(() => c?.steps.map((s, i) => seededShuffle(s.options, seed + i)) ?? [], [c, seed]);
  if (!c) return <NotFoundPage />;

  const done = step >= c.steps.length;
  const s = c.steps[step];
  const opts = shuffled[step] ?? [];
  const solved = tried.some((i) => opts[i]?.correct);
  const idx = cases.findIndex((x) => x.id === c.id);
  const next = cases[idx + 1];

  const choose = (i: number) => {
    if (solved || tried.includes(i)) return;
    const nt = [...tried, i];
    setTried(nt);
    if (nt.length === 1) setFirstTry((f) => [...f, !!opts[i].correct]);
  };
  const advance = () => {
    const ns = step + 1;
    setStep(ns);
    setTried([]);
    if (ns >= c.steps.length) recordCase(c.id, firstTry.filter(Boolean).length, c.steps.length);
  };
  const restart = () => { setStep(0); setTried([]); setFirstTry([]); setSeed(Math.floor(Math.random() * 1e9)); };

  return (
    <article className="mx-auto max-w-3xl space-y-5">
      <Link to="/cases" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"><ArrowLeft className="h-4 w-4" aria-hidden />All cases</Link>
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{c.title}</h1>
        <div className="mt-2 flex gap-1.5">{c.steps.map((_, i) => <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < step ? (firstTry[i] ? 'bg-emerald-500' : 'bg-amber-500') : i === step ? 'bg-brand' : 'bg-surface-2')} />)}</div>
      </header>
      <Card className="bg-surface-2/60">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Presentation (synthetic)</p>
        <p className="leading-relaxed">{c.vignette}</p>
      </Card>

      {!done ? (
        <Card className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Decision {step + 1} of {c.steps.length}</p>
          {s.info && <p className="text-sm">{s.info}</p>}
          <p className="font-semibold">{s.prompt}</p>
          <div className="grid gap-2">
            {opts.map((o, i) => {
              const picked = tried.includes(i);
              return (
                <div key={i}>
                  <button onClick={() => choose(i)} disabled={solved || picked} className={cn('w-full rounded-xl border p-3 text-left text-sm transition-colors', !picked && !solved && 'hover:border-brand/60 hover:bg-surface-2', picked && o.correct && 'border-emerald-500/60 bg-emerald-500/10', picked && !o.correct && 'border-red-500/60 bg-red-500/10')}>
                    <span className="flex items-start gap-2">
                      {picked && (o.correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />)}
                      {o.text}
                    </span>
                  </button>
                  {picked && <p className={cn('animate-fade-in px-3 pt-1.5 text-sm', o.correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300')} aria-live="polite">{o.feedback}</p>}
                </div>
              );
            })}
          </div>
          {!solved && tried.length > 0 && <p className="text-xs text-muted">Try another option.</p>}
          {solved && <div className="flex justify-end"><Button onClick={advance}>{step === c.steps.length - 1 ? 'Finish case' : 'Next decision'}<ArrowRight className="h-4 w-4" aria-hidden /></Button></div>}
        </Card>
      ) : (
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold">Case complete</p>
            <Badge tone={firstTry.every(Boolean) ? 'green' : 'amber'}>{firstTry.filter(Boolean).length}/{c.steps.length} correct on first try</Badge>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-2 font-medium"><Lightbulb className="h-4 w-4 text-brand" aria-hidden />Take-aways</p>
            <Bullets items={c.takeaways} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={restart}><RotateCcw className="h-4 w-4" aria-hidden />Retry</Button>
            {next && <Link to={`/cases/${next.id}`} onClick={restart} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-brand-fg">Next case: {next.title}<ArrowRight className="h-4 w-4" aria-hidden /></Link>}
          </div>
        </Card>
      )}
    </article>
  );
}
