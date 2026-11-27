import { Library, ExternalLink } from 'lucide-react';
import { references } from '@/data/references';
import { Card, PageHeader, SectionTitle } from '@/components/ui';

const CHANGES: { date: string; title: string; detail: string }[] = [
  { date: 'Oct 2026', title: 'Olanzapine monthly subcutaneous LAI (Weltruza)', detail: 'Approved for schizophrenia; no loading dose, oral supplementation or post-injection observation (unlike IM Relprevv, which requires 3 h).' },
  { date: 'Jul 2026', title: 'Centanafadine (Simtriyo) for ADHD', detail: 'Triple reuptake inhibitor approved for adults and children ≥6 y; boxed warnings for pediatric suicidality and abuse/misuse; DEA scheduling pending.' },
  { date: 'Jun 2026', title: 'Cytisinicline not approved', detail: 'FDA Complete Response Letter citing third-party manufacturing deficiencies; no efficacy/safety concerns cited. Resubmission planned.' },
  { date: 'Feb 2026', title: 'Milsaperidone (Bysanti)', detail: 'Iloperidone active metabolite approved for schizophrenia and acute bipolar I mania/mixed episodes; titration for orthostasis; CYP2D6 genotype-based dosing; QT caution.' },
  { date: 'Jan 2026', title: 'Telemedicine prescribing flexibilities extended', detail: 'DEA/HHS extended controlled-substance telemedicine flexibilities through Dec 31, 2026; the buprenorphine telemedicine final rule took effect Dec 31, 2025.' },
  { date: 'Nov 2025', title: 'Lumateperone adjunctive MDD', detail: 'Fourth indication for Caplyta (schizophrenia, bipolar I/II depression, adjunctive MDD).' },
  { date: 'Jun–Aug 2025', title: 'Clozapine REMS eliminated', detail: 'Effective June 13, 2025: no REMS enrollment or ANC reporting; FDA still advises ANC monitoring per labeling.' },
  { date: 'Jun 2025', title: 'Benzodiazepine tapering joint guideline', detail: 'Ten-society guideline: individualized tapers starting at 5–10% every 2–4 weeks, usually ≤25% per 2 weeks; never abrupt discontinuation in dependent patients.' },
  { date: 'Jun 2025', title: 'ER stimulants in children <6 y', detail: 'FDA requires class labeling about higher exposure and clinically significant weight loss.' },
  { date: '2024–2025', title: 'Buprenorphine: no 24 mg cap', detail: 'FDA recommended labels clarify 24 mg/day is not a maximum; Suboxone and Zubsolv labels updated in 2025.' },
  { date: 'Jan 2025', title: 'Esketamine monotherapy for TRD', detail: 'Spravato approved without a required oral antidepressant.' },
  { date: 'Sep 2024', title: 'Xanomeline–trospium (Cobenfy)', detail: 'First antipsychotic without direct D2 blockade (muscarinic M1/M4 agonist).' },
  { date: 'Feb 2024', title: 'Methadone treatment rule (42 CFR 8)', detail: 'Expanded take-home doses and initial dose up to 50 mg; telehealth for buprenorphine in OTPs.' },
  { date: 'May 2023', title: 'Stimulant boxed warning updated', detail: 'Abuse, misuse and addiction; overdose and death; assess risk and monitor throughout.' },
  { date: 'Mar 2023', title: 'Naloxone over the counter', detail: 'Narcan 4 mg nasal spray approved OTC.' },
  { date: 'Jan 2023', title: 'X-waiver eliminated', detail: 'Any DEA registrant with Schedule III authority may prescribe buprenorphine for OUD.' },
  { date: 'Aug 2023', title: 'Zuranolone for postpartum depression', detail: '14-day oral course; boxed warning on driving impairment.' },
];

export default function ReferencesPage() {
  const sorted = [...references].sort((a, b) => b.year - a.year);
  return (
    <div className="space-y-8">
      <PageHeader icon={Library} title="Evidence & what's new" subtitle="Content is anchored to current FDA labeling, major guidelines (APA, CANMAT, ASAM, AASM, AAP, AGS Beers, ACOG, VA/DoD) and pivotal network meta-analyses. Last reviewed November 2026." />

      <section>
        <SectionTitle>What changed (2023–2026)</SectionTitle>
        <Card className="p-0">
          <ol className="divide-y divide-line">
            {CHANGES.map((c) => (
              <li key={c.title} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[110px_1fr]">
                <span className="text-sm font-semibold text-brand">{c.date}</span>
                <div><p className="font-medium">{c.title}</p><p className="text-sm text-muted">{c.detail}</p></div>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section>
        <SectionTitle>How claims are graded here</SectionTitle>
        <Card className="space-y-2 text-sm">
          <p><span className="font-semibold">Labeling first:</span> indications, boxed warnings, contraindications, dose limits and washouts follow current US prescribing information.</p>
          <p><span className="font-semibold">Guidelines second:</span> where labeling is silent (e.g., augmentation, tapering), recommendations follow the most recent major guideline and are cited on each page.</p>
          <p><span className="font-semibold">Comparative claims:</span> "highest/lowest" side-effect statements come from network meta-analyses (Cipriani 2018, Huhn 2019, Cortese 2018, De Crescenzo 2022).</p>
          <p><span className="font-semibold">Uncertainty is stated:</span> where evidence is weak or mixed (e.g., prazosin for nightmares, mirtazapine augmentation), the text says so.</p>
        </Card>
      </section>

      <section>
        <SectionTitle>Sources ({sorted.length})</SectionTitle>
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {sorted.map((r) => (
              <li key={r.id} className="flex gap-3 px-5 py-3 text-sm">
                <span className="w-10 shrink-0 text-muted">{r.year}</span>
                <span className="min-w-0 flex-1">{r.cite}</span>
                {r.url && <a href={r.url} target="_blank" rel="noreferrer" className="shrink-0 text-brand" aria-label="Open source"><ExternalLink className="h-4 w-4" /></a>}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
