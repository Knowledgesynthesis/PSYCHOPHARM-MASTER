import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, ListChecks, Sparkles, Stethoscope, CheckCircle2 } from 'lucide-react';
import { lessons } from '@/data/lessons';
import { questions } from '@/data/questions';
import { cases } from '@/data/cases';
import { allDrugs } from '@/data/drugs';
import { deck, dueCards } from '@/lib/flashcards';
import { useProgress } from '@/store/progress';
import { tools } from '@/components/nav';
import { Badge, Card, ProgressRing } from '@/components/ui';
import { lessonIcons, moduleTone } from '@/components/nav';
import { cn } from '@/utils/cn';

const UPDATES = [
  { date: 'Oct 2026', text: 'Olanzapine monthly subcutaneous LAI (Weltruza) approved — no post-injection observation.' },
  { date: 'Jul 2026', text: 'Centanafadine (Simtriyo) approved for ADHD ≥6 y.' },
  { date: 'Jun 2026', text: 'Cytisinicline NOT approved (FDA Complete Response Letter).' },
  { date: 'Feb 2026', text: 'Milsaperidone (Bysanti) approved for schizophrenia and bipolar mania.' },
  { date: 'Nov 2025', text: 'Lumateperone approved as adjunct for MDD.' },
  { date: 'Jun 2025', text: 'Clozapine REMS removed — ANC monitoring per labeling continues.' },
  { date: 'Jun 2025', text: 'Benzodiazepine tapering joint guideline: 5–10% every 2–4 weeks.' },
  { date: '2024–25', text: 'Buprenorphine: no 24 mg/day labeled maximum.' },
];

export default function HomePage() {
  const { lessonsDone, quiz, cards, cases: caseRec } = useProgress();
  const doneCount = lessons.filter((l) => lessonsDone[l.id]).length;
  const next = lessons.find((l) => !lessonsDone[l.id]);
  const answered = Object.values(quiz);
  const accuracy = answered.length ? answered.filter((a) => a.last).length / answered.length : 0;
  const due = dueCards(deck, cards).filter((c) => cards[c.id]).length;

  return (
    <div className="space-y-10">
      <section className="card relative overflow-hidden p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl" aria-hidden />
        <div className="relative max-w-3xl space-y-4">
          <Badge tone="brand">Updated November 2026 · {allDrugs.length} drugs · {questions.length} questions · {cases.length} cases</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Master psychopharmacology — by doing it.</h1>
          <p className="text-base text-muted sm:text-lg">
            A guided path from receptors to real prescribing decisions: learn each class, then practice with an interaction checker, switching planner, emergency recognizer, calculators, cases and spaced repetition. Every claim is sourced.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to={next ? `/learn/${next.id}` : '/learn'} className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg hover:bg-brand/90">
              {doneCount === 0 ? 'Start the learning path' : next ? `Continue: ${next.title}` : 'Review the path'} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/tools/interactions" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold hover:bg-surface-2">Check an interaction</Link>
          </div>
        </div>
      </section>

      <section aria-label="Your progress" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="flex items-center gap-3 p-4">
          <ProgressRing value={doneCount / lessons.length} />
          <div><p className="text-sm font-semibold">{doneCount}/{lessons.length} modules</p><p className="text-xs text-muted">completed</p></div>
        </Card>
        <Link to="/quiz" className="card flex items-center gap-3 p-4 hover:border-brand/50">
          <ListChecks className="h-8 w-8 text-brand" aria-hidden />
          <div><p className="text-sm font-semibold">{answered.length ? `${Math.round(accuracy * 100)}%` : '—'} accuracy</p><p className="text-xs text-muted">{answered.length}/{questions.length} answered</p></div>
        </Link>
        <Link to="/flashcards" className="card flex items-center gap-3 p-4 hover:border-brand/50">
          <Sparkles className="h-8 w-8 text-brand" aria-hidden />
          <div><p className="text-sm font-semibold">{due} cards due</p><p className="text-xs text-muted">{Object.keys(cards).length}/{deck.length} studied</p></div>
        </Link>
        <Link to="/cases" className="card flex items-center gap-3 p-4 hover:border-brand/50">
          <Stethoscope className="h-8 w-8 text-brand" aria-hidden />
          <div><p className="text-sm font-semibold">{Object.keys(caseRec).length}/{cases.length} cases</p><p className="text-xs text-muted">completed</p></div>
        </Link>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-bold tracking-tight">The learning path</h2>
          <Link to="/learn" className="text-sm font-medium text-brand hover:underline">View all</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((l, i) => {
            const Icon = lessonIcons[l.icon];
            const tone = moduleTone[l.color];
            return (
              <Link key={l.id} to={`/learn/${l.id}`} className={cn('card group flex gap-3 p-4 transition-colors', tone.border)}>
                <div className={cn('h-fit rounded-xl p-2.5', tone.bg, tone.text)}><Icon className="h-5 w-5" aria-hidden /></div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-semibold group-hover:text-brand">
                    <span className="text-muted">{i}.</span> {l.title}
                    {lessonsDone[l.id] && <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-label="completed" />}
                  </p>
                  <p className="text-sm text-muted">{l.short}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold tracking-tight">Clinical tools</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.to} to={t.to} className="card group p-4 hover:border-brand/50">
              <t.icon className="mb-2 h-6 w-6 text-brand" aria-hidden />
              <p className="font-semibold group-hover:text-brand">{t.label}</p>
              <p className="text-sm text-muted">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-bold tracking-tight">What changed recently</h2>
          <Link to="/references" className="text-sm font-medium text-brand hover:underline">All updates & sources</Link>
        </div>
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {UPDATES.map((u) => (
              <li key={u.text} className="flex gap-4 px-5 py-3 text-sm">
                <span className="w-20 shrink-0 whitespace-nowrap font-medium text-brand">{u.date}</span>
                <span>{u.text}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="card flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center">
        <GraduationCap className="h-8 w-8 text-brand" aria-hidden />
        <div className="flex-1">
          <p className="font-semibold">How to use this to actually master it</p>
          <p className="text-sm text-muted">Read a module → answer its check questions → run its tools on your own scenarios → do the matching case → review flashcards daily. Repeat until every module is complete and accuracy exceeds 85%.</p>
        </div>
      </section>
    </div>
  );
}
