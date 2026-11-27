export type Mechanism = 'baseline' | 'reuptake' | 'antagonist' | 'partial' | 'maoi' | 'alpha2' | 'release' | 'pam';

export const MECHANISMS: { id: Mechanism; label: string; examples: string; text: string }[] = [
  { id: 'baseline', label: 'Normal synapse', examples: '—', text: 'Neurotransmitter is released from vesicles, binds postsynaptic receptors, and is cleared by transporter reuptake and MAO breakdown. Presynaptic α2 autoreceptors brake further release.' },
  { id: 'reuptake', label: 'Reuptake inhibition', examples: 'SSRIs, SNRIs, TCAs, bupropion, methylphenidate', text: 'Blocking the transporter keeps transmitter in the cleft longer. Receptor down-regulation over weeks parallels the delayed clinical effect.' },
  { id: 'antagonist', label: 'Receptor antagonism', examples: 'Haloperidol (D2), risperidone (D2/5-HT2A), mirtazapine (H1)', text: 'The drug occupies the receptor without activating it. Antipsychotic effect needs ~65–80% striatal D2 occupancy; above ~80% EPS rise sharply.' },
  { id: 'partial', label: 'Partial agonism', examples: 'Aripiprazole, brexpiprazole, cariprazine (D2); buprenorphine (μ); buspirone (5-HT1A)', text: 'Produces a submaximal signal: lowers activity when endogenous tone is high, raises it when tone is low. High affinity lets it displace full agonists.' },
  { id: 'maoi', label: 'MAO inhibition', examples: 'Phenelzine, tranylcypromine, selegiline', text: 'Without MAO, more transmitter is packaged and released — and dietary tyramine escapes gut breakdown, triggering norepinephrine release (hypertensive crisis).' },
  { id: 'alpha2', label: 'α2 autoreceptor blockade', examples: 'Mirtazapine', text: 'Cutting the presynaptic brake increases norepinephrine and serotonin release.' },
  { id: 'release', label: 'Releaser (transporter reversal)', examples: 'Amphetamine, lisdexamfetamine', text: 'Amphetamine enters the terminal, empties vesicles via VMAT2 and reverses the transporter, pumping dopamine and norepinephrine out.' },
  { id: 'pam', label: 'Positive allosteric modulation', examples: 'Benzodiazepines, Z-drugs, zuranolone (GABA-A)', text: 'Binding at a separate site amplifies GABA\'s effect (more frequent chloride-channel opening). No effect without GABA — but synergy with alcohol and other depressants.' },
];
