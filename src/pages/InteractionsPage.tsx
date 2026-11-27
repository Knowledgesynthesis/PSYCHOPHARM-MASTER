import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Combine, X, CheckCircle2, Zap } from 'lucide-react';
import type { Severity } from '@/types';
import { allDrugs } from '@/data/drugs';
import { coMeds } from '@/data/coMeds';
import { agentById, checkByIds, SEVERITY_MEANING, SEVERITY_RANK } from '@/lib/interactions';
import AgentPicker, { type PickerOption } from '@/components/AgentPicker';
import { Badge, Callout, Card, PageHeader, RefList, SeverityBadge } from '@/components/ui';
import { cn } from '@/utils/cn';

const options: PickerOption[] = [
  ...allDrugs.map((d) => ({ id: d.id, label: d.name, hint: d.className })),
  ...coMeds.map((c) => ({ id: c.id, label: c.name, hint: c.category })),
];

const PRESETS: { label: string; ids: string[] }[] = [
  { label: 'SSRI + tramadol', ids: ['sertraline', 'tramadol'] },
  { label: 'Lithium + NSAID + ACE inhibitor', ids: ['lithium', 'nsaids', 'acei'] },
  { label: 'MAOI + decongestant', ids: ['phenelzine', 'pseudoephedrine'] },
  { label: 'Paroxetine + tamoxifen', ids: ['paroxetine', 'tamoxifen'] },
  { label: 'Methadone + citalopram + ondansetron', ids: ['methadone', 'citalopram', 'ondansetron'] },
  { label: 'Opioid + benzo + gabapentin', ids: ['oxycodone', 'alprazolam', 'gabapentin'] },
  { label: 'Clozapine + smoking + benztropine', ids: ['clozapine', 'tobacco', 'benztropine'] },
  { label: 'Valproate + lamotrigine + OCP', ids: ['valproate', 'lamotrigine', 'estrogen-contraceptive'] },
  { label: 'Linezolid + escitalopram', ids: ['linezolid', 'escitalopram'] },
];

const SEV_ORDER: Severity[] = ['contraindicated', 'major', 'moderate', 'minor'];
const sevBorder: Record<Severity, string> = { contraindicated: 'border-l-red-500', major: 'border-l-orange-500', moderate: 'border-l-amber-500', minor: 'border-l-slate-400' };

export default function InteractionsPage() {
  const [params, setParams] = useSearchParams();
  const ids = useMemo(() => (params.get('ids') ?? '').split(',').filter((x) => agentById(x)), [params]);
  const setIds = (next: string[]) => setParams(next.length ? { ids: next.join(',') } : {}, { replace: true });
  const findings = useMemo(() => checkByIds(ids), [ids]);
  const counts = SEV_ORDER.map((s) => [s, findings.filter((f) => f.severity === s).length] as const);

  return (
    <div>
      <PageHeader
        icon={Combine}
        eyebrow="Tool"
        title="Interaction checker"
        subtitle="Add psychotropics plus common co-medications, foods and smoking. The engine checks labeled contraindications, MAOI rules, serotonergic load, QTc, respiratory depression, anticholinergic burden, lithium clearance, bleeding, sodium, seizure threshold, dopamine conflicts and CYP/UGT pharmacokinetics."
      />

      <Card className="mb-5 space-y-4">
        <AgentPicker label="Add a drug" options={options} exclude={ids} onSelect={(id) => setIds([...ids, id])} placeholder="Add a drug, food or exposure (e.g., tramadol, grapefruit, smoking)…" />
        {ids.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ids.map((id) => (
              <span key={id} className="inline-flex items-center gap-1 rounded-full border border-brand/40 bg-brand/10 py-1 pl-3 pr-1 text-sm">
                {agentById(id)?.name}
                <button onClick={() => setIds(ids.filter((x) => x !== id))} className="rounded-full p-0.5 hover:bg-brand/20" aria-label={`Remove ${agentById(id)?.name}`}><X className="h-3.5 w-3.5" /></button>
              </span>
            ))}
            <button onClick={() => setIds([])} className="text-sm text-muted underline-offset-2 hover:underline">Clear</button>
          </div>
        )}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Try a classic</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => <button key={p.label} className="chip text-xs" onClick={() => setIds(p.ids)}><Zap className="h-3 w-3 text-brand" aria-hidden />{p.label}</button>)}
          </div>
        </div>
      </Card>

      {ids.length < 2 ? (
        <Callout tone="info" title="Add at least two agents">Interactions are evaluated across every pair and for cumulative effects (e.g., three QT-prolonging drugs).</Callout>
      ) : findings.length === 0 ? (
        <Callout tone="success" title="No interactions found by the engine">
          The rules found no clinically important pharmacodynamic or CYP/UGT interaction. Rare or transporter-mediated interactions may not be captured — check labeling for unusual combinations.
        </Callout>
      ) : (
        <div className="space-y-4" aria-live="polite">
          <div className="flex flex-wrap gap-2">
            {counts.filter(([, n]) => n).map(([s, n]) => <span key={s} className="inline-flex items-center gap-1.5 text-sm"><SeverityBadge severity={s} /> ×{n}</span>)}
          </div>
          {findings.map((f) => (
            <article key={f.key} className={cn('card border-l-4 p-4', sevBorder[f.severity])}>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <SeverityBadge severity={f.severity} />
                <h3 className="font-semibold">{f.title}</h3>
              </div>
              <div className="mb-2 flex flex-wrap gap-1">{f.agents.map((a) => <Badge key={a}>{a}</Badge>)}</div>
              <p className="text-sm leading-relaxed">{f.detail}</p>
              <p className="mt-2 flex gap-2 text-sm font-medium"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />{f.action}</p>
            </article>
          ))}
        </div>
      )}

      <Card className="mt-6 space-y-2 p-4">
        <p className="text-sm font-semibold">Severity scale</p>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {[...SEV_ORDER].sort((a, b) => SEVERITY_RANK[b] - SEVERITY_RANK[a]).map((s) => <li key={s} className="flex items-center gap-2"><SeverityBadge severity={s} /><span className="text-muted">{SEVERITY_MEANING[s]}</span></li>)}
        </ul>
        <p className="pt-1 text-xs text-muted">Want the mechanisms behind these rules? See <Link to="/learn/foundations" className="text-brand hover:underline">Foundations</Link>.</p>
      </Card>
      <RefList className="mt-4" ids={['fda-ddi-table', 'crediblemeds', 'fda-opioid-benzo-2016', 'boyer-2005', 'gillman-2018', 'fda-label']} />
    </div>
  );
}
