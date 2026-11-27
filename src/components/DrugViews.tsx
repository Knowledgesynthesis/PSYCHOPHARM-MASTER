import { Link } from 'react-router-dom';
import { AlertTriangle, Sparkles } from 'lucide-react';
import type { Drug, ProfileKey } from '@/types';
import { PROFILE_LABELS } from '@/lib/profile';
import { cn } from '@/utils/cn';
import { Badge } from './ui';
import { levelCellClass, levelLabel } from '@/lib/levels';
import { lessonMap } from '@/data/lessons';
import { moduleTone } from './nav';

const ORDER = Object.keys(PROFILE_LABELS) as ProfileKey[];

export function DrugTile({ drug }: { drug: Drug }) {
  const lesson = lessonMap[drug.module];
  const tone = moduleTone[lesson.color];
  return (
    <Link to={`/drug/${drug.id}`} className={cn('card group flex flex-col gap-2 p-4 transition-colors', tone.border)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold group-hover:text-brand">{drug.name}</p>
          <p className="truncate text-xs text-muted">{drug.className}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          {drug.update && <Badge tone="violet"><Sparkles className="h-3 w-3" aria-hidden />New</Badge>}
          {drug.boxed?.length ? <Badge tone="red"><AlertTriangle className="h-3 w-3" aria-hidden />Boxed</Badge> : null}
        </div>
      </div>
      <p className="line-clamp-2 text-sm text-muted">{drug.pearls[0]}</p>
    </Link>
  );
}

export function ProfileHeatmap({ drugs, keys, caption }: { drugs: Drug[]; keys?: ProfileKey[]; caption?: string }) {
  const cols = keys ?? ORDER.filter((k) => drugs.some((d) => d.profile[k] !== undefined));
  return (
    <div className="scrollbar-thin -mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[640px] border-separate border-spacing-1 text-xs">
        {caption && <caption className="mb-2 text-left text-xs text-muted">{caption}</caption>}
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-surface p-1 text-left font-medium text-muted">Drug</th>
            {cols.map((k) => <th key={k} className="p-1 text-center font-medium text-muted">{PROFILE_LABELS[k]}</th>)}
          </tr>
        </thead>
        <tbody>
          {drugs.map((d) => (
            <tr key={d.id}>
              <th scope="row" className="sticky left-0 z-10 bg-surface p-1 text-left">
                <Link to={`/drug/${d.id}`} className="whitespace-nowrap text-sm font-medium hover:text-brand">{d.name}</Link>
              </th>
              {cols.map((k) => (
                <td key={k} className={cn('rounded-md px-1 py-1.5 text-center font-medium', levelCellClass(d.profile[k]))}>{levelLabel(d.profile[k])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1 text-[11px] text-muted">Relative ratings from network meta-analyses (Cipriani 2018, Huhn 2019) and labeling; "—" = not characterized or not relevant.</p>
    </div>
  );
}
