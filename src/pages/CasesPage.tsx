import { Link } from 'react-router-dom';
import { Stethoscope, CheckCircle2 } from 'lucide-react';
import { cases } from '@/data/cases';
import { lessonMap } from '@/data/lessons';
import { useProgress } from '@/store/progress';
import { Badge, PageHeader } from '@/components/ui';

export default function CasesPage() {
  const rec = useProgress((s) => s.cases);
  return (
    <div>
      <PageHeader icon={Stethoscope} eyebrow={`${cases.length} synthetic cases`} title="Clinical cases" subtitle="Work through real-world decisions step by step. Every option — right or wrong — explains why." />
      <div className="grid gap-3 sm:grid-cols-2">
        {cases.map((c) => (
          <Link key={c.id} to={`/cases/${c.id}`} className="card group flex flex-col gap-2 p-5 hover:border-brand/50">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone="brand">{lessonMap[c.module].title}</Badge>
              <Badge>{['', 'Core', 'Applied', 'Advanced'][c.difficulty]}</Badge>
              <Badge>{c.steps.length} decisions</Badge>
              {rec[c.id] && <Badge tone="green"><CheckCircle2 className="h-3 w-3" aria-hidden />{rec[c.id].score}/{rec[c.id].total}</Badge>}
            </div>
            <p className="text-lg font-semibold group-hover:text-brand">{c.title}</p>
            <p className="line-clamp-3 text-sm text-muted">{c.vignette}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
