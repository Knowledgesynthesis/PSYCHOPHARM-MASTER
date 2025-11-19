import { Activity } from 'lucide-react';
import DrugCard from '@/components/DrugCard';
import { moodStabilizersData } from '@/data/moodStabilizers';

const MoodStabilizersPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-purple-500/10">
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Mood Stabilizers</h1>
            <p className="text-muted-foreground mt-1">
              Lithium, valproate, carbamazepine, and lamotrigine
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-3">Module Overview</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Mood stabilizers are the cornerstone of bipolar disorder treatment. Each agent has unique
            monitoring requirements, side effect profiles, and clinical considerations that must be
            understood for safe prescribing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Key Concepts</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Lithium therapeutic monitoring (0.6-1.2 mEq/L)</li>
                <li>Valproate teratogenicity and PCOS risk</li>
                <li>Lamotrigine rash and slow titration</li>
                <li>Carbamazepine autoinduction and drug interactions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Clinical Pearls</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Lithium: monitor renal and thyroid function</li>
                <li>Valproate: avoid in women of childbearing potential</li>
                <li>Lamotrigine: more effective for bipolar depression</li>
                <li>Screen for HLA-B*1502 before carbamazepine in Asians</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Drug Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Medications</h2>
        <div className="space-y-4">
          {moodStabilizersData.map((drug) => (
            <DrugCard key={drug.id} drug={drug} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodStabilizersPage;
