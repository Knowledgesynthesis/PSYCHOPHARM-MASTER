import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CornerDownLeft } from 'lucide-react';
import { allDrugs } from '@/data/drugs';
import { lessons } from '@/data/lessons';
import { cases } from '@/data/cases';
import { tools, practice } from './nav';
import { cn } from '@/utils/cn';

interface Hit { to: string; title: string; sub: string; kind: string; haystack: string }

const index: Hit[] = [
  ...allDrugs.map((d) => ({ to: `/drug/${d.id}`, title: d.name, sub: `${d.className}${d.brands?.length ? ' · ' + d.brands.slice(0, 2).join(', ') : ''}`, kind: 'Drug', haystack: [d.name, d.className, ...(d.brands ?? []), ...d.indications].join(' ').toLowerCase() })),
  ...lessons.map((l) => ({ to: `/learn/${l.id}`, title: l.title, sub: l.short, kind: 'Lesson', haystack: [l.title, l.short, ...l.concepts.map((c) => c.title)].join(' ').toLowerCase() })),
  ...[...tools, ...practice].map((t) => ({ to: t.to, title: t.label, sub: t.desc ?? '', kind: 'Tool', haystack: `${t.label} ${t.desc}`.toLowerCase() })),
  ...cases.map((c) => ({ to: `/cases/${c.id}`, title: c.title, sub: 'Clinical case', kind: 'Case', haystack: `${c.title} ${c.vignette}`.toLowerCase() })),
];

function score(h: Hit, q: string) {
  const t = h.title.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;
  return h.haystack.includes(q) ? 30 : 0;
}

export default function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const nav = useNavigate();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQ(''); setActive(0); setTimeout(() => ref.current?.focus(), 10); }
  }, [open]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return index.filter((h) => h.kind !== 'Drug').slice(0, 10);
    return index.map((h) => ({ h, s: score(h, needle) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 12).map((x) => x.h);
  }, [q]);

  if (!open) return null;
  const go = (h: Hit) => { nav(h.to); onClose(); };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter' && results[active]) go(results[active]);
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 p-4 pt-[10vh] backdrop-blur-sm" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label="Search">
      <div className="card w-full max-w-xl overflow-hidden p-0 animate-fade-in" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-line px-4">
          <Search className="h-5 w-5 text-muted" aria-hidden />
          <input ref={ref} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey} placeholder="Search drugs, brands, lessons, tools, cases…" className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted" aria-label="Search" />
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-muted">ESC</kbd>
        </div>
        <ul className="scrollbar-thin max-h-[60vh] overflow-auto p-2" role="listbox">
          {results.length === 0 && <li className="p-6 text-center text-sm text-muted">No matches for “{q}”.</li>}
          {results.map((h, i) => (
            <li key={h.to} role="option" aria-selected={i === active}>
              <button onClick={() => go(h)} onMouseEnter={() => setActive(i)} className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left', i === active && 'bg-surface-2')}>
                <span className="w-14 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-muted">{h.kind}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{h.title}</span>
                  <span className="block truncate text-xs text-muted">{h.sub}</span>
                </span>
                {i === active && <CornerDownLeft className="h-4 w-4 text-muted" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
