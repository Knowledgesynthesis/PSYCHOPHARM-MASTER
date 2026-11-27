import { useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import {
  BZD_EQUIV, LAMOTRIGINE_SCHEDULES, LITHIUM_TARGETS, CIWA_ITEMS, COWS_ITEMS, buildTaper, ciwaBand, computeQtc, convertBzd, cowsBand, interpretAnc, interpretLithium, interpretQtc,
  type AncPopulation, type LamotrigineRegimen, type LithiumContext, type ScaleItem,
} from '@/lib/calculators';
import { Badge, Bullets, Callout, Card, PageHeader, RefList, Segmented } from '@/components/ui';
import { cn } from '@/utils/cn';

type Tab = 'qtc' | 'lithium' | 'anc' | 'lamotrigine' | 'benzo' | 'ciwa' | 'cows';
const TABS: { value: Tab; label: string }[] = [
  { value: 'qtc', label: 'QTc' }, { value: 'lithium', label: 'Lithium level' }, { value: 'anc', label: 'Clozapine ANC' }, { value: 'lamotrigine', label: 'Lamotrigine' },
  { value: 'benzo', label: 'Benzo taper' }, { value: 'ciwa', label: 'CIWA-Ar' }, { value: 'cows', label: 'COWS' },
];

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted">{hint}</span>}
    </label>
  );
}
const num = (v: string, d = 0) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : d);

function Qtc() {
  const [qt, setQt] = useState('400');
  const [hr, setHr] = useState('90');
  const [sex, setSex] = useState<'male' | 'female'>('female');
  const valid = num(qt) > 200 && num(qt) < 800 && num(hr) >= 30 && num(hr) <= 220;
  const r = valid ? computeQtc(num(qt), num(hr)) : null;
  const preferred = r ? (num(hr) > 90 || num(hr) < 60 ? r.fridericia : r.bazett) : 0;
  const interp = r ? interpretQtc(preferred, sex) : null;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card className="space-y-4">
        <Field label="Measured QT (ms)"><input className="input" inputMode="numeric" value={qt} onChange={(e) => setQt(e.target.value)} /></Field>
        <Field label="Heart rate (bpm)"><input className="input" inputMode="numeric" value={hr} onChange={(e) => setHr(e.target.value)} /></Field>
        <Segmented label="Sex" value={sex} onChange={setSex} options={[{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }]} />
      </Card>
      <div className="space-y-3">
        {!r ? <Callout tone="warn" title="Enter a QT of 200–800 ms and HR of 30–220 bpm" /> : (
          <>
            <Card className="grid grid-cols-2 gap-3 text-center">
              {([['Bazett', r.bazett], ['Fridericia', r.fridericia], ['Framingham', r.framingham], ['Hodges', r.hodges]] as const).map(([k, v]) => (
                <div key={k} className={cn('rounded-xl bg-surface-2 p-3', ((k === 'Fridericia' && (num(hr) > 90 || num(hr) < 60)) || (k === 'Bazett' && num(hr) >= 60 && num(hr) <= 90)) && 'ring-2 ring-brand')}>
                  <p className="text-xs text-muted">{k}</p><p className="text-2xl font-bold">{v}</p><p className="text-xs text-muted">ms</p>
                </div>
              ))}
            </Card>
            <Callout tone={interp!.band === 'normal' ? 'success' : interp!.band === 'prolonged' ? 'warn' : 'danger'} title={`QTc ${preferred} ms`}>{interp!.text}</Callout>
            <p className="text-xs text-muted">Highlighted: Fridericia when HR &gt;90 or &lt;60 (Bazett over-corrects at high rates and under-corrects at low rates).</p>
          </>
        )}
      </div>
    </div>
  );
}

const SYMPTOMS: [keyof Parameters<typeof interpretLithium>[0]['symptoms'], string][] = [
  ['gi', 'Vomiting / diarrhea'], ['coarseTremor', 'Coarse tremor'], ['ataxia', 'Ataxia / dysarthria'], ['confusion', 'Confusion'],
  ['decreasedConsciousness', 'Decreased consciousness'], ['seizure', 'Seizure'], ['dysrhythmia', 'Life-threatening dysrhythmia'],
];

function Lithium() {
  const [level, setLevel] = useState('0.9');
  const [hours, setHours] = useState('12');
  const [ctx, setCtx] = useState<LithiumContext>('maintenance');
  const [kidney, setKidney] = useState(false);
  const [sym, setSym] = useState(() => Object.fromEntries(SYMPTOMS.map(([k]) => [k, false])) as Record<string, boolean>);
  const res = interpretLithium({ level: num(level), hoursSinceDose: num(hours, 12), context: ctx, impairedKidney: kidney, symptoms: sym as never });
  const tone = { low: 'info', target: 'success', above: 'warn', toxic: 'danger', severe: 'danger' } as const;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Serum lithium (mmol/L)"><input className="input" inputMode="decimal" value={level} onChange={(e) => setLevel(e.target.value)} /></Field>
          <Field label="Hours since last dose"><input className="input" inputMode="numeric" value={hours} onChange={(e) => setHours(e.target.value)} /></Field>
        </div>
        <Field label="Clinical context">
          <select className="input" value={ctx} onChange={(e) => setCtx(e.target.value as LithiumContext)}>
            {(Object.keys(LITHIUM_TARGETS) as LithiumContext[]).map((k) => <option key={k} value={k}>{LITHIUM_TARGETS[k][2]} — {LITHIUM_TARGETS[k][0]}–{LITHIUM_TARGETS[k][1]}</option>)}
          </select>
        </Field>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-4 w-4" checked={kidney} onChange={(e) => setKidney(e.target.checked)} />Impaired kidney function</label>
        <fieldset>
          <legend className="mb-1 text-sm font-medium">Symptoms</legend>
          <div className="grid gap-1 sm:grid-cols-2">
            {SYMPTOMS.map(([k, l]) => <label key={k} className="flex items-center gap-2 rounded-lg px-1 py-1 text-sm"><input type="checkbox" className="h-4 w-4" checked={sym[k]} onChange={(e) => setSym({ ...sym, [k]: e.target.checked })} />{l}</label>)}
          </div>
        </fieldset>
      </Card>
      <div className="space-y-3">
        <Callout tone={tone[res.band]} title={res.headline}><Bullets items={res.actions} /></Callout>
        {res.timingNote && <Callout tone="warn" title="Timing">{res.timingNote}</Callout>}
        {res.extrip && <Callout tone="danger" title={`EXTRIP: hemodialysis ${res.extrip.strength}`}><Bullets items={res.extrip.reasons} /></Callout>}
      </div>
    </div>
  );
}

function Anc() {
  const [anc, setAnc] = useState('1400');
  const [pop, setPop] = useState<AncPopulation>('general');
  const [months, setMonths] = useState('3');
  const r = interpretAnc(num(anc), pop, num(months));
  const tone = { normal: 'success', mild: 'warn', moderate: 'danger', severe: 'danger' } as const;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card className="space-y-4">
        <Field label="ANC (cells/µL)"><input className="input" inputMode="numeric" value={anc} onChange={(e) => setAnc(e.target.value)} /></Field>
        <Field label="Months on clozapine"><input className="input" inputMode="numeric" value={months} onChange={(e) => setMonths(e.target.value)} /></Field>
        <Segmented label="Population" value={pop} onChange={setPop} options={[{ value: 'general', label: 'General population' }, { value: 'ben', label: 'BEN / Duffy-null' }]} />
        <p className="text-xs text-muted">Benign ethnic neutropenia (Duffy-null–associated neutrophil count) is common in people of African and Middle Eastern ancestry; it uses lower thresholds and requires ≥2 baseline ANCs.</p>
      </Card>
      <div className="space-y-3">
        <Callout tone={tone[r.severity]} title={r.category}><p>{r.action}</p><p className="mt-2"><span className="font-medium">Monitoring: </span>{r.monitoring}</p></Callout>
        <Callout tone="info" title="2025 update">The clozapine REMS was removed (effective June 13, 2025): no enrollment or ANC reporting, but ANC monitoring per labeling continues. Any fever or infection → check ANC urgently.</Callout>
      </div>
    </div>
  );
}

function Lamotrigine() {
  const [reg, setReg] = useState<LamotrigineRegimen>('mono');
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card className="space-y-4">
        <p className="text-sm font-medium">Co-medication</p>
        <Segmented label="Regimen" value={reg} onChange={setReg} options={[{ value: 'mono', label: 'None / other' }, { value: 'valproate', label: 'With valproate' }, { value: 'inducer', label: 'With inducer' }]} />
        <ol className="divide-y divide-line">
          {LAMOTRIGINE_SCHEDULES[reg].map((s) => <li key={s.weeks} className="flex justify-between gap-3 py-2.5 text-sm"><span className="font-medium">{s.weeks}</span><span>{s.dose}</span></li>)}
        </ol>
        <p className="text-xs text-muted">Inducers: carbamazepine, phenytoin, phenobarbital, primidone, rifampin. Estrogen-containing contraceptives lower levels ~50% (higher maintenance doses may be needed).</p>
      </Card>
      <div className="space-y-3">
        <Callout tone="danger" title="Rash rules">Any rash during titration → stop unless clearly unrelated. Highest risk weeks 2–8, with valproate, rapid escalation and in children.</Callout>
        <Callout tone="warn" title="Restart rule">If ≥5 half-lives are missed (~5 days), re-titrate from week 1.</Callout>
        <Callout tone="info" title="Pregnancy">Clearance rises 2–3× — monitor and adjust; reduce promptly after delivery.</Callout>
      </div>
    </div>
  );
}

function Benzo() {
  const [drug, setDrug] = useState('alprazolam');
  const [dose, setDose] = useState('2');
  const [pct, setPct] = useState('10');
  const [weeks, setWeeks] = useState('2');
  const [target, setTarget] = useState('diazepam');
  const info = BZD_EQUIV.find((b) => b.id === drug)!;
  const steps = useMemo(() => (num(dose) > 0 ? buildTaper(num(dose), Math.min(25, Math.max(5, num(pct, 10))), Math.min(4, Math.max(2, num(weeks, 2))), info.step) : []), [dose, pct, weeks, info.step]);
  const conv = convertBzd(drug, num(dose), target);
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Current benzodiazepine">
              <select className="input" value={drug} onChange={(e) => setDrug(e.target.value)}>{BZD_EQUIV.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
            </Field>
            <Field label="Total daily dose (mg)"><input className="input" inputMode="decimal" value={dose} onChange={(e) => setDose(e.target.value)} /></Field>
            <Field label="Reduction per step (%)" hint="Guideline: start 5–10%; ≤25%"><input className="input" inputMode="numeric" value={pct} onChange={(e) => setPct(e.target.value)} /></Field>
            <Field label="Weeks per step" hint="Guideline: 2–4 weeks"><input className="input" inputMode="numeric" value={weeks} onChange={(e) => setWeeks(e.target.value)} /></Field>
          </div>
        </Card>
        <Card className="space-y-3">
          <p className="text-sm font-medium">Approximate equivalent</p>
          <div className="flex items-center gap-2">
            <span className="text-sm">{dose || 0} mg {info.name} ≈</span>
            <select className="input w-auto" value={target} onChange={(e) => setTarget(e.target.value)}>{BZD_EQUIV.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
          </div>
          <p className="text-3xl font-bold">{Number.isFinite(conv) ? +conv.toFixed(2) : '—'} mg/day</p>
          <p className="text-xs text-muted">Equivalence tables vary widely between sources and individuals; convert in steps over 1–2 weeks and re-titrate to clinical effect.</p>
        </Card>
      </div>
      <Card>
        <p className="mb-2 text-sm font-semibold">Proportional taper ({steps.length - 1} steps, ~{steps.at(-1)?.week ?? 0} weeks)</p>
        <div className="scrollbar-thin max-h-80 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-surface text-left text-muted"><tr><th className="py-1.5">Week</th><th>Daily dose</th><th>Reduction</th><th /></tr></thead>
            <tbody className="divide-y divide-line">
              {steps.map((s, i) => (
                <tr key={i}><td className="py-1.5">{s.week}</td><td className="font-medium">{s.dose} mg</td><td>{i === 0 ? 'start' : `−${s.reductionPct}%`}</td><td>{s.minStep && <Badge tone="amber">smallest step — interval doubled / consider liquid</Badge>}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted">Slow or pause the taper if withdrawal symptoms emerge; the last steps are often hardest. Never stop abruptly after regular use (seizure risk). Offer CBT for insomnia/anxiety.</p>
      </Card>
    </div>
  );
}

function Scale({ items, band, max, title }: { items: ScaleItem[]; band: (n: number) => { label: string; action: string }; max: number; title: string }) {
  const [scores, setScores] = useState<Record<string, number>>(() => Object.fromEntries(items.map((i) => [i.id, 0])));
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const b = band(total);
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <Card className="space-y-4">
        {items.map((it) => (
          <fieldset key={it.id}>
            <legend className="mb-1.5 text-sm font-medium">{it.label}</legend>
            <div className="flex flex-wrap gap-1.5">
              {it.options.map((o) => (
                <button key={o.score} className={cn('chip text-xs', scores[it.id] === o.score && 'chip-on')} aria-pressed={scores[it.id] === o.score} onClick={() => setScores({ ...scores, [it.id]: o.score })}>
                  <span className="font-semibold">{o.score}</span> {o.text}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </Card>
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card className="space-y-2 text-center">
          <p className="text-sm text-muted">{title} total</p>
          <p className="text-5xl font-bold">{total}<span className="text-lg text-muted">/{max}</span></p>
          <Badge tone={b.label.startsWith('Severe') || b.label.startsWith('Moderately') ? 'red' : b.label.startsWith('Moderate') ? 'amber' : 'green'}>{b.label}</Badge>
          <p className="pt-2 text-left text-sm">{b.action}</p>
        </Card>
      </div>
    </div>
  );
}

export default function CalculatorsPage() {
  const [params, setParams] = useSearchParams();
  const tab = (TABS.find((t) => t.value === params.get('tab'))?.value ?? 'qtc') as Tab;
  return (
    <div>
      <PageHeader icon={Calculator} eyebrow="Tool" title="Clinical calculators" subtitle="Bedside math for the decisions that most often go wrong: QTc, lithium levels, clozapine ANC, lamotrigine titration, benzodiazepine tapers and withdrawal scales." />
      <div className="mb-5 overflow-x-auto"><Segmented label="Calculator" value={tab} onChange={(v) => setParams({ tab: v }, { replace: true })} options={TABS} /></div>
      {tab === 'qtc' && <Qtc />}
      {tab === 'lithium' && <Lithium />}
      {tab === 'anc' && <Anc />}
      {tab === 'lamotrigine' && <Lamotrigine />}
      {tab === 'benzo' && <Benzo />}
      {tab === 'ciwa' && <Scale key="ciwa" items={CIWA_ITEMS} band={ciwaBand} max={67} title="CIWA-Ar" />}
      {tab === 'cows' && <Scale key="cows" items={COWS_ITEMS} band={cowsBand} max={48} title="COWS" />}
      <RefList className="mt-6" ids={{ qtc: ['crediblemeds'], lithium: ['igsli-2019', 'extrip-2015'], anc: ['fda-label', 'fda-clozapine-rems-2025'], lamotrigine: ['fda-label', 'fda-lamotrigine-2021'], benzo: ['bzd-taper-2025', 'fda-benzo-box-2020'], ciwa: ['ciwa-1989', 'asam-aws-2020'], cows: ['cows-2003', 'asam-oud-2020'] }[tab]} />
    </div>
  );
}
