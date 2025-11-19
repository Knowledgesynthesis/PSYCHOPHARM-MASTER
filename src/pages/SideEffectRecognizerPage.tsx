import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
}

interface AdverseEffect {
  name: string;
  symptoms: string[];
  keyFeatures: string[];
  management: string[];
  urgency: 'emergency' | 'urgent' | 'routine';
}

const symptoms: Symptom[] = [
  { id: 'fever', name: 'Fever' },
  { id: 'rigidity', name: 'Muscle rigidity' },
  { id: 'tremor', name: 'Tremor' },
  { id: 'confusion', name: 'Confusion/altered mental status' },
  { id: 'hyperreflexia', name: 'Hyperreflexia' },
  { id: 'clonus', name: 'Clonus' },
  { id: 'agitation', name: 'Agitation' },
  { id: 'diaphoresis', name: 'Diaphoresis (sweating)' },
  { id: 'diarrhea', name: 'Diarrhea' },
  { id: 'mydriasis', name: 'Mydriasis (dilated pupils)' },
  { id: 'ataxia', name: 'Ataxia' },
  { id: 'coarseTremor', name: 'Coarse tremor' },
  { id: 'nausea', name: 'Nausea/vomiting' },
  { id: 'dystonia', name: 'Dystonia/muscle spasms' },
  { id: 'restlessness', name: 'Restlessness/inability to sit still' },
  { id: 'rash', name: 'Rash' },
];

const adverseEffects: AdverseEffect[] = [
  {
    name: 'Serotonin Syndrome',
    symptoms: ['fever', 'hyperreflexia', 'clonus', 'agitation', 'diaphoresis', 'diarrhea', 'mydriasis', 'tremor'],
    keyFeatures: [
      'Triad: altered mental status, autonomic hyperactivity, neuromuscular abnormalities',
      'Clonus (especially ocular and spontaneous) is highly specific',
      'Hyperreflexia more prominent in lower extremities',
      'Caused by excess serotonergic activity',
    ],
    management: [
      'Discontinue serotonergic agents immediately',
      'Supportive care',
      'Benzodiazepines for agitation',
      'Cyproheptadine (5-HT antagonist) in severe cases',
      'ICU admission for severe cases',
    ],
    urgency: 'emergency',
  },
  {
    name: 'Neuroleptic Malignant Syndrome (NMS)',
    symptoms: ['fever', 'rigidity', 'confusion', 'diaphoresis', 'tremor'],
    keyFeatures: [
      'Lead-pipe rigidity (sustained, not intermittent)',
      'Elevated CK, leukocytosis',
      'Caused by dopamine blockade (antipsychotics)',
      'Develops over days (slower onset than serotonin syndrome)',
    ],
    management: [
      'Discontinue antipsychotic immediately',
      'Supportive care and cooling',
      'Dantrolene or bromocriptine in severe cases',
      'ICU admission',
    ],
    urgency: 'emergency',
  },
  {
    name: 'Lithium Toxicity',
    symptoms: ['coarseTremor', 'ataxia', 'confusion', 'nausea', 'diarrhea'],
    keyFeatures: [
      'Coarse tremor (vs fine tremor at therapeutic levels)',
      'Ataxia, dysarthria, nystagmus',
      'Can progress to seizures, coma, arrhythmias',
      'Serum lithium level >1.5 mEq/L',
    ],
    management: [
      'Check lithium level immediately',
      'Hold lithium',
      'Hydration and electrolyte management',
      'Hemodialysis for severe toxicity',
    ],
    urgency: 'emergency',
  },
  {
    name: 'Acute Dystonia',
    symptoms: ['dystonia', 'rigidity'],
    keyFeatures: [
      'Sudden onset muscle spasms (neck, eyes, tongue)',
      'Oculogyric crisis, torticollis',
      'Caused by antipsychotics (especially FGAs)',
      'More common in young males',
    ],
    management: [
      'Diphenhydramine 50 mg IM/IV or benztropine 1-2 mg IM/IV',
      'Rapid response to anticholinergics',
      'Consider prophylactic anticholinergics if continuing antipsychotic',
    ],
    urgency: 'urgent',
  },
  {
    name: 'Akathisia',
    symptoms: ['restlessness', 'agitation'],
    keyFeatures: [
      'Subjective feeling of inner restlessness',
      'Inability to sit still, pacing, leg movements',
      'Caused by antipsychotics (especially aripiprazole)',
      'Can be mistaken for anxiety or agitation',
    ],
    management: [
      'Reduce dose or switch antipsychotic',
      'Beta-blocker (propranolol 20-40 mg TID)',
      'Benzodiazepines',
      'Anticholinergics less effective than for other EPS',
    ],
    urgency: 'routine',
  },
  {
    name: 'Stevens-Johnson Syndrome / TEN',
    symptoms: ['rash', 'fever'],
    keyFeatures: [
      'Severe mucocutaneous reaction',
      'Caused by lamotrigine, carbamazepine (especially with HLA-B*1502)',
      'Skin detachment, mucosal involvement',
      'Medical emergency',
    ],
    management: [
      'Discontinue offending agent immediately',
      'Dermatology and burn unit consultation',
      'Supportive care',
      'Do NOT rechallenge',
    ],
    urgency: 'emergency',
  },
];

const SideEffectRecognizerPage = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<AdverseEffect[]>([]);

  const toggleSymptom = (symptomId: string) => {
    const newSelection = new Set(selectedSymptoms);
    if (newSelection.has(symptomId)) {
      newSelection.delete(symptomId);
    } else {
      newSelection.add(symptomId);
    }
    setSelectedSymptoms(newSelection);
  };

  const analyzeSymptoms = () => {
    const selectedArray = Array.from(selectedSymptoms);
    const matches = adverseEffects
      .map((effect) => {
        const matchCount = effect.symptoms.filter((s) => selectedArray.includes(s)).length;
        const matchPercentage = effect.symptoms.length > 0 ? matchCount / effect.symptoms.length : 0;
        return { effect, matchCount, matchPercentage };
      })
      .filter((m) => m.matchCount > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    setResults(matches.map((m) => m.effect));
  };

  const resetSelection = () => {
    setSelectedSymptoms(new Set());
    setResults([]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-primary-500/10">
            <AlertCircle className="h-8 w-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Side Effect Recognizer</h1>
            <p className="text-muted-foreground mt-1">
              Pattern recognition for adverse effects and emergencies
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-3">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Select the symptoms present in your clinical scenario</li>
          <li>Click "Analyze Symptoms" to see potential adverse effects</li>
          <li>Review the differential diagnosis and management recommendations</li>
          <li>This is an educational tool - always correlate with clinical context</li>
        </ol>
      </div>

      {/* Symptom Selection */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Select Symptoms</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {symptoms.map((symptom) => (
            <button
              key={symptom.id}
              onClick={() => toggleSymptom(symptom.id)}
              className={`p-3 rounded-lg border text-sm text-left transition-all ${
                selectedSymptoms.has(symptom.id)
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'hover:border-primary-500/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <span>{symptom.name}</span>
                {selectedSymptoms.has(symptom.id) && (
                  <CheckCircle className="h-4 w-4 text-primary-500 flex-shrink-0 ml-2" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={analyzeSymptoms}
            disabled={selectedSymptoms.size === 0}
            className="px-6 py-2 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Analyze Symptoms
          </button>
          <button
            onClick={resetSelection}
            className="px-6 py-2 rounded-lg border hover:bg-accent transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Differential Diagnosis</h2>
          {results.map((effect, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-6 space-y-4 ${
                effect.urgency === 'emergency'
                  ? 'border-red-500/50 bg-red-500/5'
                  : effect.urgency === 'urgent'
                  ? 'border-yellow-500/50 bg-yellow-500/5'
                  : 'border-blue-500/50 bg-blue-500/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold">{effect.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    effect.urgency === 'emergency'
                      ? 'bg-red-500 text-white'
                      : effect.urgency === 'urgent'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {effect.urgency.toUpperCase()}
                </span>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {effect.keyFeatures.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Management:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {effect.management.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && selectedSymptoms.size > 0 && (
        <div className="rounded-lg border bg-card p-6 text-center">
          <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Click "Analyze Symptoms" to see potential adverse effects
          </p>
        </div>
      )}

      {/* Educational Disclaimer */}
      <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-6">
        <div className="flex items-start space-x-4">
          <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-yellow-500">Educational Tool - Clinical Judgment Required</h3>
            <p className="text-sm text-muted-foreground">
              This tool is designed for educational purposes to help learn adverse effect recognition patterns.
              It does not replace clinical assessment, laboratory testing, or expert consultation. Always
              consider the full clinical context and seek appropriate emergency care for life-threatening
              conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideEffectRecognizerPage;
