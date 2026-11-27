import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, Target, AlertTriangle, ListChecks, Sparkles, Wrench } from 'lucide-react';
import type { ModuleId } from '@/types';
import { lessonMap, lessons } from '@/data/lessons';
import { drugsForModule, drugMap } from '@/data/drugs';
import { questionsByModule } from '@/data/questions';
import { cases } from '@/data/cases';
import { useProgress } from '@/store/progress';
import { Bullets, Callout, Card, RefList, SectionTitle } from '@/components/ui';
import { DrugTile, ProfileHeatmap } from '@/components/DrugViews';
import MCQ from '@/components/MCQ';
import { lessonIcons, moduleTone } from '@/components/nav';
import { cn } from '@/utils/cn';
import NotFoundPage from './NotFoundPage';

export default function LessonPage() {
  const { moduleId } = useParams();
  const lesson = lessonMap[moduleId as ModuleId];
  const { lessonsDone, toggleLesson, recordAnswer } = useProgress();
  const [seed] = useState(() => Math.floor(Math.random() * 1e9));
  const check = useMemo(() => (lesson ? questionsByModule(lesson.id).slice(0, 5) : []), [lesson]);
  if (!lesson) return <NotFoundPage />;

  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];
  const Icon = lessonIcons[lesson.icon];
  const tone = moduleTone[lesson.color];
  const drugs = drugsForModule(lesson.id);
  const compare = (lesson.compareIds ?? []).map((id) => drugMap[id]).filter(Boolean);
  const moduleCases = cases.filter((c) => c.module === lesson.id);
  const isDone = !!lessonsDone[lesson.id];

  const toc = [
    ['objectives', 'Objectives'], ['concepts', 'Core concepts'], lesson.algorithm && ['algorithm', 'Decision path'], lesson.table && ['table', 'Reference table'],
    compare.length && ['compare', 'Side-effect heatmap'], drugs.length && ['drugs', 'Drugs'], ['pitfalls', 'Pitfalls'], ['check', 'Check yourself'],
  ].filter(Boolean) as [string, string][];

  return (
    <article className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-8">
      <div className="min-w-0 space-y-8">
        <header className="space-y-4">
          <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"><ArrowLeft className="h-4 w-4" aria-hidden />Learning path</Link>
          <div className="flex items-start gap-3">
            <div className={cn('rounded-xl p-3', tone.bg, tone.text)}><Icon className="h-7 w-7" aria-hidden /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Module {idx}</p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{lesson.title}</h1>
              <p className="text-muted">{lesson.short}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted"><Clock className="h-3.5 w-3.5" aria-hidden />{lesson.minutes} min</p>
            </div>
          </div>
        </header>

        <section aria-labelledby="objectives">
          <SectionTitle id="objectives">By the end you can</SectionTitle>
          <Card className="p-4">
            <ul className="grid gap-2 sm:grid-cols-2">
              {lesson.objectives.map((o) => <li key={o} className="flex gap-2 text-sm"><Target className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />{o}</li>)}
            </ul>
          </Card>
        </section>

        <section aria-labelledby="concepts">
          <SectionTitle id="concepts">Core concepts</SectionTitle>
          <div className="grid gap-3 md:grid-cols-2">
            {lesson.concepts.map((c, i) => (
              <Card key={c.title} className="space-y-2 p-4">
                <p className="font-semibold"><span className="mr-1.5 text-brand">{i + 1}.</span>{c.title}</p>
                <p className="text-sm leading-relaxed text-fg/90">{c.body}</p>
                {c.bullets && <Bullets items={c.bullets} />}
              </Card>
            ))}
          </div>
        </section>

        {lesson.algorithm && (
          <section aria-labelledby="algorithm">
            <SectionTitle id="algorithm">{lesson.algorithm.title}</SectionTitle>
            <Card className="p-4">
              <ol className="space-y-0">
                {lesson.algorithm.steps.map((s, i) => (
                  <li key={s} className="relative flex gap-3 pb-4 last:pb-0">
                    {i < lesson.algorithm!.steps.length - 1 && <span className="absolute left-[13px] top-7 h-[calc(100%-20px)] w-px bg-line" aria-hidden />}
                    <span className="z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{i + 1}</span>
                    <span className="pt-1 text-sm">{s}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </section>
        )}

        {lesson.table && (
          <section aria-labelledby="table">
            <SectionTitle id="table">{lesson.table.title}</SectionTitle>
            <div className="card scrollbar-thin overflow-x-auto p-0">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-surface-2 text-left">
                  <tr>{lesson.table.columns.map((c) => <th key={c} className="px-4 py-2.5 font-semibold">{c}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {lesson.table.rows.map((r, i) => (
                    <tr key={i} className="align-top">{r.map((cell, j) => <td key={j} className={cn('px-4 py-2.5', j === 0 && 'font-medium')}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
            {lesson.table.note && <p className="mt-1 text-xs text-muted">{lesson.table.note}</p>}
          </section>
        )}

        {compare.length > 0 && (
          <section aria-labelledby="compare">
            <SectionTitle id="compare" aside={<Link to={`/compare?ids=${compare.slice(0, 4).map((d) => d.id).join(',')}`} className="text-sm font-medium text-brand hover:underline">Open in Compare</Link>}>Side-effect heatmap</SectionTitle>
            <Card className="p-3"><ProfileHeatmap drugs={compare} /></Card>
          </section>
        )}

        {drugs.length > 0 && (
          <section aria-labelledby="drugs">
            <SectionTitle id="drugs">Drugs in this module ({drugs.length})</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{drugs.map((d) => <DrugTile key={d.id} drug={d} />)}</div>
          </section>
        )}

        <section aria-labelledby="pitfalls">
          <SectionTitle id="pitfalls">Pitfalls that cause harm</SectionTitle>
          <Card className="border-amber-500/30 p-4">
            <ul className="space-y-2">
              {lesson.pitfalls.map((p) => <li key={p} className="flex gap-2 text-sm"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />{p}</li>)}
            </ul>
          </Card>
        </section>

        <section aria-labelledby="check">
          <SectionTitle id="check" aside={<Link to={`/quiz?module=${lesson.id}`} className="text-sm font-medium text-brand hover:underline">All {questionsByModule(lesson.id).length} questions</Link>}>Check yourself</SectionTitle>
          <div className="space-y-4">
            {check.map((q, i) => (
              <Card key={q.id}><MCQ question={q} seed={seed} number={`${i + 1}.`} onAnswer={(ok) => recordAnswer(q.id, ok)} /></Card>
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <Link to={`/flashcards?module=${lesson.id}`} className="card flex items-center gap-3 p-4 hover:border-brand/50"><Sparkles className="h-5 w-5 text-brand" aria-hidden /><span className="text-sm font-medium">Flashcards for this module</span></Link>
          {moduleCases.map((c) => <Link key={c.id} to={`/cases/${c.id}`} className="card flex items-center gap-3 p-4 hover:border-brand/50"><ListChecks className="h-5 w-5 text-brand" aria-hidden /><span className="text-sm font-medium">Case: {c.title}</span></Link>)}
          {(lesson.toolLinks ?? []).map((t) => <Link key={t.to} to={t.to} className="card flex items-center gap-3 p-4 hover:border-brand/50"><Wrench className="h-5 w-5 text-brand" aria-hidden /><span className="text-sm font-medium">{t.label}</span></Link>)}
        </section>

        <RefList ids={lesson.refs} />

        <Callout tone={isDone ? 'success' : 'info'} title={isDone ? 'Module completed' : 'Finished the module?'}>
          <div className="mt-2 flex flex-wrap gap-2">
            <button onClick={() => toggleLesson(lesson.id)} className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm hover:bg-surface-2" aria-pressed={isDone}>
              {isDone ? <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden /> : <Circle className="h-4 w-4" aria-hidden />}
              {isDone ? 'Marked complete' : 'Mark as complete'}
            </button>
          </div>
        </Callout>

        <nav className="flex justify-between gap-3" aria-label="Module navigation">
          {prev ? <Link to={`/learn/${prev.id}`} className="card flex items-center gap-2 p-3 text-sm hover:border-brand/50"><ArrowLeft className="h-4 w-4" aria-hidden />{prev.title}</Link> : <span />}
          {next && <Link to={`/learn/${next.id}`} className="card ml-auto flex items-center gap-2 p-3 text-sm font-medium hover:border-brand/50">{next.title}<ArrowRight className="h-4 w-4" aria-hidden /></Link>}
        </nav>
      </div>

      <aside className="hidden lg:block">
        <nav className="sticky top-20 space-y-1 text-sm" aria-label="On this page">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">On this page</p>
          {toc.map(([id, label]) => <a key={id} href={`#${id}`} className="block rounded px-2 py-1 text-muted hover:bg-surface-2 hover:text-fg">{label}</a>)}
        </nav>
      </aside>
    </article>
  );
}
