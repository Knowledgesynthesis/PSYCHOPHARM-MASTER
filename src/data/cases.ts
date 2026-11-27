import type { ClinicalCase } from '@/types';

export const cases: ClinicalCase[] = [
  {
    id: 'serotonin-tramadol', title: 'The new painkiller', module: 'emergencies', difficulty: 2,
    vignette: 'A 52-year-old on sertraline 150 mg and trazodone 50 mg nightly was started on tramadol for back pain yesterday. Today: anxious, sweating, tremulous. T 38.6 °C, HR 118, BP 158/92. Pupils dilated. Hyperreflexia with sustained ankle clonus, more in the legs. Hyperactive bowel sounds.',
    steps: [
      {
        prompt: 'What is the most likely diagnosis?',
        options: [
          { text: 'Serotonin syndrome', correct: true, feedback: 'Correct. Serotonergic exposure plus inducible clonus with diaphoresis meets the Hunter criteria; onset within 24 h of adding tramadol fits.' },
          { text: 'Neuroleptic malignant syndrome', correct: false, feedback: 'NMS needs a dopamine antagonist, develops over days and shows rigidity with reduced reflexes — not clonus.' },
          { text: 'Anticholinergic toxicity', correct: false, feedback: 'Anticholinergic patients have dry skin and absent bowel sounds; this patient is sweating with hyperactive bowel sounds.' },
          { text: 'Opioid withdrawal', correct: false, feedback: 'Withdrawal causes yawning, rhinorrhea and piloerection — not clonus or hyperthermia.' },
        ],
      },
      {
        prompt: 'Best initial management?',
        options: [
          { text: 'Stop sertraline, trazodone and tramadol; give a benzodiazepine; supportive care', correct: true, feedback: 'Correct. Removing the serotonergic load and sedating (to reduce muscle activity and heat) are the core steps.' },
          { text: 'Give dantrolene', correct: false, feedback: 'Dantrolene is for malignant hyperthermia/NMS; it is not effective in serotonin syndrome.' },
          { text: 'Apply physical restraints and acetaminophen', correct: false, feedback: 'Restraint increases isometric contraction and hyperthermia; antipyretics do not reduce muscle-generated heat.' },
          { text: 'Add bromocriptine', correct: false, feedback: 'Bromocriptine is serotonergic and can worsen serotonin syndrome.' },
        ],
      },
      {
        prompt: 'Despite lorazepam, clonus and agitation persist. Next?',
        options: [
          { text: 'Cyproheptadine 12 mg PO/NG, then 2 mg every 2 h while symptomatic', correct: true, feedback: 'Correct. Cyproheptadine is a 5-HT2A antagonist used for moderate cases. If T >41 °C: sedation, paralysis with a non-depolarizing agent and intubation.' },
          { text: 'Haloperidol for agitation', correct: false, feedback: 'Antipsychotics impair heat dissipation and can confuse the picture with NMS.' },
          { text: 'Restart sertraline at a lower dose', correct: false, feedback: 'Serotonergic drugs stay stopped until symptoms resolve (usually within 24–72 h).' },
        ],
      },
    ],
    takeaways: ['Serotonin syndrome = rapid onset + clonus/hyperreflexia + autonomic hyperactivity.', 'Tramadol, meperidine, methadone, fentanyl, dextromethorphan, linezolid and methylene blue are common culprits.', 'Treat: stop agents, benzodiazepines, cyproheptadine; avoid restraints and antipyretics.'],
  },
  {
    id: 'nms-haloperidol', title: 'Rigid and febrile on day 5', module: 'emergencies', difficulty: 2,
    vignette: 'A 28-year-old with first-episode psychosis received escalating haloperidol IM over 4 days and is dehydrated. Now confused and mute, T 39.4 °C, BP swinging 100/60–170/100, diffuse lead-pipe rigidity, reduced reflexes. CK 14,000 U/L, WBC 15,000.',
    steps: [
      {
        prompt: 'Diagnosis?',
        options: [
          { text: 'Neuroleptic malignant syndrome', correct: true, feedback: 'Correct. Rigidity, hyperthermia, altered mental status, autonomic instability and CK ≥4× ULN after a D2 antagonist (risk factors: IM, rapid escalation, dehydration).' },
          { text: 'Serotonin syndrome', correct: false, feedback: 'No serotonergic drug; reflexes are reduced and onset was over days.' },
          { text: 'Acute dystonia', correct: false, feedback: 'Dystonia is focal sustained spasm without fever or CK this high.' },
        ],
      },
      {
        prompt: 'Immediate management?',
        options: [
          { text: 'Stop haloperidol; ICU supportive care with cooling and IV fluids; lorazepam; consider dantrolene and/or bromocriptine', correct: true, feedback: 'Correct. Aggressive fluids protect the kidneys from rhabdomyolysis; ECT is an option if refractory.' },
          { text: 'Switch to olanzapine immediately', correct: false, feedback: 'All antipsychotics are stopped. Rechallenge only after ≥2 weeks of recovery, at low dose with slow titration.' },
          { text: 'Add benztropine and continue haloperidol', correct: false, feedback: 'Continuing the causative drug can be fatal.' },
        ],
      },
      {
        prompt: 'Two weeks after recovery, psychosis returns. Safest plan?',
        options: [
          { text: 'Low-potency or atypical antipsychotic at a low dose, slow titration, hydration and close monitoring of temperature/CK', correct: true, feedback: 'Correct. Most patients can be rechallenged safely with these precautions; avoid depots and high-potency agents initially.' },
          { text: 'Restart haloperidol decanoate', correct: false, feedback: 'A depot cannot be withdrawn if NMS recurs.' },
          { text: 'Never use antipsychotics again', correct: false, feedback: 'Recurrence risk exists, but careful rechallenge is usually possible; ECT is an alternative.' },
        ],
      },
    ],
    takeaways: ['NMS: days, rigidity, bradyreflexia, CK ↑↑.', 'Risk factors: high-potency, IM, rapid escalation, dehydration, agitation.', 'Rechallenge after ≥2 weeks with a low-potency/atypical agent, low and slow.'],
  },
  {
    id: 'lithium-bp', title: 'Lithium and the new blood-pressure pill', module: 'mood-stabilizers', difficulty: 2,
    vignette: 'A 66-year-old with bipolar I, stable for years on lithium (last level 0.7 mmol/L), was started on lisinopril/hydrochlorothiazide 3 weeks ago and has been taking ibuprofen for knee pain. Now: vomiting and diarrhea for 2 days, coarse tremor, unsteady gait, slurred speech, mild confusion. Creatinine 1.9 (baseline 1.1).',
    steps: [
      {
        prompt: 'What explains the presentation?',
        options: [
          { text: 'Lithium toxicity from reduced renal clearance (thiazide + ACE inhibitor + NSAID + volume loss)', correct: true, feedback: 'Correct. Each reduces lithium clearance; GI losses add acute kidney injury.' },
          { text: 'Viral gastroenteritis only', correct: false, feedback: 'Coarse tremor, ataxia and dysarthria are neurological toxicity signs — check a level.' },
          { text: 'Bipolar relapse', correct: false, feedback: 'Neuro signs and AKI point to toxicity, not a mood episode.' },
        ],
      },
      {
        prompt: 'Level returns at 2.8 mmol/L. Management?',
        options: [
          { text: 'Hold lithium and the interacting drugs, isotonic IV fluids, repeat levels every 2–6 h, involve nephrology for possible dialysis', correct: true, feedback: 'Correct. With impaired kidneys and neuro signs, the EXTRIP threshold for "suggested" dialysis is met if clearance is slow; decreased consciousness or seizures make it "recommended".' },
          { text: 'Activated charcoal', correct: false, feedback: 'Charcoal does not bind lithium. Whole-bowel irrigation is for large sustained-release ingestions.' },
          { text: 'Halve the dose and recheck next week', correct: false, feedback: 'This is symptomatic toxicity — hold and treat now.' },
        ],
      },
      {
        prompt: 'After recovery, the safest long-term plan for blood pressure is:',
        options: [
          { text: 'Avoid thiazides/NSAIDs; if an ACE inhibitor or ARB is essential, reduce lithium and recheck the level in 5–7 days; teach sick-day rules', correct: true, feedback: 'Correct. Calcium-channel blockers are lithium-neutral alternatives. Sick-day rule: hold lithium during vomiting, diarrhea or poor intake.' },
          { text: 'Restart everything at the same doses', correct: false, feedback: 'The same toxicity will recur.' },
          { text: 'Stop lithium permanently in all cases', correct: false, feedback: 'Lithium remains the best maintenance drug; manage interactions rather than abandon it reflexively.' },
        ],
      },
    ],
    takeaways: ['Thiazides, ACE inhibitors/ARBs, NSAIDs and dehydration raise lithium.', 'Coarse tremor + ataxia + confusion = toxicity until proven otherwise.', 'Teach sick-day rules; recheck levels 5–7 days after any interacting change.'],
  },
  {
    id: 'clozapine-anc', title: 'Clozapine: month 3', module: 'antipsychotics', difficulty: 3,
    vignette: 'A 34-year-old with treatment-resistant schizophrenia is responding well to clozapine 400 mg (level 420 ng/mL). Routine weekly ANC is 820/µL (previous 2,100). Afebrile, no infection. General population reference range.',
    steps: [
      {
        prompt: 'How should this ANC be managed (labeling algorithm)?',
        options: [
          { text: 'Moderate neutropenia: interrupt clozapine if clozapine-induced neutropenia is suspected, hematology consult, ANC daily; resume once ANC ≥1,000/µL', correct: true, feedback: 'Correct. 500–999 is moderate. Rechallenge is permitted once ANC recovers; monitor 3× weekly to ≥1,500, then weekly for 4 weeks.' },
          { text: 'Permanently discontinue — never rechallenge', correct: false, feedback: 'That applies to severe neutropenia (<500/µL), and even then rechallenge is possible if benefits clearly outweigh risks.' },
          { text: 'Continue; recheck next month', correct: false, feedback: 'Mild neutropenia (1,000–1,499) continues with 3× weekly ANC; moderate requires interruption.' },
        ],
      },
      {
        prompt: 'ANC recovers to 1,600/µL in 6 days. The REMS was removed in 2025. Which is true?',
        options: [
          { text: 'ANC monitoring per labeling is still required; REMS enrollment/reporting is not', correct: true, feedback: 'Correct. The REMS removal (effective June 13, 2025) did not change the neutropenia risk or the labeled monitoring.' },
          { text: 'Monitoring can stop because the REMS is gone', correct: false, feedback: 'FDA explicitly advises continued ANC monitoring per prescribing information.' },
        ],
      },
      {
        prompt: 'Months later he quits smoking (20 cigarettes/day) and uses a nicotine patch. A week later he is very sedated and drooling. Most likely?',
        options: [
          { text: 'Rising clozapine level after loss of CYP1A2 induction — check a level and reduce the dose', correct: true, feedback: 'Correct. Smoke hydrocarbons induce CYP1A2; nicotine does not. Levels often rise ~50% within 1–2 weeks of quitting; seizure risk rises with levels.' },
          { text: 'Nicotine toxicity', correct: false, feedback: 'Patch nicotine does not affect clozapine metabolism.' },
          { text: 'Catatonia', correct: false, feedback: 'Sedation and hypersalivation after quitting smoking are classic for rising clozapine levels.' },
        ],
      },
    ],
    takeaways: ['ANC categories: mild 1,000–1,499 (continue), moderate 500–999 (interrupt, rechallenge OK), severe <500.', 'Benign ethnic / Duffy-null neutropenia uses lower thresholds (≥1,000 normal).', 'Smoking changes alter clozapine levels — adjust proactively.'],
  },
  {
    id: 'lamotrigine-valproate', title: 'Adding lamotrigine', module: 'mood-stabilizers', difficulty: 2,
    vignette: 'A 29-year-old with bipolar I on valproate has recurrent depressive episodes. You plan to add lamotrigine.',
    steps: [
      {
        prompt: 'Starting schedule?',
        options: [
          { text: '25 mg every other day for 2 weeks, then 25 mg daily for 2 weeks, 50 mg week 5, 100 mg week 6', correct: true, feedback: 'Correct. Valproate doubles lamotrigine exposure; the schedule and target are halved.' },
          { text: '25 mg daily for 2 weeks, then 50 mg daily', correct: false, feedback: 'That is the monotherapy schedule — too fast with valproate (SJS/TEN risk).' },
          { text: '50 mg daily, increasing to 400 mg', correct: false, feedback: 'That is the schedule with enzyme inducers like carbamazepine.' },
        ],
      },
      {
        prompt: 'In week 4 she develops a rash. What now?',
        options: [
          { text: 'Stop lamotrigine and assess urgently (fever, mucosal lesions, blistering, skin pain, facial edema, lymphadenopathy)', correct: true, feedback: 'Correct. Most serious rashes appear in weeks 2–8; stop unless clearly unrelated. Never rechallenge after SJS/TEN or DRESS.' },
          { text: 'Continue and add an antihistamine', correct: false, feedback: 'Benign rash is common, but you cannot safely tell it apart early — stop first.' },
          { text: 'Increase the dose to "push through"', correct: false, feedback: 'Faster escalation raises SJS/TEN risk.' },
        ],
      },
      {
        prompt: 'She also asks about contraception and pregnancy. Most important counseling point?',
        options: [
          { text: 'Valproate carries ~10% malformation risk plus neurodevelopmental harm — plan an alternative before pregnancy and use effective contraception', correct: true, feedback: 'Correct. Lamotrigine (≈2.9%) and lithium are preferred options; folic acid alone does not remove valproate risk.' },
          { text: 'Folic acid makes valproate safe', correct: false, feedback: 'Folic acid reduces but does not eliminate risks; IQ/autism effects persist.' },
        ],
      },
    ],
    takeaways: ['Valproate → halve lamotrigine; inducers → double; estrogen lowers levels ~50%.', 'Any rash during titration → stop.', 'Plan pregnancy away from valproate.'],
  },
  {
    id: 'ssri-mania', title: 'Better than ever', module: 'antidepressants', difficulty: 2,
    vignette: 'A 24-year-old started fluoxetine 20 mg for depression 3 weeks ago. Her partner reports she has slept 3 hours a night for 5 days, spent $6,000, talks rapidly and feels "on top of the world." Her mother has bipolar disorder; this was not asked about before.',
    steps: [
      {
        prompt: 'What happened?',
        options: [
          { text: 'Antidepressant-associated mania in likely bipolar disorder', correct: true, feedback: 'Correct. A family history and early-onset depression are bipolarity red flags that should be screened before antidepressants.' },
          { text: 'Normal recovery from depression', correct: false, feedback: 'Decreased need for sleep, spending and pressured speech are manic symptoms.' },
          { text: 'Serotonin syndrome', correct: false, feedback: 'No clonus, hyperthermia or autonomic signs.' },
        ],
      },
      {
        prompt: 'Best management?',
        options: [
          { text: 'Stop fluoxetine and start an anti-manic agent (e.g., lithium, quetiapine, aripiprazole, risperidone or valproate)', correct: true, feedback: 'Correct. Treat the mania; if bipolar I is confirmed, avoid antidepressant monotherapy going forward.' },
          { text: 'Add bupropion', correct: false, feedback: 'Another antidepressant can worsen mania.' },
          { text: 'Double the fluoxetine', correct: false, feedback: 'This would likely worsen the manic episode.' },
        ],
      },
    ],
    takeaways: ['Screen every depressed patient for prior mania/hypomania and family history.', 'Antidepressant monotherapy is not recommended in bipolar I.'],
  },
  {
    id: 'akathisia', title: 'Restless and hopeless', module: 'antipsychotics', difficulty: 2,
    vignette: 'A 40-year-old started aripiprazole 5 mg added to escitalopram 2 weeks ago. Now she cannot sit still, crosses and uncrosses her legs, paces at night, and says she feels like "jumping out of my skin." She reports new passive suicidal thoughts.',
    steps: [
      {
        prompt: 'Most likely cause?',
        options: [
          { text: 'Akathisia', correct: true, feedback: 'Correct. Subjective restlessness with an urge to move after starting a D2 partial agonist; akathisia is linked to agitation and suicidality.' },
          { text: 'Worsening anxiety — increase aripiprazole', correct: false, feedback: 'Increasing the dose worsens akathisia.' },
          { text: 'Tardive dyskinesia', correct: false, feedback: 'TD is involuntary choreiform movement after months–years, not an inner urge to move.' },
        ],
      },
      {
        prompt: 'Best treatment?',
        options: [
          { text: 'Reduce or stop aripiprazole; propranolol 10–20 mg BID–TID (or mirtazapine 15 mg); assess suicide risk', correct: true, feedback: 'Correct. Address safety directly, as akathisia-related suicidality improves when akathisia is treated.' },
          { text: 'Benztropine', correct: false, feedback: 'Anticholinergics help only if parkinsonism coexists.' },
          { text: 'Long-term lorazepam alone', correct: false, feedback: 'Benzodiazepines can help short-term, but the cause should be removed.' },
        ],
      },
    ],
    takeaways: ['Always ask about inner restlessness after starting or raising antipsychotics (and SSRIs).', 'Treat: reduce/switch, propranolol, mirtazapine; not anticholinergics.'],
  },
  {
    id: 'bup-fentanyl', title: 'The first dose', module: 'substance-use', difficulty: 3,
    vignette: 'A 31-year-old who smokes illicit fentanyl daily wants treatment. Last use was 10 hours ago. COWS is 7. A clinician gives buprenorphine–naloxone 8 mg. Thirty minutes later he is vomiting, sweating, yawning, with severe cramps; COWS 26.',
    steps: [
      {
        prompt: 'What happened?',
        options: [
          { text: 'Precipitated withdrawal: buprenorphine displaced fentanyl before withdrawal was established', correct: true, feedback: 'Correct. Fentanyl\'s lipophilic tissue stores prolong receptor occupancy, so precipitated withdrawal is more likely even after a typical wait.' },
          { text: 'Naloxone component absorbed sublingually', correct: false, feedback: 'Sublingual naloxone bioavailability is minimal; buprenorphine itself caused this.' },
          { text: 'Allergic reaction', correct: false, feedback: 'The syndrome is classic opioid withdrawal.' },
        ],
      },
      {
        prompt: 'Best management now?',
        options: [
          { text: 'Give more buprenorphine (e.g., additional 8–16 mg) plus symptomatic treatment (antiemetic, clonidine/lofexidine)', correct: true, feedback: 'Correct. Saturating receptors with more buprenorphine resolves precipitated withdrawal faster than stopping.' },
          { text: 'Give naloxone', correct: false, feedback: 'Naloxone would worsen withdrawal.' },
          { text: 'Stop buprenorphine and discharge with instructions to return in a week', correct: false, feedback: 'He is likely to return to fentanyl — and to overdose. Continue the induction.' },
        ],
      },
      {
        prompt: 'For the next patient using fentanyl, which strategy reduces this risk?',
        options: [
          { text: 'Low-dose ("micro") induction overlapping the full agonist, or waiting for COWS ≥8–12 and then using higher initial doses', correct: true, feedback: 'Correct. Both strategies are used in contemporary practice (ASAM).' },
          { text: 'Requiring 7 days of abstinence first', correct: false, feedback: 'That standard applies to naltrexone, not buprenorphine.' },
        ],
      },
    ],
    takeaways: ['Treat precipitated withdrawal with MORE buprenorphine.', 'Fentanyl → consider low-dose induction.', 'No X-waiver and no 24 mg cap; prescribe naloxone.'],
  },
  {
    id: 'maoi-switch', title: 'Switching to an MAOI', module: 'antidepressants', difficulty: 3,
    vignette: 'A 47-year-old with atypical depression has failed sertraline, bupropion augmentation and venlafaxine. She currently takes fluoxetine 40 mg. You plan phenelzine.',
    steps: [
      {
        prompt: 'How long after stopping fluoxetine can phenelzine start?',
        options: [
          { text: 'At least 5 weeks', correct: true, feedback: 'Correct. Norfluoxetine persists for weeks; starting earlier risks fatal serotonin syndrome.' },
          { text: '14 days', correct: false, feedback: '14 days is the interval for most other SSRIs.' },
          { text: 'The next day', correct: false, feedback: 'Never overlap or start an MAOI immediately after a serotonergic antidepressant.' },
        ],
      },
      {
        prompt: 'On phenelzine she has a cold. Which OTC product is dangerous?',
        options: [
          { text: 'Pseudoephedrine or dextromethorphan cough/cold combinations', correct: true, feedback: 'Correct. Pseudoephedrine → hypertensive crisis; dextromethorphan → serotonin syndrome.' },
          { text: 'Acetaminophen', correct: false, feedback: 'Acetaminophen is safe with MAOIs.' },
          { text: 'Saline nasal spray', correct: false, feedback: 'Safe.' },
        ],
      },
      {
        prompt: 'She asks about diet. Accurate counseling?',
        options: [
          { text: 'Avoid aged cheeses, cured/fermented meats, tap beer, soy sauce, sauerkraut and yeast extracts; most bottled beer and wine in moderation are low-risk', correct: true, feedback: 'Correct (Gillman 2018). Freshness matters: leftovers and spoiled protein accumulate tyramine.' },
          { text: 'No restrictions are necessary', correct: false, feedback: 'That is true only for selegiline transdermal 6 mg/24 h.' },
          { text: 'Avoid all dairy and all alcohol forever', correct: false, feedback: 'Overly restrictive advice reduces adherence without improving safety.' },
        ],
      },
    ],
    takeaways: ['Washouts: fluoxetine 5 weeks; vortioxetine 3 weeks; most 2 weeks; MAOI → anything 2 weeks.', 'Screen every new drug and OTC product.', 'The tyramine diet is short and specific.'],
  },
  {
    id: 'valproate-pregnancy', title: 'Planning a pregnancy', module: 'special-populations', difficulty: 2,
    vignette: 'A 27-year-old with bipolar I, stable for 2 years on valproate 1,000 mg, wants to conceive in 6 months. Two prior manic episodes, one with psychosis.',
    steps: [
      {
        prompt: 'Best plan?',
        options: [
          { text: 'Transition away from valproate before conception (e.g., to lithium or an antipsychotic such as quetiapine/aripiprazole), with contraception until stable', correct: true, feedback: 'Correct. Valproate has the highest teratogenic and neurodevelopmental risk; stability on the new regimen should be confirmed before conception.' },
          { text: 'Stop all medications now', correct: false, feedback: 'Abrupt discontinuation risks relapse; postpartum relapse risk is especially high without prophylaxis.' },
          { text: 'Continue valproate with high-dose folic acid', correct: false, feedback: 'Folic acid does not eliminate valproate\'s risks.' },
        ],
      },
      {
        prompt: 'She chooses lithium and becomes pregnant. Monitoring?',
        options: [
          { text: 'Levels every 2–4 weeks (weekly near term), fetal echocardiogram, delivery plan to hold/reduce lithium with hydration, restart promptly postpartum', correct: true, feedback: 'Correct. GFR rises in pregnancy (levels fall) then drops abruptly at delivery (toxicity risk).' },
          { text: 'No extra monitoring', correct: false, feedback: 'Pregnancy markedly changes lithium handling.' },
        ],
      },
    ],
    takeaways: ['Plan pregnancy months ahead; move away from valproate.', 'Lithium: cardiac risk modestly ↑ (2.4% vs 1.2%); intensive level monitoring.', 'Postpartum is the highest-risk period for relapse.'],
  },
  {
    id: 'insomnia-older', title: 'Zolpidem at 81', module: 'sleep', difficulty: 2,
    vignette: 'An 81-year-old has taken zolpidem 10 mg nightly for 6 years. She fell twice this year, once at night. She wants to "sleep better."',
    steps: [
      {
        prompt: 'Best next step?',
        options: [
          { text: 'Offer CBT-I and a gradual zolpidem taper; check for sleep apnea, pain, nocturia and depression', correct: true, feedback: 'Correct. Beers 2023 advises avoiding Z-drugs in older adults (falls, fractures, delirium). CBT-I improves outcomes during tapering.' },
          { text: 'Add trazodone 50 mg', correct: false, feedback: 'Adds orthostasis and fall risk; AASM recommends against trazodone for insomnia.' },
          { text: 'Switch to lorazepam', correct: false, feedback: 'Benzodiazepines carry the same or greater risks.' },
        ],
      },
      {
        prompt: 'If a medication is still needed after CBT-I, which is most appropriate?',
        options: [
          { text: 'Low-dose doxepin 3 mg or a DORA (e.g., lemborexant 5 mg)', correct: true, feedback: 'Correct. Doxepin ≤6 mg is Beers-acceptable; DORAs were studied in older adults.' },
          { text: 'Diphenhydramine', correct: false, feedback: 'Strongly anticholinergic — Beers: avoid.' },
          { text: 'Quetiapine 25 mg', correct: false, feedback: 'Metabolic, fall and dementia-mortality risks without good evidence for insomnia.' },
        ],
      },
    ],
    takeaways: ['CBT-I first, especially in older adults.', 'Taper long-term Z-drugs gradually.', 'Doxepin ≤6 mg, DORAs or ramelteon if medication is needed.'],
  },
  {
    id: 'alcohol-withdrawal', title: 'Hospital day 2', module: 'substance-use', difficulty: 2,
    vignette: 'A 55-year-old admitted for pneumonia drinks ~12 drinks daily. 36 hours after his last drink: tremor, sweating, anxiety, tactile "bugs," HR 118, BP 168/98. CIWA-Ar 21. History of a withdrawal seizure.',
    steps: [
      {
        prompt: 'Management?',
        options: [
          { text: 'Benzodiazepine (symptom-triggered or front-loaded), IV thiamine before glucose, electrolytes incl. Mg2+, close monitoring', correct: true, feedback: 'Correct. CIWA ≥19 is severe withdrawal; prior seizure raises complication risk. Phenobarbital is an alternative in experienced settings (ASAM 2020).' },
          { text: 'Haloperidol alone', correct: false, feedback: 'Antipsychotics lower the seizure threshold and do not treat withdrawal; use only as adjuncts for persistent hallucinations.' },
          { text: 'Wait until CIWA-Ar >30', correct: false, feedback: 'Treat now; delays raise the risk of seizures and delirium tremens.' },
        ],
      },
      {
        prompt: 'He has cirrhosis (Child-Pugh B). Benzodiazepine choice?',
        options: [
          { text: 'Lorazepam or oxazepam', correct: true, feedback: 'Correct. Glucuronidation-only benzodiazepines avoid accumulation in liver disease.' },
          { text: 'Chlordiazepoxide', correct: false, feedback: 'Long-acting oxidized metabolites accumulate in cirrhosis.' },
        ],
      },
      {
        prompt: 'Before discharge, which AUD medication fits best?',
        options: [
          { text: 'Acamprosate (if CrCl >30) or gabapentin', correct: true, feedback: 'Correct. Both avoid hepatic metabolism. Naltrexone is avoided in decompensated liver disease.' },
          { text: 'Disulfiram', correct: false, feedback: 'Hepatotoxic and requires supervision — avoid in cirrhosis.' },
          { text: 'No medication — AUD medications are ineffective', correct: false, feedback: 'Naltrexone and acamprosate have solid evidence and are underused.' },
        ],
      },
    ],
    takeaways: ['CIWA-Ar bands (ASAM): <10 mild, 10–18 moderate, ≥19 severe.', 'Thiamine before glucose.', 'In liver disease: lorazepam/oxazepam for withdrawal; acamprosate or gabapentin for relapse prevention.'],
  },
];
