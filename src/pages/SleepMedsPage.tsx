import { Moon } from 'lucide-react';
import DrugCard from '@/components/DrugCard';
import { sleepMedsData } from '@/data/sleepMeds';

const SleepMedsPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-indigo-500/10">
            <Moon className="h-8 w-8 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Sleep Medications</h1>
            <p className="text-muted-foreground mt-1">
              Z-drugs, melatonin receptor agonists, and sedating antidepressants
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-3">Module Overview</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Insomnia is commonly encountered in clinical practice. While cognitive-behavioral therapy
            for insomnia (CBT-I) is first-line, pharmacotherapy plays a role in select cases.
            Understanding the mechanisms and risks of sleep medications is essential.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Key Concepts</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>GABA-A modulation (Z-drugs)</li>
                <li>Melatonin receptor agonism (ramelteon)</li>
                <li>Complex sleep behaviors risk</li>
                <li>CBT-I is first-line treatment</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Clinical Pearls</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Short-term use only (2-4 weeks for Z-drugs)</li>
                <li>Ramelteon: no dependence, good for sleep onset</li>
                <li>Trazodone: commonly used off-label</li>
                <li>Avoid Z-drugs in elderly (Beers Criteria)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Drug Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Medications</h2>
        <div className="space-y-4">
          {sleepMedsData.map((drug) => (
            <DrugCard key={drug.id} drug={drug} />
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-blue-500">Note:</span> Cognitive-behavioral therapy for
          insomnia (CBT-I) is the first-line treatment for chronic insomnia. Pharmacotherapy should be
          considered adjunctive or for short-term use when appropriate.
        </p>
      </div>
    </div>
  );
};

export default SleepMedsPage;
