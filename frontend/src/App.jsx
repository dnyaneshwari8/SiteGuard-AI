import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider } from './hooks/useAppState';
import { AppLayout } from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AnalyzeMedia from './pages/AnalyzeMedia';
import DetectionResults from './pages/DetectionResults';
import IncidentHistory from './pages/IncidentHistory';
import IncidentDetails from './pages/IncidentDetails';

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analyze" element={<AnalyzeMedia />} />
            <Route path="results" element={<DetectionResults />} />
            <Route path="incidents" element={<IncidentHistory />} />
            <Route path="incidents/:id" element={<IncidentDetails />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
