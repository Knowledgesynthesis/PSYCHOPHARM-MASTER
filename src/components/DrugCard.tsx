import { useState } from 'react';
import { ChevronDown, ChevronUp, Pill, AlertTriangle, Activity, Beaker, FileText, Users } from 'lucide-react';
import { Drug } from '@/types';
import { cn } from '@/utils/cn';

interface DrugCardProps {
  drug: Drug;
}

const DrugCard = ({ drug }: DrugCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg bg-card overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <Pill className="h-5 w-5 text-primary-500" />
              <h3 className="text-xl font-semibold">{drug.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{drug.class}</p>
          </div>
          <button
            className="ml-4 p-2 rounded-md hover:bg-accent transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mechanism Preview */}
        <div className="mt-4">
          <p className="text-sm text-foreground line-clamp-2">{drug.mechanism}</p>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t bg-accent/30 p-6 space-y-6">
          {/* Mechanism */}
          <Section icon={Beaker} title="Mechanism of Action">
            <p className="text-sm">{drug.mechanism}</p>
          </Section>

          {/* Indications */}
          <Section icon={FileText} title="Indications">
            <ul className="list-disc list-inside space-y-1 text-sm">
              {drug.indications.map((indication, idx) => (
                <li key={idx}>{indication}</li>
              ))}
            </ul>
          </Section>

          {/* Dosing */}
          <Section icon={Activity} title="Dosing">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Starting:</span> {drug.dosing.starting}
              </div>
              <div>
                <span className="font-medium">Therapeutic:</span> {drug.dosing.therapeutic}
              </div>
              <div>
                <span className="font-medium">Maximum:</span> {drug.dosing.maximum}
              </div>
            </div>
          </Section>

          {/* Side Effects */}
          <Section icon={AlertTriangle} title="Side Effects">
            <ul className="list-disc list-inside space-y-1 text-sm">
              {drug.sideEffects.map((effect, idx) => (
                <li key={idx}>{effect}</li>
              ))}
            </ul>
          </Section>

          {/* Contraindications */}
          <Section icon={AlertTriangle} title="Contraindications" variant="warning">
            <ul className="list-disc list-inside space-y-1 text-sm">
              {drug.contraindications.map((contra, idx) => (
                <li key={idx}>{contra}</li>
              ))}
            </ul>
          </Section>

          {/* Warnings */}
          {drug.warnings.length > 0 && (
            <Section icon={AlertTriangle} title="Warnings" variant="danger">
              <ul className="list-disc list-inside space-y-1 text-sm">
                {drug.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Interactions */}
          <Section icon={Beaker} title="Drug Interactions">
            <ul className="list-disc list-inside space-y-1 text-sm">
              {drug.interactions.map((interaction, idx) => (
                <li key={idx}>{interaction}</li>
              ))}
            </ul>
          </Section>

          {/* Monitoring */}
          {drug.monitoring.length > 0 && (
            <Section icon={Activity} title="Monitoring">
              <ul className="list-disc list-inside space-y-1 text-sm">
                {drug.monitoring.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Switching Notes */}
          {drug.switchingNotes.length > 0 && (
            <Section icon={FileText} title="Switching Notes">
              <ul className="list-disc list-inside space-y-1 text-sm">
                {drug.switchingNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Special Populations */}
          {drug.specialPopulations && (
            <Section icon={Users} title="Special Populations">
              <div className="space-y-2 text-sm">
                {drug.specialPopulations.pregnancy && (
                  <div>
                    <span className="font-medium">Pregnancy:</span> {drug.specialPopulations.pregnancy}
                  </div>
                )}
                {drug.specialPopulations.lactation && (
                  <div>
                    <span className="font-medium">Lactation:</span> {drug.specialPopulations.lactation}
                  </div>
                )}
                {drug.specialPopulations.geriatric && (
                  <div>
                    <span className="font-medium">Geriatric:</span> {drug.specialPopulations.geriatric}
                  </div>
                )}
                {drug.specialPopulations.renal && (
                  <div>
                    <span className="font-medium">Renal Impairment:</span> {drug.specialPopulations.renal}
                  </div>
                )}
                {drug.specialPopulations.hepatic && (
                  <div>
                    <span className="font-medium">Hepatic Impairment:</span> {drug.specialPopulations.hepatic}
                  </div>
                )}
              </div>
            </Section>
          )}
        </div>
      )}
    </div>
  );
};

interface SectionProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'warning' | 'danger';
}

const Section = ({ icon: Icon, title, children, variant = 'default' }: SectionProps) => {
  const colorClass = {
    default: 'text-primary-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
  }[variant];

  return (
    <div>
      <div className="flex items-center space-x-2 mb-3">
        <Icon className={cn('h-5 w-5', colorClass)} />
        <h4 className="font-semibold">{title}</h4>
      </div>
      <div className="ml-7">{children}</div>
    </div>
  );
};

export default DrugCard;
