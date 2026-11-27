import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface PickerOption { id: string; label: string; hint?: string; group?: string }

/** Accessible type-ahead combobox. */
export default function AgentPicker({
  options, onSelect, placeholder = 'Search…', label, exclude = [], autoFocus,
}: { options: PickerOption[]; onSelect: (id: string) => void; placeholder?: string; label: string; exclude?: string[]; autoFocus?: boolean }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return options
      .filter((o) => !exclude.includes(o.id))
      .filter((o) => !needle || o.label.toLowerCase().includes(needle) || o.hint?.toLowerCase().includes(needle))
      .slice(0, 40);
  }, [q, options, exclude]);

  const choose = (id: string) => {
    onSelect(id);
    setQ('');
    setActive(0);
    setOpen(false);
    inputRef.current?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && results[active]) { e.preventDefault(); choose(results[active].id); }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div className="relative">
      <label className="sr-only" htmlFor={`${listId}-input`}>{label}</label>
      <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden />
      <input
        id={`${listId}-input`}
        ref={inputRef}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoFocus={autoFocus}
        className="input pl-9"
        placeholder={placeholder}
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKey}
      />
      {open && results.length > 0 && (
        <ul id={listId} role="listbox" className="scrollbar-thin absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-line bg-surface p-1 shadow-lg">
          {results.map((o, i) => (
            <li
              key={o.id}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); choose(o.id); }}
              onMouseEnter={() => setActive(i)}
              className={cn('flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm', i === active && 'bg-surface-2')}
            >
              <span className="truncate">{o.label}</span>
              {o.hint && <span className="shrink-0 text-xs text-muted">{o.hint}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
