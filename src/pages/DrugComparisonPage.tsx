import { useState } from 'react';
import { GitCompare } from 'lucide-react';
import { antidepressantsData } from '@/data/antidepressants';
import { moodStabilizersData } from '@/data/moodStabilizers';
import { antipsychoticsData } from '@/data/antipsychotics';
import { Drug } from '@/types';

const allDrugs = [
  ...antidepressantsData,
  ...moodStabilizersData,
  ...antipsychoticsData,
];

const DrugComparisonPage = () => {
  const [drug1, setDrug1] = useState<Drug | null>(null);
  const [drug2, setDrug2] = useState<Drug | null>(null);

  const comparisonCategories = [
    { key: 'class', label: 'Drug Class' },
    { key: 'mechanism', label: 'Mechanism' },
    { key: 'dosing', label: 'Dosing' },
    { key: 'indications', label: 'Indications' },
    { key: 'sideEffects', label: 'Side Effects' },
    { key: 'contraindications', label: 'Contraindications' },
    { key: 'warnings', label: 'Warnings' },
    { key: 'monitoring', label: 'Monitoring' },
  ];

  const renderValue = (drug: Drug | null, key: string) => {
    if (!drug) return <span className="text-muted-foreground italic">Select a drug</span>;

    switch (key) {
      case 'class':
        return <span>{drug.class}</span>;
      case 'mechanism':
        return <p className="text-sm">{drug.mechanism}</p>;
      case 'dosing':
        return (
          <div className="text-sm space-y-1">
            <div><span className="font-medium">Starting:</span> {drug.dosing.starting}</div>
            <div><span className="font-medium">Therapeutic:</span> {drug.dosing.therapeutic}</div>
            <div><span className="font-medium">Maximum:</span> {drug.dosing.maximum}</div>
          </div>
        );
      case 'indications':
      case 'sideEffects':
      case 'contraindications':
      case 'warnings':
      case 'monitoring':
        const items = drug[key as keyof Drug] as string[];
        return (
          <ul className="list-disc list-inside text-sm space-y-1">
            {items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-primary-500/10">
            <GitCompare className="h-8 w-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Drug Comparison</h1>
            <p className="text-muted-foreground mt-1">
              Compare medications across multiple parameters
            </p>
          </div>
        </div>
      </div>

      {/* Drug Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Drug 1</h2>
          <select
            value={drug1?.id || ''}
            onChange={(e) => setDrug1(allDrugs.find((d) => d.id === e.target.value) || null)}
            className="w-full p-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a drug...</option>
            {allDrugs.map((drug) => (
              <option key={drug.id} value={drug.id}>
                {drug.name} ({drug.class})
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Drug 2</h2>
          <select
            value={drug2?.id || ''}
            onChange={(e) => setDrug2(allDrugs.find((d) => d.id === e.target.value) || null)}
            className="w-full p-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a drug...</option>
            {allDrugs.map((drug) => (
              <option key={drug.id} value={drug.id}>
                {drug.name} ({drug.class})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      {(drug1 || drug2) && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent">
                <tr>
                  <th className="p-4 text-left font-semibold border-b">Category</th>
                  <th className="p-4 text-left font-semibold border-b border-l">
                    {drug1 ? drug1.name : 'Drug 1'}
                  </th>
                  <th className="p-4 text-left font-semibold border-b border-l">
                    {drug2 ? drug2.name : 'Drug 2'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonCategories.map((category) => (
                  <tr key={category.key} className="border-b last:border-b-0">
                    <td className="p-4 font-medium bg-accent/50 align-top">
                      {category.label}
                    </td>
                    <td className="p-4 border-l align-top">
                      {renderValue(drug1, category.key)}
                    </td>
                    <td className="p-4 border-l align-top">
                      {renderValue(drug2, category.key)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!drug1 && !drug2 && (
        <div className="rounded-lg border bg-card p-12 text-center">
          <GitCompare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Drugs Selected</h3>
          <p className="text-muted-foreground">
            Select drugs from the dropdowns above to compare them side by side
          </p>
        </div>
      )}

      {/* Educational Note */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-blue-500">Note:</span> This comparison tool provides
          general information about medications. Individual patient factors, comorbidities, and drug
          interactions should be considered when selecting medications. Always refer to current
          prescribing information and clinical guidelines.
        </p>
      </div>
    </div>
  );
};

export default DrugComparisonPage;
