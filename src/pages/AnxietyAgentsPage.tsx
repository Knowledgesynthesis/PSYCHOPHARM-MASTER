import { Heart } from 'lucide-react';
import DrugCard from '@/components/DrugCard';
import { anxietyAgentsData } from '@/data/anxietyAgents';

const AnxietyAgentsPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-red-500/10">
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Anxiety Agents</h1>
            <p className="text-muted-foreground mt-1">
              SSRIs/SNRIs for anxiety, benzodiazepines, and buspirone
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-3">Module Overview</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            While SSRIs and SNRIs (covered in Antidepressants) are first-line for most anxiety disorders,
            benzodiazepines and buspirone play important roles in acute and chronic anxiety management.
            Understanding their risk-benefit profiles is essential.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Key Concepts</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>GABA-A modulation by benzodiazepines</li>
                <li>Dependence and withdrawal risks</li>
                <li>Buspirone: delayed onset, no dependence</li>
                <li>Beers Criteria: avoid benzos in elderly</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Clinical Pearls</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>SSRIs/SNRIs are first-line for most anxiety disorders</li>
                <li>Benzos: short-term use only</li>
                <li>Lorazepam safer in hepatic/renal impairment</li>
                <li>Buspirone not effective for panic disorder</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Drug Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Medications</h2>
        <div className="space-y-4">
          {anxietyAgentsData.map((drug) => (
            <DrugCard key={drug.id} drug={drug} />
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-blue-500">Note:</span> SSRIs and SNRIs are first-line
          treatments for most anxiety disorders (GAD, panic disorder, social anxiety disorder, OCD, PTSD).
          Refer to the Antidepressants module for detailed information on these medications.
        </p>
      </div>
    </div>
  );
};

export default AnxietyAgentsPage;
