import { useMemo, useState } from 'react';
import { Pill, Search, Bookmark, AlertTriangle, Sparkles } from 'lucide-react';
import { allDrugs } from '@/data/drugs';
import { lessons } from '@/data/lessons';
import { useProgress } from '@/store/progress';
import { DrugTile } from '@/components/DrugViews';
import { EmptyState, PageHeader } from '@/components/ui';
import { cn } from '@/utils/cn';

const clinical = lessons.filter((l) => !['foundations', 'emergencies', 'special-populations'].includes(l.id));

export default function DrugLibraryPage() {
  const [q, setQ] = useState('');
  const [mod, setMod] = useState<string>('all');
  const [flag, setFlag] = useState<'none' | 'boxed' | 'new' | 'saved'>('none');
  const bookmarks = useProgress((s) => s.bookmarks);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return allDrugs.filter((d) => {
      if (mod !== 'all' && d.module !== mod && !d.alsoIn?.includes(mod as never)) return false;
      if (flag === 'boxed' && !d.boxed?.length) return false;
      if (flag === 'new' && !d.update) return false;
      if (flag === 'saved' && !bookmarks.includes(d.id)) return false;
      if (!n) return true;
      return [d.name, d.className, ...(d.brands ?? []), ...d.indications, ...(d.offLabel ?? [])].join(' ').toLowerCase().includes(n);
    });
  }, [q, mod, flag, bookmarks]);

  return (
    <div>
      <PageHeader icon={Pill} title="Drug library" subtitle={`${allDrugs.length} agents with mechanism, dosing, boxed warnings, interactions, monitoring, special populations and evidence. Search by drug, brand, class or indication.`} />
      <div className="card mb-5 space-y-3 p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden />
          <input className="input pl-9" placeholder="e.g. Zoloft, OCD, D2 partial agonist, insomnia…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search drugs" />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by module">
          <button className={cn('chip', mod === 'all' && 'chip-on')} onClick={() => setMod('all')} aria-pressed={mod === 'all'}>All</button>
          {clinical.map((l) => <button key={l.id} className={cn('chip', mod === l.id && 'chip-on')} onClick={() => setMod(l.id)} aria-pressed={mod === l.id}>{l.title}</button>)}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by flag">
          {([['boxed', 'Boxed warning', AlertTriangle], ['new', 'New / updated', Sparkles], ['saved', 'Bookmarked', Bookmark]] as const).map(([k, label, Icon]) => (
            <button key={k} className={cn('chip', flag === k && 'chip-on')} onClick={() => setFlag(flag === k ? 'none' : k)} aria-pressed={flag === k}><Icon className="h-3.5 w-3.5" aria-hidden />{label}</button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-sm text-muted">{list.length} result{list.length === 1 ? '' : 's'}</p>
      {list.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{list.map((d) => <DrugTile key={d.id} drug={d} />)}</div>
      ) : (
        <EmptyState icon={Search} title="No drugs match">Try a brand name, class or indication.</EmptyState>
      )}
    </div>
  );
}
