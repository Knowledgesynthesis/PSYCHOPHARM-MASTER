import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Siren, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { SIGNS, SYNDROMES, COMPARISON_TABLE, rankSyndromes, type Sign } from '@/data/toxidromes';
import { hunterCriteria, type HunterInput } from '@/lib/calculators';
import { Badge, Bullets, Callout, Card, PageHeader, RefList, Segmented } from '@/components/ui';
import { cn } from '@/utils/cn';

type Tab = 'recognize' | 'hunter' | 'compare' | 'reference';
const urgencyTone = { emergency: 'red', urgent: 'orange', routine: 'neutral' } as const;
const signLabel = Object.fromEntries(SIGNS.map((s) => [s.id, s.label]));
const groups = SIGNS.reduce<Record<string, Sign[]>>((acc, s) => ((acc[s.group] ??= []).push(s), acc), {});

function Recognizer() {
  const [sel, setSel] = useState<string[]>([]);
  const ranked = useMemo(() => rankSyndromes(sel), [sel]);
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Select the findings</p>
          <button className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg" onClick={() => setSel([])}><RotateCcw className="h-3.5 w-3.5" aria-hidden />Reset</button>
        </div>
        {Object.entries(groups).map(([g, signs]) => (
          <fieldset key={g}>
            <legend className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{g}</legend>
            <div className="flex flex-wrap gap-1.5">
              {signs.map((s) => <button key={s.id} className={cn('chip text-xs', sel.includes(s.id) && 'chip-on')} aria-pressed={sel.includes(s.id)} onClick={() => toggle(s.id)}>{s.label}</button>)}
            </div>
          </fieldset>
        ))}
        {sel.length > 0 && ranked.length > 0 && (
          <a href="#differential" className="block rounded-xl bg-brand px-4 py-2.5 text-center text-sm font-semibold text-brand-fg lg:hidden">View differential: {ranked[0].syndrome.name} leads</a>
        )}
      </Card>
      <div id="differential" className="scroll-mt-20 space-y-3" aria-live="polite">
        {sel.length === 0 && <Callout tone="info" title="Ranked differential appears here">Findings that argue against a syndrome (e.g., dry skin against serotonin syndrome) lower its rank.</Callout>}
        {sel.length > 0 && ranked.length === 0 && <Callout tone="warn" title="No pattern matched">Consider non-drug causes (sepsis, CNS infection, thyroid storm, heat stroke, withdrawal from other agents).</Callout>}
        {ranked.slice(0, 5).map((r, i) => (
          <details key={r.syndrome.id} open={i === 0} className="card group p-4">
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-muted">{i + 1}</span>
              <span className="font-semibold">{r.syndrome.name}</span>
              <Badge tone={urgencyTone[r.syndrome.urgency]}>{r.syndrome.urgency}</Badge>
              <span className="ml-auto text-xs text-muted">pattern match {r.pct}%</span>
            </summary>
            <div className="mt-3 space-y-3 text-sm">
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-brand" style={{ width: `${r.pct}%` }} /></div>
              <div className="flex flex-wrap gap-1">
                {r.matched.map((m) => <Badge key={m} tone="green"><CheckCircle2 className="h-3 w-3" aria-hidden />{signLabel[m]}</Badge>)}
                {r.against.map((m) => <Badge key={m} tone="red"><XCircle className="h-3 w-3" aria-hidden />{signLabel[m]}</Badge>)}
              </div>
              <p><span className="font-medium">Onset:</span> {r.syndrome.onset}</p>
              <div><p className="mb-1 font-medium">Hallmarks</p><Bullets items={r.syndrome.hallmarks} /></div>
              <div><p className="mb-1 font-medium">Management</p><Bullets items={r.syndrome.management} /></div>
              <p className="rounded-lg bg-brand/5 p-2.5"><span className="font-semibold text-brand">Pearl: </span>{r.syndrome.pearl}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

const HUNTER_FIELDS: [keyof HunterInput, string][] = [
  ['serotonergic', 'Exposure to a serotonergic agent'], ['spontaneousClonus', 'Spontaneous clonus'], ['inducibleClonus', 'Inducible clonus'], ['ocularClonus', 'Ocular clonus'],
  ['agitation', 'Agitation'], ['diaphoresis', 'Diaphoresis'], ['tremor', 'Tremor'], ['hyperreflexia', 'Hyperreflexia'], ['hypertonia', 'Hypertonia'], ['tempOver38', 'Temperature >38 °C'],
];

function Hunter() {
  const [h, setH] = useState<HunterInput>(() => Object.fromEntries(HUNTER_FIELDS.map(([k]) => [k, k === 'serotonergic'])) as unknown as HunterInput);
  const res = hunterCriteria(h);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card className="space-y-2">
        <p className="mb-1 font-semibold">Hunter Serotonin Toxicity Criteria</p>
        {HUNTER_FIELDS.map(([k, label]) => (
          <label key={k} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-2">
            <input type="checkbox" className="h-4 w-4 accent-[hsl(var(--brand))]" checked={h[k]} onChange={(e) => setH({ ...h, [k]: e.target.checked })} />
            {label}
          </label>
        ))}
      </Card>
      <div className="space-y-3">
        <Callout tone={res.met ? 'danger' : 'info'} title={res.met ? 'Hunter criteria MET — serotonin toxicity' : 'Criteria not met'}>
          {res.rule ?? 'Serotonergic exposure plus one of the five rule combinations is required.'}
        </Callout>
        <Card className="text-sm">
          <p className="mb-2 font-semibold">Decision rules (any one, with serotonergic exposure)</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Spontaneous clonus</li>
            <li>Inducible clonus + agitation or diaphoresis</li>
            <li>Ocular clonus + agitation or diaphoresis</li>
            <li>Tremor + hyperreflexia</li>
            <li>Hypertonia + T &gt;38 °C + ocular or inducible clonus</li>
          </ol>
          <p className="mt-3 text-muted">Sensitivity 84%, specificity 97% vs. toxicologist diagnosis (Dunkley 2003). More specific than the Sternbach criteria.</p>
        </Card>
      </div>
    </div>
  );
}

export default function EmergenciesPage() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as Tab) ?? 'recognize';
  return (
    <div>
      <PageHeader icon={Siren} eyebrow="Tool" title="Emergency recognizer" subtitle="Pattern-match bedside findings to drug-induced emergencies, apply the Hunter criteria, and review first-line management." />
      <div className="mb-5">
        <Segmented label="Section" value={tab} onChange={(v) => setParams({ tab: v }, { replace: true })} options={[{ value: 'recognize', label: 'Recognizer' }, { value: 'hunter', label: 'Hunter criteria' }, { value: 'compare', label: 'Compare syndromes' }, { value: 'reference', label: 'All syndromes' }]} />
      </div>
      {tab === 'recognize' && <Recognizer />}
      {tab === 'hunter' && <Hunter />}
      {tab === 'compare' && (
        <div className="card scrollbar-thin overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-surface-2 text-left"><tr>{COMPARISON_TABLE.columns.map((c) => <th key={c} className="px-3 py-2.5 font-semibold">{c}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">{COMPARISON_TABLE.rows.map((r) => <tr key={r[0]} className="align-top">{r.map((c, i) => <td key={i} className={cn('px-3 py-2.5', i === 0 && 'font-medium')}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
      {tab === 'reference' && (
        <div className="grid gap-3 md:grid-cols-2">
          {SYNDROMES.map((s) => (
            <details key={s.id} className="card p-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold">{s.name}<Badge tone={urgencyTone[s.urgency]} className="ml-auto">{s.urgency}</Badge></summary>
              <div className="mt-3 space-y-3 text-sm">
                <p><span className="font-medium">Onset:</span> {s.onset}</p>
                <div><p className="mb-1 font-medium">Causes</p><Bullets items={s.causes} /></div>
                <div><p className="mb-1 font-medium">Hallmarks</p><Bullets items={s.hallmarks} /></div>
                <div><p className="mb-1 font-medium">Management</p><Bullets items={s.management} /></div>
                <p className="rounded-lg bg-brand/5 p-2.5"><span className="font-semibold text-brand">Pearl: </span>{s.pearl}</p>
              </div>
            </details>
          ))}
        </div>
      )}
      <RefList className="mt-6" ids={['hunter-2003', 'boyer-2005', 'nms-2011', 'extrip-2015', 'asam-aws-2020', 'goldfrank-11']} />
    </div>
  );
}
