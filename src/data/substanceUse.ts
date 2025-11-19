import { Drug } from '@/types';

export const substanceUseData: Drug[] = [
  {
    id: 'naltrexone',
    name: 'Naltrexone',
    class: 'Opioid Antagonist',
    mechanism: 'Mu-opioid receptor antagonist. Blocks rewarding effects of alcohol and opioids.',
    indications: [
      'Alcohol use disorder',
      'Opioid use disorder (after detoxification)',
    ],
    contraindications: [
      'Current opioid use or physiologic opioid dependence',
      'Acute opioid withdrawal',
      'Acute hepatitis or liver failure',
      'Positive urine opioid screen',
    ],
    sideEffects: [
      'Nausea',
      'Headache',
      'Dizziness',
      'Fatigue',
      'Hepatotoxicity (dose-dependent)',
      'Injection site reactions (IM formulation)',
    ],
    interactions: [
      'Opioids: Blocks analgesic effects; can precipitate withdrawal',
    ],
    monitoring: [
      'Liver function tests',
      'Urine drug screen (ensure opioid-free before initiating)',
      'Alcohol/opioid use',
    ],
    dosing: {
      starting: '25 mg daily (oral), then 50 mg daily; or 380 mg IM monthly',
      therapeutic: '50 mg daily (oral) or 380 mg IM monthly',
      maximum: '50 mg daily (oral)',
    },
    switchingNotes: [
      'Must be opioid-free 7-10 days before starting (14 days for long-acting opioids)',
      'Naloxone challenge test recommended before starting',
    ],
    warnings: [
      'Black box: Hepatotoxicity at high doses',
      'Can precipitate severe opioid withdrawal if patient using opioids',
      'Patients lose opioid tolerance: risk of overdose if naltrexone discontinued and opioid use resumed',
    ],
    specialPopulations: {
      pregnancy: 'Category C.',
      lactation: 'Excreted in milk; weigh risks.',
      geriatric: 'Caution.',
      renal: 'Caution in severe impairment.',
      hepatic: 'Contraindicated in acute hepatitis or liver failure.',
    },
  },
  {
    id: 'acamprosate',
    name: 'Acamprosate',
    class: 'NMDA Modulator',
    mechanism: 'Modulates glutamate (NMDA) receptors. Reduces craving and protracted withdrawal symptoms in alcohol use disorder.',
    indications: [
      'Alcohol use disorder (maintenance of abstinence)',
    ],
    contraindications: [
      'Severe renal impairment (CrCl <30 mL/min)',
    ],
    sideEffects: [
      'Diarrhea',
      'Nausea',
      'Headache',
      'Dizziness',
      'Suicidal ideation (rare)',
    ],
    interactions: [
      'No significant drug interactions (renally eliminated)',
    ],
    monitoring: [
      'Alcohol use',
      'Suicidal ideation',
      'Renal function',
    ],
    dosing: {
      starting: '666 mg TID',
      therapeutic: '666 mg TID (1998 mg daily)',
      maximum: '1998 mg daily',
    },
    switchingNotes: [
      'Can be combined with naltrexone for dual mechanism',
      'Requires abstinence initiation',
    ],
    warnings: [
      'Suicidal ideation reported',
      'Contraindicated in severe renal impairment',
    ],
    specialPopulations: {
      pregnancy: 'Category C.',
      lactation: 'Unknown; weigh risks.',
      geriatric: 'Monitor renal function.',
      renal: 'Contraindicated in CrCl <30; reduce dose in CrCl 30-50.',
      hepatic: 'No adjustment.',
    },
  },
  {
    id: 'buprenorphine',
    name: 'Buprenorphine',
    class: 'Partial Opioid Agonist',
    mechanism: 'Partial mu-opioid receptor agonist and kappa antagonist. Reduces cravings and withdrawal in opioid use disorder. Ceiling effect reduces overdose risk.',
    indications: [
      'Opioid use disorder (maintenance)',
      'Pain management (different formulations)',
    ],
    contraindications: [
      'Hypersensitivity',
      'Concurrent full opioid agonist use (can precipitate withdrawal)',
    ],
    sideEffects: [
      'Headache',
      'Nausea',
      'Constipation',
      'Sweating',
      'Insomnia',
      'Respiratory depression (less than full agonists)',
      'Hepatotoxicity',
      'Precipitated withdrawal if started too soon',
    ],
    interactions: [
      'CNS depressants (benzodiazepines, alcohol): respiratory depression risk',
      'CYP3A4 substrate',
    ],
    monitoring: [
      'Liver function tests',
      'Urine drug screens',
      'Diversion risk',
      'Respiratory status',
    ],
    dosing: {
      starting: '2-4 mg SL (induction), then titrate',
      therapeutic: '8-24 mg daily (maintenance)',
      maximum: '24 mg daily (sublingual); 32 mg daily (some formulations)',
    },
    switchingNotes: [
      'Induction: start in mild-moderate withdrawal (COWS ≥8-12) to avoid precipitated withdrawal',
      'Buprenorphine/naloxone combination preferred to reduce diversion',
    ],
    warnings: [
      'Black box: Risk of respiratory depression, especially with benzodiazepines; QT prolongation (high doses); neonatal opioid withdrawal syndrome',
      'Requires DEA X-waiver for prescribing (updated regulations as of 2023)',
      'Can precipitate withdrawal if started too early',
    ],
    specialPopulations: {
      pregnancy: 'Category C. Preferred over methadone by some; risk of neonatal opioid withdrawal.',
      lactation: 'Excreted in milk; weigh benefits of breastfeeding vs risk.',
      geriatric: 'Lower doses.',
      renal: 'Caution.',
      hepatic: 'Reduce dose; monitor LFTs.',
    },
  },
  {
    id: 'methadone',
    name: 'Methadone',
    class: 'Full Opioid Agonist',
    mechanism: 'Full mu-opioid receptor agonist. Long-acting, reduces cravings and withdrawal. Also NMDA antagonist.',
    indications: [
      'Opioid use disorder (maintenance)',
      'Chronic pain',
    ],
    contraindications: [
      'Respiratory depression',
      'Acute or severe bronchial asthma',
      'Prolonged QT interval',
    ],
    sideEffects: [
      'Sedation',
      'Constipation',
      'Sweating',
      'QT prolongation (can cause torsades de pointes)',
      'Respiratory depression',
      'Hormonal effects (hypogonadism)',
    ],
    interactions: [
      'CYP3A4, CYP2D6, CYP2B6 substrate: many interactions',
      'QT-prolonging drugs',
      'Benzodiazepines: respiratory depression',
    ],
    monitoring: [
      'ECG (QTc) at baseline and periodically',
      'Respiratory status',
      'Urine drug screens',
      'Diversion',
    ],
    dosing: {
      starting: '10-30 mg daily',
      therapeutic: '60-120 mg daily (maintenance)',
      maximum: 'Variable, based on tolerance and response',
    },
    switchingNotes: [
      'Dispensed only through certified opioid treatment programs (OTPs) for opioid use disorder',
      'Complex pharmacokinetics; long and variable half-life',
    ],
    warnings: [
      'Black box: QT prolongation and torsades de pointes; respiratory depression; accidental ingestion (fatal in children); neonatal opioid withdrawal',
      'Requires OTP for opioid use disorder treatment',
      'High overdose risk, especially in first 2 weeks',
    ],
    specialPopulations: {
      pregnancy: 'Category C. Preferred treatment for opioid use disorder in pregnancy; neonatal withdrawal expected.',
      lactation: 'Present in milk; benefits generally outweigh risks.',
      geriatric: 'Lower doses; monitor closely.',
      renal: 'Caution.',
      hepatic: 'Caution; accumulation risk.',
    },
  },
  {
    id: 'varenicline',
    name: 'Varenicline',
    class: 'Nicotinic Receptor Partial Agonist',
    mechanism: 'Partial agonist at alpha-4 beta-2 nicotinic receptors. Reduces craving and nicotine reward.',
    indications: [
      'Smoking cessation',
    ],
    contraindications: [
      'Hypersensitivity',
    ],
    sideEffects: [
      'Nausea',
      'Insomnia, vivid dreams',
      'Headache',
      'Neuropsychiatric symptoms (mood changes, suicidal ideation)',
      'Cardiovascular events (controversial)',
    ],
    interactions: [
      'Minimal drug interactions (renally eliminated)',
      'Nicotine replacement: additive nausea',
    ],
    monitoring: [
      'Mood and suicidal ideation',
      'Smoking status',
      'Cardiovascular symptoms',
    ],
    dosing: {
      starting: '0.5 mg daily x 3 days, then 0.5 mg BID x 4 days',
      therapeutic: '1 mg BID',
      maximum: '1 mg BID',
    },
    switchingNotes: [
      'Most effective smoking cessation medication',
      'Can combine with nicotine replacement (though nausea may increase)',
    ],
    warnings: [
      'Black box removed (2016), but monitor for neuropsychiatric symptoms',
      'Mood changes, depression, suicidal ideation reported',
      'Cardiovascular events debated; recent studies show lower risk',
    ],
    specialPopulations: {
      pregnancy: 'Category C.',
      lactation: 'Unknown; weigh benefits of smoking cessation.',
      geriatric: 'Well tolerated.',
      renal: 'Reduce dose in severe impairment.',
      hepatic: 'No adjustment.',
    },
  },
];
