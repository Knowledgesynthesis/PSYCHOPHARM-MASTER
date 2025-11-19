import { Pill } from 'lucide-react';
import DrugCard from '@/components/DrugCard';
import { antidepressantsData } from '@/data/antidepressants';

const AntidepressantsPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-blue-500/10">
            <Pill className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Antidepressants</h1>
            <p className="text-muted-foreground mt-1">
              SSRIs, SNRIs, TCAs, MAOIs, and atypical antidepressants
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-3">Module Overview</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Antidepressants are primarily used to treat major depressive disorder, anxiety disorders,
            and other psychiatric conditions. Understanding their mechanisms, side effect profiles,
            and switching strategies is essential for safe and effective prescribing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Key Concepts</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Serotonin and norepinephrine reuptake inhibition</li>
                <li>Sexual side effects and management</li>
                <li>Serotonin syndrome recognition</li>
                <li>MAOI dietary restrictions and washout periods</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Clinical Pearls</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Start low, titrate gradually</li>
                <li>Allow 4-6 weeks for full effect</li>
                <li>Monitor for activation in early treatment</li>
                <li>Never combine SSRIs/SNRIs with MAOIs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Drug Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Medications</h2>
        <div className="space-y-4">
          {antidepressantsData.map((drug) => (
            <DrugCard key={drug.id} drug={drug} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AntidepressantsPage;
