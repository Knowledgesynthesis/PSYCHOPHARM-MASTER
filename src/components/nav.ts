import {
  Activity, Brain, Calculator, FlaskConical, GitCompare, GraduationCap, HeartPulse, Home, Layers, Library, ListChecks, Moon, Network,
  Pill, Repeat, Settings, Siren, Stethoscope, Users, Zap, BookOpen, Sparkles, Combine, type LucideIcon,
} from 'lucide-react';
import type { ModuleId } from '@/types';

export const lessonIcons: Record<string, LucideIcon> = { Layers, Pill, Activity, Brain, HeartPulse, Zap, Moon, FlaskConical, Siren, Users };

/** Full class strings so Tailwind can see them. */
export const moduleTone: Record<string, { text: string; bg: string; bar: string; border: string }> = {
  slate: { text: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-500/10', bar: 'bg-slate-500', border: 'hover:border-slate-500/50' },
  sky: { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/10', bar: 'bg-sky-500', border: 'hover:border-sky-500/50' },
  violet: { text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10', bar: 'bg-violet-500', border: 'hover:border-violet-500/50' },
  rose: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', bar: 'bg-rose-500', border: 'hover:border-rose-500/50' },
  amber: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', bar: 'bg-amber-500', border: 'hover:border-amber-500/50' },
  yellow: { text: 'text-yellow-600 dark:text-yellow-300', bg: 'bg-yellow-500/10', bar: 'bg-yellow-500', border: 'hover:border-yellow-500/50' },
  indigo: { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10', bar: 'bg-indigo-500', border: 'hover:border-indigo-500/50' },
  emerald: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500', border: 'hover:border-emerald-500/50' },
  red: { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10', bar: 'bg-red-500', border: 'hover:border-red-500/50' },
  teal: { text: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10', bar: 'bg-teal-500', border: 'hover:border-teal-500/50' },
};

export interface NavItem { to: string; label: string; icon: LucideIcon; desc?: string }

export const tools: NavItem[] = [
  { to: '/tools/interactions', label: 'Interaction checker', icon: Combine, desc: 'Serotonergic, QT, CYP, lithium, respiratory and MAOI risks for any combination' },
  { to: '/tools/switching', label: 'Switching planner', icon: Repeat, desc: 'Drug-to-drug washouts and cross-taper timelines' },
  { to: '/tools/emergencies', label: 'Emergency recognizer', icon: Siren, desc: 'Signs → ranked differential, Hunter criteria, management' },
  { to: '/tools/calculators', label: 'Clinical calculators', icon: Calculator, desc: 'QTc, lithium, clozapine ANC, lamotrigine, benzo taper, CIWA, COWS' },
  { to: '/tools/receptors', label: 'Receptor explorer', icon: Network, desc: 'Mechanisms, synapse model and receptor heatmap' },
  { to: '/compare', label: 'Compare drugs', icon: GitCompare, desc: 'Side-by-side profiles and side-effect heatmap' },
];

export const practice: NavItem[] = [
  { to: '/quiz', label: 'Question bank', icon: ListChecks, desc: 'Practice and exam modes with rationales' },
  { to: '/cases', label: 'Clinical cases', icon: Stethoscope, desc: 'Step-by-step decisions with feedback' },
  { to: '/flashcards', label: 'Flashcards', icon: Sparkles, desc: 'Spaced repetition across every drug' },
];

export const primary: NavItem[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/learn', label: 'Learning path', icon: GraduationCap },
  { to: '/drugs', label: 'Drug library', icon: Pill },
];

export const reference: NavItem[] = [
  { to: '/references', label: "Evidence & what's new", icon: Library },
  { to: '/settings', label: 'Settings & progress', icon: Settings },
];

export const learnIcon = BookOpen;

export const legacyRedirects: Record<string, ModuleId | string> = {
  '/antidepressants': '/learn/antidepressants',
  '/mood-stabilizers': '/learn/mood-stabilizers',
  '/antipsychotics': '/learn/antipsychotics',
  '/anxiety-agents': '/learn/anxiety',
  '/adhd': '/learn/adhd',
  '/sleep-meds': '/learn/sleep',
  '/substance-use': '/learn/substance-use',
  '/mechanism-visualizer': '/tools/receptors',
  '/side-effect-recognizer': '/tools/emergencies',
  '/drug-comparison': '/compare',
  '/switching-simulator': '/tools/switching',
  '/assessment': '/quiz',
};
