import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/components/LoginPage';
import RegistrationPage from './features/auth/components/RegistrationPage';
import StudentDashboard from './features/student/components/StudentDashboard';
import TeacherDashboard from './features/teacher/components/TeacherDashboard';
import AdminDashboard from './features/admin/components/AdminDashboard';
import ActivityPage from './features/student/components/ActivityPage';
import { ToastProvider } from './components/ui/toast';

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/activity/:activityId" element={<ActivityPage />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;