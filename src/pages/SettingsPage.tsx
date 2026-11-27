import { useRef, useState } from 'react';
import { Settings, Download, Upload, Trash2, Moon, Sun } from 'lucide-react';
import { useProgress } from '@/store/progress';
import { lessons } from '@/data/lessons';
import { questions } from '@/data/questions';
import { deck } from '@/lib/flashcards';
import { cases } from '@/data/cases';
import { Button, Callout, Card, PageHeader, Segmented } from '@/components/ui';

export default function SettingsPage() {
  const s = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const exportData = () => {
    const data = JSON.stringify({ lessonsDone: s.lessonsDone, quiz: s.quiz, cards: s.cards, cases: s.cases, bookmarks: s.bookmarks, exportedAt: new Date().toISOString() }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `psychopharm-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    try {
      const d = JSON.parse(await file.text());
      if (typeof d !== 'object' || !d) throw new Error('bad');
      useProgress.setState({ lessonsDone: d.lessonsDone ?? {}, quiz: d.quiz ?? {}, cards: d.cards ?? {}, cases: d.cases ?? {}, bookmarks: Array.isArray(d.bookmarks) ? d.bookmarks : [] });
      setMsg('Progress imported.');
    } catch {
      setMsg('That file could not be read as exported progress.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={Settings} title="Settings & progress" subtitle="Progress is stored only in this browser. Export it to move between devices." />
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="font-semibold">Appearance</p><p className="text-sm text-muted">Dark mode is the default.</p></div>
        <Segmented label="Theme" value={s.theme} onChange={s.setTheme} options={[{ value: 'dark', label: <span className="inline-flex items-center gap-1"><Moon className="h-4 w-4" aria-hidden />Dark</span> }, { value: 'light', label: <span className="inline-flex items-center gap-1"><Sun className="h-4 w-4" aria-hidden />Light</span> }]} />
      </Card>
      <Card>
        <p className="mb-3 font-semibold">Your progress</p>
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div><dt className="text-muted">Modules</dt><dd className="text-lg font-semibold">{Object.keys(s.lessonsDone).length}/{lessons.length}</dd></div>
          <div><dt className="text-muted">Questions answered</dt><dd className="text-lg font-semibold">{Object.keys(s.quiz).length}/{questions.length}</dd></div>
          <div><dt className="text-muted">Cards studied</dt><dd className="text-lg font-semibold">{Object.keys(s.cards).length}/{deck.length}</dd></div>
          <div><dt className="text-muted">Cases</dt><dd className="text-lg font-semibold">{Object.keys(s.cases).length}/{cases.length}</dd></div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportData}><Download className="h-4 w-4" aria-hidden />Export</Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" aria-hidden />Import</Button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} />
          <Button variant="secondary" className="text-red-600 dark:text-red-400" onClick={() => { if (window.confirm('Erase all progress on this device?')) { s.reset(); setMsg('Progress reset.'); } }}><Trash2 className="h-4 w-4" aria-hidden />Reset</Button>
        </div>
        {msg && <Callout className="mt-3" tone="info">{msg}</Callout>}
      </Card>
      <Card className="space-y-2 text-sm">
        <p className="font-semibold">About</p>
        <p>Psychopharm Master v2.0 · content reviewed November 2026 · works offline once loaded (installable as an app).</p>
        <p className="text-muted">All cases are synthetic. Doses are for adults unless stated; confirm against current labeling and local protocols.</p>
      </Card>
    </div>
  );
}
