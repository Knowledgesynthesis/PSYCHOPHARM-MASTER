import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Repeat, AlertTriangle, Activity, ArrowLeftRight, Timer } from 'lucide-react';
import { allDrugs, getDrug } from '@/data/drugs';
import { planSwitch, switchableModules, type SwitchStrategy } from '@/lib/switching';
import AgentPicker from '@/components/AgentPicker';
import { Badge, Bullets, Callout, Card, PageHeader, RefList, SectionTitle } from '@/components/ui';

const options = allDrugs
  .filter((d) => (switchableModules as readonly string[]).includes(d.module) && !['VMAT2', 'anticholinergic'].includes(d.cls))
  .map((d) => ({ id: d.id, label: d.name, hint: d.className }));

const PRESETS: [string, string][] = [
  ['fluoxetine', 'phenelzine'], ['sertraline', 'escitalopram'], ['venlafaxine', 'sertraline'], ['olanzapine', 'aripiprazole'],
  ['risperidone', 'clozapine'], ['valproate', 'lamotrigine'], ['alprazolam', 'clonazepam'], ['methadone', 'buprenorphine'], ['methylphenidate', 'atomoxetine'],
];

const STRATEGY: Record<SwitchStrategy, { label: string; tone: 'red' | 'amber' | 'green' | 'violet' | 'brand' }> = {
  washout: { label: 'Washout required', tone: 'red' },
  'cross-taper': { label: 'Cross-taper', tone: 'amber' },
  direct: { label: 'Direct switch', tone: 'green' },
  'stop-wait-start': { label: 'Stop → wait → start', tone: 'violet' },
  'overlap-then-stop': { label: 'Overlap, then stop', tone: 'brand' },
  specialist: { label: 'Special situation', tone: 'violet' },
};

function Picker({ label, value, onChange, exclude }: { label: string; value?: string; onChange: (id: string) => void; exclude?: string }) {
  const d = getDrug(value);
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {d ? (
        <div className="flex items-center justify-between rounded-xl border border-brand/40 bg-brand/5 px-3 py-2.5">
          <div><p className="font-semibold">{d.name}</p><p className="text-xs text-muted">{d.className}</p></div>
          <button className="text-sm text-muted hover:text-fg" onClick={() => onChange('')}>Change</button>
        </div>
      ) : (
        <AgentPicker label={label} options={options} exclude={exclude ? [exclude] : []} onSelect={onChange} placeholder="Search medications…" />
      )}
    </div>
  );
}

export default function SwitchingPage() {
  const [params, setParams] = useSearchParams();
  const from = params.get('from') ?? '';
  const to = params.get('to') ?? '';
  const set = (k: 'from' | 'to', v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next, { replace: true });
  };
  const a = getDrug(from);
  const b = getDrug(to);
  const plan = useMemo(() => (a && b ? planSwitch(a, b) : null), [a, b]);

  return (
    <div>
      <PageHeader icon={Repeat} eyebrow="Tool" title="Switching planner" subtitle="Drug-to-drug plans using label washouts (MAOIs), pharmacokinetics (half-life, CYP inhibition) and receptor pharmacology (partial agonists, cholinergic rebound). Interaction checks for the overlap period are included automatically." />

      <Card className="mb-5 space-y-4">
        <div className="grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
          <Picker label="Current medication (A)" value={from} onChange={(v) => set('from', v)} exclude={to} />
          <button className="hidden h-11 w-11 items-center justify-center self-end rounded-xl border border-line hover:bg-surface-2 md:flex" onClick={() => { const n = new URLSearchParams(); if (to) n.set('from', to); if (from) n.set('to', from); setParams(n, { replace: true }); }} aria-label="Swap A and B"><ArrowLeftRight className="h-4 w-4" /></button>
          <Picker label="New medication (B)" value={to} onChange={(v) => set('to', v)} exclude={from} />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Common switches</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(([x, y]) => (
              <button key={x + y} className="chip text-xs" onClick={() => setParams({ from: x, to: y }, { replace: true })}>{getDrug(x)?.name} <ArrowRight className="h-3 w-3" aria-hidden /> {getDrug(y)?.name}</button>
            ))}
          </div>
        </div>
      </Card>

      {!plan ? (
        <Callout tone="info" title="Choose two medications">Every combination returns a plan; MAOI, fluoxetine, clozapine, partial-agonist, benzodiazepine, lamotrigine and opioid switches use dedicated rules.</Callout>
      ) : (
        <div className="space-y-5" aria-live="polite">
          <Card className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={STRATEGY[plan.strategy].tone}>{STRATEGY[plan.strategy].label}</Badge>
              {plan.washoutDays !== undefined && <Badge tone="red"><Timer className="h-3 w-3" aria-hidden />{plan.washoutDays} days drug-free</Badge>}
            </div>
            <h2 className="text-xl font-bold">{a!.name} → {b!.name}: {plan.headline}</h2>
            <p className="text-sm leading-relaxed text-fg/90">{plan.rationale}</p>
          </Card>

          {plan.phases.length > 0 && (
            <Card>
              <SectionTitle>Timeline</SectionTitle>
              <div className="mb-3 flex gap-4 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-slate-400" />{a!.name} (% of current dose)</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-brand" />{b!.name} (% of target)</span>
              </div>
              <ol className="space-y-4">
                {plan.phases.map((p, i) => (
                  <li key={i} className="grid gap-2 sm:grid-cols-[120px_1fr]">
                    <p className="text-sm font-semibold">{p.label}</p>
                    <div className="space-y-1.5">
                      <div className="h-3 overflow-hidden rounded-full bg-surface-2" role="img" aria-label={`${a!.name} ${p.a}%`}><div className="h-full rounded-full bg-slate-400 transition-all" style={{ width: `${p.a}%` }} /></div>
                      <div className="h-3 overflow-hidden rounded-full bg-surface-2" role="img" aria-label={`${b!.name} ${p.b}%`}><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${p.b}%` }} /></div>
                      <p className="text-sm text-fg/90">{p.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-xs text-muted">Bars are schematic; adjust timing to tolerability, symptom severity and setting.</p>
            </Card>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {plan.cautions.length > 0 && (
              <Card>
                <SectionTitle><span className="inline-flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden />Cautions</span></SectionTitle>
                <Bullets items={plan.cautions} />
              </Card>
            )}
            <Card>
              <SectionTitle><span className="inline-flex items-center gap-2"><Activity className="h-5 w-5 text-brand" aria-hidden />Monitor</span></SectionTitle>
              <Bullets items={plan.monitoring} />
            </Card>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link className="chip" to={`/drug/${a!.id}`}>{a!.name} details</Link>
            <Link className="chip" to={`/drug/${b!.id}`}>{b!.name} details</Link>
            <Link className="chip" to={`/tools/interactions?ids=${a!.id},${b!.id}`}>Full interaction check</Link>
          </div>
        </div>
      )}
      <RefList className="mt-6" ids={['fda-label', 'maudsley-14', 'canmat-mdd-2023', 'apa-scz-2020', 'bzd-taper-2025', 'asam-oud-2020']} />
    </div>
  );
}
