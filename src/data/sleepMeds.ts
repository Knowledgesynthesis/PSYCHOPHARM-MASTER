import { Drug } from '@/types';

export const sleepMedsData: Drug[] = [
  {
    id: 'zolpidem',
    name: 'Zolpidem',
    class: 'Z-Drug (Non-Benzodiazepine Hypnotic)',
    mechanism: 'Selective GABA-A receptor modulator. Preferentially binds to alpha-1 subunit. Hypnotic effect with less anxiolytic, muscle relaxant, or anticonvulsant properties than benzodiazepines.',
    indications: [
      'Insomnia (short-term treatment)',
    ],
    contraindications: [
      'Hypersensitivity',
      'Complex sleep behaviors history',
    ],
    sideEffects: [
      'Drowsiness, dizziness',
      'Headache',
      'Complex sleep behaviors (sleepwalking, sleep-driving)',
      'Amnesia',
      'Hallucinations (rare)',
      'Dependence (lower than benzos but still present)',
    ],
    interactions: [
      'CNS depressants: additive sedation',
      'CYP3A4 substrate',
    ],
    monitoring: [
      'Complex sleep behaviors',
      'Dependence',
      'Next-day impairment',
    ],
    dosing: {
      starting: '5 mg (women), 5-10 mg (men) at bedtime',
      therapeutic: '5-10 mg at bedtime',
      maximum: '10 mg at bedtime',
    },
    switchingNotes: [
      'Short-term use recommended (2-4 weeks)',
      'Taper if chronic use',
      'Consider CBT-I for long-term insomnia',
    ],
    warnings: [
      'Black box: Complex sleep behaviors (sleepwalking, sleep-driving)',
      'Risk of next-day impairment, especially in women and elderly',
      'Avoid alcohol',
    ],
    specialPopulations: {
      pregnancy: 'Category C.',
      lactation: 'Excreted in milk; caution.',
      geriatric: 'Lower dose (5 mg); Beers Criteria caution.',
      renal: 'No adjustment.',
      hepatic: 'Use lower dose; avoid in severe impairment.',
    },
  },
  {
    id: 'eszopiclone',
    name: 'Eszopiclone',
    class: 'Z-Drug (Non-Benzodiazepine Hypnotic)',
    mechanism: 'GABA-A receptor modulator. Similar to zolpidem but with longer half-life.',
    indications: [
      'Insomnia',
    ],
    contraindications: [
      'Hypersensitivity',
    ],
    sideEffects: [
      'Unpleasant taste (metallic)',
      'Drowsiness',
      'Headache',
      'Complex sleep behaviors',
      'Next-day impairment',
    ],
    interactions: [
      'CYP3A4 substrate',
      'CNS depressants',
    ],
    monitoring: [
      'Complex sleep behaviors',
      'Next-day impairment',
    ],
    dosing: {
      starting: '1 mg at bedtime',
      therapeutic: '2-3 mg at bedtime',
      maximum: '3 mg at bedtime',
    },
    switchingNotes: [
      'Can be used longer-term than zolpidem (FDA approved up to 6 months)',
      'Similar profile to zolpidem',
    ],
    warnings: [
      'Complex sleep behaviors',
      'Unpleasant taste common',
    ],
    specialPopulations: {
      pregnancy: 'Category C.',
      lactation: 'Unknown; caution.',
      geriatric: 'Lower dose (1-2 mg).',
      renal: 'No adjustment.',
      hepatic: 'Lower dose; avoid in severe impairment.',
    },
  },
  {
    id: 'trazodone',
    name: 'Trazodone',
    class: 'Atypical Antidepressant (used off-label for insomnia)',
    mechanism: 'Serotonin antagonist/reuptake inhibitor (SARI). 5-HT2A antagonist and weak SERT inhibitor. Strong H1 antagonist causing sedation.',
    indications: [
      'Major depressive disorder (FDA approved)',
      'Insomnia (off-label, most common use)',
    ],
    contraindications: [
      'MAOI use',
    ],
    sideEffects: [
      'Sedation',
      'Orthostatic hypotension',
      'Dizziness',
      'Headache',
      'Dry mouth',
      'Priapism (rare but serious)',
      'Cardiac arrhythmias (rare)',
    ],
    interactions: [
      'CYP3A4 substrate',
      'Serotonergic drugs: additive serotonin effects',
    ],
    monitoring: [
      'Blood pressure',
      'Sedation',
      'Priapism warning (rare)',
    ],
    dosing: {
      starting: '25-50 mg at bedtime (insomnia)',
      therapeutic: '50-100 mg at bedtime (insomnia); 150-400 mg daily (depression)',
      maximum: '600 mg daily (depression)',
    },
    switchingNotes: [
      'Commonly used off-label for insomnia due to sedation',
      'Often combined with SSRIs/SNRIs for both depression and sleep',
    ],
    warnings: [
      'Orthostatic hypotension risk',
      'Priapism (rare but requires emergency intervention)',
      'Not FDA approved for insomnia',
    ],
    specialPopulations: {
      pregnancy: 'Category C.',
      lactation: 'Excreted in milk; caution.',
      geriatric: 'Lower doses; fall risk due to orthostatic hypotension.',
      renal: 'Caution.',
      hepatic: 'Lower dose.',
    },
  },
  {
    id: 'ramelteon',
    name: 'Ramelteon',
    class: 'Melatonin Receptor Agonist',
    mechanism: 'Selective melatonin MT1 and MT2 receptor agonist. Promotes sleep onset by regulating circadian rhythm. No GABA activity, so no dependence.',
    indications: [
      'Insomnia (difficulty with sleep onset)',
    ],
    contraindications: [
      'Severe hepatic impairment',
      'Concurrent fluvoxamine (strong CYP1A2 inhibitor)',
    ],
    sideEffects: [
      'Dizziness',
      'Fatigue',
      'Headache',
      'Nausea',
      'Hormonal effects (decreased testosterone, increased prolactin - rare)',
      'No dependence potential',
    ],
    interactions: [
      'CYP1A2 substrate (avoid with fluvoxamine)',
      'CYP3A4 substrate',
    ],
    monitoring: [
      'Generally well tolerated',
      'Hormonal side effects if symptomatic',
    ],
    dosing: {
      starting: '8 mg at bedtime',
      therapeutic: '8 mg at bedtime',
      maximum: '8 mg at bedtime',
    },
    switchingNotes: [
      'Good alternative to Z-drugs or benzos (no dependence)',
      'Helps with sleep onset more than maintenance',
    ],
    warnings: [
      'Not for sleep maintenance insomnia',
      'Avoid with severe hepatic impairment',
    ],
    specialPopulations: {
      pregnancy: 'Category C.',
      lactation: 'Unknown; caution.',
      geriatric: 'Well tolerated.',
      renal: 'No adjustment.',
      hepatic: 'Contraindicated in severe impairment.',
    },
  },
];
