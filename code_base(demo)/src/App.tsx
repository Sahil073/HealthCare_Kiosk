import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LoginForm from './components/auth/LoginForm';
import Layout from './components/common/Layout';
import PatientDashboard from './components/patient/PatientDashboard';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import VideoLibrary from './components/patient/VideoLibrary';
import HealthChatbot from './components/patient/HealthChatbot';
import Sidebar from './components/common/Sidebar';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    if (user.role === 'patient') {
      switch (activeTab) {
        case 'dashboard':
          return <PatientDashboard />;
        case 'videos':
          return <VideoLibrary />;
        case 'chatbot':
          return <HealthChatbot />;
        case 'appointments':
        case 'health':
        case 'payments':
        case 'profile':
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} - Coming Soon
              </h2>
              <p className="text-gray-600">This feature is under development</p>
            </div>
          );
        default:
          return <PatientDashboard />;
      }
    }

    if (user.role === 'doctor') {
      switch (activeTab) {
        case 'dashboard':
          return <DoctorDashboard />;
        case 'appointments':
        case 'patients':
        case 'prescriptions':
        case 'profile':
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} - Coming Soon
              </h2>
              <p className="text-gray-600">This feature is under development</p>
            </div>
          );
        default:
          return <DoctorDashboard />;
      }
    }

    if (user.role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
        case 'analytics':
          return <AdminDashboard />;
        case 'doctors':
        case 'patients':
        case 'appointments':
        case 'settings':
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} - Coming Soon
              </h2>
              <p className="text-gray-600">This feature is under development</p>
            </div>
          );
        default:
          return <AdminDashboard />;
      }
    }

    return <PatientDashboard />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="App">
            <AppContent />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10B981',
                  },
                },
                error: {
                  style: {
                    background: '#EF4444',
                  },
                },
              }}
            />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;