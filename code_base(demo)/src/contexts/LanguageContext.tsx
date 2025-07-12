import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.appointments': 'Appointments',
    'nav.health': 'Health Records',
    'nav.chatbot': 'AI Assistant',
    'nav.videos': 'Health Videos',
    'nav.payments': 'Payments',
    'nav.profile': 'Profile',
    'nav.patients': 'Patients',
    'nav.doctors': 'Doctors',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'nav.prescriptions': 'Prescriptions',
    'nav.logout': 'Logout',

    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.todayAppointments': 'Today\'s Appointments',
    'dashboard.upcomingAppointments': 'Upcoming Appointments',
    'dashboard.recentVitals': 'Recent Vitals',
    'dashboard.healthTimeline': 'Health Timeline',
    'dashboard.quickActions': 'Quick Actions',

    // Appointments
    'appointments.book': 'Book Appointment',
    'appointments.selectDoctor': 'Select Doctor',
    'appointments.selectDate': 'Select Date',
    'appointments.selectTime': 'Select Time',
    'appointments.symptoms': 'Describe your symptoms',
    'appointments.book.button': 'Book Appointment',
    'appointments.status.scheduled': 'Scheduled',
    'appointments.status.completed': 'Completed',
    'appointments.status.cancelled': 'Cancelled',

    // Health
    'health.vitals': 'Vital Signs',
    'health.records': 'Medical Records',
    'health.timeline': 'Health Timeline',
    'health.bmi': 'BMI',
    'health.bloodPressure': 'Blood Pressure',
    'health.bloodSugar': 'Blood Sugar',
    'health.weight': 'Weight',

    // Chatbot
    'chatbot.title': 'AI Health Assistant',
    'chatbot.placeholder': 'Type your health question...',
    'chatbot.send': 'Send',
    'chatbot.greeting': 'Hello! I\'m your AI health assistant. How can I help you today?',

    // Videos
    'videos.title': 'Health Education Videos',
    'videos.diet': 'Diet & Nutrition',
    'videos.yoga': 'Yoga & Exercise',
    'videos.awareness': 'Health Awareness',
    'videos.recommended': 'Recommended for You',

    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.status': 'Status',
    'common.action': 'Action',

    // Login
    'login.title': 'HealthKiosk Login',
    'login.subtitle': 'Smart Healthcare for Everyone',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.login': 'Login',
    'login.selectRole': 'Select your role',
    'login.patient': 'Patient',
    'login.doctor': 'Doctor',
    'login.admin': 'Admin',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.appointments': 'अपॉइंटमेंट',
    'nav.health': 'स्वास्थ्य रिकॉर्ड',
    'nav.chatbot': 'AI सहायक',
    'nav.videos': 'स्वास्थ्य वीडियो',
    'nav.payments': 'भुगतान',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.patients': 'मरीज़',
    'nav.doctors': 'डॉक्टर',
    'nav.analytics': 'विश्लेषण',
    'nav.settings': 'सेटिंग्स',
    'nav.prescriptions': 'नुस्खे',
    'nav.logout': 'लॉग आउट',

    // Dashboard
    'dashboard.welcome': 'स्वागत',
    'dashboard.todayAppointments': 'आज की अपॉइंटमेंट',
    'dashboard.upcomingAppointments': 'आगामी अपॉइंटमेंट',
    'dashboard.recentVitals': 'हाल की जांच',
    'dashboard.healthTimeline': 'स्वास्थ्य समयरेखा',
    'dashboard.quickActions': 'त्वरित कार्य',

    // Appointments
    'appointments.book': 'अपॉइंटमेंट बुक करें',
    'appointments.selectDoctor': 'डॉक्टर चुनें',
    'appointments.selectDate': 'तारीख चुनें',
    'appointments.selectTime': 'समय चुनें',
    'appointments.symptoms': 'अपने लक्षण बताएं',
    'appointments.book.button': 'अपॉइंटमेंट बुक करें',
    'appointments.status.scheduled': 'निर्धारित',
    'appointments.status.completed': 'पूर्ण',
    'appointments.status.cancelled': 'रद्द',

    // Health
    'health.vitals': 'महत्वपूर्ण संकेत',
    'health.records': 'चिकित्सा रिकॉर्ड',
    'health.timeline': 'स्वास्थ्य समयरेखा',
    'health.bmi': 'बीएमआई',
    'health.bloodPressure': 'रक्तचाप',
    'health.bloodSugar': 'रक्त शर्करा',
    'health.weight': 'वजन',

    // Chatbot
    'chatbot.title': 'AI स्वास्थ्य सहायक',
    'chatbot.placeholder': 'अपना स्वास्थ्य प्रश्न टाइप करें...',
    'chatbot.send': 'भेजें',
    'chatbot.greeting': 'नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',

    // Videos
    'videos.title': 'स्वास्थ्य शिक्षा वीडियो',
    'videos.diet': 'आहार और पोषण',
    'videos.yoga': 'योग और व्यायाम',
    'videos.awareness': 'स्वास्थ्य जागरूकता',
    'videos.recommended': 'आपके लिए सुझाव',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.view': 'देखें',
    'common.download': 'डाउनलोड',
    'common.upload': 'अपलोड',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'common.date': 'तारीख',
    'common.time': 'समय',
    'common.status': 'स्थिति',
    'common.action': 'कार्य',

    // Login
    'login.title': 'हेल्थकियोस्क लॉगिन',
    'login.subtitle': 'सभी के लिए स्मार्ट स्वास्थ्य सेवा',
    'login.email': 'ईमेल पता',
    'login.password': 'पासवर्ड',
    'login.login': 'लॉगिन',
    'login.selectRole': 'अपनी भूमिका चुनें',
    'login.patient': 'मरीज़',
    'login.doctor': 'डॉक्टर',
    'login.admin': 'प्रशासक',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};