// ---------------- QTc ----------------
export interface QtcResult {
  rr: number;
  bazett: number;
  fridericia: number;
  framingham: number;
  hodges: number;
}

export function computeQtc(qtMs: number, hr: number): QtcResult {
  const rr = 60 / hr;
  return {
    rr,
    bazett: Math.round(qtMs / Math.sqrt(rr)),
    fridericia: Math.round(qtMs / Math.cbrt(rr)),
    framingham: Math.round(qtMs + 154 * (1 - rr)),
    hodges: Math.round(qtMs + 1.75 * (hr - 60)),
  };
}

export type QtcBand = 'normal' | 'prolonged' | 'high-risk';

/** AHA/ACCF/HRS 2009: prolonged ≥450 ms (men) / ≥460 ms (women); ≥500 ms = high torsades risk. */
export function interpretQtc(qtc: number, sex: 'male' | 'female'): { band: QtcBand; text: string } {
  if (qtc >= 500) return { band: 'high-risk', text: 'QTc ≥500 ms: high torsades risk — stop or avoid QT-prolonging drugs, correct K+/Mg2+, cardiology input.' };
  const limit = sex === 'male' ? 450 : 460;
  if (qtc >= limit) return { band: 'prolonged', text: `Prolonged (≥${limit} ms). Avoid adding QT drugs; prefer lower-risk alternatives; correct electrolytes; repeat ECG.` };
  return { band: 'normal', text: 'Within normal limits. Recheck if adding QT drugs or if QTc rises >60 ms from baseline.' };
}

// ---------------- Lithium ----------------
export type LithiumContext = 'acute' | 'maintenance' | 'older';
export const LITHIUM_TARGETS: Record<LithiumContext, [number, number, string]> = {
  acute: [0.8, 1.2, 'Acute mania'],
  maintenance: [0.6, 0.8, 'Maintenance (0.8–1.0 if response is inadequate)'],
  older: [0.4, 0.8, 'Older adult (≥65 y)'],
};

export interface LithiumInput {
  level: number;
  hoursSinceDose: number;
  context: LithiumContext;
  symptoms: { gi: boolean; coarseTremor: boolean; ataxia: boolean; confusion: boolean; seizure: boolean; dysrhythmia: boolean; decreasedConsciousness: boolean };
  impairedKidney: boolean;
}

export interface LithiumResult {
  band: 'low' | 'target' | 'above' | 'toxic' | 'severe';
  headline: string;
  actions: string[];
  timingNote?: string;
  extrip?: { strength: 'recommended' | 'suggested'; reasons: string[] };
}

export function interpretLithium(i: LithiumInput): LithiumResult {
  const [lo, hi] = LITHIUM_TARGETS[i.context];
  const s = i.symptoms;
  const neuro = s.coarseTremor || s.ataxia || s.confusion;
  const severeSigns = s.seizure || s.dysrhythmia || s.decreasedConsciousness;
  const timingNote = i.hoursSinceDose < 10 || i.hoursSinceDose > 14
    ? `Drawn ${i.hoursSinceDose} h after the last dose — not a 12-h trough. ${i.hoursSinceDose < 10 ? 'Early levels overestimate steady state.' : 'Late levels underestimate exposure.'}`
    : undefined;

  const reasonsRec: string[] = [];
  const reasonsSug: string[] = [];
  if (i.level > 4.0 && i.impairedKidney) reasonsRec.push('Level >4.0 mmol/L with impaired kidney function');
  if (severeSigns) reasonsRec.push('Decreased consciousness, seizures or life-threatening dysrhythmia (any level)');
  if (i.level > 5.0) reasonsSug.push('Level >5.0 mmol/L');
  if (s.confusion) reasonsSug.push('Significant confusion');
  if (i.impairedKidney && i.level > 2.5) reasonsSug.push('Expected time to <1.0 mmol/L with optimal care likely >36 h (impaired kidneys)');
  const extrip = reasonsRec.length
    ? { strength: 'recommended' as const, reasons: reasonsRec }
    : reasonsSug.length && i.level > 1.5
      ? { strength: 'suggested' as const, reasons: reasonsSug }
      : undefined;

  const toxicActions = [
    'Hold lithium. Assess airway, volume status, neuro exam; ECG.',
    'Isotonic IV fluids if volume-depleted; stop NSAIDs, thiazides, ACE inhibitors/ARBs.',
    'Repeat level every 2–6 h (levels can rebound after redistribution or with sustained-release tablets).',
    'Contact poison control/nephrology early; whole-bowel irrigation for large sustained-release ingestions (activated charcoal does not bind lithium).',
  ];

  if (i.level > 2.5 || severeSigns) {
    return { band: 'severe', headline: 'Severe toxicity — emergency', actions: toxicActions, timingNote, extrip };
  }
  if (i.level > 1.5 || neuro) {
    return {
      band: 'toxic',
      headline: neuro && i.level <= 1.5 ? 'Clinical toxicity despite a "safe" level — treat the patient, not the number' : 'Toxic range',
      actions: toxicActions,
      timingNote,
      extrip,
    };
  }
  if (i.level > hi) {
    return {
      band: 'above',
      headline: `Above target (${lo}–${hi})`,
      actions: ['Check timing, adherence pattern, new interacting drugs, dehydration, intercurrent illness, renal function.', 'Reduce dose (~proportionally) and recheck in 5–7 days.', s.gi ? 'GI symptoms may be early toxicity — reassess within 24 h.' : 'Counsel on early toxicity signs.'],
      timingNote,
    };
  }
  if (i.level < lo) {
    return { band: 'low', headline: `Below target (${lo}–${hi})`, actions: ['Confirm adherence and trough timing.', 'If clinically indicated, increase dose (level rises roughly proportionally) and recheck in 5–7 days.'], timingNote };
  }
  return { band: 'target', headline: `In target range (${lo}–${hi})`, actions: ['Continue; recheck every 3–6 months and after any dose or interacting-drug change.', 'eGFR and TSH every 6 months; calcium annually.'], timingNote };
}

// ---------------- Clozapine ANC (labeling algorithm) ----------------
export type AncPopulation = 'general' | 'ben';
export interface AncResult {
  category: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  action: string;
  monitoring: string;
}

export function routineAncFrequency(monthsOnTreatment: number): string {
  if (monthsOnTreatment < 6) return 'Weekly (first 6 months)';
  if (monthsOnTreatment < 12) return 'Every 2 weeks (months 6–12)';
  return 'Monthly (after 12 months)';
}

export function interpretAnc(anc: number, pop: AncPopulation, months: number): AncResult {
  const routine = routineAncFrequency(months);
  if (pop === 'general') {
    if (anc >= 1500) return { category: 'Normal range (≥1,500/µL)', severity: 'normal', action: 'Continue clozapine.', monitoring: routine };
    if (anc >= 1000) return { category: 'Mild neutropenia (1,000–1,499/µL)', severity: 'mild', action: 'Continue clozapine.', monitoring: 'ANC three times weekly until ≥1,500/µL, then return to the routine schedule.' };
    if (anc >= 500) return { category: 'Moderate neutropenia (500–999/µL)', severity: 'moderate', action: 'Hematology consultation. Interrupt clozapine if clozapine-induced neutropenia is suspected; resume once ANC ≥1,000/µL.', monitoring: 'Daily until >1,000/µL, then three times weekly until ≥1,500/µL; then weekly for 4 weeks before returning to the routine schedule.' };
    return { category: 'Severe neutropenia (<500/µL)', severity: 'severe', action: 'Interrupt clozapine; hematology consultation; evaluate for infection/neutropenic fever. Do not rechallenge unless benefits clearly outweigh risks.', monitoring: 'Daily until >1,000/µL, then three times weekly until ≥1,500/µL.' };
  }
  if (anc >= 1000) return { category: 'Normal range for BEN/Duffy-null (≥1,000/µL)', severity: 'normal', action: 'Continue clozapine.', monitoring: routine };
  if (anc >= 500) return { category: 'BEN neutropenia (500–999/µL)', severity: 'moderate', action: 'Hematology consultation. Continue clozapine.', monitoring: 'Three times weekly until ≥1,000/µL or the patient\'s known baseline; then weekly for 4 weeks before returning to the routine schedule.' };
  return { category: 'BEN severe neutropenia (<500/µL)', severity: 'severe', action: 'Interrupt clozapine; hematology consultation. Do not rechallenge unless benefits clearly outweigh risks.', monitoring: 'Daily until ≥500/µL, then three times weekly until at or above the patient\'s baseline.' };
}

// ---------------- Lamotrigine ----------------
export type LamotrigineRegimen = 'mono' | 'valproate' | 'inducer';
export const LAMOTRIGINE_SCHEDULES: Record<LamotrigineRegimen, { weeks: string; dose: string }[]> = {
  mono: [
    { weeks: 'Weeks 1–2', dose: '25 mg once daily' },
    { weeks: 'Weeks 3–4', dose: '50 mg once daily' },
    { weeks: 'Week 5', dose: '100 mg/day' },
    { weeks: 'Week 6 → target', dose: '200 mg/day' },
  ],
  valproate: [
    { weeks: 'Weeks 1–2', dose: '25 mg every OTHER day' },
    { weeks: 'Weeks 3–4', dose: '25 mg once daily' },
    { weeks: 'Week 5', dose: '50 mg/day' },
    { weeks: 'Week 6 → target', dose: '100 mg/day' },
  ],
  inducer: [
    { weeks: 'Weeks 1–2', dose: '50 mg/day' },
    { weeks: 'Weeks 3–4', dose: '100 mg/day (divided)' },
    { weeks: 'Week 5', dose: '200 mg/day (divided)' },
    { weeks: 'Week 6', dose: '300 mg/day (divided)' },
    { weeks: 'Week 7 → target', dose: 'Up to 400 mg/day (divided)' },
  ],
};

// ---------------- Benzodiazepines ----------------
export interface BzdInfo { id: string; name: string; equivMg: number; step: number; halfLife: string }
/** Approximate equivalents to diazepam 10 mg — wide interindividual variation. */
export const BZD_EQUIV: BzdInfo[] = [
  { id: 'alprazolam', name: 'Alprazolam', equivMg: 0.5, step: 0.125, halfLife: '6–27 h' },
  { id: 'clonazepam', name: 'Clonazepam', equivMg: 0.5, step: 0.125, halfLife: '30–40 h' },
  { id: 'lorazepam', name: 'Lorazepam', equivMg: 1, step: 0.25, halfLife: '10–20 h' },
  { id: 'diazepam', name: 'Diazepam', equivMg: 10, step: 1, halfLife: '20–100 h (+metabolite)' },
  { id: 'chlordiazepoxide', name: 'Chlordiazepoxide', equivMg: 25, step: 5, halfLife: '5–30 h (+metabolites)' },
  { id: 'temazepam', name: 'Temazepam', equivMg: 20, step: 7.5, halfLife: '8–20 h' },
  { id: 'oxazepam', name: 'Oxazepam', equivMg: 20, step: 5, halfLife: '5–15 h' },
];

export function diazepamEquivalent(drugId: string, mg: number): number {
  const d = BZD_EQUIV.find((x) => x.id === drugId);
  return d ? (mg / d.equivMg) * 10 : NaN;
}

export function convertBzd(fromId: string, mg: number, toId: string): number {
  const to = BZD_EQUIV.find((x) => x.id === toId);
  if (!to) return NaN;
  return (diazepamEquivalent(fromId, mg) / 10) * to.equivMg;
}

export interface TaperStep { week: number; dose: number; reductionPct: number; minStep?: boolean }

/**
 * Proportional taper: each step removes `pct`% of the CURRENT dose (absolute steps shrink as the dose falls),
 * rounded to practical tablet increments. When the smallest available increment would exceed 25% of the dose,
 * the step is flagged and its interval doubled (or use a liquid formulation) — per the 2025 joint guideline's ≤25%/2-week ceiling.
 */
export function buildTaper(startMg: number, pct: number, intervalWeeks: number, stepMg: number): TaperStep[] {
  const steps: TaperStep[] = [{ week: 0, dose: startMg, reductionPct: 0 }];
  let dose = startMg;
  let week = 0;
  const round = (x: number) => Math.round(x / stepMg) * stepMg;
  for (let guard = 0; dose > 0 && guard < 80; guard++) {
    let next = round(dose * (1 - pct / 100));
    if (next >= dose) next = dose - stepMg;
    if (next < stepMg / 2) next = 0;
    const reductionPct = Math.round(((dose - next) / dose) * 100);
    const minStep = reductionPct > 25;
    week += minStep ? intervalWeeks * 2 : intervalWeeks;
    steps.push({ week, dose: +next.toFixed(3), reductionPct, ...(minStep ? { minStep } : {}) });
    dose = next;
  }
  return steps;
}

// ---------------- Hunter serotonin toxicity criteria ----------------
export interface HunterInput {
  serotonergic: boolean;
  spontaneousClonus: boolean;
  inducibleClonus: boolean;
  ocularClonus: boolean;
  agitation: boolean;
  diaphoresis: boolean;
  tremor: boolean;
  hyperreflexia: boolean;
  hypertonia: boolean;
  tempOver38: boolean;
}

export function hunterCriteria(h: HunterInput): { met: boolean; rule?: string } {
  if (!h.serotonergic) return { met: false, rule: 'Requires exposure to a serotonergic agent' };
  if (h.spontaneousClonus) return { met: true, rule: 'Spontaneous clonus' };
  if (h.inducibleClonus && (h.agitation || h.diaphoresis)) return { met: true, rule: 'Inducible clonus + agitation or diaphoresis' };
  if (h.ocularClonus && (h.agitation || h.diaphoresis)) return { met: true, rule: 'Ocular clonus + agitation or diaphoresis' };
  if (h.tremor && h.hyperreflexia) return { met: true, rule: 'Tremor + hyperreflexia' };
  if (h.hypertonia && h.tempOver38 && (h.ocularClonus || h.inducibleClonus)) return { met: true, rule: 'Hypertonia + temperature >38 °C + ocular or inducible clonus (severe)' };
  return { met: false };
}

// ---------------- Withdrawal scales ----------------
export interface ScaleItem { id: string; label: string; options: { score: number; text: string }[] }

export const CIWA_ITEMS: ScaleItem[] = [
  { id: 'nausea', label: 'Nausea and vomiting', options: [{ score: 0, text: 'None' }, { score: 1, text: 'Mild nausea, no vomiting' }, { score: 4, text: 'Intermittent nausea with dry heaves' }, { score: 7, text: 'Constant nausea, frequent dry heaves and vomiting' }] },
  { id: 'tremor', label: 'Tremor (arms extended, fingers spread)', options: [{ score: 0, text: 'No tremor' }, { score: 1, text: 'Not visible, felt fingertip to fingertip' }, { score: 4, text: 'Moderate with arms extended' }, { score: 7, text: 'Severe, even with arms not extended' }] },
  { id: 'sweats', label: 'Paroxysmal sweats', options: [{ score: 0, text: 'No sweat visible' }, { score: 1, text: 'Barely perceptible; palms moist' }, { score: 4, text: 'Beads of sweat on forehead' }, { score: 7, text: 'Drenching sweats' }] },
  { id: 'anxiety', label: 'Anxiety', options: [{ score: 0, text: 'At ease' }, { score: 1, text: 'Mildly anxious' }, { score: 4, text: 'Moderately anxious or guarded' }, { score: 7, text: 'Equivalent to acute panic' }] },
  { id: 'agitation', label: 'Agitation', options: [{ score: 0, text: 'Normal activity' }, { score: 1, text: 'Somewhat more than normal' }, { score: 4, text: 'Moderately fidgety and restless' }, { score: 7, text: 'Paces or constantly thrashes about' }] },
  { id: 'tactile', label: 'Tactile disturbances', options: [{ score: 0, text: 'None' }, { score: 1, text: 'Very mild itching, pins and needles, numbness' }, { score: 4, text: 'Moderately severe hallucinations' }, { score: 7, text: 'Continuous hallucinations' }] },
  { id: 'auditory', label: 'Auditory disturbances', options: [{ score: 0, text: 'None' }, { score: 1, text: 'Very mild harshness or ability to frighten' }, { score: 4, text: 'Moderately severe hallucinations' }, { score: 7, text: 'Continuous hallucinations' }] },
  { id: 'visual', label: 'Visual disturbances', options: [{ score: 0, text: 'None' }, { score: 1, text: 'Very mild sensitivity' }, { score: 4, text: 'Moderately severe hallucinations' }, { score: 7, text: 'Continuous hallucinations' }] },
  { id: 'headache', label: 'Headache, fullness in head', options: [{ score: 0, text: 'None' }, { score: 1, text: 'Very mild' }, { score: 4, text: 'Moderately severe' }, { score: 7, text: 'Extremely severe' }] },
  { id: 'orientation', label: 'Orientation / clouding of sensorium', options: [{ score: 0, text: 'Oriented; can do serial additions' }, { score: 1, text: 'Cannot do serial additions or uncertain of date' }, { score: 2, text: 'Date off by ≤2 days' }, { score: 3, text: 'Date off by >2 days' }, { score: 4, text: 'Disoriented to place or person' }] },
];

/** ASAM 2020 severity bands */
export function ciwaBand(total: number): { label: string; action: string } {
  if (total >= 19) return { label: 'Severe (≥19)', action: 'Inpatient/monitored setting; front-loaded or symptom-triggered benzodiazepine (or phenobarbital in experienced settings); thiamine before glucose.' };
  if (total >= 10) return { label: 'Moderate (10–18)', action: 'Benzodiazepine (symptom-triggered when CIWA ≥10); assess for complicated-withdrawal risk (prior seizures/DTs).' };
  return { label: 'Mild (<10)', action: 'Supportive care; outpatient management possible if low risk (carbamazepine or gabapentin are alternatives to benzodiazepines).' };
}

export const COWS_ITEMS: ScaleItem[] = [
  { id: 'pulse', label: 'Resting pulse (after 1 min)', options: [{ score: 0, text: '≤80' }, { score: 1, text: '81–100' }, { score: 2, text: '101–120' }, { score: 4, text: '>120' }] },
  { id: 'sweat', label: 'Sweating (past 30 min, not from heat/activity)', options: [{ score: 0, text: 'No chills or flushing' }, { score: 1, text: 'Subjective chills or flushing' }, { score: 2, text: 'Flushed or moist face' }, { score: 3, text: 'Beads of sweat on brow/face' }, { score: 4, text: 'Sweat streaming off face' }] },
  { id: 'restless', label: 'Restlessness', options: [{ score: 0, text: 'Able to sit still' }, { score: 1, text: 'Difficulty sitting still, but able' }, { score: 3, text: 'Frequent shifting/extraneous movements' }, { score: 5, text: 'Unable to sit still >few seconds' }] },
  { id: 'pupils', label: 'Pupil size', options: [{ score: 0, text: 'Pinned or normal for room light' }, { score: 1, text: 'Possibly larger than normal' }, { score: 2, text: 'Moderately dilated' }, { score: 5, text: 'Only rim of iris visible' }] },
  { id: 'aches', label: 'Bone or joint aches', options: [{ score: 0, text: 'None' }, { score: 1, text: 'Mild diffuse discomfort' }, { score: 2, text: 'Severe diffuse aching' }, { score: 4, text: 'Rubbing joints, unable to sit still' }] },
  { id: 'nose', label: 'Runny nose or tearing', options: [{ score: 0, text: 'None' }, { score: 1, text: 'Nasal stuffiness or moist eyes' }, { score: 2, text: 'Nose running or tearing' }, { score: 4, text: 'Constantly running / tears streaming' }] },
  { id: 'gi', label: 'GI upset (past 30 min)', options: [{ score: 0, text: 'None' }, { score: 1, text: 'Stomach cramps' }, { score: 2, text: 'Nausea or loose stool' }, { score: 3, text: 'Vomiting or diarrhea' }, { score: 5, text: 'Multiple episodes of diarrhea or vomiting' }] },
  { id: 'tremor', label: 'Tremor (outstretched hands)', options: [{ score: 0, text: 'None' }, { score: 1, text: 'Felt, not observed' }, { score: 2, text: 'Slight, observable' }, { score: 4, text: 'Gross tremor or twitching' }] },
  { id: 'yawn', label: 'Yawning', options: [{ score: 0, text: 'None' }, { score: 1, text: 'Once or twice' }, { score: 2, text: 'Three or more times' }, { score: 4, text: 'Several times per minute' }] },
  { id: 'anxiety', label: 'Anxiety or irritability', options: [{ score: 0, text: 'None' }, { score: 1, text: 'Reports increasing irritability/anxiety' }, { score: 2, text: 'Obviously irritable or anxious' }, { score: 4, text: 'Too irritable/anxious to participate' }] },
  { id: 'goose', label: 'Gooseflesh skin', options: [{ score: 0, text: 'Smooth' }, { score: 3, text: 'Piloerection felt / hairs standing up' }, { score: 5, text: 'Prominent piloerection' }] },
];

export function cowsBand(total: number): { label: string; action: string } {
  if (total > 36) return { label: 'Severe (>36)', action: 'Withdrawal is clearly established — begin buprenorphine (or methadone) and treat symptoms.' };
  if (total >= 25) return { label: 'Moderately severe (25–36)', action: 'Begin buprenorphine induction.' };
  if (total >= 13) return { label: 'Moderate (13–24)', action: 'Buprenorphine induction appropriate (standard threshold ≥8–12).' };
  if (total >= 5) return { label: 'Mild (5–12)', action: 'Buprenorphine can usually start at ≥8–12; below this, wait or use low-dose induction.' };
  return { label: 'No active withdrawal (<5)', action: 'Too early for standard buprenorphine induction — wait, or use low-dose induction.' };
}
