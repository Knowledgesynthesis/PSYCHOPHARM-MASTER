# Psychopharm Master

An evidence-based, interactive psychopharmacology course and clinical toolkit. Content reviewed **November 2026**.

**Live:** https://psychopharm-master.vercel.app

## What's inside

| Area | Contents |
| --- | --- |
| Learning path | 10 modules (foundations → special populations): objectives, core concepts, decision algorithms, reference tables, side-effect heatmaps, pitfalls, check-yourself questions |
| Drug library | 85 agents: mechanism, receptor profile, FDA indications vs off-label, dosing, half-life, CYP/UGT profile, boxed warnings, adverse effects, interactions, monitoring, switching, pregnancy/lactation/pediatric/geriatric/renal/hepatic notes, pearls, citations |
| Interaction checker | Rule engine: labeled contraindications, MAOI rules, serotonergic load, QTc stacking, opioid + sedative, anticholinergic burden, lithium clearance, bleeding, sodium, seizure threshold, dopamine conflicts, marrow suppression, generic CYP inhibition/induction incl. prodrugs; 51 co-medications/foods/smoking |
| Switching planner | Drug-to-drug plans with label MAOI washouts, fluoxetine rules, partial-agonist plateau cross-tapers, clozapine, lamotrigine conversions, benzodiazepine and opioid transitions, timeline view |
| Emergency recognizer | Signs → ranked differential across 16 syndromes, Hunter criteria, comparison table, management |
| Calculators | QTc (4 formulas), lithium level + EXTRIP, clozapine ANC (general/BEN), lamotrigine titration, benzodiazepine equivalence + taper, CIWA-Ar, COWS |
| Practice | 97-question bank (practice/exam, shuffled options), 12 branching cases, ~465 spaced-repetition flashcards, progress tracking |

Works offline (PWA) and stores progress locally.

## Evidence approach

Labeling first (current US prescribing information), then major guidelines (APA, CANMAT, ASAM, AASM, AAP, AGS Beers 2023, ACOG 2023, VA/DoD), then network meta-analyses for comparative claims. All sources are listed in-app (`/references`) and in `src/data/references.ts`.

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # 244 unit tests: data integrity + engines + calculators
npm run lint
npm run build    # typecheck + production build + service worker
```

Content lives in `src/data/` (drugs, lessons, questions, cases, toxidromes, references); logic in `src/lib/` (interactions, switching, calculators, flashcards). `vercel.json` provides SPA rewrites so deep links work.
