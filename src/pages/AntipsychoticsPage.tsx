import { Brain } from 'lucide-react';
import DrugCard from '@/components/DrugCard';
import { antipsychoticsData } from '@/data/antipsychotics';

const AntipsychoticsPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-pink-500/10">
            <Brain className="h-8 w-8 text-pink-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Antipsychotics</h1>
            <p className="text-muted-foreground mt-1">
              First and second-generation antipsychotic medications
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-3">Module Overview</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Antipsychotics are used to treat schizophrenia, bipolar disorder, and other psychotic
            conditions. Understanding the differences between first-generation (typical) and
            second-generation (atypical) agents is crucial for balancing efficacy and tolerability.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Key Concepts</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>D2 antagonism: antipsychotic effect and EPS</li>
                <li>Metabolic syndrome monitoring</li>
                <li>EPS, tardive dyskinesia, and NMS recognition</li>
                <li>Clozapine REMS and ANC monitoring</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Clinical Pearls</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>FGAs: high EPS risk; SGAs: metabolic risks</li>
                <li>Olanzapine: highest weight gain</li>
                <li>Aripiprazole: high akathisia, low metabolic risk</li>
                <li>Clozapine: most effective but requires monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Drug Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Medications</h2>
        <div className="space-y-4">
          {antipsychoticsData.map((drug) => (
            <DrugCard key={drug.id} drug={drug} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AntipsychoticsPage;
