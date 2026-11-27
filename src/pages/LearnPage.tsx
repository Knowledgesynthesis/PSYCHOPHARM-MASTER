import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, GraduationCap } from 'lucide-react';
import { lessons } from '@/data/lessons';
import { questionsByModule } from '@/data/questions';
import { useProgress } from '@/store/progress';
import { PageHeader, ProgressRing } from '@/components/ui';
import { lessonIcons, moduleTone } from '@/components/nav';
import { cn } from '@/utils/cn';

export default function LearnPage() {
  const { lessonsDone, quiz, toggleLesson } = useProgress();
  const total = lessons.reduce((s, l) => s + l.minutes, 0);
  const done = lessons.filter((l) => lessonsDone[l.id]).length;

  return (
    <div>
      <PageHeader
        icon={GraduationCap}
        eyebrow={`${lessons.length} modules · ~${Math.round(total / 6) / 10} hours`}
        title="Learning path"
        subtitle="Work top to bottom. Foundations unlock everything else: once you can read a receptor profile and a CYP table, every drug becomes predictable."
        actions={<ProgressRing value={done / lessons.length} size={56} />}
      />
      <ol className="relative space-y-3 border-l border-line pl-6">
        {lessons.map((l, i) => {
          const Icon = lessonIcons[l.icon];
          const tone = moduleTone[l.color];
          const qs = questionsByModule(l.id);
          const answered = qs.filter((q) => quiz[q.id]);
          const correct = answered.filter((q) => quiz[q.id].last).length;
          const isDone = !!lessonsDone[l.id];
          return (
            <li key={l.id} className="relative">
              <span className={cn('absolute -left-[33px] top-5 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-bg', isDone ? 'border-emerald-500' : 'border-line')} aria-hidden>
                {isDone && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </span>
              <div className={cn('card flex flex-col gap-4 p-5 transition-colors sm:flex-row sm:items-center', tone.border)}>
                <div className={cn('h-fit w-fit rounded-xl p-3', tone.bg, tone.text)}><Icon className="h-6 w-6" aria-hidden /></div>
                <Link to={`/learn/${l.id}`} className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Module {i}</p>
                  <p className="text-lg font-semibold hover:text-brand">{l.title}</p>
                  <p className="text-sm text-muted">{l.short}</p>
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{l.minutes} min</span>
                    <span>{l.objectives.length} objectives</span>
                    <span>Quiz {answered.length ? `${correct}/${answered.length} correct` : `${qs.length} questions`}</span>
                  </p>
                </Link>
                <button onClick={() => toggleLesson(l.id)} className={cn('inline-flex items-center gap-2 self-start rounded-xl border px-3 py-2 text-sm sm:self-center', isDone ? 'border-emerald-500/50 text-emerald-700 dark:text-emerald-300' : 'border-line text-muted hover:text-fg')} aria-pressed={isDone}>
                  {isDone ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : <Circle className="h-4 w-4" aria-hidden />}
                  {isDone ? 'Completed' : 'Mark complete'}
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
