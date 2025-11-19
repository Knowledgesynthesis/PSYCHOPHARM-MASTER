import { Zap } from 'lucide-react';
import DrugCard from '@/components/DrugCard';
import { adhdData } from '@/data/adhd';

const ADHDPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-yellow-500/10">
            <Zap className="h-8 w-8 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">ADHD & Stimulants</h1>
            <p className="text-muted-foreground mt-1">
              Methylphenidate, amphetamines, and non-stimulant medications
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-3">Module Overview</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            ADHD medications improve attention, focus, and impulse control through dopaminergic and
            noradrenergic mechanisms. Stimulants are first-line, but non-stimulants offer important
            alternatives when stimulants are contraindicated or ineffective.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Key Concepts</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>DA/NE reuptake inhibition (stimulants)</li>
                <li>Cardiovascular screening before initiation</li>
                <li>Growth monitoring in children</li>
                <li>Controlled substance regulations (stimulants)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Clinical Pearls</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Stimulants: rapid onset, first-line</li>
                <li>Non-stimulants: delayed onset, no abuse potential</li>
                <li>Atomoxetine: good if comorbid anxiety or tics</li>
                <li>Monitor appetite, sleep, and growth in children</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Drug Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Medications</h2>
        <div className="space-y-4">
          {adhdData.map((drug) => (
            <DrugCard key={drug.id} drug={drug} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ADHDPage;
