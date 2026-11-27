import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { Brain, Menu, Moon, Search, Sun, X, GraduationCap, Wrench, ListChecks, Home } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useProgress } from '@/store/progress';
import { lessons } from '@/data/lessons';
import { lessonIcons, moduleTone, practice, primary, reference, tools, type NavItem } from './nav';
import SearchPalette from './SearchPalette';

function NavGroup({ title, items, onNavigate }: { title: string; items: NavItem[]; onNavigate?: () => void }) {
  return (
    <div>
      <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">{title}</p>
      <ul className="space-y-0.5">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              end={it.to === '/'}
              onClick={onNavigate}
              className={({ isActive }) => cn('flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors', isActive ? 'bg-brand/10 font-medium text-brand' : 'text-fg/80 hover:bg-surface-2 hover:text-fg')}
            >
              <it.icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{it.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const done = useProgress((s) => s.lessonsDone);
  return (
    <nav className="space-y-6" aria-label="Main">
      <NavGroup title="Start" items={primary} onNavigate={onNavigate} />
      <div>
        <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Modules</p>
        <ul className="space-y-0.5">
          {lessons.map((l, i) => {
            const Icon = lessonIcons[l.icon];
            return (
              <li key={l.id}>
                <NavLink
                  to={`/learn/${l.id}`}
                  onClick={onNavigate}
                  className={({ isActive }) => cn('flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors', isActive ? 'bg-brand/10 font-medium text-brand' : 'text-fg/80 hover:bg-surface-2 hover:text-fg')}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', moduleTone[l.color].text)} aria-hidden />
                  <span className="truncate"><span className="text-muted">{i}.</span> {l.title}</span>
                  {done[l.id] && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" aria-label="completed" />}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <NavGroup title="Tools" items={tools} onNavigate={onNavigate} />
      <NavGroup title="Practice" items={practice} onNavigate={onNavigate} />
      <NavGroup title="Reference" items={reference} onNavigate={onNavigate} />
    </nav>
  );
}

const bottomNav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/learn', label: 'Learn', icon: GraduationCap },
  { to: '/tools/interactions', label: 'Tools', icon: Wrench },
  { to: '/quiz', label: 'Practice', icon: ListChecks },
];

export default function Layout() {
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const { theme, toggleTheme } = useProgress();
  const loc = useLocation();

  useEffect(() => { setDrawer(false); window.scrollTo(0, 0); }, [loc.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch(true); }
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) { e.preventDefault(); setSearch(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-lg focus:bg-brand focus:px-3 focus:py-2 focus:text-brand-fg">Skip to content</a>

      {/* Desktop sidebar */}
      <aside className="scrollbar-thin fixed inset-y-0 left-0 z-40 hidden w-64 overflow-y-auto border-r border-line bg-surface px-3 pb-8 pt-5 lg:block">
        <Link to="/" className="mb-6 flex items-center gap-2 px-3">
          <span className="rounded-lg bg-brand p-1.5 text-brand-fg"><Brain className="h-5 w-5" aria-hidden /></span>
          <span className="text-base font-bold tracking-tight">Psychopharm Master</span>
        </Link>
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="scrollbar-thin absolute inset-y-0 left-0 w-[82%] max-w-xs overflow-y-auto border-r border-line bg-surface px-3 pb-10 pt-4 animate-fade-in">
            <div className="mb-4 flex items-center justify-between px-3">
              <span className="font-bold">Psychopharm Master</span>
              <button onClick={() => setDrawer(false)} className="rounded-lg p-2 hover:bg-surface-2" aria-label="Close menu"><X className="h-5 w-5" /></button>
            </div>
            <SidebarContent onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
            <button className="rounded-lg p-2 hover:bg-surface-2 lg:hidden" onClick={() => setDrawer(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
            <Link to="/" className="flex items-center gap-2 font-bold lg:hidden"><Brain className="h-5 w-5 text-brand" aria-hidden /> <span className="text-sm">Psychopharm Master</span></Link>
            <button onClick={() => setSearch(true)} className="ml-auto flex w-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-muted hover:border-brand/50 sm:w-72" aria-label="Search (Ctrl+K)">
              <Search className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Search drugs, tools, lessons…</span>
              <kbd className="ml-auto hidden rounded border border-line px-1.5 text-[10px] sm:inline">⌘K</kbd>
            </button>
            <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-surface-2" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        <main id="main" className="mx-auto max-w-6xl px-4 pb-28 pt-6 lg:pb-12">
          <Suspense fallback={<div className="py-24 text-center text-sm text-muted">Loading…</div>}>
            <Outlet />
          </Suspense>
        </main>

        <footer className="mx-auto max-w-6xl px-4 pb-24 text-center text-xs text-muted lg:pb-8">
          For clinical education — verify doses against current labeling and local protocols. Content reviewed Nov 2026.
        </footer>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Quick">
        {bottomNav.map((b) => (
          <NavLink key={b.to} to={b.to} end={b.to === '/'} className={({ isActive }) => cn('flex flex-col items-center gap-0.5 py-2 text-[11px]', isActive ? 'text-brand' : 'text-muted')}>
            <b.icon className="h-5 w-5" aria-hidden />
            {b.label}
          </NavLink>
        ))}
      </nav>

      <SearchPalette open={search} onClose={() => setSearch(false)} />
    </div>
  );
}
