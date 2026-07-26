import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { usePinAuth } from './hooks/usePinAuth';

// Student
import StudentLobby from './pages/student/StudentLobby';
import StudentGame from './pages/student/StudentGame';

// Mentor
import MentorPinGate from './pages/mentor/MentorPinGate';
import MentorHome from './pages/mentor/MentorHome';
import WordManager from './pages/mentor/WordManager';
import GameSetup from './pages/mentor/GameSetup';
import CardReveal from './pages/mentor/CardReveal';
import MentorPanel from './pages/mentor/MentorPanel';

// Dashboard
import DashPinGate from './pages/dashboard/DashPinGate';
import DashboardLobby from './pages/dashboard/DashboardLobby';
import DashboardGame from './pages/dashboard/DashboardGame';

// Protected Route Wrapper
const ProtectedRoute = ({ type, children }) => {
  const { isAuthenticated, isLoading } = usePinAuth(type);
  
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to={`/${type}/pin`} replace />;
  
  return children ? children : <Outlet />;
};

function App() {
  return (
    <Routes>
      {/* Student Routes */}
      <Route path="/" element={<StudentLobby />} />
      <Route path="/game/:gameId" element={<StudentGame />} />

      {/* Mentor Routes */}
      <Route path="/mentor/pin" element={<MentorPinGate />} />
      <Route path="/mentor" element={<ProtectedRoute type="mentor" />}>
        <Route index element={<MentorHome />} />
        <Route path="words" element={<WordManager />} />
        <Route path="setup" element={<GameSetup />} />
        <Route path="game/:gameId/cards" element={<CardReveal />} />
        <Route path="game/:gameId/panel" element={<MentorPanel />} />
      </Route>

      {/* Dashboard Routes */}
      <Route path="/dashboard/pin" element={<DashPinGate />} />
      <Route path="/dashboard" element={<ProtectedRoute type="dashboard" />}>
        <Route index element={<DashboardLobby />} />
        <Route path="game/:gameId" element={<DashboardGame />} />
      </Route>
      <Route path="/dash" element={<Navigate to="/dashboard" replace />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
