export type ModuleId =
  | 'foundations'
  | 'antidepressants'
  | 'mood-stabilizers'
  | 'antipsychotics'
  | 'anxiety'
  | 'adhd'
  | 'sleep'
  | 'substance-use'
  | 'emergencies'
  | 'special-populations';

/** CYP isoenzymes plus UGT glucuronidation (lamotrigine/valproate/estrogen interactions). */
export type Enzyme = '1A2' | '2B6' | '2C9' | '2C19' | '2D6' | '3A4' | 'UGT';
export type Strength = 'strong' | 'moderate' | 'weak';
/** 0 = none/minimal, 1 = low, 2 = moderate, 3 = high */
export type Level = 0 | 1 | 2 | 3;

export type ProfileKey =
  | 'sedation'
  | 'activation'
  | 'weight'
  | 'sexual'
  | 'gi'
  | 'qt'
  | 'orthostasis'
  | 'anticholinergic'
  | 'eps'
  | 'prolactin'
  | 'discontinuation'
  | 'dependence';

export type Receptor =
  | 'SERT'
  | 'NET'
  | 'DAT'
  | 'D2'
  | '5-HT1A'
  | '5-HT2A'
  | '5-HT2C'
  | '5-HT3'
  | 'H1'
  | 'M1'
  | 'α1'
  | 'α2';

/** Relative affinity 1–4. Suffix p = partial agonist, a = agonist; bare = antagonist/inhibitor. */
export type RxVal = '1' | '2' | '3' | '4' | '1p' | '2p' | '3p' | '4p' | '1a' | '2a' | '3a' | '4a';

export type DrugClass =
  | 'SSRI'
  | 'SNRI'
  | 'TCA'
  | 'MAOI'
  | 'NDRI'
  | 'NaSSA'
  | 'SARI'
  | 'multimodal'
  | 'NMDA'
  | 'neurosteroid'
  | 'lithium'
  | 'anticonvulsant'
  | 'FGA'
  | 'SGA'
  | 'D2-partial'
  | 'muscarinic'
  | '5HT2A-inverse'
  | 'VMAT2'
  | 'anticholinergic'
  | 'benzodiazepine'
  | 'azapirone'
  | 'antihistamine'
  | 'beta-blocker'
  | 'alpha1-blocker'
  | 'gabapentinoid'
  | 'stimulant'
  | 'NRI'
  | 'alpha2-agonist'
  | 'SNDRI'
  | 'z-drug'
  | 'DORA'
  | 'melatonergic'
  | 'opioid-antagonist'
  | 'opioid-partial'
  | 'opioid-full'
  | 'glutamate-modulator'
  | 'ALDH-inhibitor'
  | 'nicotinic';

/** Flags consumed by the interaction engine. */
export interface IxFlags {
  /** Serotonergic weight: 3 = potent reuptake inhibitor, 2 = moderate, 1 = weak contribution */
  sero?: 1 | 2 | 3;
  /** MAO inhibition. irreversible = classic MAOI; weak = linezolid / methylene blue */
  maoi?: 'irreversible' | 'weak';
  /** QT liability: 3 = known torsades risk, 2 = possible, 1 = conditional/minor */
  qt?: 1 | 2 | 3;
  /** CNS depressant (additive sedation) */
  cns?: boolean;
  /** Respiratory depressant class (benzodiazepines, Z-drugs, gabapentinoids, alcohol, opioids) */
  resp?: boolean;
  opioid?: 'full' | 'partial' | 'antagonist';
  /** Anticholinergic burden 1–3 */
  achol?: 1 | 2 | 3;
  /** Lowers seizure threshold */
  seizure?: boolean;
  /** Sympathomimetic / pressor: hypertensive crisis with MAOIs */
  symp?: boolean;
  /** Impairs platelet serotonin uptake (SSRIs/SNRIs) */
  bleed?: boolean;
  /** Anticoagulant, antiplatelet or NSAID */
  anticoag?: boolean;
  hypoNa?: boolean;
  /** Raises / lowers serum lithium */
  liUp?: boolean;
  liDown?: boolean;
  lithium?: boolean;
  da?: 'antagonist' | 'partial' | 'agonist';
  /** Bone-marrow suppression risk */
  myelo?: boolean;
  orthostatic?: boolean;
  disulfiram?: boolean;
  alcohol?: boolean;
}

export interface CypProfile {
  /** Major metabolic pathways (substrate of) */
  sub?: Enzyme[];
  inh?: Partial<Record<Enzyme, Strength>>;
  ind?: Partial<Record<Enzyme, Strength>>;
  /** Activated by this enzyme (inhibition = loss of effect) */
  prodrug?: Enzyme;
}

export interface Drug {
  id: string;
  name: string;
  brands?: string[];
  module: ModuleId;
  alsoIn?: ModuleId[];
  cls: DrugClass;
  className: string;
  mechanism: string;
  receptors?: Partial<Record<Receptor, RxVal>>;
  /** US FDA-approved indications */
  indications: string[];
  /** Evidence-supported off-label uses */
  offLabel?: string[];
  dosing: { start: string; target: string; max: string; notes?: string };
  halfLife: string;
  metabolism: string;
  cyp?: CypProfile;
  schedule?: string;
  boxed?: string[];
  contraindications: string[];
  adverse: { common: string[]; serious: string[] };
  interactions: string[];
  monitoring: string[];
  switching?: string[];
  populations: {
    pregnancy: string;
    lactation: string;
    pediatric?: string;
    geriatric: string;
    renal: string;
    hepatic: string;
  };
  pearls: string[];
  profile: Partial<Record<ProfileKey, Level>>;
  ix: IxFlags;
  /** Days to wait after stopping this drug before starting an MAOI (label-based) */
  washoutBeforeMaoiDays?: number;
  /** Labeled contraindicated combinations by agent id */
  contraWith?: { id: string; why: string }[];
  refs: string[];
  /** Highlight for recent approvals/label changes */
  update?: string;
}

/** Non-psychiatric co-medications used only by the interaction checker. */
export interface CoMed {
  id: string;
  name: string;
  category: string;
  ix: IxFlags;
  cyp?: CypProfile;
}

export interface Concept {
  title: string;
  body: string;
  bullets?: string[];
}

export interface Lesson {
  id: ModuleId;
  title: string;
  short: string;
  color: string;
  icon: string;
  minutes: number;
  objectives: string[];
  concepts: Concept[];
  /** Ordered clinical decision steps */
  algorithm?: { title: string; steps: string[] };
  table?: { title: string; columns: string[]; rows: string[][]; note?: string };
  pitfalls: string[];
  compareIds?: string[];
  toolLinks?: { to: string; label: string }[];
  refs: string[];
}

export interface QuizQuestion {
  id: string;
  module: ModuleId;
  difficulty: 1 | 2 | 3;
  stem: string;
  options: string[];
  answer: number;
  explanation: string;
  refs?: string[];
}

export interface CaseStep {
  prompt: string;
  info?: string;
  options: { text: string; correct: boolean; feedback: string }[];
}

export interface ClinicalCase {
  id: string;
  title: string;
  module: ModuleId;
  difficulty: 1 | 2 | 3;
  vignette: string;
  steps: CaseStep[];
  takeaways: string[];
}

export interface Reference {
  id: string;
  cite: string;
  url?: string;
  year: number;
}

export type Severity = 'contraindicated' | 'major' | 'moderate' | 'minor';
