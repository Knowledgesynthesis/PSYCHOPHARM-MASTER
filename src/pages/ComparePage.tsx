import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GitCompare, X } from 'lucide-react';
import { allDrugs, getDrug } from '@/data/drugs';
import AgentPicker from '@/components/AgentPicker';
import { ProfileHeatmap } from '@/components/DrugViews';
import { Bullets, Callout, Card, PageHeader } from '@/components/ui';
import type { Drug } from '@/types';

const options = allDrugs.map((d) => ({ id: d.id, label: d.name, hint: d.className }));
const PRESETS: { label: string; ids: string[] }[] = [
  { label: 'First-line SSRIs', ids: ['sertraline', 'escitalopram', 'fluoxetine', 'paroxetine'] },
  { label: 'SGAs: metabolic vs EPS', ids: ['olanzapine', 'risperidone', 'aripiprazole', 'lurasidone'] },
  { label: 'Bipolar maintenance', ids: ['lithium', 'valproate', 'lamotrigine', 'quetiapine'] },
  { label: 'Insomnia', ids: ['zolpidem', 'eszopiclone', 'lemborexant', 'doxepin-low'] },
  { label: 'OUD', ids: ['buprenorphine', 'methadone', 'naltrexone'] },
  { label: 'ADHD', ids: ['methylphenidate', 'lisdexamfetamine', 'atomoxetine', 'guanfacine-er'] },
];

const ROWS: { label: string; render: (d: Drug) => React.ReactNode }[] = [
  { label: 'Class', render: (d) => d.className },
  { label: 'Mechanism', render: (d) => d.mechanism },
  { label: 'Half-life', render: (d) => d.halfLife },
  { label: 'Dosing', render: (d) => <span>Start {d.dosing.start}; target {d.dosing.target}; max {d.dosing.max}</span> },
  { label: 'Boxed warning', render: (d) => (d.boxed?.length ? <Bullets items={d.boxed} /> : '—') },
  { label: 'Serious adverse effects', render: (d) => <Bullets items={d.adverse.serious.slice(0, 4)} /> },
  { label: 'Monitoring', render: (d) => <Bullets items={d.monitoring.slice(0, 3)} /> },
  { label: 'Pregnancy', render: (d) => d.populations.pregnancy },
  { label: 'Key pearl', render: (d) => d.pearls[0] },
];

export default function ComparePage() {
  const [params, setParams] = useSearchParams();
  const ids = useMemo(() => (params.get('ids') ?? '').split(',').filter((id) => getDrug(id)).slice(0, 4), [params]);
  const drugs = ids.map((id) => getDrug(id)!);
  const setIds = (next: string[]) => setParams(next.length ? { ids: next.join(',') } : {}, { replace: true });

  return (
    <div>
      <PageHeader icon={GitCompare} eyebrow="Tool" title="Compare drugs" subtitle="Up to four medications side by side: side-effect heatmap plus the facts that drive selection." />
      <Card className="mb-5 space-y-3">
        {ids.length < 4 && <AgentPicker label="Add a drug" options={options} exclude={ids} onSelect={(id) => setIds([...ids, id])} placeholder="Add a drug to compare…" />}
        <div className="flex flex-wrap gap-2">
          {drugs.map((d) => (
            <span key={d.id} className="inline-flex items-center gap-1 rounded-full border border-brand/40 bg-brand/10 py-1 pl-3 pr-1 text-sm">{d.name}
              <button onClick={() => setIds(ids.filter((x) => x !== d.id))} className="rounded-full p-0.5 hover:bg-brand/20" aria-label={`Remove ${d.name}`}><X className="h-3.5 w-3.5" /></button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">{PRESETS.map((p) => <button key={p.label} className="chip text-xs" onClick={() => setIds(p.ids)}>{p.label}</button>)}</div>
      </Card>

      {drugs.length < 2 ? (
        <Callout tone="info" title="Pick at least two drugs, or choose a preset" />
      ) : (
        <div className="space-y-5">
          <Card className="p-3"><ProfileHeatmap drugs={drugs} /></Card>
          <div className="card scrollbar-thin overflow-x-auto p-0">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-surface-2 text-left">
                <tr><th className="w-36 px-4 py-2.5" />{drugs.map((d) => <th key={d.id} className="px-4 py-2.5"><Link to={`/drug/${d.id}`} className="font-semibold hover:text-brand">{d.name}</Link></th>)}</tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ROWS.map((r) => (
                  <tr key={r.label} className="align-top">
                    <th scope="row" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">{r.label}</th>
                    {drugs.map((d) => <td key={d.id} className="px-4 py-3">{r.render(d)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
