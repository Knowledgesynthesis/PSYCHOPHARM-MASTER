import { Drug } from '@/types';

export const anxietyAgentsData: Drug[] = [
  {
    id: 'buspirone',
    name: 'Buspirone',
    class: 'Azapirone Anxiolytic',
    mechanism: '5-HT1A partial agonist. Does not act on GABA receptors (unlike benzodiazepines). No sedation, no dependence potential.',
    indications: [
      'Generalized anxiety disorder (GAD)',
    ],
    contraindications: [
      'MAOI use',
    ],
    sideEffects: [
      'Dizziness',
      'Headache',
      'Nausea',
      'Nervousness',
      'No sedation',
      'No dependence or withdrawal',
    ],
    interactions: [
      'MAOIs: risk of hypertension',
      'CYP3A4 substrate',
    ],
    monitoring: [
      'Anxiety symptoms',
      'Generally well tolerated',
    ],
    dosing: {
      starting: '7.5 mg BID',
      therapeutic: '15-30 mg daily in divided doses',
      maximum: '60 mg daily',
    },
    switchingNotes: [
      'Not effective for panic disorder',
      'Delayed onset (2-4 weeks)',
      'Can be combined with SSRIs/SNRIs',
    ],
    warnings: [
      'Delayed onset of action (not for acute anxiety)',
      'No cross-tolerance with benzodiazepines',
    ],
    specialPopulations: {
      pregnancy: 'Category B.',
      lactation: 'Unknown; caution.',
      geriatric: 'Well tolerated.',
      renal: 'Reduce dose in severe impairment.',
      hepatic: 'Reduce dose in hepatic impairment.',
    },
  },
  {
    id: 'lorazepam',
    name: 'Lorazepam',
    class: 'Benzodiazepine',
    mechanism: 'GABA-A receptor positive allosteric modulator. Enhances GABAergic inhibition, causing anxiolysis, sedation, muscle relaxation.',
    indications: [
      'Anxiety disorders (short-term)',
      'Insomnia',
      'Acute agitation',
      'Seizures',
      'Alcohol withdrawal',
    ],
    contraindications: [
      'Acute narrow-angle glaucoma',
      'Severe respiratory insufficiency',
      'Sleep apnea (relative)',
    ],
    sideEffects: [
      'Sedation',
      'Cognitive impairment',
      'Ataxia, falls',
      'Dependence and withdrawal',
      'Respiratory depression (especially with opioids)',
      'Paradoxical agitation (rare)',
    ],
    interactions: [
      'CNS depressants (opioids, alcohol): additive sedation and respiratory depression',
      'Metabolized by glucuronidation (not CYP), so fewer drug interactions than other benzos',
    ],
    monitoring: [
      'Dependence risk',
      'Sedation and fall risk',
      'Respiratory status if combined with CNS depressants',
    ],
    dosing: {
      starting: '0.5-1 mg BID-TID',
      therapeutic: '1-6 mg daily in divided doses',
      maximum: '10 mg daily',
    },
    switchingNotes: [
      'Taper slowly to avoid withdrawal (seizures, rebound anxiety)',
      'Transition to SSRIs/SNRIs for long-term anxiety management',
    ],
    warnings: [
      'Physical dependence with chronic use',
      'Withdrawal can be life-threatening (seizures)',
      'Beers Criteria: avoid in elderly',
    ],
    specialPopulations: {
      pregnancy: 'Category D. Risk of floppy infant syndrome, withdrawal in neonate.',
      lactation: 'Excreted in milk; avoid.',
      geriatric: 'Beers Criteria: avoid. High fall and cognitive impairment risk.',
      renal: 'Safer choice in renal impairment (glucuronidation).',
      hepatic: 'Safer choice in hepatic impairment (glucuronidation).',
    },
  },
  {
    id: 'alprazolam',
    name: 'Alprazolam',
    class: 'Benzodiazepine',
    mechanism: 'GABA-A receptor positive allosteric modulator. Short-acting, high-potency benzodiazepine.',
    indications: [
      'Panic disorder',
      'Generalized anxiety disorder (short-term)',
    ],
    contraindications: [
      'Acute narrow-angle glaucoma',
      'Concurrent ketoconazole or itraconazole (CYP3A4 inhibitors)',
    ],
    sideEffects: [
      'Sedation',
      'Cognitive impairment',
      'Ataxia',
      'Dependence (high potential)',
      'Withdrawal (severe, especially with abrupt discontinuation)',
    ],
    interactions: [
      'CYP3A4 substrate: many interactions',
      'CNS depressants: additive effects',
    ],
    monitoring: [
      'Dependence and misuse potential',
      'Withdrawal symptoms',
      'Sedation',
    ],
    dosing: {
      starting: '0.25-0.5 mg TID',
      therapeutic: '0.5-4 mg daily in divided doses',
      maximum: '10 mg daily (panic disorder)',
    },
    switchingNotes: [
      'Very difficult to taper due to short half-life and high potency',
      'Switch to longer-acting benzo (e.g., clonazepam, diazepam) then taper',
      'Transition to SSRIs for panic disorder',
    ],
    warnings: [
      'High dependence and misuse potential',
      'Severe withdrawal with abrupt discontinuation',
      'Short half-life leads to interdose rebound anxiety',
    ],
    specialPopulations: {
      pregnancy: 'Category D.',
      lactation: 'Excreted in milk; avoid.',
      geriatric: 'Beers Criteria: avoid.',
      renal: 'Caution.',
      hepatic: 'Caution; avoid in severe impairment.',
    },
  },
  {
    id: 'clonazepam',
    name: 'Clonazepam',
    class: 'Benzodiazepine',
    mechanism: 'GABA-A receptor positive allosteric modulator. Longer-acting than alprazolam.',
    indications: [
      'Panic disorder',
      'Seizure disorders',
      'Anxiety (off-label)',
      'REM sleep behavior disorder',
    ],
    contraindications: [
      'Severe hepatic impairment',
      'Acute narrow-angle glaucoma',
    ],
    sideEffects: [
      'Sedation',
      'Ataxia',
      'Cognitive impairment',
      'Dependence',
      'Depression',
    ],
    interactions: [
      'CNS depressants',
      'CYP3A4 substrate',
    ],
    monitoring: [
      'Sedation and fall risk',
      'Dependence',
      'Mood',
    ],
    dosing: {
      starting: '0.25 mg BID',
      therapeutic: '0.5-2 mg daily in divided doses',
      maximum: '4 mg daily',
    },
    switchingNotes: [
      'Longer half-life makes tapering easier than alprazolam',
      'Transition to SSRIs for long-term management',
    ],
    warnings: [
      'Dependence potential',
      'Beers Criteria: avoid in elderly',
      'Withdrawal risk',
    ],
    specialPopulations: {
      pregnancy: 'Category D.',
      lactation: 'Excreted in milk; avoid.',
      geriatric: 'Beers Criteria: avoid.',
      renal: 'Caution.',
      hepatic: 'Contraindicated in severe impairment.',
    },
  },
];
