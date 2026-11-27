import type { CoMed } from '@/types';

/** Common non-psychiatric agents that drive dangerous psychotropic interactions. */
export const coMeds: CoMed[] = [
  // Opioids & cough
  { id: 'tramadol', name: 'Tramadol', category: 'Opioid', ix: { sero: 2, opioid: 'full', resp: true, cns: true, seizure: true }, cyp: { sub: ['2D6', '3A4'], prodrug: '2D6' } },
  { id: 'meperidine', name: 'Meperidine', category: 'Opioid', ix: { sero: 2, opioid: 'full', resp: true, cns: true, seizure: true } },
  { id: 'fentanyl', name: 'Fentanyl', category: 'Opioid', ix: { sero: 1, opioid: 'full', resp: true, cns: true }, cyp: { sub: ['3A4'] } },
  { id: 'oxycodone', name: 'Oxycodone', category: 'Opioid', ix: { opioid: 'full', resp: true, cns: true }, cyp: { sub: ['3A4', '2D6'] } },
  { id: 'hydrocodone', name: 'Hydrocodone', category: 'Opioid', ix: { opioid: 'full', resp: true, cns: true }, cyp: { sub: ['3A4', '2D6'] } },
  { id: 'morphine', name: 'Morphine', category: 'Opioid', ix: { opioid: 'full', resp: true, cns: true } },
  { id: 'codeine', name: 'Codeine', category: 'Opioid', ix: { opioid: 'full', resp: true, cns: true }, cyp: { sub: ['2D6'], prodrug: '2D6' } },
  { id: 'dextromethorphan', name: 'Dextromethorphan (OTC cough)', category: 'Cough suppressant', ix: { sero: 2 }, cyp: { sub: ['2D6'] } },
  // Serotonergic / MAO-inhibiting non-psych drugs
  { id: 'linezolid', name: 'Linezolid', category: 'Antibiotic (reversible MAOI)', ix: { maoi: 'weak' } },
  { id: 'methylene-blue', name: 'Methylene blue (IV)', category: 'MAOI-like dye', ix: { maoi: 'weak' } },
  { id: 'triptans', name: 'Triptans (sumatriptan etc.)', category: 'Migraine', ix: { sero: 1 } },
  { id: 'ondansetron', name: 'Ondansetron', category: 'Antiemetic', ix: { sero: 1, qt: 2 } },
  { id: 'st-johns-wort', name: "St John's wort", category: 'Supplement', ix: { sero: 2 }, cyp: { ind: { '3A4': 'strong', '2C19': 'moderate' } } },
  // Bleeding
  { id: 'nsaids', name: 'NSAIDs (ibuprofen, naproxen)', category: 'Analgesic', ix: { anticoag: true, liUp: true } },
  { id: 'aspirin', name: 'Aspirin (low-dose)', category: 'Antiplatelet', ix: { anticoag: true } },
  { id: 'warfarin', name: 'Warfarin', category: 'Anticoagulant', ix: { anticoag: true }, cyp: { sub: ['2C9', '3A4', '1A2'] } },
  { id: 'doac', name: 'DOACs (apixaban, rivaroxaban)', category: 'Anticoagulant', ix: { anticoag: true }, cyp: { sub: ['3A4'] } },
  { id: 'clopidogrel', name: 'Clopidogrel', category: 'Antiplatelet', ix: { anticoag: true }, cyp: { sub: ['2C19'], prodrug: '2C19' } },
  // Renal / lithium
  { id: 'thiazide', name: 'Thiazide diuretics (HCTZ, chlorthalidone)', category: 'Antihypertensive', ix: { liUp: true, hypoNa: true } },
  { id: 'acei', name: 'ACE inhibitors (lisinopril)', category: 'Antihypertensive', ix: { liUp: true } },
  { id: 'arb', name: 'ARBs (losartan)', category: 'Antihypertensive', ix: { liUp: true } },
  { id: 'sglt2', name: 'SGLT2 inhibitors (empagliflozin)', category: 'Antidiabetic', ix: { liDown: true } },
  { id: 'theophylline', name: 'Theophylline', category: 'Bronchodilator', ix: { liDown: true, seizure: true }, cyp: { sub: ['1A2'] } },
  { id: 'caffeine', name: 'Caffeine (high intake)', category: 'Dietary', ix: { liDown: true }, cyp: { sub: ['1A2'] } },
  // Anti-infectives
  { id: 'ciprofloxacin', name: 'Ciprofloxacin', category: 'Antibiotic', ix: { qt: 2, seizure: true }, cyp: { inh: { '1A2': 'strong', '3A4': 'weak' } } },
  { id: 'levofloxacin', name: 'Levofloxacin', category: 'Antibiotic', ix: { qt: 3 } },
  { id: 'clarithromycin', name: 'Clarithromycin', category: 'Antibiotic', ix: { qt: 3 }, cyp: { inh: { '3A4': 'strong' } } },
  { id: 'azithromycin', name: 'Azithromycin', category: 'Antibiotic', ix: { qt: 3 } },
  { id: 'carbapenems', name: 'Carbapenems (meropenem, ertapenem)', category: 'Antibiotic', ix: {} },
  { id: 'metronidazole', name: 'Metronidazole', category: 'Antibiotic', ix: {} },
  { id: 'ketoconazole', name: 'Ketoconazole', category: 'Antifungal', ix: { qt: 2 }, cyp: { inh: { '3A4': 'strong' } } },
  { id: 'itraconazole', name: 'Itraconazole', category: 'Antifungal', ix: {}, cyp: { inh: { '3A4': 'strong' } } },
  { id: 'fluconazole', name: 'Fluconazole', category: 'Antifungal', ix: { qt: 3 }, cyp: { inh: { '2C19': 'strong', '2C9': 'moderate', '3A4': 'moderate' } } },
  { id: 'rifampin', name: 'Rifampin', category: 'Antibiotic (inducer)', ix: {}, cyp: { ind: { '3A4': 'strong', '2C9': 'strong', '2C19': 'strong', '2B6': 'strong', '1A2': 'moderate', UGT: 'strong' } } },
  { id: 'ritonavir', name: 'Ritonavir (incl. nirmatrelvir/ritonavir)', category: 'Antiviral booster', ix: {}, cyp: { inh: { '3A4': 'strong' } } },
  // Other
  { id: 'phenytoin', name: 'Phenytoin', category: 'Antiepileptic (inducer)', ix: { cns: true }, cyp: { sub: ['2C9', '2C19'], ind: { '3A4': 'strong', '2C9': 'moderate', '2C19': 'moderate', '1A2': 'moderate', UGT: 'strong' } } },
  { id: 'estrogen-contraceptive', name: 'Estrogen-containing contraceptives', category: 'Hormonal', ix: {}, cyp: { sub: ['3A4'], inh: { '1A2': 'weak' }, ind: { UGT: 'moderate' } } },
  { id: 'tamoxifen', name: 'Tamoxifen', category: 'Oncology (prodrug)', ix: {}, cyp: { sub: ['2D6', '3A4'], prodrug: '2D6' } },
  { id: 'metoprolol', name: 'Metoprolol', category: 'β-blocker', ix: {}, cyp: { sub: ['2D6'] } },
  { id: 'omeprazole', name: 'Omeprazole / esomeprazole', category: 'PPI', ix: {}, cyp: { inh: { '2C19': 'moderate' } } },
  { id: 'amiodarone', name: 'Amiodarone', category: 'Antiarrhythmic', ix: { qt: 3 }, cyp: { inh: { '2D6': 'moderate', '2C9': 'moderate', '3A4': 'weak' } } },
  { id: 'tizanidine', name: 'Tizanidine', category: 'Muscle relaxant', ix: { cns: true, orthostatic: true }, cyp: { sub: ['1A2'] } },
  { id: 'diphenhydramine', name: 'Diphenhydramine', category: 'Antihistamine (OTC)', ix: { achol: 2, cns: true } },
  { id: 'oxybutynin', name: 'Oxybutynin', category: 'Bladder antimuscarinic', ix: { achol: 3 } },
  { id: 'metoclopramide', name: 'Metoclopramide', category: 'Antiemetic (D2 blocker)', ix: { da: 'antagonist' } },
  { id: 'levodopa', name: 'Levodopa / dopamine agonists', category: 'Parkinson disease', ix: { da: 'agonist' } },
  { id: 'pseudoephedrine', name: 'Decongestants (pseudoephedrine, phenylephrine)', category: 'Sympathomimetic (OTC)', ix: { symp: true } },
  { id: 'tyramine', name: 'Tyramine-rich foods (aged cheese, cured meats, tap beer)', category: 'Dietary', ix: { symp: true } },
  { id: 'grapefruit', name: 'Grapefruit juice', category: 'Dietary', ix: {}, cyp: { inh: { '3A4': 'moderate' } } },
  { id: 'tobacco', name: 'Tobacco smoking', category: 'Inducer (PAHs)', ix: {}, cyp: { ind: { '1A2': 'moderate' } } },
  { id: 'alcohol', name: 'Alcohol', category: 'CNS depressant', ix: { cns: true, resp: true, alcohol: true } },
];

export const coMedMap: Record<string, CoMed> = Object.fromEntries(coMeds.map((c) => [c.id, c]));
