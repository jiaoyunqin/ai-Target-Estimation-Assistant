import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AIChat } from './pages/AIChat';
import { FeishuBotDemo } from './pages/FeishuBotDemo';
import { TargetExplanationPage } from './pages/TargetExplanationPage';
import { useAuthStore } from './store/authStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feishu-bot" element={<FeishuBotDemo />} />
        <Route path="/target-explanation" element={<TargetExplanationPage />} />
        
        {/* Main AI Bot Experience - Full Screen */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          }
        />

        {/* Catch all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
