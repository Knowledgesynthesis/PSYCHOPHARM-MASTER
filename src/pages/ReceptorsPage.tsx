import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Network, Shuffle, Eye } from 'lucide-react';
import type { Drug, Receptor } from '@/types';
import { allDrugs } from '@/data/drugs';
import { RECEPTORS, receptorInfo, DOPAMINE_PATHWAYS } from '@/data/receptors';
import { parseRx } from '@/lib/receptors';
import SynapseDiagram from '@/components/SynapseDiagram';
import { MECHANISMS, type Mechanism } from '@/data/mechanisms';
import { Bullets, Card, PageHeader, RefList, SectionTitle, Segmented } from '@/components/ui';
import { cn } from '@/utils/cn';
import { seededShuffle } from '@/lib/quiz';

const withRx = allDrugs.filter((d) => d.receptors && Object.keys(d.receptors).length >= 2);
const cellColor = ['', 'bg-brand/15', 'bg-brand/35', 'bg-brand/60', 'bg-brand/90 text-brand-fg'];

function Heatmap({ drugs, onPick, active }: { drugs: Drug[]; onPick: (r: Receptor) => void; active: Receptor }) {
  return (
    <div className="scrollbar-thin overflow-x-auto">
      <table className="w-full min-w-[720px] border-separate border-spacing-0.5 text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-surface p-1 text-left font-medium text-muted">Drug</th>
            {RECEPTORS.map((r) => (
              <th key={r} className="p-1"><button onClick={() => onPick(r)} className={cn('rounded px-1.5 py-0.5 font-semibold', active === r ? 'bg-brand text-brand-fg' : 'text-muted hover:text-fg')}>{r}</button></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {drugs.map((d) => (
            <tr key={d.id}>
              <th scope="row" className="sticky left-0 z-10 bg-surface p-1 text-left"><Link to={`/drug/${d.id}`} className="whitespace-nowrap font-medium hover:text-brand">{d.name}</Link></th>
              {RECEPTORS.map((r) => {
                const v = d.receptors?.[r];
                const p = v ? parseRx(r, v) : null;
                return (
                  <td key={r} title={p ? `${r}: ${p.action} (${p.affinity}/4)` : `${r}: negligible`} className={cn('h-7 min-w-[34px] rounded text-center font-semibold', p ? cellColor[p.affinity] : 'bg-surface-2')}>
                    {p ? (p.action === 'partial agonist' ? 'P' : p.action === 'agonist' ? 'A' : '') : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[11px] text-muted">Darker = higher relative affinity (approximate, from PDSP Ki data and Stahl). P = partial agonist, A = agonist; unlabeled = antagonist/inhibitor. Click a receptor to see its clinical meaning.</p>
    </div>
  );
}

function PredictGame() {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const { target, choices } = useMemo(() => {
    const pool = seededShuffle(withRx, 7919 * (round + 1) + Date.now() % 1000);
    const t = pool[0];
    return { target: t, choices: seededShuffle([t, ...pool.slice(1, 4)], round + 3) };
  }, [round]);
  const rx = Object.entries(target.receptors ?? {}).sort((a, b) => Number(b[1]![0]) - Number(a[1]![0]));
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Which drug has this receptor profile?</p>
        <button className="inline-flex items-center gap-1 text-sm text-brand hover:underline" onClick={() => { setRound((r) => r + 1); setPicked(null); }}><Shuffle className="h-4 w-4" aria-hidden />New</button>
      </div>
      <ul className="space-y-1.5">
        {rx.map(([r, v]) => {
          const p = parseRx(r as Receptor, v!);
          return (
            <li key={r} className="flex items-center gap-3 text-sm">
              <span className="w-14 font-semibold">{r}</span>
              <div className="flex flex-1 gap-1" aria-hidden>{[1, 2, 3, 4].map((i) => <span key={i} className={cn('h-2 flex-1 rounded-full', i <= p.affinity ? 'bg-brand' : 'bg-surface-2')} />)}</div>
              <span className="w-28 text-right text-xs text-muted">{p.action}</span>
            </li>
          );
        })}
      </ul>
      <div className="grid gap-2 sm:grid-cols-2">
        {choices.map((c) => (
          <button key={c.id} disabled={!!picked} onClick={() => setPicked(c.id)} className={cn('rounded-xl border p-3 text-left text-sm', !picked && 'hover:border-brand/60', picked && c.id === target.id && 'border-emerald-500/60 bg-emerald-500/10', picked === c.id && c.id !== target.id && 'border-red-500/60 bg-red-500/10')}>
            {c.name} <span className="text-xs text-muted">· {c.className}</span>
          </button>
        ))}
      </div>
      {picked && (
        <p className="animate-fade-in rounded-lg bg-surface-2 p-3 text-sm">
          <span className="font-semibold">{picked === target.id ? 'Correct.' : `It was ${target.name}.`}</span> Predicted effects: {rx.slice(0, 3).map(([r, v]) => {
            const p = parseRx(r as Receptor, v!);
            const info = receptorInfo[r as Receptor];
            return p.action === 'antagonist' || p.action === 'inhibitor' ? [...info.block.harm.slice(0, 1), ...info.block.benefit.slice(0, 1)].join(', ') : info.agonism?.split(':')[0];
          }).filter(Boolean).join('; ')}.
        </p>
      )}
    </Card>
  );
}

export default function ReceptorsPage() {
  const [mech, setMech] = useState<Mechanism>('reuptake');
  const [rec, setRec] = useState<Receptor>('H1');
  const [filter, setFilter] = useState<'all' | 'antidepressants' | 'antipsychotics'>('antipsychotics');
  const m = MECHANISMS.find((x) => x.id === mech)!;
  const info = receptorInfo[rec];
  const drugs = withRx.filter((d) => filter === 'all' || d.module === filter);
  const strongest = withRx
    .map((d) => ({ d, v: d.receptors?.[rec] }))
    .filter((x) => x.v && Number(x.v[0]) >= 3)
    .sort((a, b) => Number(b.v![0]) - Number(a.v![0]))
    .slice(0, 8);

  return (
    <div className="space-y-8">
      <PageHeader icon={Network} eyebrow="Tool" title="Receptor explorer" subtitle="Mechanism → receptor → clinical effect. Learn a dozen receptors and you can predict most of a drug's benefits and side effects before you read its label." />

      <section>
        <SectionTitle>How drugs act at the synapse</SectionTitle>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <Card className="p-3"><SynapseDiagram mechanism={mech} /></Card>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {MECHANISMS.map((x) => <button key={x.id} className={cn('chip text-xs', mech === x.id && 'chip-on')} aria-pressed={mech === x.id} onClick={() => setMech(x.id)}>{x.label}</button>)}
            </div>
            <Card className="space-y-2">
              <p className="text-lg font-semibold">{m.label}</p>
              <p className="text-sm leading-relaxed">{m.text}</p>
              <p className="text-sm"><span className="font-medium text-muted">Examples: </span>{m.examples}</p>
            </Card>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle aside={<Segmented label="Filter" value={filter} onChange={setFilter} options={[{ value: 'antipsychotics', label: 'Antipsychotics' }, { value: 'antidepressants', label: 'Antidepressants' }, { value: 'all', label: 'All' }]} />}>Receptor heatmap</SectionTitle>
        <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
          <Card className="p-3"><Heatmap drugs={drugs} onPick={setRec} active={rec} /></Card>
          <Card className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{info.family}</p>
            <p className="text-lg font-semibold">{rec} — {info.label}</p>
            {info.block.benefit.length > 0 && <div><p className="mb-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">Blocking it helps</p><Bullets items={info.block.benefit} /></div>}
            {info.block.harm.length > 0 && <div><p className="mb-1 text-sm font-medium text-red-600 dark:text-red-400">Blocking it harms</p><Bullets items={info.block.harm} /></div>}
            {info.agonism && <p className="rounded-lg bg-surface-2 p-2.5 text-sm">{info.agonism}</p>}
            {strongest.length > 0 && (
              <div><p className="mb-1 text-sm font-medium">Strongest actions</p>
                <div className="flex flex-wrap gap-1.5">{strongest.map(({ d }) => <Link key={d.id} to={`/drug/${d.id}`} className="chip text-xs">{d.name}</Link>)}</div>
              </div>
            )}
          </Card>
        </div>
      </section>

      <section>
        <SectionTitle>Practice: predict the drug</SectionTitle>
        <PredictGame />
      </section>

      <section>
        <SectionTitle><span className="inline-flex items-center gap-2"><Eye className="h-5 w-5 text-brand" aria-hidden />The four dopamine pathways</span></SectionTitle>
        <div className="grid gap-3 md:grid-cols-2">
          {DOPAMINE_PATHWAYS.map((p) => (
            <Card key={p.name} className="p-4">
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-muted">{p.from} · {p.role}</p>
              <p className="mt-2 text-sm"><span className="font-medium">D2 blockade: </span>{p.block}</p>
            </Card>
          ))}
        </div>
      </section>
      <RefList ids={['stahl-5', 'pdsp', 'huhn-2019']} />
    </div>
  );
}
