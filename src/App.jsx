import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { usePinAuth } from './hooks/usePinAuth';
import { GameProvider } from './contexts/GameContext';

import Login      from './pages/Login';
import MentorHome from './pages/mentor/MentorHome';
import WordManager from './pages/mentor/WordManager';
import GameSetup  from './pages/mentor/GameSetup';
import CardReveal from './pages/mentor/CardReveal';
import MentorPanel from './pages/mentor/MentorPanel';

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = usePinAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function AuthRoute() {
  const { isAuthenticated, isLoading } = usePinAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/mentor" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <GameProvider>
      <Routes>
        {/* Public */}
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected — mentor */}
        <Route element={<ProtectedRoute />}>
          <Route path="/mentor"        element={<MentorHome />} />
          <Route path="/mentor/words"  element={<WordManager />} />
          <Route path="/mentor/setup"  element={<GameSetup />} />
          <Route path="/mentor/cards"  element={<CardReveal />} />
          <Route path="/mentor/panel"  element={<MentorPanel />} />
        </Route>

        {/* Fallbacks */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />
      </Routes>
    </GameProvider>
  );
}
