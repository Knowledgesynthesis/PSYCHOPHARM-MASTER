import { useState } from 'react';
import { Repeat, AlertTriangle, CheckCircle } from 'lucide-react';

interface SwitchingScenario {
  fromClass: string;
  toClass: string;
  method: 'direct' | 'cross-taper' | 'washout';
  duration?: string;
  steps: string[];
  cautions: string[];
  monitoring: string[];
}

const switchingScenarios: SwitchingScenario[] = [
  {
    fromClass: 'SSRI',
    toClass: 'SSRI',
    method: 'direct',
    steps: [
      'Most SSRIs can be switched directly',
      'Stop SSRI #1',
      'Start SSRI #2 at therapeutic dose the next day',
      'Exception: fluoxetine requires washout due to long half-life',
    ],
    cautions: [
      'Fluoxetine has a long half-life (4-6 days); consider lower starting dose of new SSRI',
      'Monitor for discontinuation symptoms if switching from short half-life SSRI',
    ],
    monitoring: ['Mood', 'Anxiety', 'Discontinuation symptoms', 'Side effects of new medication'],
  },
  {
    fromClass: 'SSRI',
    toClass: 'SNRI',
    method: 'cross-taper',
    duration: '1-2 weeks',
    steps: [
      'Begin tapering SSRI while starting SNRI at low dose',
      'Gradually decrease SSRI over 1-2 weeks',
      'Simultaneously increase SNRI to therapeutic dose',
      'Complete SSRI taper once SNRI is at full dose',
    ],
    cautions: [
      'Monitor for serotonin syndrome (rare but possible during overlap)',
      'SNRIs may increase blood pressure',
    ],
    monitoring: ['Serotonergic symptoms', 'Blood pressure', 'Mood', 'Anxiety'],
  },
  {
    fromClass: 'SSRI',
    toClass: 'MAOI',
    method: 'washout',
    duration: '14 days (5 weeks for fluoxetine)',
    steps: [
      'Taper and discontinue SSRI',
      'Wait minimum 14 days washout (2 weeks)',
      'For fluoxetine: wait 5 weeks due to long half-life',
      'Start MAOI at low dose and titrate',
    ],
    cautions: [
      'NEVER overlap SSRI and MAOI - risk of fatal serotonin syndrome',
      'Fluoxetine requires 5-week washout due to active metabolite',
      'Patient must be willing to follow tyramine-restricted diet',
    ],
    monitoring: ['Ensure complete washout before MAOI initiation', 'Blood pressure', 'Dietary compliance'],
  },
  {
    fromClass: 'MAOI',
    toClass: 'SSRI',
    method: 'washout',
    duration: '14 days',
    steps: [
      'Taper and discontinue MAOI',
      'Wait minimum 14 days washout (2 weeks)',
      'Start SSRI at low dose',
      'Gradually titrate SSRI to therapeutic dose',
    ],
    cautions: [
      'NEVER overlap MAOI and SSRI - risk of fatal serotonin syndrome',
      'Patient can resume normal diet after MAOI washout',
    ],
    monitoring: ['Ensure complete washout', 'Serotonergic symptoms', 'Mood'],
  },
  {
    fromClass: 'SNRI',
    toClass: 'SSRI',
    method: 'cross-taper',
    duration: '1-2 weeks',
    steps: [
      'Begin tapering SNRI (especially important for venlafaxine)',
      'Start SSRI at low dose',
      'Gradually decrease SNRI over 1-2 weeks',
      'Titrate SSRI to therapeutic dose',
    ],
    cautions: [
      'Venlafaxine has short half-life and high discontinuation syndrome risk - taper slowly',
      'Monitor for discontinuation symptoms during taper',
    ],
    monitoring: ['Discontinuation symptoms', 'Blood pressure (may decrease)', 'Mood'],
  },
  {
    fromClass: 'First-generation Antipsychotic',
    toClass: 'Second-generation Antipsychotic',
    method: 'cross-taper',
    duration: '2-4 weeks',
    steps: [
      'Start SGA at low dose',
      'Gradually increase SGA over 1-2 weeks',
      'Begin tapering FGA once SGA at therapeutic dose',
      'Taper FGA over 2-4 weeks',
    ],
    cautions: [
      'Monitor for EPS during transition',
      'May need to continue anticholinergics during taper if patient on them',
      'Watch for withdrawal dyskinesias',
    ],
    monitoring: ['Psychotic symptoms', 'EPS/movement disorders', 'Metabolic parameters (with SGA)'],
  },
  {
    fromClass: 'Benzodiazepine',
    toClass: 'SSRI',
    method: 'cross-taper',
    duration: 'Weeks to months',
    steps: [
      'Start SSRI/SNRI for long-term anxiety management',
      'Wait 4-6 weeks for SSRI to reach full effect',
      'Begin VERY slow benzodiazepine taper (10-25% every 1-2 weeks)',
      'May take months for complete benzodiazepine taper',
    ],
    cautions: [
      'Never abruptly stop benzodiazepines - risk of seizures',
      'Switch to longer-acting benzo (clonazepam, diazepam) before taper if on short-acting (alprazolam)',
      'Patient may experience rebound anxiety during taper',
    ],
    monitoring: ['Anxiety symptoms', 'Withdrawal symptoms', 'Seizure risk'],
  },
  {
    fromClass: 'TCA',
    toClass: 'SSRI',
    method: 'cross-taper',
    duration: '1-2 weeks',
    steps: [
      'Start SSRI at low dose',
      'Begin tapering TCA',
      'Gradually decrease TCA over 1-2 weeks',
      'Titrate SSRI to therapeutic dose',
    ],
    cautions: [
      'Some SSRIs inhibit CYP2D6 and may increase TCA levels during overlap',
      'Monitor for anticholinergic withdrawal during TCA taper',
    ],
    monitoring: ['TCA side effects during overlap', 'Anticholinergic withdrawal', 'Mood'],
  },
];

const drugClasses = [
  'SSRI',
  'SNRI',
  'MAOI',
  'TCA',
  'Atypical Antidepressant',
  'First-generation Antipsychotic',
  'Second-generation Antipsychotic',
  'Benzodiazepine',
  'Mood Stabilizer',
];

const SwitchingSimulatorPage = () => {
  const [fromClass, setFromClass] = useState<string>('');
  const [toClass, setToClass] = useState<string>('');
  const [scenario, setScenario] = useState<SwitchingScenario | null>(null);

  const findScenario = () => {
    if (!fromClass || !toClass) {
      setScenario(null);
      return;
    }

    const found = switchingScenarios.find(
      (s) => s.fromClass === fromClass && s.toClass === toClass
    );

    setScenario(found || null);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'direct':
        return 'text-green-500 bg-green-500/10';
      case 'cross-taper':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'washout':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-primary-500/10">
            <Repeat className="h-8 w-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Switching Simulator</h1>
            <p className="text-muted-foreground mt-1">
              Learn safe medication switching strategies
            </p>
          </div>
        </div>
      </div>

      {/* Drug Class Selection */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Select Switching Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">From (Current Medication Class)</label>
            <select
              value={fromClass}
              onChange={(e) => setFromClass(e.target.value)}
              className="w-full p-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select drug class...</option>
              {drugClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To (New Medication Class)</label>
            <select
              value={toClass}
              onChange={(e) => setToClass(e.target.value)}
              className="w-full p-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select drug class...</option>
              {drugClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={findScenario}
          disabled={!fromClass || !toClass}
          className="mt-6 px-6 py-2 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Find Switching Strategy
        </button>
      </div>

      {/* Switching Strategy */}
      {scenario && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  {scenario.fromClass} → {scenario.toClass}
                </h2>
              </div>
              <div className={`px-4 py-2 rounded-lg font-medium ${getMethodColor(scenario.method)}`}>
                {scenario.method.toUpperCase().replace('-', ' ')}
              </div>
            </div>

            {scenario.duration && (
              <div className="mb-4 p-3 rounded-lg bg-accent">
                <span className="font-medium">Duration: </span>
                {scenario.duration}
              </div>
            )}

            <div className="space-y-6">
              {/* Steps */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-semibold">Switching Steps</h3>
                </div>
                <ol className="space-y-2 ml-7">
                  {scenario.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary-500/10 text-primary-500 text-sm font-medium">
                        {idx + 1}
                      </span>
                      <span className="text-sm pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Cautions */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold">Cautions</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 ml-7 text-sm">
                  {scenario.cautions.map((caution, idx) => (
                    <li key={idx}>{caution}</li>
                  ))}
                </ul>
              </div>

              {/* Monitoring */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Repeat className="h-5 w-5 text-primary-500" />
                  <h3 className="text-lg font-semibold">Monitoring Parameters</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 ml-7 text-sm">
                  {scenario.monitoring.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {!scenario && fromClass && toClass && (
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/5 p-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-500 mb-2">Scenario Not Available</h3>
              <p className="text-sm text-muted-foreground">
                A switching strategy for this specific combination is not currently available in the simulator.
                Please refer to current clinical guidelines and consult with a specialist for complex switching
                scenarios. Common principles: avoid MAOI overlaps, taper slowly to avoid withdrawal, and monitor
                closely during transitions.
              </p>
            </div>
          </div>
        </div>
      )}

      {!fromClass && !toClass && (
        <div className="rounded-lg border bg-card p-12 text-center">
          <Repeat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Scenario Selected</h3>
          <p className="text-muted-foreground">
            Select medication classes above to view switching strategies
          </p>
        </div>
      )}

      {/* Educational Note */}
      <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-6">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-yellow-500">Educational Tool - Clinical Judgment Required</h3>
            <p className="text-sm text-muted-foreground">
              This simulator provides general guidelines for medication switching. Individual patient factors,
              psychiatric stability, medical comorbidities, and current symptom severity must be considered.
              Some switches may require inpatient monitoring. Always consult current clinical guidelines and
              consider specialist consultation for complex cases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwitchingSimulatorPage;
