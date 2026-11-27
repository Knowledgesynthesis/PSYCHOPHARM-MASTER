import type { CoMed, CypProfile, Drug, Enzyme, IxFlags, Severity, Strength } from '@/types';
import { allDrugs, drugMap } from '@/data/drugs';
import { coMedMap, coMeds } from '@/data/coMeds';

export interface Agent {
  id: string;
  name: string;
  kind: 'drug' | 'comed';
  ix: IxFlags;
  cyp?: CypProfile;
  cls?: string;
  module?: string;
  contraWith?: { id: string; why: string }[];
}

export interface Finding {
  key: string;
  severity: Severity;
  title: string;
  agents: string[];
  detail: string;
  action: string;
}

export const SEVERITY_RANK: Record<Severity, number> = { contraindicated: 4, major: 3, moderate: 2, minor: 1 };

export const SEVERITY_MEANING: Record<Severity, string> = {
  contraindicated: 'Do not combine.',
  major: 'Avoid, or adjust dose and monitor closely.',
  moderate: 'Monitor; adjust if needed.',
  minor: 'Usually no action; be aware.',
};

export function toAgent(x: Drug | CoMed): Agent {
  if ('module' in x) {
    return { id: x.id, name: x.name, kind: 'drug', ix: x.ix, cyp: x.cyp, cls: x.cls, module: x.module, contraWith: x.contraWith };
  }
  return { id: x.id, name: x.name, kind: 'comed', ix: x.ix, cyp: x.cyp };
}

export function agentById(id: string): Agent | undefined {
  const d = drugMap[id];
  if (d) return toAgent(d);
  const c = coMedMap[id];
  return c ? toAgent(c) : undefined;
}

export const allAgents: Agent[] = [...allDrugs.map(toAgent), ...coMeds.map(toAgent)];

const pairKey = (a: Agent, b: Agent) => [a.id, b.id].sort().join('|');
const names = (xs: Agent[]) => xs.map((x) => x.name);
const isBenzo = (a: Agent) => a.cls === 'benzodiazepine';
const isOpioidAgonist = (a: Agent) => a.ix.opioid === 'full' || a.ix.opioid === 'partial';

interface PairRule {
  a: (x: Agent) => boolean;
  b: (x: Agent) => boolean;
  severity: Severity;
  title: string;
  detail: string;
  action: string;
}

const id = (...ids: string[]) => (x: Agent) => ids.includes(x.id);

/** Clinically specific pairs whose consequence is better described than by the generic CYP rule. */
const PAIR_RULES: PairRule[] = [
  {
    a: id('valproate'), b: id('lamotrigine'), severity: 'major',
    title: 'Valproate doubles lamotrigine levels',
    detail: 'Valproate inhibits lamotrigine glucuronidation (~2× exposure, half-life ~70 h) — the main modifiable risk factor for SJS/TEN.',
    action: 'Use the valproate titration (25 mg every other day) and roughly half the usual targets.',
  },
  {
    a: id('carbamazepine', 'phenytoin', 'rifampin'), b: id('lamotrigine'), severity: 'moderate',
    title: 'Inducer lowers lamotrigine ~50%',
    detail: 'UGT induction halves lamotrigine exposure.',
    action: 'Use the inducer titration schedule; when the inducer is stopped, reduce lamotrigine over ~2 weeks as levels rise.',
  },
  {
    a: id('estrogen-contraceptive'), b: id('lamotrigine'), severity: 'moderate',
    title: 'Estrogen lowers lamotrigine ~50%',
    detail: 'Estrogen induces glucuronidation; levels rise during the pill-free week (toxicity) and fall on active pills (breakthrough).',
    action: 'Higher lamotrigine doses may be needed; consider continuous regimens, progestin-only methods or an IUD.',
  },
  {
    a: id('carbamazepine'), b: id('estrogen-contraceptive'), severity: 'major',
    title: 'Contraceptive failure',
    detail: 'Strong CYP3A4 induction lowers contraceptive hormone levels.',
    action: 'Use a copper or levonorgestrel IUD or DMPA; avoid relying on pills, patch, ring or implant.',
  },
  {
    a: id('carbapenems'), b: id('valproate'), severity: 'major',
    title: 'Carbapenems crash valproate levels',
    detail: 'Valproate levels fall 60–90% within 24 h and do not respond to dose increases.',
    action: 'Avoid the combination; use an alternative antibiotic or a bridging anticonvulsant/mood stabilizer.',
  },
  {
    a: id('topiramate'), b: id('valproate'), severity: 'moderate',
    title: 'Hyperammonemia',
    detail: 'Combination associated with hyperammonemic encephalopathy and hypothermia.',
    action: 'Check ammonia if lethargy, vomiting or confusion.',
  },
  {
    a: id('valproate'), b: id('lorazepam'), severity: 'moderate',
    title: 'Valproate raises lorazepam',
    detail: 'UGT inhibition reduces lorazepam clearance.',
    action: 'Reduce lorazepam dose ~50%.',
  },
  {
    a: id('disulfiram'), b: (x) => !!x.ix.alcohol, severity: 'contraindicated',
    title: 'Disulfiram–alcohol reaction',
    detail: 'Acetaldehyde accumulation: flushing, vomiting, tachycardia, hypotension; rarely arrhythmia or death. Occurs up to 2 weeks after the last dose.',
    action: 'No alcohol in any form (including mouthwash and cooking) during and for 14 days after treatment.',
  },
  {
    a: id('disulfiram'), b: id('metronidazole'), severity: 'contraindicated',
    title: 'Disulfiram + metronidazole',
    detail: 'Acute psychosis and confusion reported.',
    action: 'Do not combine; allow 2 weeks after disulfiram.',
  },
  {
    a: id('tobacco'), b: id('clozapine'), severity: 'major',
    title: 'Smoking status changes clozapine levels',
    detail: 'Hydrocarbons in smoke induce CYP1A2: smokers need roughly 1.5× higher doses. Quitting (or a smoke-free admission) raises levels ~50% within 1–2 weeks → sedation, seizures. Nicotine replacement does not induce 1A2.',
    action: 'Check a level, and reduce the dose by ~25–50% when the patient stops smoking.',
  },
  {
    a: id('tobacco'), b: id('olanzapine'), severity: 'moderate',
    title: 'Smoking lowers olanzapine levels',
    detail: 'CYP1A2 induction lowers levels; stopping smoking raises them.',
    action: 'Anticipate sedation and adjust the dose when smoking status changes.',
  },
  {
    a: id('naltrexone'), b: isOpioidAgonist, severity: 'contraindicated',
    title: 'Naltrexone blocks opioids / precipitates withdrawal',
    detail: 'Naltrexone precipitates severe withdrawal in opioid-dependent patients and blocks analgesia; attempts to overcome the blockade risk overdose.',
    action: 'Require 7–14 opioid-free days before naltrexone; use non-opioid or regional analgesia.',
  },
  {
    a: id('buprenorphine'), b: (x) => x.ix.opioid === 'full', severity: 'major',
    title: 'Buprenorphine + full agonist',
    detail: 'At induction, buprenorphine displaces a full agonist and can precipitate withdrawal; during maintenance it blunts full-agonist analgesia.',
    action: 'Start buprenorphine in withdrawal (COWS ≥8–12) or by low-dose induction; for acute pain continue buprenorphine and add multimodal or high-affinity opioid analgesia with monitoring.',
  },
  {
    a: id('clozapine', 'olanzapine'), b: isBenzo, severity: 'moderate',
    title: 'Parenteral benzodiazepine with clozapine/olanzapine',
    detail: 'Cardiorespiratory depression and collapse are reported, mainly with IM/IV benzodiazepines (and IM olanzapine).',
    action: 'Avoid giving IM olanzapine and parenteral benzodiazepines together; separate by ≥1 h and monitor vitals.',
  },
  {
    a: (x) => x.ix.maoi === 'irreversible', b: id('carbamazepine'), severity: 'contraindicated',
    title: 'MAOI + carbamazepine',
    detail: 'Labeled contraindication (tricyclic structure; hypertensive/serotonergic reactions).',
    action: 'Allow 14 days after stopping the MAOI.',
  },
];

function push(list: Finding[], f: Omit<Finding, 'key'>) {
  const key = `${f.title}|${[...f.agents].sort().join('|')}`;
  if (!list.some((x) => x.key === key)) list.push({ ...f, key });
}

const STRENGTH_SEVERITY: Record<Strength, Severity> = { strong: 'major', moderate: 'moderate', weak: 'minor' };
const worst = (a: Severity | undefined, b: Severity): Severity => (!a || SEVERITY_RANK[b] > SEVERITY_RANK[a] ? b : a);

/** Main entry point: returns findings sorted by severity. */
export function checkInteractions(agents: Agent[]): Finding[] {
  const findings: Finding[] = [];
  const handled = new Set<string>();
  const uniq = agents.filter((a, i) => agents.findIndex((b) => b.id === a.id) === i);

  // 1. Labeled contraindicated pairs
  for (const a of uniq) {
    for (const c of a.contraWith ?? []) {
      const b = uniq.find((x) => x.id === c.id);
      if (!b) continue;
      handled.add(pairKey(a, b));
      push(findings, { severity: 'contraindicated', title: `${a.name} + ${b.name}: labeled contraindication`, agents: [a.name, b.name], detail: c.why, action: 'Do not combine; choose an alternative.' });
    }
  }

  // 2. Specific pair rules
  for (let i = 0; i < uniq.length; i++) {
    for (let j = i + 1; j < uniq.length; j++) {
      for (const r of PAIR_RULES) {
        const [x, y] = r.a(uniq[i]) && r.b(uniq[j]) ? [uniq[i], uniq[j]] : r.a(uniq[j]) && r.b(uniq[i]) ? [uniq[j], uniq[i]] : [];
        if (!x || !y) continue;
        handled.add(pairKey(x, y));
        push(findings, { severity: r.severity, title: r.title, agents: [x.name, y.name], detail: r.detail, action: r.action });
      }
    }
  }

  // 3. MAOIs
  const maois = uniq.filter((a) => a.ix.maoi);
  for (const m of maois) {
    for (const o of uniq) {
      if (o.id === m.id) continue;
      const irreversible = m.ix.maoi === 'irreversible';
      if (o.ix.maoi && m.id < o.id) {
        push(findings, { severity: 'contraindicated', title: 'Two MAO inhibitors', agents: [m.name, o.name], detail: 'Combined MAO inhibition risks hypertensive crisis and serotonin syndrome.', action: 'Never combine; observe the 14-day washout.' });
      } else if (o.ix.sero && !o.ix.maoi) {
        // Labeled contraindications: all antidepressants, potent serotonergic agents, triptans, buspirone
        const labeled = (o.ix.sero ?? 0) >= 2 || o.module === 'antidepressants' || ['triptans', 'buspirone'].includes(o.id);
        push(findings, {
          severity: irreversible && labeled ? 'contraindicated' : 'major',
          title: 'MAO inhibition + serotonergic drug: serotonin syndrome',
          agents: [m.name, o.name],
          detail: irreversible
            ? 'MAOIs combined with serotonin reuptake inhibitors, serotonergic opioids (tramadol, meperidine, methadone) or dextromethorphan have caused fatal serotonin toxicity.'
            : `${m.name} is a reversible MAO inhibitor; with serotonergic drugs it has caused serotonin syndrome (FDA).`,
          action: irreversible && labeled
            ? 'Contraindicated. Respect washouts: 14 days after an MAOI; 5 weeks after fluoxetine; 3 weeks after vortioxetine before an MAOI.'
            : irreversible
              ? 'Avoid if possible; if needed, use the lowest dose with close monitoring for serotonin toxicity.'
              : 'Use an alternative if possible. If essential and urgent, stop the serotonergic drug and monitor for serotonin toxicity for 2 weeks (5 weeks for fluoxetine).',
        });
      } else if (o.ix.symp) {
        push(findings, {
          severity: irreversible ? 'contraindicated' : 'major',
          title: 'MAO inhibition + sympathomimetic/tyramine: hypertensive crisis',
          agents: [m.name, o.name],
          detail: 'Indirect sympathomimetics and dietary tyramine release norepinephrine that MAO can no longer degrade → severe hypertension, stroke.',
          action: 'Avoid. Treat crisis with phentolamine or IV nicardipine/clevidipine.',
        });
      }
    }
  }

  // 4. Serotonergic load (excluding MAOIs, handled above)
  const sero = uniq.filter((a) => a.ix.sero && !a.ix.maoi);
  if (sero.length >= 2) {
    const total = sero.reduce((s, a) => s + (a.ix.sero ?? 0), 0);
    const potent = sero.filter((a) => a.ix.sero === 3).length;
    // Grade by the second-strongest contributor: SSRI + weak agent (trazodone, mirtazapine, triptan) = minor;
    // SSRI + moderate agent (tramadol, TCA, dextromethorphan) = major.
    const second = sero.map((a) => a.ix.sero ?? 0).sort((x, y) => y - x)[1];
    const severity: Severity = potent >= 2 || total >= 5 ? 'major' : second >= 2 ? 'moderate' : 'minor';
    push(findings, {
      severity,
      title: potent >= 2 ? 'Duplicate serotonin reuptake inhibitors' : 'Additive serotonergic effect',
      agents: names(sero),
      detail:
        potent >= 2
          ? 'Two potent serotonin reuptake inhibitors add risk without evidence of added benefit.'
          : 'Combined serotonergic activity can cause serotonin toxicity, typically within 24 h of starting or increasing a drug. Absolute risk is low for many pairs (e.g., SSRI + triptan).',
      action: potent >= 2 ? 'Avoid duplication except during a planned cross-taper.' : 'Counsel; monitor for tremor, clonus, hyperreflexia, agitation, diarrhea, hyperthermia.',
    });
  }

  // 5. QT
  const qt = uniq.filter((a) => (a.ix.qt ?? 0) >= 2);
  if (qt.length >= 2) {
    const zipra = qt.some((a) => a.id === 'ziprasidone');
    const known = qt.some((a) => a.ix.qt === 3);
    push(findings, {
      severity: zipra ? 'contraindicated' : known ? 'major' : 'moderate',
      title: 'Additive QTc prolongation',
      agents: names(qt),
      detail: `Each agent prolongs QTc${known ? '; at least one has known torsades risk (CredibleMeds)' : ''}. Risk rises with age >65, female sex, bradycardia, hypokalemia/hypomagnesemia, heart disease and high doses.`,
      action: zipra
        ? 'Ziprasidone labeling contraindicates use with other QT-prolonging drugs.'
        : 'Baseline ECG and K+/Mg2+; avoid if QTc >500 ms or rises >60 ms; prefer lower-risk alternatives.',
    });
  }

  // 6. Respiratory depression
  const opioids = uniq.filter(isOpioidAgonist);
  const sedatives = uniq.filter((a) => a.ix.resp && !isOpioidAgonist(a));
  if (opioids.length && sedatives.length) {
    push(findings, {
      severity: 'major',
      title: 'Opioid + sedative: respiratory depression',
      agents: names([...opioids, ...sedatives]),
      detail: 'Boxed warning: profound sedation, respiratory depression, coma and death (benzodiazepines, Z-drugs, gabapentinoids, alcohol).',
      action: 'Use the lowest doses, co-prescribe naloxone, avoid alcohol. For patients on buprenorphine or methadone, do not withhold OUD treatment — manage the risk (FDA 2017).',
    });
  }
  const alcohol = uniq.find((a) => a.ix.alcohol);
  const hypnotics = uniq.filter((a) => a.ix.resp && !a.ix.alcohol && !isOpioidAgonist(a));
  if (alcohol && hypnotics.length) {
    push(findings, { severity: 'major', title: 'Alcohol + sedative-hypnotic', agents: names([alcohol, ...hypnotics]), detail: 'Synergistic CNS and respiratory depression; complex sleep behaviors with Z-drugs.', action: 'Advise abstinence from alcohol with these agents.' });
  }
  if (opioids.length >= 2) {
    push(findings, { severity: 'moderate', title: 'Multiple opioids', agents: names(opioids), detail: 'Additive respiratory depression (or precipitated withdrawal if a partial agonist is involved).', action: 'Review necessity; ensure naloxone is available.' });
  }

  // 7. General CNS depression
  const cns = uniq.filter((a) => a.ix.cns || a.ix.resp);
  if (cns.length >= 2 && !(opioids.length && sedatives.length)) {
    push(findings, {
      severity: cns.length >= 3 ? 'moderate' : 'minor',
      title: 'Additive sedation',
      agents: names(cns),
      detail: 'Additive sedation, psychomotor impairment and falls (especially older adults).',
      action: 'Use the lowest effective doses; caution with driving.',
    });
  }

  // 8. Anticholinergic burden
  const achol = uniq.filter((a) => a.ix.achol);
  const acholSum = achol.reduce((s, a) => s + (a.ix.achol ?? 0), 0);
  if (achol.length >= 2 && acholSum >= 4) {
    const cloz = achol.some((a) => a.id === 'clozapine');
    push(findings, {
      severity: cloz ? 'major' : 'moderate',
      title: cloz ? 'Clozapine + anticholinergic: ileus risk' : 'High anticholinergic burden',
      agents: names(achol),
      detail: cloz
        ? 'Clozapine-induced GI hypomotility can progress to fatal ileus; added anticholinergics compound it.'
        : 'Delirium, cognitive impairment, urinary retention, constipation, hyperthermia — especially in older adults.',
      action: cloz ? 'Avoid other anticholinergics; prophylactic laxatives; ask about bowels every visit.' : 'Deprescribe where possible.',
    });
  }

  // 9. Lithium
  const li = uniq.find((a) => a.ix.lithium);
  if (li) {
    for (const o of uniq) {
      if (o.ix.liUp) push(findings, { severity: 'major', title: `${o.name} raises lithium levels`, agents: [li.name, o.name], detail: 'Reduced renal lithium clearance (thiazides ~25–40%; NSAIDs, ACE inhibitors and ARBs variably) → toxicity.', action: 'Avoid if possible; otherwise reduce lithium and recheck the level in 5–7 days.' });
      if (o.ix.liDown) push(findings, { severity: 'moderate', title: `${o.name} lowers lithium levels`, agents: [li.name, o.name], detail: 'Increased renal lithium clearance → loss of efficacy; stopping the agent raises levels.', action: 'Recheck the lithium level after starting or stopping.' });
    }
  }

  // 10. Bleeding
  const bleed = uniq.filter((a) => a.ix.bleed);
  const anticoag = uniq.filter((a) => a.ix.anticoag);
  if (bleed.length && anticoag.length) {
    push(findings, { severity: 'moderate', title: 'Bleeding risk', agents: names([...bleed, ...anticoag]), detail: 'SSRIs/SNRIs deplete platelet serotonin; with NSAIDs, antiplatelets or anticoagulants, GI bleeding risk rises several-fold.', action: 'Consider a PPI; monitor for bleeding; check INR with warfarin.' });
  }

  // 11. Hyponatremia
  const na = uniq.filter((a) => a.ix.hypoNa);
  if (na.length >= 2) push(findings, { severity: 'moderate', title: 'Additive hyponatremia/SIADH', agents: names(na), detail: 'Highest risk in older adults, low body weight and with diuretics.', action: 'Check sodium at baseline and 2–4 weeks.' });

  // 12. Seizure threshold
  const sz = uniq.filter((a) => a.ix.seizure);
  if (sz.length >= 2) push(findings, { severity: 'moderate', title: 'Lowered seizure threshold', agents: names(sz), detail: 'Additive seizure risk (bupropion, clozapine, TCAs, tramadol and others).', action: 'Avoid in seizure disorders; keep doses within limits.' });

  // 13. Dopamine
  const daAnt = uniq.filter((a) => a.ix.da === 'antagonist');
  const daAg = uniq.filter((a) => a.ix.da === 'agonist');
  if (daAnt.length && daAg.length) push(findings, { severity: 'moderate', title: 'Dopamine antagonist vs dopamine agonist', agents: names([...daAnt, ...daAg]), detail: 'Opposing effects: worsened parkinsonism or loss of antipsychotic effect.', action: 'In Parkinson disease psychosis prefer pimavanserin, clozapine or (weaker evidence) quetiapine.' });
  if (daAnt.length >= 2) push(findings, { severity: 'moderate', title: 'Multiple D2 antagonists', agents: names(daAnt), detail: 'Additive EPS, prolactin and NMS risk; antipsychotic polypharmacy has limited evidence outside clozapine augmentation and cross-tapers.', action: 'Justify and document; review at each visit.' });

  // 14. Myelosuppression
  const myelo = uniq.filter((a) => a.ix.myelo);
  if (myelo.length >= 2) push(findings, { severity: 'major', title: 'Additive bone-marrow suppression', agents: names(myelo), detail: 'Combined risk of neutropenia/agranulocytosis.', action: 'Avoid; if unavoidable, intensify CBC/ANC monitoring.' });

  // 15. Orthostasis
  const ortho = uniq.filter((a) => a.ix.orthostatic);
  if (ortho.length >= 2) push(findings, { severity: ortho.length >= 3 ? 'moderate' : 'minor', title: 'Additive orthostatic hypotension', agents: names(ortho), detail: 'Dizziness, syncope and falls — especially during titration and in older adults.', action: 'Titrate slowly; check orthostatic vitals.' });

  // 16. Generic CYP (pharmacokinetic) — UGT handled only by explicit rules
  for (const perp of uniq) {
    for (const victim of uniq) {
      if (perp.id === victim.id || handled.has(pairKey(perp, victim)) || !victim.cyp) continue;
      const enzymes = new Set<Enzyme>([...(victim.cyp.sub ?? []), ...(victim.cyp.prodrug ? [victim.cyp.prodrug] : [])]);
      let inhSev: Severity | undefined;
      let indSev: Severity | undefined;
      const inhNotes: string[] = [];
      const indNotes: string[] = [];
      for (const e of enzymes) {
        if (e === 'UGT') continue;
        const inh = perp.cyp?.inh?.[e];
        const ind = perp.cyp?.ind?.[e];
        if (inh) { inhSev = worst(inhSev, STRENGTH_SEVERITY[inh]); inhNotes.push(`${inh} CYP${e} inhibitor`); }
        if (ind) { indSev = worst(indSev, STRENGTH_SEVERITY[ind]); indNotes.push(`${ind} CYP${e} inducer`); }
      }
      const prodrug = victim.cyp.prodrug;
      if (inhSev) {
        const activation = prodrug && perp.cyp?.inh?.[prodrug];
        push(findings, {
          severity: inhSev,
          title: activation ? `${perp.name} blocks activation of ${victim.name}` : `${perp.name} raises ${victim.name} levels`,
          agents: [perp.name, victim.name],
          detail: `${perp.name} is a ${inhNotes.join(' and ')}; ${victim.name} depends on this pathway${activation ? ' for conversion to its active form → loss of effect' : ' → higher exposure and dose-related toxicity'}.`,
          action: activation ? 'Choose an alternative that does not inhibit this enzyme.' : 'Lower the victim drug dose or choose a non-interacting alternative; monitor effects/levels.',
        });
      }
      if (indSev) {
        push(findings, {
          severity: indSev,
          title: `${perp.name} lowers ${victim.name} levels`,
          agents: [perp.name, victim.name],
          detail: `${perp.name} is a ${indNotes.join(' and ')} → reduced ${victim.name} exposure and possible loss of efficacy (or withdrawal). Induction develops and resolves over ~2 weeks.`,
          action: 'Anticipate dose increases while combined and reductions after the inducer is stopped.',
        });
      }
    }
  }

  return findings.sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]);
}

export function checkByIds(ids: string[]): Finding[] {
  return checkInteractions(ids.map(agentById).filter((a): a is Agent => !!a));
}
