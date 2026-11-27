import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Combine, Repeat, GitCompare, Lightbulb, Baby, Users, Droplets, FlaskConical, HeartHandshake, UserRound } from 'lucide-react';
import type { ProfileKey, Receptor } from '@/types';
import { getDrug, allDrugs } from '@/data/drugs';
import { lessonMap } from '@/data/lessons';
import { receptorInfo } from '@/data/receptors';
import { useProgress } from '@/store/progress';
import { parseRx, AFFINITY_LABEL } from '@/lib/receptors';
import { Badge, Bullets, Callout, Card, LevelBar, RefList, SectionTitle } from '@/components/ui';
import { DrugTile } from '@/components/DrugViews';
import { PROFILE_LABELS } from '@/lib/profile';
import NotFoundPage from './NotFoundPage';
import { cn } from '@/utils/cn';

export default function DrugPage() {
  const { id } = useParams();
  const d = getDrug(id);
  const { bookmarks, toggleBookmark } = useProgress();
  if (!d) return <NotFoundPage />;
  const lesson = lessonMap[d.module];
  const saved = bookmarks.includes(d.id);
  const related = allDrugs.filter((x) => x.id !== d.id && x.cls === d.cls).slice(0, 3);
  const cypChips = [
    ...(d.cyp?.sub ?? []).map((e) => ({ t: `Substrate ${e === 'UGT' ? 'UGT' : 'CYP' + e}`, tone: 'neutral' as const })),
    ...Object.entries(d.cyp?.inh ?? {}).map(([e, s]) => ({ t: `${s} ${e === 'UGT' ? 'UGT' : 'CYP' + e} inhibitor`, tone: s === 'strong' ? ('orange' as const) : ('amber' as const) })),
    ...Object.entries(d.cyp?.ind ?? {}).map(([e, s]) => ({ t: `${s} ${e === 'UGT' ? 'UGT' : 'CYP' + e} inducer`, tone: s === 'strong' ? ('orange' as const) : ('amber' as const) })),
  ];
  const pops = [
    { k: 'Pregnancy', v: d.populations.pregnancy, icon: Baby },
    { k: 'Lactation', v: d.populations.lactation, icon: HeartHandshake },
    d.populations.pediatric && { k: 'Pediatric', v: d.populations.pediatric, icon: UserRound },
    { k: 'Older adults', v: d.populations.geriatric, icon: Users },
    { k: 'Renal', v: d.populations.renal, icon: Droplets },
    { k: 'Hepatic', v: d.populations.hepatic, icon: FlaskConical },
  ].filter(Boolean) as { k: string; v: string; icon: typeof Baby }[];

  return (
    <article className="space-y-6">
      <Link to={`/learn/${d.module}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"><ArrowLeft className="h-4 w-4" aria-hidden />{lesson.title}</Link>

      <header className="card space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{d.name}</h1>
            {d.brands && <p className="text-sm text-muted">{d.brands.join(' · ')}</p>}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone="brand">{d.className}</Badge>
              {d.schedule && <Badge tone="violet">{d.schedule}</Badge>}
              {d.update && <Badge tone="violet">{d.update}</Badge>}
            </div>
          </div>
          <button onClick={() => toggleBookmark(d.id)} className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm hover:bg-surface-2" aria-pressed={saved}>
            {saved ? <BookmarkCheck className="h-4 w-4 text-brand" aria-hidden /> : <Bookmark className="h-4 w-4" aria-hidden />}{saved ? 'Saved' : 'Save'}
          </button>
        </div>
        <p className="leading-relaxed">{d.mechanism}</p>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted">Half-life</dt><dd>{d.halfLife}</dd></div>
          <div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase tracking-wide text-muted">Metabolism</dt><dd>{d.metabolism}</dd></div>
        </dl>
        {cypChips.length > 0 && <div className="flex flex-wrap gap-1.5">{cypChips.map((c) => <Badge key={c.t} tone={c.tone}>{c.t}</Badge>)}</div>}
        <div className="flex flex-wrap gap-2 pt-1">
          <Link to={`/tools/interactions?ids=${d.id}`} className="inline-flex items-center gap-2 rounded-xl bg-brand px-3 py-2 text-sm font-medium text-brand-fg hover:bg-brand/90"><Combine className="h-4 w-4" aria-hidden />Check interactions</Link>
          <Link to={`/tools/switching?from=${d.id}`} className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm hover:bg-surface-2"><Repeat className="h-4 w-4" aria-hidden />Plan a switch</Link>
          <Link to={`/compare?ids=${[d.id, ...related.map((r) => r.id)].slice(0, 3).join(',')}`} className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm hover:bg-surface-2"><GitCompare className="h-4 w-4" aria-hidden />Compare</Link>
        </div>
      </header>

      {d.boxed?.length ? (
        <Callout tone="danger" title="Boxed warning">
          <Bullets items={d.boxed} />
        </Callout>
      ) : null}

      <Card className="border-brand/30 bg-brand/5">
        <SectionTitle><span className="inline-flex items-center gap-2"><Lightbulb className="h-5 w-5 text-brand" aria-hidden />Clinical pearls</span></SectionTitle>
        <Bullets items={d.pearls} className="text-[15px]" />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle>Indications</SectionTitle>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">FDA-approved</p>
          <Bullets items={d.indications} />
          {d.offLabel?.length ? (<><p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-muted">Evidence-supported off-label</p><Bullets items={d.offLabel} /></>) : null}
        </Card>
        <Card>
          <SectionTitle>Dosing (adults)</SectionTitle>
          <dl className="space-y-2 text-sm">
            {([['Start', d.dosing.start], ['Target', d.dosing.target], ['Maximum', d.dosing.max]] as const).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[80px_1fr] gap-2"><dt className="font-medium text-muted">{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          {d.dosing.notes && <p className="mt-3 rounded-lg bg-surface-2 p-2.5 text-sm">{d.dosing.notes}</p>}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Object.keys(d.profile).length > 0 && (
          <Card>
            <SectionTitle>Side-effect profile</SectionTitle>
            <div className="space-y-2">
              {(Object.entries(d.profile) as [ProfileKey, 0 | 1 | 2 | 3][]).map(([k, v]) => <LevelBar key={k} level={v} label={PROFILE_LABELS[k]} />)}
            </div>
          </Card>
        )}
        {d.receptors && (
          <Card>
            <SectionTitle aside={<Link to="/tools/receptors" className="text-sm text-brand hover:underline">Explorer</Link>}>Receptor profile</SectionTitle>
            <ul className="space-y-2">
              {(Object.entries(d.receptors) as [Receptor, NonNullable<typeof d.receptors>[Receptor]][]).sort((a, b) => Number(b[1]![0]) - Number(a[1]![0])).map(([r, v]) => {
                const { affinity, action } = parseRx(r, v!);
                return (
                  <li key={r} className="text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-16 shrink-0 font-semibold">{r}</span>
                      <div className="flex flex-1 gap-1" aria-hidden>{[1, 2, 3, 4].map((i) => <span key={i} className={cn('h-2 flex-1 rounded-full', i <= affinity ? 'bg-brand' : 'bg-surface-2')} />)}</div>
                      <span className="w-28 shrink-0 text-right text-xs text-muted">{AFFINITY_LABEL[affinity]} {action}</span>
                    </div>
                    <p className="ml-[76px] text-xs text-muted">{action === 'partial agonist' || action === 'agonist' ? receptorInfo[r].agonism ?? '' : [...receptorInfo[r].block.benefit.slice(0, 1), ...receptorInfo[r].block.harm.slice(0, 2)].join(' · ')}</p>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle>Adverse effects</SectionTitle>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Common</p>
          <Bullets items={d.adverse.common} />
          <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">Serious</p>
          <Bullets items={d.adverse.serious} />
        </Card>
        <Card>
          <SectionTitle>Contraindications</SectionTitle>
          <Bullets items={d.contraindications} />
          <SectionTitle>Key interactions</SectionTitle>
          <Bullets items={d.interactions} />
          {d.contraWith?.length ? <div className="mt-3 space-y-1">{d.contraWith.map((c) => <p key={c.id} className="text-sm"><Badge tone="red">Do not combine</Badge> <span className="ml-1">{c.why}</span></p>)}</div> : null}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle>Monitoring</SectionTitle>
          <Bullets items={d.monitoring} />
        </Card>
        <Card>
          <SectionTitle>Switching & stopping</SectionTitle>
          <Bullets items={d.switching ?? ['Taper gradually when stopping after regular use; use the switching planner for drug-specific plans.']} />
          {d.washoutBeforeMaoiDays !== undefined && <p className="mt-3 rounded-lg bg-surface-2 p-2.5 text-sm"><strong>Before an MAOI:</strong> wait {d.washoutBeforeMaoiDays >= 28 ? `${d.washoutBeforeMaoiDays / 7} weeks` : `${d.washoutBeforeMaoiDays} days`} after the last dose.</p>}
        </Card>
      </div>

      <section>
        <SectionTitle>Special populations</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pops.map((p) => (
            <Card key={p.k} className="p-4">
              <p className="mb-1 flex items-center gap-2 text-sm font-semibold"><p.icon className="h-4 w-4 text-brand" aria-hidden />{p.k}</p>
              <p className="text-sm leading-relaxed text-fg/90">{p.v}</p>
            </Card>
          ))}
        </div>
      </section>

      <RefList ids={d.refs} />

      {related.length > 0 && (
        <section>
          <SectionTitle>Same class</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-3">{related.map((r) => <DrugTile key={r.id} drug={r} />)}</div>
        </section>
      )}
    </article>
  );
}
