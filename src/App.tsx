import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { legacyRedirects } from './components/nav';

const HomePage = lazy(() => import('./pages/HomePage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const DrugLibraryPage = lazy(() => import('./pages/DrugLibraryPage'));
const DrugPage = lazy(() => import('./pages/DrugPage'));
const InteractionsPage = lazy(() => import('./pages/InteractionsPage'));
const SwitchingPage = lazy(() => import('./pages/SwitchingPage'));
const EmergenciesPage = lazy(() => import('./pages/EmergenciesPage'));
const CalculatorsPage = lazy(() => import('./pages/CalculatorsPage'));
const ReceptorsPage = lazy(() => import('./pages/ReceptorsPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const CasesPage = lazy(() => import('./pages/CasesPage'));
const CasePage = lazy(() => import('./pages/CasePage'));
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage'));
const ReferencesPage = lazy(() => import('./pages/ReferencesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="learn/:moduleId" element={<LessonPage />} />
          <Route path="drugs" element={<DrugLibraryPage />} />
          <Route path="drug/:id" element={<DrugPage />} />
          <Route path="tools/interactions" element={<InteractionsPage />} />
          <Route path="tools/switching" element={<SwitchingPage />} />
          <Route path="tools/emergencies" element={<EmergenciesPage />} />
          <Route path="tools/calculators" element={<CalculatorsPage />} />
          <Route path="tools/receptors" element={<ReceptorsPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="cases" element={<CasesPage />} />
          <Route path="cases/:id" element={<CasePage />} />
          <Route path="flashcards" element={<FlashcardsPage />} />
          <Route path="references" element={<ReferencesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {Object.entries(legacyRedirects).map(([from, to]) => (
            <Route key={from} path={from.slice(1)} element={<Navigate to={to} replace />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
