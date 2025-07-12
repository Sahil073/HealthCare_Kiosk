import { 
  User, 
  Appointment, 
  Vital, 
  ChatMessage, 
  VideoContent, 
  DietPlan, 
  Payment,
  Notification,
  Analytics 
} from '../types';
import { 
  mockUsers, 
  mockAppointments, 
  mockVideoContent, 
  mockDietPlans,
  mockAnalytics 
} from '../data/mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys
const STORAGE_KEYS = {
  appointments: 'healthcare_appointments',
  vitals: 'healthcare_vitals',
  chatHistory: 'healthcare_chat_history',
  payments: 'healthcare_payments',
  notifications: 'healthcare_notifications'
};

// Helper to get data from localStorage
const getStorageData = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper to save data to localStorage
const setStorageData = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Appointments API
export const appointmentsAPI = {
  getAll: async (patientId?: string): Promise<Appointment[]> => {
    await delay(500);
    const appointments = getStorageData(STORAGE_KEYS.appointments, mockAppointments);
    return patientId ? appointments.filter(apt => apt.patientId === patientId) : appointments;
  },

  create: async (appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> => {
    await delay(800);
    const appointments = getStorageData(STORAGE_KEYS.appointments, mockAppointments);
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt_${Date.now()}`,
      createdAt: new Date()
    };
    appointments.push(newAppointment);
    setStorageData(STORAGE_KEYS.appointments, appointments);
    return newAppointment;
  },

  update: async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
    await delay(500);
    const appointments = getStorageData(STORAGE_KEYS.appointments, mockAppointments);
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updates };
      setStorageData(STORAGE_KEYS.appointments, appointments);
      return appointments[index];
    }
    throw new Error('Appointment not found');
  }
};

// Vitals API
export const vitalsAPI = {
  getAll: async (patientId: string): Promise<Vital[]> => {
    await delay(400);
    const vitals = getStorageData(STORAGE_KEYS.vitals, []);
    return vitals.filter((vital: Vital) => vital.patientId === patientId);
  },

  create: async (vital: Omit<Vital, 'id'>): Promise<Vital> => {
    await delay(600);
    const vitals = getStorageData(STORAGE_KEYS.vitals, []);
    const newVital: Vital = {
      ...vital,
      id: `vital_${Date.now()}`
    };
    vitals.push(newVital);
    setStorageData(STORAGE_KEYS.vitals, vitals);
    return newVital;
  }
};

// Chat API with AI simulation
export const chatAPI = {
  getHistory: async (patientId: string): Promise<ChatMessage[]> => {
    await delay(300);
    const chatHistory = getStorageData(STORAGE_KEYS.chatHistory, []);
    return chatHistory.filter((msg: ChatMessage) => msg.patientId === patientId);
  },

  sendMessage: async (patientId: string, message: string): Promise<ChatMessage[]> => {
    await delay(1000); // Simulate AI processing time
    
    const chatHistory = getStorageData(STORAGE_KEYS.chatHistory, []);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      patientId,
      message,
      isBot: false,
      timestamp: new Date()
    };
    
    // Generate AI response based on keywords
    const aiResponse = generateAIResponse(message);
    const botMessage: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      patientId,
      message: aiResponse,
      isBot: true,
      timestamp: new Date()
    };
    
    chatHistory.push(userMessage, botMessage);
    setStorageData(STORAGE_KEYS.chatHistory, chatHistory);
    
    return chatHistory.filter((msg: ChatMessage) => msg.patientId === patientId);
  }
};

// Simple AI response generation
const generateAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
    return 'I understand you\'re experiencing fever. Please monitor your temperature regularly. If it persists above 100°F for more than 24 hours, consider consulting a doctor. Stay hydrated and get plenty of rest.';
  }
  
  if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
    return 'Headaches can have various causes. Try to rest in a quiet, dark room and stay hydrated. If headaches are frequent or severe, please consult with a doctor for proper evaluation.';
  }
  
  if (lowerMessage.includes('diabetes') || lowerMessage.includes('sugar')) {
    return 'For diabetes management, focus on a balanced diet with low glycemic index foods. Regular exercise and monitoring blood sugar levels are crucial. I can recommend some Indian diet videos that might help.';
  }
  
  if (lowerMessage.includes('blood pressure') || lowerMessage.includes('bp')) {
    return 'High blood pressure requires regular monitoring. Reduce salt intake, exercise regularly, and manage stress. If you have consistent high readings, please consult a cardiologist.';
  }
  
  if (lowerMessage.includes('diet') || lowerMessage.includes('food')) {
    return 'A healthy diet should include plenty of vegetables, fruits, whole grains, and lean proteins. I can suggest some diet plans based on common Indian foods. Would you like me to recommend some videos?';
  }
  
  return 'Thank you for your question. While I can provide general health information, I recommend consulting with one of our qualified doctors for personalized medical advice. You can book an appointment through the app.';
};

// Videos API
export const videosAPI = {
  getAll: async (category?: string): Promise<VideoContent[]> => {
    await delay(400);
    return category ? 
      mockVideoContent.filter(video => video.category === category) : 
      mockVideoContent;
  },

  getRecommended: async (patientId: string): Promise<VideoContent[]> => {
    await delay(600);
    // Simulate AI-based recommendations
    return mockVideoContent.slice(0, 3);
  }
};

// Diet Plans API
export const dietAPI = {
  getPlans: async (patientId: string): Promise<DietPlan[]> => {
    await delay(500);
    return mockDietPlans.filter(plan => plan.patientId === patientId);
  },

  generatePlan: async (patientId: string, condition: string): Promise<DietPlan> => {
    await delay(2000); // Simulate AI processing
    
    const newPlan: DietPlan = {
      id: `diet_${Date.now()}`,
      patientId,
      title: `AI-Generated Plan for ${condition}`,
      description: `Personalized diet plan created by AI for managing ${condition}`,
      meals: mockDietPlans[0].meals, // Use template for demo
      targetCondition: condition,
      duration: '30 days',
      createdBy: 'ai',
      createdAt: new Date()
    };
    
    return newPlan;
  }
};

// Payments API
export const paymentsAPI = {
  getAll: async (patientId: string): Promise<Payment[]> => {
    await delay(400);
    const payments = getStorageData(STORAGE_KEYS.payments, []);
    return payments.filter((payment: Payment) => payment.patientId === patientId);
  },

  createPayment: async (payment: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> => {
    await delay(1500); // Simulate payment processing
    
    const payments = getStorageData(STORAGE_KEYS.payments, []);
    const newPayment: Payment = {
      ...payment,
      id: `pay_${Date.now()}`,
      transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: Math.random() > 0.1 ? 'completed' : 'failed', // 90% success rate
      createdAt: new Date()
    };
    
    payments.push(newPayment);
    setStorageData(STORAGE_KEYS.payments, payments);
    return newPayment;
  }
};

// Notifications API
export const notificationsAPI = {
  getAll: async (userId: string): Promise<Notification[]> => {
    await delay(300);
    const notifications = getStorageData(STORAGE_KEYS.notifications, []);
    return notifications.filter((notif: Notification) => notif.userId === userId);
  },

  markAsRead: async (id: string): Promise<void> => {
    await delay(200);
    const notifications = getStorageData(STORAGE_KEYS.notifications, []);
    const index = notifications.findIndex((notif: Notification) => notif.id === id);
    if (index !== -1) {
      notifications[index].isRead = true;
      setStorageData(STORAGE_KEYS.notifications, notifications);
    }
  }
};

// Analytics API
export const analyticsAPI = {
  getDashboard: async (): Promise<Analytics> => {
    await delay(800);
    return mockAnalytics;
  }
};

// Users API
export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    await delay(400);
    return mockUsers;
  },

  getDoctors: async (): Promise<User[]> => {
    await delay(400);
    return mockUsers.filter(user => user.role === 'doctor');
  }
};