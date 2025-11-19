import { Settings, Sun, Moon, Info, AlertTriangle } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

const SettingsPage = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-primary-500/10">
            <Settings className="h-8 w-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Customize your learning experience
            </p>
          </div>
        </div>
      </div>

      {/* Theme Setting */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {theme === 'dark' ? (
              <Moon className="h-5 w-5 text-primary-500" />
            ) : (
              <Sun className="h-5 w-5 text-primary-500" />
            )}
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm text-muted-foreground">
                Current theme: {theme === 'dark' ? 'Dark' : 'Light'}
              </div>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-6 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors font-medium"
          >
            Toggle to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-primary-500" />
          <h2 className="text-xl font-semibold">About Psychopharm Master</h2>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Psychopharm Master</span> is an interactive
            psychopharmacology learning system designed for medical students, psychiatry residents, and
            primary care clinicians.
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Features:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Comprehensive drug information across 7 medication categories</li>
              <li>Interactive mechanism visualizer showing neurotransmitter effects</li>
              <li>Side effect pattern recognition tool for adverse event identification</li>
              <li>Drug comparison tool for side-by-side medication analysis</li>
              <li>Switching simulator with safe medication transition strategies</li>
              <li>Assessment module with case vignettes and MCQs</li>
              <li>Mobile-responsive design for learning on any device</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Covered Topics:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Antidepressants (SSRIs, SNRIs, TCAs, MAOIs, atypicals)</li>
              <li>Mood Stabilizers (lithium, valproate, carbamazepine, lamotrigine)</li>
              <li>Antipsychotics (first and second-generation)</li>
              <li>Anxiety Agents (benzodiazepines, buspirone)</li>
              <li>ADHD Medications (stimulants and non-stimulants)</li>
              <li>Sleep Medications</li>
              <li>Substance Use Pharmacotherapies</li>
            </ul>
          </div>
          <p className="pt-2">
            <span className="font-semibold text-foreground">Version:</span> 1.0.0
          </p>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Important Disclaimers</h2>
        </div>

        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-6 space-y-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-yellow-500 mb-2">Educational Purpose Only</h3>
              <p>
                This application is designed exclusively for educational purposes to help healthcare
                professionals and students learn about psychopharmacology. It is NOT intended to be used
                as a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-500 mb-2">Not for Clinical Decision Making</h3>
              <p>
                The information provided in this app should not be used to make clinical decisions without
                consulting current prescribing information, clinical guidelines, and appropriate specialists.
                Always verify information with authoritative sources before applying to patient care.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-500 mb-2">Seek Professional Medical Advice</h3>
              <p>
                If you are a patient or seeking medical advice, always consult with qualified healthcare
                providers. Do not start, stop, or change any medication regimen based on information in
                this educational application.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-500 mb-2">No Liability</h3>
              <p>
                While every effort has been made to ensure accuracy, the developers and contributors assume
                no liability for errors, omissions, or outcomes resulting from use of this educational tool.
                Medical knowledge evolves rapidly; always refer to current literature and guidelines.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-500 mb-2">Synthetic Data</h3>
              <p>
                All clinical cases and scenarios are synthetic and created for educational purposes. No
                protected health information (PHI) or real patient data is included in this application.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-500 mb-2">Guideline Alignment</h3>
              <p>
                Information is based on general psychopharmacology principles and consensus guidelines
                (APA, FDA labeling concepts). Specific clinical situations may require deviation from
                general principles. Treatment should be individualized based on patient factors.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-500 mb-2">Emergency Situations</h3>
              <p>
                If you are experiencing a medical emergency or psychiatric crisis, call 911 or go to the
                nearest emergency department immediately. Do not rely on educational materials for
                emergency guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact/Feedback */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Educational Use</h2>
        <p className="text-sm text-muted-foreground">
          This application is intended for use by medical students, healthcare professionals in training,
          and practicing clinicians as a supplement to formal education and clinical training. It should
          be used alongside textbooks, peer-reviewed literature, and supervised clinical experience.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
