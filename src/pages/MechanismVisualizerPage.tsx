import { useState } from 'react';
import { Eye, Activity, Zap, TrendingUp, TrendingDown } from 'lucide-react';

interface Neurotransmitter {
  name: string;
  color: string;
  effect: 'increase' | 'decrease' | 'neutral';
}

interface DrugMechanism {
  id: string;
  name: string;
  class: string;
  neurotransmitters: Neurotransmitter[];
  receptors: string[];
  description: string;
}

const mechanismData: DrugMechanism[] = [
  {
    id: 'ssri',
    name: 'SSRIs (e.g., Sertraline)',
    class: 'Selective Serotonin Reuptake Inhibitor',
    neurotransmitters: [
      { name: 'Serotonin (5-HT)', color: 'text-blue-500', effect: 'increase' },
    ],
    receptors: ['Serotonin transporter (SERT) blockade'],
    description: 'Blocks serotonin reuptake at the presynaptic neuron, increasing serotonin availability in the synaptic cleft.',
  },
  {
    id: 'snri',
    name: 'SNRIs (e.g., Venlafaxine)',
    class: 'Serotonin-Norepinephrine Reuptake Inhibitor',
    neurotransmitters: [
      { name: 'Serotonin (5-HT)', color: 'text-blue-500', effect: 'increase' },
      { name: 'Norepinephrine (NE)', color: 'text-orange-500', effect: 'increase' },
    ],
    receptors: ['SERT blockade', 'NET blockade (dose-dependent)'],
    description: 'Blocks both serotonin and norepinephrine reuptake. NE effect increases at higher doses.',
  },
  {
    id: 'bupropion',
    name: 'Bupropion',
    class: 'Norepinephrine-Dopamine Reuptake Inhibitor',
    neurotransmitters: [
      { name: 'Norepinephrine (NE)', color: 'text-orange-500', effect: 'increase' },
      { name: 'Dopamine (DA)', color: 'text-purple-500', effect: 'increase' },
    ],
    receptors: ['NET blockade', 'DAT blockade'],
    description: 'Increases NE and DA without affecting serotonin. No sexual side effects.',
  },
  {
    id: 'mirtazapine',
    name: 'Mirtazapine',
    class: 'Noradrenergic and Specific Serotonergic Antidepressant',
    neurotransmitters: [
      { name: 'Norepinephrine (NE)', color: 'text-orange-500', effect: 'increase' },
      { name: 'Serotonin (5-HT)', color: 'text-blue-500', effect: 'increase' },
    ],
    receptors: ['Alpha-2 antagonist', '5-HT2 antagonist', '5-HT3 antagonist', 'H1 antagonist (sedation)'],
    description: 'Alpha-2 antagonism increases NE and 5-HT release. H1 antagonism causes sedation and appetite increase.',
  },
  {
    id: 'haloperidol',
    name: 'Haloperidol',
    class: 'First-Generation Antipsychotic',
    neurotransmitters: [
      { name: 'Dopamine (DA)', color: 'text-purple-500', effect: 'decrease' },
    ],
    receptors: ['D2 receptor antagonist (high potency)'],
    description: 'Strong D2 blockade in mesolimbic (antipsychotic), nigrostriatal (EPS), and tuberoinfundibular (prolactin) pathways.',
  },
  {
    id: 'olanzapine',
    name: 'Olanzapine',
    class: 'Second-Generation Antipsychotic',
    neurotransmitters: [
      { name: 'Dopamine (DA)', color: 'text-purple-500', effect: 'decrease' },
      { name: 'Serotonin (5-HT)', color: 'text-blue-500', effect: 'decrease' },
    ],
    receptors: ['D2 antagonist', '5-HT2A antagonist', 'H1 antagonist', 'M1 antagonist'],
    description: '5-HT2A antagonism reduces EPS risk. H1 and M1 antagonism cause sedation and metabolic effects.',
  },
  {
    id: 'lithium',
    name: 'Lithium',
    class: 'Mood Stabilizer',
    neurotransmitters: [
      { name: 'Multiple systems', color: 'text-green-500', effect: 'neutral' },
    ],
    receptors: ['Modulates second messenger systems', 'Affects inositol metabolism', 'Neuroprotective effects'],
    description: 'Exact mechanism unclear. Modulates multiple neurotransmitter systems and has neuroprotective properties.',
  },
  {
    id: 'methylphenidate',
    name: 'Methylphenidate',
    class: 'Stimulant',
    neurotransmitters: [
      { name: 'Dopamine (DA)', color: 'text-purple-500', effect: 'increase' },
      { name: 'Norepinephrine (NE)', color: 'text-orange-500', effect: 'increase' },
    ],
    receptors: ['DAT blockade', 'NET blockade'],
    description: 'Blocks DA and NE reuptake in prefrontal cortex, improving attention and impulse control.',
  },
];

const MechanismVisualizerPage = () => {
  const [selectedDrug, setSelectedDrug] = useState<DrugMechanism>(mechanismData[0]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-primary-500/10">
            <Eye className="h-8 w-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Mechanism Visualizer</h1>
            <p className="text-muted-foreground mt-1">
              Explore neurotransmitter effects and receptor interactions
            </p>
          </div>
        </div>
      </div>

      {/* Drug Selection */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Select a Medication</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mechanismData.map((drug) => (
            <button
              key={drug.id}
              onClick={() => setSelectedDrug(drug)}
              className={`p-4 rounded-lg border text-left transition-all hover:shadow-md ${
                selectedDrug.id === drug.id
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'hover:border-primary-500/50'
              }`}
            >
              <div className="font-semibold">{drug.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{drug.class}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Visualization */}
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">{selectedDrug.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{selectedDrug.class}</p>
        </div>

        {/* Neurotransmitter Effects */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold">Neurotransmitter Effects</h3>
          </div>
          <div className="space-y-3">
            {selectedDrug.neurotransmitters.map((nt, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                <div className="flex items-center space-x-3">
                  <div className={`font-medium ${nt.color}`}>{nt.name}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {nt.effect === 'increase' && (
                    <>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-500">Increased</span>
                    </>
                  )}
                  {nt.effect === 'decrease' && (
                    <>
                      <TrendingDown className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-medium text-red-500">Decreased</span>
                    </>
                  )}
                  {nt.effect === 'neutral' && (
                    <>
                      <Activity className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium text-blue-500">Modulated</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Receptor Actions */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold">Receptor Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDrug.receptors.map((receptor, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-accent/50 text-sm">
                {receptor}
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Mechanism Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {selectedDrug.description}
          </p>
        </div>
      </div>

      {/* Educational Note */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-blue-500">Educational Note:</span> These visualizations
          represent simplified conceptual models of drug mechanisms. Actual pharmacology involves complex
          interactions across multiple receptor systems and brain regions.
        </p>
      </div>
    </div>
  );
};

export default MechanismVisualizerPage;
