import { describe, expect, it } from 'vitest';
import { checkByIds } from '@/lib/interactions';
import { planSwitch } from '@/lib/switching';
import { drugMap, allDrugs } from '@/data/drugs';
import {
  buildTaper, computeQtc, convertBzd, ciwaBand, cowsBand, hunterCriteria, interpretAnc, interpretLithium, interpretQtc, LAMOTRIGINE_SCHEDULES,
} from '@/lib/calculators';
import { rankSyndromes } from '@/data/toxidromes';

const sev = (ids: string[]) => checkByIds(ids).map((f) => f.severity);
const titles = (ids: string[]) => checkByIds(ids).map((f) => `${f.severity}: ${f.title}`);
const worst = (ids: string[]) => checkByIds(ids)[0]?.severity;

describe('interaction engine — must-catch combinations', () => {
  it('MAOI + SSRI is contraindicated', () => expect(worst(['phenelzine', 'sertraline'])).toBe('contraindicated'));
  it('MAOI + tramadol and MAOI + dextromethorphan are contraindicated', () => {
    expect(worst(['phenelzine', 'tramadol'])).toBe('contraindicated');
    expect(worst(['tranylcypromine', 'dextromethorphan'])).toBe('contraindicated');
  });
  it('MAOI + stimulant/decongestant/tyramine → hypertensive crisis', () => {
    for (const x of ['methylphenidate', 'pseudoephedrine', 'tyramine', 'bupropion']) {
      expect(titles(['phenelzine', x]).join()).toMatch(/hypertensive crisis/);
      expect(worst(['phenelzine', x])).toBe('contraindicated');
    }
  });
  it('linezolid + SSRI is major (FDA)', () => expect(worst(['linezolid', 'escitalopram'])).toBe('major'));
  it('lithium + MAOI is not flagged as contraindicated (recognized augmentation)', () => expect(sev(['lithium', 'phenelzine'])).not.toContain('contraindicated'));
  it('SSRI + tramadol → major serotonergic load', () => expect(titles(['sertraline', 'tramadol']).join()).toMatch(/major: Additive serotonergic/));
  it('SSRI + weak serotonergic agent (trazodone, triptan) is minor, not alarming', () => {
    expect(worst(['sertraline', 'trazodone'])).toBe('minor');
    expect(worst(['escitalopram', 'triptans'])).toBe('minor');
  });
  it('two SSRIs → duplicate warning', () => expect(titles(['sertraline', 'fluoxetine']).join()).toMatch(/Duplicate serotonin/));
  it('lithium + NSAID / thiazide / ACE inhibitor → major', () => {
    for (const x of ['nsaids', 'thiazide', 'acei', 'arb']) expect(worst(['lithium', x]), x).toBe('major');
  });
  it('valproate + lamotrigine → major with the specific explanation', () => expect(titles(['valproate', 'lamotrigine'])[0]).toMatch(/major: Valproate doubles lamotrigine/));
  it('opioid + benzodiazepine → major respiratory depression', () => expect(titles(['oxycodone', 'alprazolam']).join()).toMatch(/major: Opioid \+ sedative/));
  it('naltrexone + methadone → contraindicated', () => expect(worst(['naltrexone', 'methadone'])).toBe('contraindicated'));
  it('fluoxetine/paroxetine/bupropion block tamoxifen activation', () => {
    for (const x of ['fluoxetine', 'paroxetine', 'bupropion']) expect(titles([x, 'tamoxifen']).join(), x).toMatch(/major: .*blocks activation of Tamoxifen/);
  });
  it('fluvoxamine + clozapine → major (CYP1A2)', () => expect(titles(['fluvoxamine', 'clozapine']).join()).toMatch(/major: Fluvoxamine raises Clozapine/));
  it('labeled contraindications fire', () => {
    expect(worst(['fluvoxamine', 'tizanidine'])).toBe('contraindicated');
    expect(worst(['fluvoxamine', 'ramelteon'])).toBe('contraindicated');
    expect(worst(['lurasidone', 'clarithromycin'])).toBe('contraindicated');
    expect(worst(['lurasidone', 'carbamazepine'])).toBe('contraindicated');
    expect(worst(['alprazolam', 'ketoconazole'])).toBe('contraindicated');
    expect(worst(['clozapine', 'carbamazepine'])).toBe('contraindicated');
  });
  it('ziprasidone + other QT drug → contraindicated; citalopram + methadone → major QT', () => {
    expect(worst(['ziprasidone', 'methadone'])).toBe('contraindicated');
    expect(titles(['citalopram', 'methadone']).join()).toMatch(/major: Additive QTc/);
  });
  it('smoking with clozapine → major', () => expect(worst(['tobacco', 'clozapine'])).toBe('major'));
  it('carbamazepine + contraceptive → major contraceptive failure', () => expect(titles(['carbamazepine', 'estrogen-contraceptive']).join()).toMatch(/Contraceptive failure/));
  it('clozapine + anticholinergic → ileus warning', () => expect(titles(['clozapine', 'benztropine']).join()).toMatch(/major: Clozapine \+ anticholinergic/));
  it('carbapenem + valproate → major', () => expect(worst(['carbapenems', 'valproate'])).toBe('major'));
  it('disulfiram + alcohol → contraindicated', () => expect(worst(['disulfiram', 'alcohol'])).toBe('contraindicated'));
  it('SSRI + NSAID → bleeding', () => expect(titles(['sertraline', 'nsaids']).join()).toMatch(/Bleeding risk/));

  it('returns nothing for benign pairs', () => {
    expect(checkByIds(['lamotrigine', 'methylphenidate'])).toHaveLength(0);
    expect(checkByIds(['sertraline'])).toHaveLength(0);
  });

  it('never throws and never duplicates findings across all drug pairs', () => {
    const ids = allDrugs.map((d) => d.id);
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const f = checkByIds([ids[i], ids[j]]);
        expect(new Set(f.map((x) => x.key)).size).toBe(f.length);
      }
    }
  });
});

describe('switching engine', () => {
  const plan = (a: string, b: string) => planSwitch(drugMap[a], drugMap[b]);
  it('fluoxetine → phenelzine requires 35-day washout', () => {
    const p = plan('fluoxetine', 'phenelzine');
    expect(p.strategy).toBe('washout');
    expect(p.washoutDays).toBe(35);
  });
  it('label washouts before MAOI', () => {
    expect(plan('venlafaxine', 'phenelzine').washoutDays).toBe(7);
    expect(plan('duloxetine', 'tranylcypromine').washoutDays).toBe(5);
    expect(plan('vortioxetine', 'phenelzine').washoutDays).toBe(21);
    expect(plan('sertraline', 'selegiline-td').washoutDays).toBe(14);
  });
  it('MAOI → anything serotonergic = 14 days', () => {
    expect(plan('phenelzine', 'sertraline').washoutDays).toBe(14);
    expect(plan('tranylcypromine', 'phenelzine').washoutDays).toBe(14);
    expect(plan('phenelzine', 'methylphenidate').washoutDays).toBe(14);
  });
  it('SSRI → SSRI is direct (except paroxetine/fluoxetine)', () => {
    expect(plan('sertraline', 'escitalopram').strategy).toBe('direct');
    expect(plan('paroxetine', 'sertraline').strategy).toBe('cross-taper');
    expect(plan('fluoxetine', 'sertraline').strategy).toBe('stop-wait-start');
  });
  it('antagonist → partial agonist uses plateau cross-taper', () => {
    expect(plan('olanzapine', 'aripiprazole').headline).toMatch(/keep the prior drug/);
  });
  it('valproate → lamotrigine uses the label conversion', () => {
    expect(plan('valproate', 'lamotrigine').headline).toMatch(/valproate schedule/);
  });
  it('produces a plan with phases for every drug pair without throwing', () => {
    for (const a of allDrugs) for (const b of allDrugs) {
      const p = planSwitch(a, b);
      if (a.id !== b.id) expect(p.phases.length, `${a.id}→${b.id}`).toBeGreaterThan(0);
      for (const ph of p.phases) { expect(ph.a).toBeGreaterThanOrEqual(0); expect(ph.b).toBeLessThanOrEqual(100); }
    }
  });
});

describe('calculators', () => {
  it('QTc formulas', () => {
    const r60 = computeQtc(400, 60);
    expect(r60.bazett).toBe(400);
    expect(r60.fridericia).toBe(400);
    const r100 = computeQtc(400, 100);
    expect(r100.bazett).toBe(516);
    expect(r100.fridericia).toBe(474);
    expect(interpretQtc(455, 'male').band).toBe('prolonged');
    expect(interpretQtc(455, 'female').band).toBe('normal');
    expect(interpretQtc(510, 'female').band).toBe('high-risk');
  });
  it('lithium interpretation', () => {
    const none = { gi: false, coarseTremor: false, ataxia: false, confusion: false, seizure: false, dysrhythmia: false, decreasedConsciousness: false };
    expect(interpretLithium({ level: 0.7, hoursSinceDose: 12, context: 'maintenance', symptoms: none, impairedKidney: false }).band).toBe('target');
    expect(interpretLithium({ level: 0.7, hoursSinceDose: 12, context: 'maintenance', symptoms: { ...none, ataxia: true }, impairedKidney: false }).band).toBe('toxic');
    const sev = interpretLithium({ level: 4.5, hoursSinceDose: 12, context: 'maintenance', symptoms: none, impairedKidney: true });
    expect(sev.band).toBe('severe');
    expect(sev.extrip?.strength).toBe('recommended');
    expect(interpretLithium({ level: 1.0, hoursSinceDose: 3, context: 'maintenance', symptoms: none, impairedKidney: false }).timingNote).toBeTruthy();
  });
  it('clozapine ANC categories (labeling)', () => {
    expect(interpretAnc(1600, 'general', 2).severity).toBe('normal');
    expect(interpretAnc(1200, 'general', 2).severity).toBe('mild');
    expect(interpretAnc(800, 'general', 2).severity).toBe('moderate');
    expect(interpretAnc(400, 'general', 2).severity).toBe('severe');
    expect(interpretAnc(1100, 'ben', 2).severity).toBe('normal');
    expect(interpretAnc(800, 'ben', 2).action).toMatch(/Continue/);
    expect(interpretAnc(1600, 'general', 8).monitoring).toMatch(/2 weeks/);
    expect(interpretAnc(1600, 'general', 14).monitoring).toMatch(/Monthly/);
  });
  it('lamotrigine schedules', () => {
    expect(LAMOTRIGINE_SCHEDULES.valproate[0].dose).toMatch(/every OTHER day/);
    expect(LAMOTRIGINE_SCHEDULES.mono.at(-1)?.dose).toMatch(/200/);
    expect(LAMOTRIGINE_SCHEDULES.inducer.at(-1)?.dose).toMatch(/400/);
  });
  it('benzodiazepine conversion and taper', () => {
    expect(convertBzd('alprazolam', 1, 'diazepam')).toBeCloseTo(20);
    expect(convertBzd('lorazepam', 2, 'clonazepam')).toBeCloseTo(1);
    const t = buildTaper(2, 10, 2, 0.125);
    expect(t.at(-1)?.dose).toBe(0);
    for (let i = 1; i < t.length; i++) expect(t[i].dose).toBeLessThan(t[i - 1].dose);
    // Any step above the 25% ceiling must be flagged and given a doubled interval
    for (let i = 1; i < t.length; i++) {
      if (t[i].reductionPct > 25) { expect(t[i].minStep).toBe(true); expect(t[i].week - t[i - 1].week).toBe(4); }
    }
    expect(t.filter((s) => !s.minStep).every((s) => s.reductionPct <= 25)).toBe(true);
  });
  it('Hunter criteria', () => {
    const base = { serotonergic: true, spontaneousClonus: false, inducibleClonus: false, ocularClonus: false, agitation: false, diaphoresis: false, tremor: false, hyperreflexia: false, hypertonia: false, tempOver38: false };
    expect(hunterCriteria({ ...base, tremor: true, hyperreflexia: true }).met).toBe(true);
    expect(hunterCriteria({ ...base, inducibleClonus: true }).met).toBe(false);
    expect(hunterCriteria({ ...base, inducibleClonus: true, diaphoresis: true }).met).toBe(true);
    expect(hunterCriteria({ ...base, serotonergic: false, spontaneousClonus: true }).met).toBe(false);
  });
  it('withdrawal scale bands', () => {
    expect(ciwaBand(9).label).toMatch(/Mild/);
    expect(ciwaBand(15).label).toMatch(/Moderate/);
    expect(ciwaBand(19).label).toMatch(/Severe/);
    expect(cowsBand(4).label).toMatch(/No active/);
    expect(cowsBand(14).label).toMatch(/Moderate/);
  });
});

describe('emergency recognizer ranking', () => {
  it('ranks classic presentations first', () => {
    expect(rankSyndromes(['clonus', 'hyperreflexia', 'diaphoresis', 'mydriasis'])[0].syndrome.id).toBe('serotonin');
    expect(rankSyndromes(['rigidity', 'hyperthermia', 'ckHigh', 'delirium'])[0].syndrome.id).toBe('nms');
    expect(rankSyndromes(['drySkin', 'decreasedBowel', 'urinaryRetention', 'mydriasis'])[0].syndrome.id).toBe('anticholinergic');
    expect(rankSyndromes(['coarseTremor', 'ataxia', 'vomiting'])[0].syndrome.id).toBe('lithium');
    expect(rankSyndromes(['miosis', 'respDepression'])[0].syndrome.id).toBe('opioid-overdose');
  });
});
