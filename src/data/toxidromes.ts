export interface Sign { id: string; label: string; group: 'Vitals' | 'Neuromuscular' | 'Mental status' | 'Autonomic/GI' | 'Skin' | 'Labs/ECG' }

export const SIGNS: Sign[] = [
  { id: 'hyperthermia', label: 'Temperature >38 °C', group: 'Vitals' },
  { id: 'tachycardia', label: 'Tachycardia', group: 'Vitals' },
  { id: 'labileBP', label: 'Labile blood pressure', group: 'Vitals' },
  { id: 'severeHTN', label: 'Severe hypertension', group: 'Vitals' },
  { id: 'respDepression', label: 'Slow/shallow breathing', group: 'Vitals' },
  { id: 'rigidity', label: '"Lead-pipe" rigidity', group: 'Neuromuscular' },
  { id: 'clonus', label: 'Clonus (inducible, ocular or spontaneous)', group: 'Neuromuscular' },
  { id: 'hyperreflexia', label: 'Hyperreflexia (legs > arms)', group: 'Neuromuscular' },
  { id: 'tremor', label: 'Fine tremor', group: 'Neuromuscular' },
  { id: 'coarseTremor', label: 'Coarse tremor', group: 'Neuromuscular' },
  { id: 'ataxia', label: 'Ataxia / dysarthria', group: 'Neuromuscular' },
  { id: 'sustainedSpasm', label: 'Sustained spasm (torticollis, oculogyric crisis)', group: 'Neuromuscular' },
  { id: 'innerRestlessness', label: 'Inner restlessness, cannot sit still', group: 'Neuromuscular' },
  { id: 'seizure', label: 'Seizure', group: 'Neuromuscular' },
  { id: 'agitation', label: 'Agitation', group: 'Mental status' },
  { id: 'delirium', label: 'Confusion / delirium', group: 'Mental status' },
  { id: 'catatonicSigns', label: 'Mutism, posturing, staring, negativism', group: 'Mental status' },
  { id: 'hallucinations', label: 'Visual/tactile hallucinations', group: 'Mental status' },
  { id: 'sedationComa', label: 'Sedation / coma', group: 'Mental status' },
  { id: 'occipitalHeadache', label: 'Sudden severe (occipital) headache', group: 'Mental status' },
  { id: 'mydriasis', label: 'Dilated pupils', group: 'Autonomic/GI' },
  { id: 'miosis', label: 'Pinpoint pupils', group: 'Autonomic/GI' },
  { id: 'diarrhea', label: 'Diarrhea / hyperactive bowel sounds', group: 'Autonomic/GI' },
  { id: 'vomiting', label: 'Vomiting', group: 'Autonomic/GI' },
  { id: 'decreasedBowel', label: 'Absent bowel sounds', group: 'Autonomic/GI' },
  { id: 'abdominalDistension', label: 'Abdominal distension / severe constipation', group: 'Autonomic/GI' },
  { id: 'urinaryRetention', label: 'Urinary retention', group: 'Autonomic/GI' },
  { id: 'diaphoresis', label: 'Diaphoresis', group: 'Skin' },
  { id: 'drySkin', label: 'Hot, dry, flushed skin', group: 'Skin' },
  { id: 'rashMucosal', label: 'Blistering rash with mucosal involvement', group: 'Skin' },
  { id: 'facialEdema', label: 'Rash with facial edema / lymphadenopathy', group: 'Skin' },
  { id: 'ckHigh', label: 'Markedly elevated CK', group: 'Labs/ECG' },
  { id: 'wideQRS', label: 'QRS >100 ms', group: 'Labs/ECG' },
  { id: 'chestPain', label: 'Chest pain / dyspnea, ↑ troponin', group: 'Labs/ECG' },
];

export interface Syndrome {
  id: string;
  name: string;
  urgency: 'emergency' | 'urgent' | 'routine';
  onset: string;
  causes: string[];
  hallmarks: string[];
  management: string[];
  pearl: string;
  weights: Record<string, number>;
}

export const SYNDROMES: Syndrome[] = [
  {
    id: 'serotonin', name: 'Serotonin syndrome', urgency: 'emergency', onset: 'Hours (usually <24 h after a new drug or dose increase)',
    causes: ['SSRIs/SNRIs/TCAs with MAOIs, linezolid, methylene blue', 'Tramadol, meperidine, methadone, fentanyl, dextromethorphan', 'Overdose of serotonergic drugs'],
    hallmarks: ['Neuromuscular hyperactivity: clonus (inducible, ocular, spontaneous), hyperreflexia legs > arms, tremor', 'Autonomic: diaphoresis, mydriasis, tachycardia, diarrhea, hyperthermia', 'Agitation → delirium', 'Diagnose with Hunter criteria (sensitivity 84%, specificity 97%)'],
    management: ['Stop all serotonergic agents', 'Supportive care; benzodiazepines for agitation and tremor', 'Cyproheptadine 12 mg PO/NG, then 2 mg every 2 h while symptomatic (8 mg every 6 h maintenance)', 'Temperature >41 °C: sedation, paralysis with a non-depolarizing agent, intubation; antipyretics do not work (muscle heat)', 'Avoid physical restraints (isometric contraction worsens hyperthermia)'],
    pearl: 'Clonus + hyperreflexia + rapid onset = serotonin syndrome; rigidity + bradyreflexia + slow onset = NMS.',
    weights: { clonus: 3, hyperreflexia: 3, tremor: 2, diaphoresis: 2, mydriasis: 2, diarrhea: 2, agitation: 1, hyperthermia: 1, tachycardia: 1, delirium: 1, rigidity: 1, drySkin: -2, decreasedBowel: -2, catatonicSigns: -2 },
  },
  {
    id: 'nms', name: 'Neuroleptic malignant syndrome', urgency: 'emergency', onset: 'Days to weeks (often first 2 weeks or after dose increase)',
    causes: ['Any D2 antagonist (high-potency, rapid titration, IM, dehydration)', 'Metoclopramide, prochlorperazine', 'Abrupt withdrawal of levodopa/dopamine agonists'],
    hallmarks: ['Lead-pipe rigidity, bradyreflexia, tremor', 'Hyperthermia', 'Altered mental status, mutism', 'Autonomic instability (labile BP, tachycardia, diaphoresis)', 'CK ≥4× ULN, leukocytosis, myoglobinuria (consensus criteria, Gurrera 2011)'],
    management: ['Stop the antipsychotic (and anticholinergics only gradually)', 'ICU: cooling, IV fluids, correct electrolytes, DVT prophylaxis', 'Lorazepam 1–2 mg IV for mild–moderate cases', 'Dantrolene and/or bromocriptine (or amantadine) for moderate–severe', 'ECT if refractory', 'Rechallenge only after ≥2 weeks with a low-potency/atypical agent, slow titration'],
    pearl: 'Develops over days; muscles are rigid and reflexes are reduced — the opposite of serotonin syndrome.',
    weights: { rigidity: 3, hyperthermia: 3, ckHigh: 3, delirium: 2, labileBP: 2, catatonicSigns: 2, diaphoresis: 1, tachycardia: 1, tremor: 1, clonus: -2, hyperreflexia: -1, diarrhea: -1, drySkin: -1 },
  },
  {
    id: 'anticholinergic', name: 'Anticholinergic toxicity', urgency: 'emergency', onset: 'Hours',
    causes: ['Diphenhydramine, TCAs, benztropine, low-potency antipsychotics, oxybutynin', 'Combinations in older adults'],
    hallmarks: ['"Hot as a hare, dry as a bone, red as a beet, blind as a bat, mad as a hatter, full as a flask"', 'Dry skin (key discriminator), mydriasis, absent bowel sounds, urinary retention', 'Tachycardia, hyperthermia', 'Delirium with picking behavior, visual hallucinations'],
    management: ['Stop offending agents; supportive care; benzodiazepines for agitation', 'Physostigmine (toxicology input) for peripheral + central toxicity without QRS widening', 'Bladder catheterization; active cooling'],
    pearl: 'Dry axillae point to anticholinergic toxicity; serotonin syndrome and NMS are sweaty.',
    weights: { drySkin: 3, decreasedBowel: 3, urinaryRetention: 3, mydriasis: 2, delirium: 2, tachycardia: 2, hallucinations: 1, hyperthermia: 1, diaphoresis: -3, clonus: -1, rigidity: -1 },
  },
  {
    id: 'malignant-catatonia', name: 'Malignant catatonia', urgency: 'emergency', onset: 'Days',
    causes: ['Catatonia in mood/psychotic disorders or medical illness', 'Benzodiazepine or clozapine withdrawal', 'Antipsychotics can precipitate or worsen it (overlaps with NMS)'],
    hallmarks: ['Catatonic signs: mutism, staring, posturing, negativism, waxy flexibility (Bush–Francis scale)', 'Fever, autonomic instability, rigidity', 'Elevated CK'],
    management: ['Stop antipsychotics', 'Lorazepam challenge 1–2 mg IV and scheduled high doses', 'Urgent ECT if not rapidly responsive (life-saving)', 'Supportive ICU care'],
    pearl: 'Lorazepam challenge is diagnostic and therapeutic; NMS may be a drug-induced form of malignant catatonia.',
    weights: { catatonicSigns: 3, rigidity: 2, hyperthermia: 2, labileBP: 2, ckHigh: 2, delirium: 1, diaphoresis: 1, clonus: -1 },
  },
  {
    id: 'lithium', name: 'Lithium toxicity', urgency: 'emergency', onset: 'Acute (overdose) or chronic (days–weeks, often lower levels)',
    causes: ['Dehydration, intercurrent illness', 'NSAIDs, thiazides, ACE inhibitors/ARBs', 'Declining kidney function, older age', 'Overdose'],
    hallmarks: ['GI first in acute: vomiting, diarrhea', 'Neuro: coarse tremor, ataxia, dysarthria, confusion, myoclonus, hyperreflexia, seizures', 'ECG: T-wave flattening, sinus node dysfunction, QTc', 'Chronic toxicity can occur at "therapeutic" levels'],
    management: ['Hold lithium; check level (repeat every 2–6 h), creatinine, electrolytes, ECG', 'Isotonic fluids if volume-depleted; stop interacting drugs', 'Whole-bowel irrigation for large sustained-release ingestion; charcoal does not bind lithium', 'Hemodialysis per EXTRIP (Li >4.0 with impaired kidneys, or decreased consciousness/seizures/dysrhythmia)'],
    pearl: 'Fine tremor = side effect; coarse tremor + ataxia + confusion = toxicity until proven otherwise.',
    weights: { coarseTremor: 3, ataxia: 3, vomiting: 2, delirium: 2, diarrhea: 1, seizure: 1, hyperreflexia: 1, clonus: 1, mydriasis: -1, drySkin: -1 },
  },
  {
    id: 'tca', name: 'TCA overdose', urgency: 'emergency', onset: 'Within 6 h (deterioration can be abrupt)',
    causes: ['Amitriptyline, nortriptyline, clomipramine, doxepin (antidepressant doses)'],
    hallmarks: ['Na-channel blockade: QRS >100 ms (seizures), >160 ms (ventricular arrhythmia); terminal R in aVR', 'Anticholinergic toxidrome', 'Hypotension (α1), sedation, seizures'],
    management: ['IV sodium bicarbonate 1–2 mEq/kg boluses for QRS >100 ms, arrhythmia or hypotension; target pH 7.50–7.55', 'Benzodiazepines for seizures; avoid physostigmine and class IA/IC antiarrhythmics', 'Activated charcoal if airway protected and early', 'Intubate early if declining'],
    pearl: 'The ECG predicts the course: QRS width guides bicarbonate.',
    weights: { wideQRS: 3, seizure: 2, delirium: 2, tachycardia: 2, drySkin: 2, sedationComa: 2, mydriasis: 1, decreasedBowel: 1, diaphoresis: -2 },
  },
  {
    id: 'maoi-crisis', name: 'MAOI hypertensive crisis', urgency: 'emergency', onset: '30 min–2 h after tyramine or a sympathomimetic',
    causes: ['Tyramine-rich foods (aged cheese, cured meats, tap beer, soy sauce)', 'Pseudoephedrine, phenylephrine, amphetamines, cocaine', 'Some opioids/serotonergic drugs (mixed reactions)'],
    hallmarks: ['Sudden severe occipital headache, palpitations, neck stiffness', 'Severe hypertension, diaphoresis, mydriasis, vomiting', 'Risk of intracranial hemorrhage'],
    management: ['IV phentolamine 2–5 mg (or nicardipine/clevidipine infusion)', 'Avoid β-blockers alone (unopposed α)', 'Avoid sublingual nifedipine (precipitous hypotension)', 'CT head if neuro signs'],
    pearl: 'Headache + severe hypertension in a patient on an MAOI is a crisis until proven otherwise.',
    weights: { severeHTN: 3, occipitalHeadache: 3, diaphoresis: 1, tachycardia: 1, mydriasis: 1, vomiting: 1 },
  },
  {
    id: 'sjs', name: 'SJS / TEN', urgency: 'emergency', onset: 'Usually 4 days–8 weeks after starting',
    causes: ['Lamotrigine (rapid titration, with valproate, children)', 'Carbamazepine/oxcarbazepine (HLA-B*15:02)', 'Modafinil, phenytoin; many non-psychiatric drugs'],
    hallmarks: ['Prodrome of fever and malaise', 'Painful dusky/target lesions, blistering, skin detachment (SJS <10% BSA, TEN >30%)', 'Mucosal involvement (≥2 sites): oral, ocular, genital'],
    management: ['Stop the culprit immediately — never rechallenge', 'Burn/ICU care; ophthalmology early', 'Calculate SCORTEN; specialist-directed systemic therapy'],
    pearl: 'Any rash with fever, mucosal lesions, blistering or skin pain during lamotrigine titration = stop the drug.',
    weights: { rashMucosal: 3, hyperthermia: 1, facialEdema: -1 },
  },
  {
    id: 'dress', name: 'DRESS', urgency: 'emergency', onset: '2–8 weeks after starting',
    causes: ['Carbamazepine (HLA-A*31:01), lamotrigine, phenytoin', 'Olanzapine and ziprasidone (FDA warnings)'],
    hallmarks: ['Fever, morbilliform rash, facial edema', 'Lymphadenopathy', 'Eosinophilia/atypical lymphocytes; hepatitis, nephritis, myocarditis'],
    management: ['Stop the culprit', 'LFTs, creatinine, CBC with differential, troponin', 'Systemic corticosteroids for organ involvement (specialist)'],
    pearl: 'Late onset (weeks) and facial edema distinguish DRESS from simple drug rash.',
    weights: { facialEdema: 3, hyperthermia: 2, rashMucosal: 1 },
  },
  {
    id: 'dystonia', name: 'Acute dystonia', urgency: 'urgent', onset: 'Hours–5 days after starting or increasing a D2 antagonist',
    causes: ['High-potency FGAs (haloperidol, fluphenazine)', 'Metoclopramide, prochlorperazine', 'Young men at highest risk'],
    hallmarks: ['Sustained involuntary contractions: torticollis, oculogyric crisis, trismus, tongue protrusion', 'Laryngospasm (rare, dangerous)'],
    management: ['Benztropine 1–2 mg IM/IV or diphenhydramine 25–50 mg IM/IV — response in minutes', 'Continue oral anticholinergic for several days', 'Reduce dose or switch antipsychotic'],
    pearl: 'Often misread as "behavioral" — dramatic relief after an IM anticholinergic confirms it.',
    weights: { sustainedSpasm: 3, rigidity: 1 },
  },
  {
    id: 'akathisia', name: 'Akathisia', urgency: 'urgent', onset: 'Days to weeks',
    causes: ['Aripiprazole, cariprazine, lurasidone, high-potency FGAs', 'SSRIs (less common)', 'Metoclopramide'],
    hallmarks: ['Subjective inner restlessness with urge to move', 'Shifting, pacing, rocking, crossing/uncrossing legs', 'Associated with agitation, impulsivity and suicidality — often mistaken for anxiety or worsening psychosis'],
    management: ['Reduce dose or switch to a lower-risk agent', 'Propranolol 10–20 mg BID–TID (first-line)', 'Mirtazapine 15 mg (RCT evidence)', 'Benzodiazepine short-term; anticholinergics only if parkinsonism coexists'],
    pearl: 'Never "treat" akathisia by increasing the antipsychotic.',
    weights: { innerRestlessness: 3, agitation: 1 },
  },
  {
    id: 'clozapine-myocarditis', name: 'Clozapine myocarditis', urgency: 'emergency', onset: 'Weeks 1–8 of clozapine (peak ~3 weeks)',
    causes: ['Clozapine, especially rapid titration and valproate co-therapy'],
    hallmarks: ['Fever, tachycardia >120, chest pain, dyspnea, flu-like illness', 'Troponin >2× ULN, CRP >100 mg/L', 'ECG changes, ↓ ejection fraction'],
    management: ['Stop clozapine', 'Cardiology; echocardiogram', 'Rechallenge only with specialist input'],
    pearl: 'Benign clozapine fever is common early — check troponin and CRP to separate it from myocarditis.',
    weights: { chestPain: 3, tachycardia: 2, hyperthermia: 2 },
  },
  {
    id: 'clozapine-gi', name: 'Clozapine GI hypomotility', urgency: 'emergency', onset: 'Any time (risk persists)',
    causes: ['Clozapine (dose-related), plus other anticholinergics or opioids'],
    hallmarks: ['Constipation progressing to ileus, abdominal distension, vomiting', 'Bowel ischemia, perforation, aspiration'],
    management: ['Hold clozapine; surgical/medical review; imaging', 'Prevention: ask about bowels every visit, prophylactic laxatives (osmotic/stimulant), avoid anticholinergics'],
    pearl: 'Mortality from clozapine-induced ileus exceeds that of agranulocytosis in some series.',
    weights: { abdominalDistension: 3, decreasedBowel: 2, vomiting: 1 },
  },
  {
    id: 'alcohol-withdrawal', name: 'Alcohol withdrawal / delirium tremens', urgency: 'emergency', onset: '6–24 h (tremor) → 12–48 h (seizures) → 48–96 h (DTs)',
    causes: ['Abrupt cessation after heavy, prolonged use'],
    hallmarks: ['Tremor, sweating, anxiety, tachycardia, hypertension', 'Hallucinations (often tactile/visual) with clear sensorium (alcoholic hallucinosis)', 'Seizures', 'Delirium tremens: delirium + autonomic instability'],
    management: ['CIWA-Ar–guided benzodiazepines (symptom-triggered) or phenobarbital in experienced settings (ASAM 2020)', 'Thiamine before glucose; correct Mg2+, K+', 'ICU for DTs'],
    pearl: 'Benzodiazepines are the treatment; antipsychotics alone lower the seizure threshold and are adjuncts only.',
    weights: { tremor: 2, diaphoresis: 2, agitation: 2, delirium: 2, tachycardia: 2, hallucinations: 2, hyperthermia: 1, seizure: 1, mydriasis: 1, labileBP: 1, drySkin: -2 },
  },
  {
    id: 'opioid-overdose', name: 'Opioid overdose', urgency: 'emergency', onset: 'Minutes–hours',
    causes: ['Fentanyl and analogues (often unknowingly), methadone, other opioids', 'Combined with benzodiazepines, gabapentinoids, alcohol'],
    hallmarks: ['Respiratory depression (RR <12), miosis, decreased consciousness'],
    management: ['Ventilate; naloxone 4 mg nasal or 0.04–0.4 mg IV titrated to breathing', 'Observe for re-sedation (long-acting opioids)', 'Offer buprenorphine/MOUD and naloxone kit after recovery'],
    pearl: 'After a nonfatal overdose, starting MOUD is the single most effective mortality intervention.',
    weights: { respDepression: 3, miosis: 3, sedationComa: 2, mydriasis: -2, agitation: -1 },
  },
  {
    id: 'sedative-overdose', name: 'Benzodiazepine / sedative overdose', urgency: 'emergency', onset: 'Minutes–hours',
    causes: ['Benzodiazepines, Z-drugs, barbiturates, gabapentinoids — especially with alcohol or opioids'],
    hallmarks: ['Sedation to coma with relatively preserved vital signs (alone)', 'Ataxia, slurred speech', 'Respiratory depression mainly with co-ingestants'],
    management: ['Supportive airway care', 'Flumazenil generally avoided (precipitates seizures in dependent patients)'],
    pearl: 'Isolated benzodiazepine overdose rarely kills — co-ingestion with opioids or alcohol does.',
    weights: { sedationComa: 3, respDepression: 2, ataxia: 1 },
  },
];

export interface RankedSyndrome { syndrome: Syndrome; score: number; pct: number; matched: string[]; against: string[] }

export function rankSyndromes(selected: string[]): RankedSyndrome[] {
  const set = new Set(selected);
  return SYNDROMES.map((s) => {
    const positive = Object.values(s.weights).filter((w) => w > 0).reduce((a, b) => a + b, 0);
    let score = 0;
    const matched: string[] = [];
    const against: string[] = [];
    for (const [sign, w] of Object.entries(s.weights)) {
      if (!set.has(sign)) continue;
      score += w;
      (w > 0 ? matched : against).push(sign);
    }
    return { syndrome: s, score, pct: Math.max(0, Math.round((score / positive) * 100)), matched, against };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.pct - a.pct);
}

export const COMPARISON_TABLE = {
  columns: ['Feature', 'Serotonin syndrome', 'NMS', 'Anticholinergic', 'Malignant hyperthermia', 'Malignant catatonia'],
  rows: [
    ['Trigger', 'Serotonergic drugs', 'D2 antagonists', 'Antimuscarinic drugs', 'Volatile anesthetics, succinylcholine', 'Psychiatric/medical illness; benzodiazepine withdrawal'],
    ['Onset', '<24 h', 'Days–weeks', 'Hours', 'Minutes–hours of anesthesia', 'Days'],
    ['Muscles', 'Hypertonia legs > arms', 'Lead-pipe rigidity', 'Normal', 'Rigor mortis-like', 'Rigidity, posturing'],
    ['Reflexes', 'Hyperreflexia, clonus', 'Bradyreflexia', 'Normal', 'Hyporeflexia', 'Variable'],
    ['Pupils', 'Mydriasis', 'Normal', 'Mydriasis', 'Normal', 'Normal'],
    ['Skin', 'Diaphoresis', 'Diaphoresis, pallor', 'Hot, dry, red', 'Mottled, diaphoretic', 'Diaphoresis'],
    ['Bowel', 'Hyperactive', 'Normal/decreased', 'Absent', 'Decreased', 'Normal'],
    ['Key labs', 'Usually unremarkable', 'CK ↑↑, WBC ↑, low iron', '—', 'CK ↑, hypercarbia, acidosis', 'CK ↑'],
    ['Treatment', 'Stop drugs, benzodiazepines, cyproheptadine', 'Stop drug, supportive, dantrolene/bromocriptine', 'Supportive ± physostigmine', 'Dantrolene', 'Lorazepam, ECT'],
  ],
};
