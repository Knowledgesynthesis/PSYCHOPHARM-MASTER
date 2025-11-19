import { Link } from 'react-router-dom';
import { Pill, Activity, Brain, Heart, Zap, Moon, Beaker, Eye, AlertCircle, GitCompare, Repeat, FileText } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModuleCard {
  title: string;
  description: string;
  icon: React.ElementType;
  to: string;
  color: string;
}

interface ToolCard {
  title: string;
  description: string;
  icon: React.ElementType;
  to: string;
}

const HomePage = () => {
  const modules: ModuleCard[] = [
    {
      title: 'Antidepressants',
      description: 'SSRIs, SNRIs, TCAs, MAOIs, and atypical antidepressants',
      icon: Pill,
      to: '/antidepressants',
      color: 'text-blue-500',
    },
    {
      title: 'Mood Stabilizers',
      description: 'Lithium, valproate, carbamazepine, lamotrigine',
      icon: Activity,
      to: '/mood-stabilizers',
      color: 'text-purple-500',
    },
    {
      title: 'Antipsychotics',
      description: 'First and second-generation antipsychotics',
      icon: Brain,
      to: '/antipsychotics',
      color: 'text-pink-500',
    },
    {
      title: 'Anxiety Agents',
      description: 'SSRIs/SNRIs for anxiety, benzodiazepines, buspirone',
      icon: Heart,
      to: '/anxiety-agents',
      color: 'text-red-500',
    },
    {
      title: 'ADHD & Stimulants',
      description: 'Methylphenidate, amphetamines, non-stimulants',
      icon: Zap,
      to: '/adhd',
      color: 'text-yellow-500',
    },
    {
      title: 'Sleep Medications',
      description: 'Z-drugs, melatonin-based agents, sedatives',
      icon: Moon,
      to: '/sleep-meds',
      color: 'text-indigo-500',
    },
    {
      title: 'Substance Use Pharmacotherapies',
      description: 'Alcohol, opioid, and nicotine use pharmacotherapy',
      icon: Beaker,
      to: '/substance-use',
      color: 'text-green-500',
    },
  ];

  const tools: ToolCard[] = [
    {
      title: 'Mechanism Visualizer',
      description: 'Explore neurotransmitter effects and receptor interactions',
      icon: Eye,
      to: '/mechanism-visualizer',
    },
    {
      title: 'Side Effect Recognizer',
      description: 'Pattern recognition for adverse effects and emergencies',
      icon: AlertCircle,
      to: '/side-effect-recognizer',
    },
    {
      title: 'Drug Comparison',
      description: 'Compare medications across multiple parameters',
      icon: GitCompare,
      to: '/drug-comparison',
    },
    {
      title: 'Switching Simulator',
      description: 'Learn safe medication switching strategies',
      icon: Repeat,
      to: '/switching-simulator',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
          Psychopharm Master
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Interactive psychopharmacology learning system for medical students, psychiatry residents, and primary care clinicians
        </p>
      </section>

      {/* Learning Modules */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Learning Modules</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              key={module.to}
              to={module.to}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary-500"
            >
              <div className="flex items-start space-x-4">
                <div className={cn('p-3 rounded-lg bg-secondary', module.color)}>
                  <module.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg group-hover:text-primary-500 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Tools */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Interactive Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary-500"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-primary-500/10 text-primary-500">
                  <tool.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg group-hover:text-primary-500 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Assessment Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Assessment</h2>
        </div>
        <Link
          to="/assessment"
          className="group relative overflow-hidden rounded-xl border bg-card p-8 transition-all hover:shadow-lg hover:border-primary-500 block"
        >
          <div className="flex items-center space-x-6">
            <div className="p-4 rounded-lg bg-primary-500/10 text-primary-500">
              <FileText className="h-8 w-8" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-2xl group-hover:text-primary-500 transition-colors">
                Test Your Knowledge
              </h3>
              <p className="text-muted-foreground">
                MCQs, matching exercises, and case vignettes to reinforce your learning
              </p>
            </div>
          </div>
        </Link>
      </section>

      {/* Educational Disclaimer */}
      <section className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
        <div className="flex items-start space-x-4">
          <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-yellow-500">Educational Purpose Only</h3>
            <p className="text-sm text-muted-foreground">
              This application is designed for educational purposes only and should not be used as a substitute
              for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified
              health providers with any questions regarding medications or medical conditions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
