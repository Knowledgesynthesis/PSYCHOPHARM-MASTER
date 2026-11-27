import type { Receptor } from '@/types';

export interface ReceptorInfo {
  label: string;
  family: 'Transporter' | 'Dopamine' | 'Serotonin' | 'Histamine' | 'Muscarinic' | 'Adrenergic';
  /** Clinical consequence of blockade/inhibition */
  block: { benefit: string[]; harm: string[] };
  /** Consequence of (partial) agonism, where relevant */
  agonism?: string;
}

export const RECEPTORS: Receptor[] = ['SERT', 'NET', 'DAT', 'D2', '5-HT1A', '5-HT2A', '5-HT2C', '5-HT3', 'H1', 'M1', 'α1', 'α2'];

export const receptorInfo: Record<Receptor, ReceptorInfo> = {
  SERT: { label: 'Serotonin transporter', family: 'Transporter', block: { benefit: ['Antidepressant and anti-anxiety effect', 'Anti-obsessional'], harm: ['Nausea, diarrhea', 'Sexual dysfunction', 'Bleeding (platelet 5-HT depletion)', 'Hyponatremia', 'Early activation', 'Serotonin toxicity in combination'] } },
  NET: { label: 'Norepinephrine transporter', family: 'Transporter', block: { benefit: ['Antidepressant', 'ADHD efficacy (prefrontal DA + NE)', 'Neuropathic pain relief'], harm: ['↑ HR and BP', 'Sweating', 'Urinary hesitancy', 'Insomnia, tremor'] } },
  DAT: { label: 'Dopamine transporter', family: 'Transporter', block: { benefit: ['ADHD efficacy', 'Energy, motivation'], harm: ['Insomnia, appetite loss', 'Reward → misuse potential', 'Psychosis at high exposure'] } },
  D2: {
    label: 'Dopamine D2',
    family: 'Dopamine',
    block: { benefit: ['Antipsychotic (mesolimbic)', 'Anti-manic', 'Antiemetic'], harm: ['EPS: dystonia, parkinsonism, akathisia (nigrostriatal)', 'Tardive dyskinesia', 'Hyperprolactinemia (tuberoinfundibular)', 'Secondary negative/cognitive symptoms (mesocortical)', 'NMS'] },
    agonism: 'Partial agonism (aripiprazole, brexpiprazole, cariprazine): antipsychotic with less EPS and prolactin, but akathisia; lowers prolactin.',
  },
  '5-HT1A': {
    label: 'Serotonin 5-HT1A',
    family: 'Serotonin',
    block: { benefit: [], harm: [] },
    agonism: 'Partial/full agonism: anxiolytic and antidepressant (buspirone, vilazodone, vortioxetine, aripiprazole, lurasidone); may lessen EPS; dizziness, nausea.',
  },
  '5-HT2A': { label: 'Serotonin 5-HT2A', family: 'Serotonin', block: { benefit: ['Fewer EPS (releases striatal dopamine)', 'Deeper sleep', 'Less SSRI-type sexual dysfunction', 'Antipsychotic without D2 blockade (pimavanserin inverse agonism)'], harm: [] } },
  '5-HT2C': { label: 'Serotonin 5-HT2C', family: 'Serotonin', block: { benefit: ['Disinhibits prefrontal DA/NE (activation, antidepressant)'], harm: ['Appetite and weight gain (with H1)'] } },
  '5-HT3': { label: 'Serotonin 5-HT3', family: 'Serotonin', block: { benefit: ['Antiemetic — fewer GI effects (mirtazapine, vortioxetine)'], harm: ['Constipation'] } },
  H1: { label: 'Histamine H1', family: 'Histamine', block: { benefit: ['Sedation for insomnia/agitation', 'Antipruritic'], harm: ['Daytime sedation', 'Appetite and weight gain', 'Cognitive slowing'] } },
  M1: { label: 'Muscarinic M1', family: 'Muscarinic', block: { benefit: ['Fewer EPS'], harm: ['Dry mouth, constipation → ileus', 'Urinary retention', 'Blurred vision, angle-closure', 'Tachycardia', 'Confusion, delirium, memory impairment'] } },
  'α1': { label: 'α1-adrenergic', family: 'Adrenergic', block: { benefit: ['Nightmare reduction (prazosin)'], harm: ['Orthostatic hypotension, dizziness, falls', 'Reflex tachycardia', 'Priapism', 'Sedation', 'Intraoperative floppy iris'] } },
  'α2': { label: 'α2-adrenergic', family: 'Adrenergic', block: { benefit: ['↑ NE and 5-HT release — antidepressant (mirtazapine)'], harm: ['Possible BP rise'] }, agonism: 'Agonism (guanfacine, clonidine, lofexidine): ADHD efficacy, reduced withdrawal hyperarousal; sedation, hypotension, bradycardia, rebound hypertension.' },
};

export const DOPAMINE_PATHWAYS = [
  { name: 'Mesolimbic', from: 'VTA → nucleus accumbens', role: 'Reward, salience', block: 'Reduces positive symptoms (therapeutic) — and blunts reward/motivation' },
  { name: 'Mesocortical', from: 'VTA → prefrontal cortex', role: 'Cognition, motivation, affect', block: 'Can worsen negative and cognitive symptoms (already hypodopaminergic)' },
  { name: 'Nigrostriatal', from: 'Substantia nigra → striatum', role: 'Motor control', block: 'EPS: dystonia (hours–days), akathisia (days–weeks), parkinsonism (weeks), TD (months–years)' },
  { name: 'Tuberoinfundibular', from: 'Hypothalamus → pituitary', role: 'Tonic inhibition of prolactin', block: 'Hyperprolactinemia: galactorrhea, amenorrhea, sexual dysfunction, bone loss' },
];
