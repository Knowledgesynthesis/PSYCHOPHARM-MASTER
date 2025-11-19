export interface Drug {
  id: string;
  name: string;
  class: string;
  mechanism: string;
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  interactions: string[];
  monitoring: string[];
  dosing: {
    starting: string;
    therapeutic: string;
    maximum: string;
  };
  switchingNotes: string[];
  warnings: string[];
  specialPopulations?: {
    pregnancy?: string;
    lactation?: string;
    geriatric?: string;
    renal?: string;
    hepatic?: string;
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  drugs: Drug[];
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'matching' | 'case';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  category: string;
}

export interface SideEffect {
  name: string;
  symptoms: string[];
  differentialDiagnosis: string[];
  management: string[];
}

export interface SwitchingStrategy {
  from: string;
  to: string;
  method: 'direct' | 'cross-taper' | 'washout';
  duration?: string;
  notes: string[];
  cautions: string[];
  monitoring: string[];
}
