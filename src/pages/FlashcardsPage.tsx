import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, RotateCcw, Eye } from 'lucide-react';
import { deck, dueCards } from '@/lib/flashcards';
import { lessons, lessonMap } from '@/data/lessons';
import { useProgress, type Grade, BOX_INTERVAL_DAYS } from '@/store/progress';
import { Badge, Bullets, Button, Callout, Card, PageHeader } from '@/components/ui';

export default function FlashcardsPage() {
  const [params, setParams] = useSearchParams();
  const module = params.get('module') ?? 'all';
  const { cards, gradeCard } = useProgress();
  const [flipped, setFlipped] = useState(false);
  const [ahead, setAhead] = useState(false);
  const [sessionDone, setSessionDone] = useState(0);

  const filtered = useMemo(() => deck.filter((c) => module === 'all' || c.module === module), [module]);
  const queue = useMemo(() => {
    const q = dueCards(filtered, cards);
    return ahead && q.length === 0 ? [...filtered].sort((a, b) => (cards[a.id]?.due ?? 0) - (cards[b.id]?.due ?? 0)) : q;
  }, [filtered, cards, ahead]);
  const card = queue[0];
  const learned = filtered.filter((c) => (cards[c.id]?.box ?? 0) >= 4).length;
  const dueNow = filtered.filter((c) => cards[c.id] && cards[c.id].due <= Date.now()).length;
  const fresh = filtered.filter((c) => !cards[c.id]).length;

  const grade = (g: Grade) => { gradeCard(card.id, g); setFlipped(false); setSessionDone((n) => n + 1); };
  const box = card ? cards[card.id]?.box ?? 1 : 1;

  return (
    <div>
      <PageHeader icon={Sparkles} eyebrow={`${deck.length} cards`} title="Flashcards" subtitle="Leitner spaced repetition: cards you know come back less often; misses return in 10 minutes. Ten minutes a day beats a weekend cram." />
      <Card className="mb-5 flex flex-wrap items-center gap-3 p-4">
        <select className="input w-auto" value={module} onChange={(e) => { setParams(e.target.value === 'all' ? {} : { module: e.target.value }, { replace: true }); setFlipped(false); }} aria-label="Module">
          <option value="all">All modules</option>
          {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
        </select>
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge tone="amber">{dueNow} due</Badge><Badge>{fresh} new</Badge><Badge tone="green">{learned} learned</Badge><Badge tone="brand">{sessionDone} this session</Badge>
        </div>
      </Card>

      {!card ? (
        <Callout tone="success" title="All caught up">
          No cards are due in this deck. <button className="font-medium text-brand underline" onClick={() => setAhead(true)}>Study ahead</button> or switch modules.
        </Callout>
      ) : (
        <div className="mx-auto max-w-2xl space-y-4">
          <Card className="min-h-[260px] space-y-4 p-6">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <Badge tone="brand">{lessonMap[card.module].title}</Badge>
              <Badge>{card.tag}</Badge>
              <Badge>box {box}</Badge>
            </div>
            <p className="text-lg font-semibold leading-snug">{card.front}</p>
            {flipped ? (
              <div className="animate-fade-in border-t border-line pt-4">
                {card.back.length === 1 ? <p className="leading-relaxed">{card.back[0]}</p> : <Bullets items={card.back} />}
                {card.drugId && <Link to={`/drug/${card.drugId}`} className="mt-3 inline-block text-sm text-brand hover:underline">Open drug page</Link>}
              </div>
            ) : (
              <p className="text-sm text-muted">Recall the answer out loud or in your head, then reveal.</p>
            )}
          </Card>
          {!flipped ? (
            <Button className="w-full" onClick={() => setFlipped(true)}><Eye className="h-4 w-4" aria-hidden />Show answer</Button>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <Button variant="secondary" onClick={() => grade('again')}><RotateCcw className="h-4 w-4" aria-hidden />Again<span className="text-xs text-muted">10 min</span></Button>
              <Button variant="secondary" onClick={() => grade('good')}>Good<span className="text-xs text-muted">{BOX_INTERVAL_DAYS[Math.min(5, box + 1)]}d</span></Button>
              <Button onClick={() => grade('easy')}>Easy<span className="text-xs opacity-80">{BOX_INTERVAL_DAYS[Math.min(5, box + 2)]}d</span></Button>
            </div>
          )}
          <p className="text-center text-xs text-muted">{queue.length - 1} more in this queue</p>
        </div>
      )}
    </div>
  );
}
