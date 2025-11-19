import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AntidepressantsPage from './pages/AntidepressantsPage';
import MoodStabilizersPage from './pages/MoodStabilizersPage';
import AntipsychoticsPage from './pages/AntipsychoticsPage';
import AnxietyAgentsPage from './pages/AnxietyAgentsPage';
import ADHDPage from './pages/ADHDPage';
import SleepMedsPage from './pages/SleepMedsPage';
import SubstanceUsePage from './pages/SubstanceUsePage';
import MechanismVisualizerPage from './pages/MechanismVisualizerPage';
import SideEffectRecognizerPage from './pages/SideEffectRecognizerPage';
import DrugComparisonPage from './pages/DrugComparisonPage';
import SwitchingSimulatorPage from './pages/SwitchingSimulatorPage';
import AssessmentPage from './pages/AssessmentPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on mount
    setTheme(theme);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="antidepressants" element={<AntidepressantsPage />} />
          <Route path="mood-stabilizers" element={<MoodStabilizersPage />} />
          <Route path="antipsychotics" element={<AntipsychoticsPage />} />
          <Route path="anxiety-agents" element={<AnxietyAgentsPage />} />
          <Route path="adhd" element={<ADHDPage />} />
          <Route path="sleep-meds" element={<SleepMedsPage />} />
          <Route path="substance-use" element={<SubstanceUsePage />} />
          <Route path="mechanism-visualizer" element={<MechanismVisualizerPage />} />
          <Route path="side-effect-recognizer" element={<SideEffectRecognizerPage />} />
          <Route path="drug-comparison" element={<DrugComparisonPage />} />
          <Route path="switching-simulator" element={<SwitchingSimulatorPage />} />
          <Route path="assessment" element={<AssessmentPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
