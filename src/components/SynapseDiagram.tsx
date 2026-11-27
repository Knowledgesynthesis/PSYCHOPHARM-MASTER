import type { Mechanism } from '@/data/mechanisms';

const DOTS_BASE = [130, 160, 190, 215, 240];

export default function SynapseDiagram({ mechanism }: { mechanism: Mechanism }) {
  const more = ['reuptake', 'maoi', 'alpha2', 'release'].includes(mechanism);
  const dots = more ? [...DOTS_BASE, 145, 175, 200, 228] : DOTS_BASE;
  const brand = 'hsl(var(--brand))';
  return (
    <svg viewBox="0 0 360 270" className="h-auto w-full" role="img" aria-label={`Synapse diagram: ${mechanism}`}>
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="hsl(var(--muted))" /></marker>
      </defs>
      {/* presynaptic terminal */}
      <path d="M70 10 H290 Q320 10 320 40 V95 Q320 115 290 115 H70 Q40 115 40 95 V40 Q40 10 70 10 Z" fill="hsl(var(--surface-2))" stroke="hsl(var(--line))" strokeWidth="2" />
      <text x="180" y="30" textAnchor="middle" className="fill-muted text-[11px]">Presynaptic neuron</text>
      {/* vesicles */}
      {[150, 185, 220].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={65 + (i % 2) * 12} r={mechanism === 'release' ? 9 : 13} fill="none" stroke="hsl(var(--muted))" strokeWidth="1.5" />
          {(mechanism === 'release' ? [0] : [0, 1, 2]).map((k) => <circle key={k} cx={x - 5 + k * 5} cy={65 + (i % 2) * 12 + (k % 2) * 4} r="2.6" fill={brand} />)}
        </g>
      ))}
      {/* MAO */}
      <g>
        <rect x="70" y="55" width="44" height="22" rx="11" fill="hsl(var(--surface))" stroke="hsl(var(--line))" />
        <text x="92" y="70" textAnchor="middle" className="fill-fg text-[10px] font-semibold">MAO</text>
        {mechanism === 'maoi' && <path d="M68 52 L116 80 M116 52 L68 80" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />}
      </g>
      {/* α2 autoreceptor (left membrane) */}
      <g>
        <rect x="52" y="100" width="22" height="16" rx="4" fill="hsl(var(--surface))" stroke="hsl(var(--line))" />
        <text x="63" y="111" textAnchor="middle" className="fill-fg text-[9px]">α2</text>
        {mechanism === 'alpha2' && <circle cx="63" cy="124" r="7" fill="#f97316" />}
      </g>
      {/* transporter (right) */}
      <g>
        <rect x="270" y="98" width="30" height="20" rx="5" fill="hsl(var(--surface))" stroke="hsl(var(--line))" />
        <text x="285" y="111" textAnchor="middle" className="fill-fg text-[8px]">SERT</text>
        {mechanism === 'reuptake' ? (
          <>
            <circle cx="285" cy="128" r="8" fill="#f97316" />
            <path d="M306 84 L318 96 M318 84 L306 96" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : mechanism === 'release' ? (
          <path d="M285 92 V140" stroke={brand} strokeWidth="2" markerEnd="url(#arr)" />
        ) : (
          <path d="M300 150 Q310 130 292 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arr)" />
        )}
      </g>
      {/* cleft dots */}
      {dots.map((x, i) => (
        <circle key={x} cx={x} cy={122} r="3" fill={brand} className="animate-flow" style={{ animationDelay: `${(i * 0.27) % 2.4}s` }} />
      ))}
      <text x="18" y="146" className="fill-muted text-[10px]">cleft</text>
      {/* postsynaptic */}
      <path d="M40 175 H320 V260 H40 Z" fill="hsl(var(--surface-2))" stroke="hsl(var(--line))" strokeWidth="2" />
      <text x="180" y="248" textAnchor="middle" className="fill-muted text-[11px]">Postsynaptic neuron</text>
      {[110, 180, 250].map((x, i) => {
        const blocked = mechanism === 'antagonist' && i !== 1;
        const partial = mechanism === 'partial';
        return (
          <g key={x}>
            <path d={`M${x - 16} 175 V158 H${x - 6} V168 H${x + 6} V158 H${x + 16} V175`} fill="hsl(var(--surface))" stroke="hsl(var(--line))" strokeWidth="1.5" />
            {blocked && <rect x={x - 6} y={160} width="12" height="10" rx="2" fill="#f97316" />}
            {partial && <rect x={x - 6} y={164} width="12" height="6" rx="2" fill="#a855f7" />}
            {mechanism === 'pam' && <circle cx={x + 20} cy={166} r="5" fill="#22c55e" />}
            <rect x={x - 3} y={180} width="6" height={blocked ? 6 : partial ? 14 : mechanism === 'pam' ? 34 : 24} rx="2" fill={blocked ? 'hsl(var(--line))' : brand} opacity={0.7} />
          </g>
        );
      })}
    </svg>
  );
}
