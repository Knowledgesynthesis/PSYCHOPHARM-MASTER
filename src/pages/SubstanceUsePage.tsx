import { Beaker } from 'lucide-react';
import DrugCard from '@/components/DrugCard';
import { substanceUseData } from '@/data/substanceUse';

const SubstanceUsePage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-green-500/10">
            <Beaker className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Substance Use Pharmacotherapies</h1>
            <p className="text-muted-foreground mt-1">
              Medications for alcohol, opioid, and nicotine use disorders
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-3">Module Overview</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Pharmacotherapy is an important component of evidence-based treatment for substance use
            disorders. Understanding medication-assisted treatment (MAT) for alcohol, opioids, and
            nicotine can significantly improve patient outcomes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Key Concepts</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Naltrexone: opioid antagonist for alcohol/opioids</li>
                <li>Buprenorphine: partial agonist for opioid use disorder</li>
                <li>Methadone: OTP-only for opioid use disorder</li>
                <li>Varenicline: most effective for smoking cessation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Clinical Pearls</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Naltrexone: must be opioid-free before starting</li>
                <li>Buprenorphine: start in mild-moderate withdrawal</li>
                <li>Acamprosate: renally cleared, no interactions</li>
                <li>Combine pharmacotherapy with psychosocial treatment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Drug Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Medications</h2>
        <div className="space-y-4">
          {substanceUseData.map((drug) => (
            <DrugCard key={drug.id} drug={drug} />
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-yellow-500">Educational Note:</span> This module provides
          an educational overview of pharmacotherapies for substance use disorders. Treatment of substance
          use disorders should always be provided within the context of comprehensive care including
          psychosocial interventions. Prescribing regulations (e.g., X-waiver for buprenorphine, OTP
          requirements for methadone) must be followed.
        </p>
      </div>
    </div>
  );
};

export default SubstanceUsePage;
