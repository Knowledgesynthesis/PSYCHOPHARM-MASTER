import type { Drug } from '@/types';
import { checkInteractions, toAgent } from './interactions';

export type SwitchStrategy = 'washout' | 'cross-taper' | 'direct' | 'stop-wait-start' | 'overlap-then-stop' | 'specialist';

export interface SwitchPhase {
  label: string;
  /** Percent of current dose of drug A during the phase */
  a: number;
  /** Percent of target dose of drug B during the phase */
  b: number;
  note: string;
}

export interface SwitchPlan {
  strategy: SwitchStrategy;
  headline: string;
  rationale: string;
  washoutDays?: number;
  phases: SwitchPhase[];
  cautions: string[];
  monitoring: string[];
}

const AD_SEROTONERGIC = new Set(['SSRI', 'SNRI', 'TCA', 'multimodal', 'SARI', 'NaSSA']);
const isMaoi = (d: Drug) => d.cls === 'MAOI';
const isAntidepressant = (d: Drug) => d.module === 'antidepressants';
const isAntipsychotic = (d: Drug) => ['FGA', 'SGA', 'D2-partial', 'muscarinic'].includes(d.cls) && d.module === 'antipsychotics';
const isPartial = (d: Drug) => d.cls === 'D2-partial';
const strong2D6 = (d: Drug) => d.cyp?.inh?.['2D6'] === 'strong' || d.cyp?.inh?.['2D6'] === 'moderate';
const HIGH_ACHOL_AP = new Set(['clozapine', 'olanzapine', 'quetiapine', 'chlorpromazine']);
const STIM_NON = new Set(['atomoxetine', 'viloxazine', 'guanfacine-er', 'clonidine-er', 'centanafadine']);
/** Drugs that must never overlap an MAOI */
const maoiConflict = (d: Drug) =>
  isMaoi(d) || !!d.ix.sero || !!d.ix.symp || d.id === 'carbamazepine' || d.cls === 'stimulant' || d.id === 'buspirone';

function overlapCautions(a: Drug, b: Drug): string[] {
  return checkInteractions([toAgent(a), toAgent(b)])
    .filter((f) => f.severity !== 'minor')
    .slice(0, 3)
    .map((f) => `During overlap — ${f.title} (${f.severity}): ${f.action}`);
}

const baseMonitoring = ['Target symptoms and relapse', 'Discontinuation symptoms from drug A', 'Early adverse effects of drug B'];

export function planSwitch(a: Drug, b: Drug): SwitchPlan {
  if (a.id === b.id) {
    return { strategy: 'direct', headline: 'Same medication', rationale: 'Select two different medications.', phases: [], cautions: [], monitoring: [] };
  }

  // ---------- MAOI rules (absolute) ----------
  if ((isMaoi(a) && maoiConflict(b)) || (isMaoi(b) && maoiConflict(a))) {
    const toMaoi = isMaoi(b);
    const days = toMaoi && !isMaoi(a) ? a.washoutBeforeMaoiDays ?? 14 : 14;
    const fluox = a.id === 'fluoxetine';
    return {
      strategy: 'washout',
      washoutDays: days,
      headline: `Washout: ${days >= 28 ? `${Math.round(days / 7)} weeks` : `${days} days`} drug-free before ${b.name}`,
      rationale: toMaoi
        ? `${a.name} must be fully cleared before an MAOI to prevent serotonin syndrome or hypertensive crisis. Label-based interval after stopping ${a.name}: ${days} days.`
        : `MAO is irreversibly inhibited; new enzyme takes ~2 weeks to regenerate. Any serotonergic or sympathomimetic drug started earlier risks fatal toxicity.`,
      phases: [
        { label: fluox ? 'Day 0' : 'Weeks 1–2', a: fluox ? 0 : 50, b: 0, note: fluox ? 'Stop fluoxetine (self-tapering half-life).' : `Taper ${a.name} to stop${isMaoi(a) ? ' (MAOI withdrawal can be severe)' : ''}.` },
        { label: `Washout (${days} d)`, a: 0, b: 0, note: 'No antidepressant. Monitor closely for relapse and suicidality.' },
        { label: 'Then', a: 0, b: 40, note: `Start ${b.name} at a low dose and titrate.${toMaoi ? ' Tyramine restrictions start before the first dose.' : ''}` },
      ],
      cautions: [
        'Never overlap — not even one dose.',
        toMaoi ? 'Low-tyramine diet from the first MAOI dose until 14 days after the last.' : 'Diet can be liberalized 14 days after the last MAOI dose.',
        'Screen every OTC product (decongestants, dextromethorphan) and procedural drugs (meperidine, methylene blue).',
      ],
      monitoring: ['Mood and suicidality during the drug-free interval', 'Blood pressure', ...baseMonitoring.slice(2)],
    };
  }

  // ---------- Antidepressant ↔ antidepressant ----------
  if (isAntidepressant(a) && isAntidepressant(b)) {
    if (b.id === 'esketamine' || b.id === 'zuranolone') {
      return {
        strategy: 'specialist',
        headline: b.id === 'esketamine' ? 'Usually added, not switched' : 'Time-limited 14-day course',
        rationale: b.id === 'esketamine'
          ? 'Esketamine is given in a certified setting either with a newly started oral antidepressant or (since 2025) as monotherapy for TRD.'
          : 'Zuranolone is a 14-day treatment for postpartum depression and is often given alongside ongoing treatment.',
        phases: [{ label: 'Course', a: 100, b: 100, note: 'Continue or plan the oral antidepressant per clinical decision.' }],
        cautions: overlapCautions(a, b),
        monitoring: b.id === 'esketamine' ? ['BP before and 40 min after dosing', '≥2 h observation', 'Dissociation and sedation'] : ['Sedation; no driving for 12 h after each dose', 'Mood after completion'],
      };
    }
    if (a.id === 'fluoxetine') {
      return {
        strategy: 'stop-wait-start',
        headline: 'Stop fluoxetine, wait 4–7 days, start low',
        rationale: 'Fluoxetine and norfluoxetine persist for weeks: an immediate full-dose start stacks serotonergic effects and CYP2D6 inhibition.',
        phases: [
          { label: 'Day 0', a: 0, b: 0, note: 'Stop fluoxetine (reduce to 20 mg first if on >40 mg).' },
          { label: 'Days 4–7', a: 0, b: 30, note: `Start ${b.name} at a low dose.` },
          { label: 'Weeks 2–4', a: 0, b: 100, note: 'Titrate slowly — fluoxetine is still clearing.' },
        ],
        cautions: [
          strong2D6(a) && (b.cyp?.sub ?? []).includes('2D6') ? `${b.name} is a CYP2D6 substrate: fluoxetine inhibition persists for weeks — start low and consider levels.` : 'Residual serotonergic activity for weeks: watch for serotonin toxicity.',
          ...overlapCautions(a, b).slice(0, 1),
        ],
        monitoring: baseMonitoring,
      };
    }
    const aTca = a.cls === 'TCA';
    const bTca = b.cls === 'TCA';
    if (bTca && strong2D6(a)) {
      return crossTaper(a, b, 'Cross-taper; start the TCA low', `${a.name} inhibits CYP2D6 and will raise TCA levels until it clears.`, [
        `Start ${b.name} at 10–25 mg; check a TCA level ~1 week after ${a.name} is stopped.`,
      ]);
    }
    if (aTca) {
      return crossTaper(a, b, 'Slow cross-taper over 2–4 weeks', 'TCAs cause cholinergic rebound (nausea, diarrhea, sweating, insomnia) if reduced quickly.', [
        strong2D6(b) ? `${b.name} inhibits CYP2D6 — reduce the TCA before adding it, as TCA levels will rise during overlap.` : 'Reduce the TCA by ~25–50 mg/week.',
      ], 4);
    }
    if (a.cls === 'SSRI' && b.cls === 'SSRI') {
      if (a.id === 'paroxetine') {
        return crossTaper(a, b, 'Brief cross-taper (1–2 weeks)', 'Paroxetine has the most severe SSRI discontinuation syndrome; a short taper while the new SSRI starts limits it.', []);
      }
      return {
        strategy: 'direct',
        headline: 'Direct switch',
        rationale: 'Same mechanism: the new SSRI prevents discontinuation symptoms. Stop A and start B the next day at a low-to-equivalent dose.',
        phases: [
          { label: 'Day 1', a: 0, b: 50, note: `Stop ${a.name}; start ${b.name} at a low/equivalent dose.` },
          { label: 'Weeks 1–4', a: 0, b: 100, note: 'Titrate to effect; reassess at 2–4 weeks.' },
        ],
        cautions: ['If discontinuation symptoms occur, slow down with a short overlap.'],
        monitoring: baseMonitoring,
      };
    }
    if (a.id === 'bupropion' || b.id === 'bupropion') {
      return crossTaper(a, b, 'Cross-taper (or add-on) — no serotonergic overlap', 'Bupropion has no serotonergic action, so overlap is pharmacodynamically safe; the combination is also a common augmentation.', [
        'Bupropion is a strong CYP2D6 inhibitor and lowers the seizure threshold — respect max doses.',
      ], 2);
    }
    const slow = ['venlafaxine', 'desvenlafaxine', 'paroxetine', 'duloxetine'].includes(a.id);
    return crossTaper(a, b, slow ? 'Cross-taper over 2–4 weeks' : 'Cross-taper over 1–2 weeks', slow
      ? `${a.name} has a short half-life and marked discontinuation symptoms: taper it slowly while ${b.name} starts low.`
      : `Overlapping lets ${b.name} start before ${a.name} is gone, limiting discontinuation symptoms and relapse.`, [], slow ? 4 : 2);
  }

  // ---------- Antipsychotic ↔ antipsychotic ----------
  if (isAntipsychotic(a) && isAntipsychotic(b)) {
    const cautions: string[] = [];
    let weeks = 3;
    let headline = 'Plateau cross-taper';
    let rationale = `Bring ${b.name} to a therapeutic dose before tapering ${a.name}: stopping first risks relapse; rapid removal risks rebound.`;
    if (a.id === 'clozapine') {
      weeks = 6;
      headline = 'Very slow clozapine taper (≥4–8 weeks)';
      rationale = 'Clozapine withdrawal causes cholinergic rebound and rapid-onset rebound psychosis. Most patients who need to switch away do better with augmentation — reconsider the reason.';
      cautions.push('Cholinergic rebound: sweating, nausea, vomiting, diarrhea, agitation, insomnia.');
    }
    if (b.id === 'clozapine') {
      headline = 'Clozapine titration with overlap';
      rationale = 'Titrate clozapine from 12.5 mg (25–50 mg/day increments as tolerated); taper the previous antipsychotic once clozapine reaches ~200–300 mg/day.';
      cautions.push('Baseline ANC required; avoid long-acting injectables during initiation (cannot be withdrawn if neutropenia occurs).');
    }
    if (isPartial(b) && !isPartial(a)) {
      headline = 'Plateau cross-taper — keep the prior drug at full dose';
      rationale = `${b.name} is a high-affinity partial agonist: it displaces the antagonist and can transiently worsen psychosis or cause akathisia if ${a.name} is reduced too early.`;
      cautions.push(b.id === 'cariprazine' ? 'Cariprazine metabolites take weeks to accumulate — hold the prior drug ≥2–3 weeks after reaching target.' : `Keep ${a.name} until ${b.name} has been at a therapeutic dose for 1–2 weeks.`);
    }
    if (isPartial(a) && !isPartial(b)) {
      cautions.push(`${a.name} has a long half-life and self-tapers; watch for emerging prolactin elevation and EPS on ${b.name}.`);
    }
    if (HIGH_ACHOL_AP.has(a.id) && a.id !== 'clozapine') {
      cautions.push(`${a.name} is antihistaminic/anticholinergic — taper it slowly to avoid rebound insomnia and cholinergic rebound.`);
      weeks = Math.max(weeks, 4);
    }
    if (b.id === 'xanomeline-trospium') {
      cautions.push('No dedicated switching data; adjunctive use failed (ARISE) — aim to complete the cross-taper rather than combine long term.');
    }
    cautions.push('If switching from a long-acting injectable, start the oral drug around when the next injection would be due.');
    return {
      strategy: 'cross-taper',
      headline,
      rationale,
      phases: [
        { label: 'Weeks 1–2', a: 100, b: b.id === 'clozapine' ? 50 : 70, note: `Continue ${a.name}; start and titrate ${b.name}.` },
        { label: `Weeks 3–${2 + weeks}`, a: 40, b: 100, note: `${b.name} at therapeutic dose; taper ${a.name} by ~25% per week.` },
        { label: 'After', a: 0, b: 100, note: `${a.name} stopped; reassess response after 4–6 weeks at target.` },
      ],
      cautions: [...cautions, ...overlapCautions(a, b)],
      monitoring: ['Psychotic symptoms and relapse', 'Akathisia/EPS and withdrawal dyskinesia', 'Insomnia, cholinergic rebound', `Metabolic baseline for ${b.name}`],
    };
  }

  // ---------- Benzodiazepines ----------
  if (a.cls === 'benzodiazepine') {
    if (b.cls === 'benzodiazepine') {
      return {
        strategy: 'cross-taper',
        headline: 'Stepwise substitution at an equivalent dose',
        rationale: `Replace ${a.name} with an approximately equivalent dose of ${b.name} in ~25% steps every few days; equivalence tables are approximate.`,
        phases: [
          { label: 'Week 1', a: 75, b: 25, note: 'Replace ~25% of the dose.' },
          { label: 'Weeks 2–3', a: 25, b: 75, note: 'Continue stepwise substitution.' },
          { label: 'Week 4', a: 0, b: 100, note: 'Fully substituted; then taper if the goal is discontinuation.' },
        ],
        cautions: ['Use the Benzodiazepine taper calculator for equivalents.', 'Watch for over-sedation as long-acting metabolites accumulate.'],
        monitoring: ['Withdrawal symptoms', 'Sedation'],
      };
    }
    return {
      strategy: 'overlap-then-stop',
      headline: `Start ${b.name}, then taper ${a.name} slowly`,
      rationale: 'Establish the long-term treatment first, then taper the benzodiazepine at 5–10% every 2–4 weeks (usually ≤25% per 2 weeks), slowing as needed (2025 joint guideline).',
      phases: [
        { label: 'Weeks 1–6', a: 100, b: 100, note: `Start ${b.name}; allow it to work.` },
        { label: 'Months 2–6+', a: 40, b: 100, note: 'Taper 5–10% of the current dose every 2–4 weeks.' },
        { label: 'End', a: 0, b: 100, note: 'Final steps are often the hardest — slow down if needed.' },
      ],
      cautions: ['Never stop abruptly after regular use — seizures and delirium are possible.', 'Offer CBT; consider switching short-acting agents to a long-acting one first.', ...overlapCautions(a, b)],
      monitoring: ['Withdrawal symptoms', 'Anxiety/insomnia rebound', 'Mood and suicidality'],
    };
  }

  // ---------- Mood stabilizers ----------
  if (b.id === 'lamotrigine' && a.id === 'valproate') {
    return {
      strategy: 'cross-taper',
      headline: 'Lamotrigine on the valproate schedule, then withdraw valproate',
      rationale: 'Valproate doubles lamotrigine levels. Titrate lamotrigine with the valproate schedule to 100 mg, then step valproate down while raising lamotrigine (label conversion).',
      phases: [
        { label: 'Weeks 1–6', a: 100, b: 50, note: 'Lamotrigine 25 mg every other day → 100 mg/day by week 6.' },
        { label: 'Week 7', a: 50, b: 50, note: 'Keep lamotrigine 100 mg; reduce valproate by ≤500 mg/day per week (to 500 mg/day).' },
        { label: 'Week 8', a: 25, b: 75, note: 'Lamotrigine 150 mg; valproate 250 mg/day.' },
        { label: 'Week 9', a: 0, b: 100, note: 'Stop valproate; lamotrigine 200 mg/day.' },
      ],
      cautions: ['Any rash during titration: stop lamotrigine unless clearly unrelated.'],
      monitoring: ['Rash', 'Mood (lamotrigine protects mainly against depression)'],
    };
  }
  if (b.id === 'lamotrigine' && a.id === 'carbamazepine') {
    return {
      strategy: 'cross-taper',
      headline: 'Lamotrigine on the inducer schedule, then withdraw carbamazepine',
      rationale: 'Carbamazepine halves lamotrigine levels; titrate to 400 mg, then stop carbamazepine and step lamotrigine down as induction wears off.',
      phases: [
        { label: 'Weeks 1–7', a: 100, b: 100, note: 'Lamotrigine 50 mg/day → 400 mg/day (inducer schedule).' },
        { label: 'Week 8', a: 0, b: 100, note: 'Stop carbamazepine; lamotrigine stays 400 mg.' },
        { label: 'Weeks 9–10', a: 0, b: 60, note: 'Lamotrigine 300 mg (week 9) → 200 mg (week 10).' },
      ],
      cautions: ['Other co-medications also rise as induction resolves over ~2 weeks.'],
      monitoring: ['Rash', 'Dizziness/diplopia as levels rise'],
    };
  }
  if (a.id === 'lithium') {
    return crossTaper(a, b, 'Overlap, then taper lithium over ≥2–4 weeks', 'Abrupt lithium discontinuation sharply raises early relapse (especially mania) and suicide risk.', ['Never stop lithium abruptly unless toxic.'], 4);
  }

  // ---------- ADHD ----------
  if (a.cls === 'stimulant' && b.cls === 'stimulant') {
    return {
      strategy: 'direct',
      headline: 'Direct switch the next morning',
      rationale: 'Short half-lives allow an immediate switch; there is no washout requirement.',
      phases: [
        { label: 'Day 1', a: 0, b: 50, note: `Start ${b.name} at a low-to-moderate dose (amphetamine ≈ half the methylphenidate dose).` },
        { label: 'Weeks 1–3', a: 0, b: 100, note: 'Titrate weekly to effect.' },
      ],
      cautions: [],
      monitoring: ['ADHD symptoms', 'Appetite, sleep, HR/BP'],
    };
  }
  if (a.cls === 'stimulant' && STIM_NON.has(b.id)) {
    return {
      strategy: 'overlap-then-stop',
      headline: `Overlap while ${b.name} takes effect`,
      rationale: `${b.name} needs weeks for full effect (atomoxetine 4–8 weeks); continue the stimulant meanwhile, then stop it.`,
      phases: [
        { label: 'Weeks 1–4', a: 100, b: 100, note: `Start and titrate ${b.name}; continue ${a.name}.` },
        { label: 'Week 5+', a: 0, b: 100, note: `Stop ${a.name} (no taper usually needed).` },
      ],
      cautions: overlapCautions(a, b),
      monitoring: ['ADHD symptoms', 'HR/BP during overlap'],
    };
  }
  if ((a.id === 'guanfacine-er' || a.id === 'clonidine-er')) {
    return crossTaper(a, b, 'Taper the α2 agonist', 'Abrupt cessation causes rebound hypertension: taper guanfacine ≤1 mg (clonidine ≤0.1 mg) every 3–7 days.', [], 2);
  }

  // ---------- Opioid use disorder ----------
  if (b.id === 'buprenorphine' && a.ix.opioid === 'full') {
    return {
      strategy: 'stop-wait-start',
      headline: 'Wait for withdrawal (or use low-dose induction)',
      rationale: 'Buprenorphine displaces full agonists; starting before withdrawal precipitates it. From methadone, first taper to ≤30–40 mg/day.',
      phases: [
        { label: 'Prep', a: 40, b: 0, note: 'Methadone: taper to ≤30–40 mg/day.' },
        { label: 'Induction day', a: 0, b: 40, note: 'When COWS ≥8–12 (often ≥36–72 h after methadone), 2–4 mg SL; repeat every 1–2 h.' },
        { label: 'Days 2–7', a: 0, b: 100, note: 'Stabilize at 16–24 mg/day (higher if needed).' },
      ],
      cautions: ['Alternative: low-dose induction from ~0.5 mg while continuing the full agonist, over 3–7 days.'],
      monitoring: ['COWS', 'Cravings and use', 'Sedation'],
    };
  }
  if (a.id === 'buprenorphine' && b.id === 'naltrexone') {
    return {
      strategy: 'washout',
      washoutDays: 7,
      headline: 'Opioid-free 7–14 days before naltrexone',
      rationale: 'Naltrexone precipitates withdrawal while buprenorphine occupies receptors.',
      phases: [
        { label: 'Taper', a: 50, b: 0, note: 'Taper buprenorphine.' },
        { label: '7–14 days', a: 0, b: 0, note: 'Opioid-free; manage withdrawal (lofexidine, symptomatic).' },
        { label: 'Then', a: 0, b: 100, note: 'Oral naltrexone test dose, then XR-NTX.' },
      ],
      cautions: ['Loss of tolerance: overdose risk is high if opioids are resumed.'],
      monitoring: ['Withdrawal', 'Relapse'],
    };
  }

  // ---------- Generic fallback ----------
  return crossTaper(a, b, 'General cross-taper', 'No pair-specific evidence: introduce the new drug at a low dose and taper the old one over 2–4 weeks, adjusting to symptoms.', [], 3);
}

function crossTaper(a: Drug, b: Drug, headline: string, rationale: string, extra: string[], weeks = 2): SwitchPlan {
  return {
    strategy: 'cross-taper',
    headline,
    rationale,
    phases: [
      { label: 'Week 1', a: 75, b: 40, note: `Reduce ${a.name} ~25%; start ${b.name} low.` },
      { label: `Weeks 2–${weeks}`, a: 30, b: 80, note: `Continue tapering ${a.name}; titrate ${b.name}.` },
      { label: `Week ${weeks + 1}`, a: 0, b: 100, note: `${a.name} stopped; ${b.name} at target.` },
    ],
    cautions: [...extra, ...overlapCautions(a, b)],
    monitoring: baseMonitoring,
  };
}

/** Classes offered in the switching selector. */
export const switchableModules = ['antidepressants', 'antipsychotics', 'mood-stabilizers', 'anxiety', 'adhd', 'substance-use', 'sleep'] as const;
export { AD_SEROTONERGIC };
