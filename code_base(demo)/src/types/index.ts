export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
  aadhaarId?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  specialization?: string; // for doctors
  experience?: number; // for doctors
  department?: string; // for doctors
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  department: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  symptoms?: string;
  notes?: string;
  prescription?: string;
  followUpDate?: Date;
  createdAt: Date;
}

export interface Vital {
  id: string;
  patientId: string;
  type: 'bp' | 'sugar' | 'weight' | 'height' | 'bmi' | 'temperature' | 'pulse';
  value: number;
  unit: string;
  timestamp: Date;
  recordedBy?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  patientId: string;
  message: string;
  isBot: boolean;
  timestamp: Date;
  category?: 'general' | 'symptoms' | 'medication' | 'diet' | 'emergency';
}

export interface VideoContent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in minutes
  category: 'diet' | 'yoga' | 'awareness' | 'exercise' | 'medication';
  tags: string[];
  viewCount: number;
  rating: number;
  language: 'en' | 'hi' | 'both';
  targetConditions?: string[];
  createdAt: Date;
}

export interface DietPlan {
  id: string;
  patientId: string;
  title: string;
  description: string;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  targetCondition: string;
  duration: string;
  createdBy: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  patientId: string;
  appointmentId?: string;
  amount: number;
  description: string;
  method: 'upi' | 'card' | 'cash' | 'insurance';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
}

export interface Analytics {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingPayments: number;
  kioskUptime: number;
  popularServices: { name: string; count: number }[];
  monthlyRevenue: { month: string; amount: number }[];
  patientSatisfaction: number;
}

export interface HealthTimeline {
  date: Date;
  bp_systolic?: number;
  bp_diastolic?: number;
  sugar?: number;
  weight?: number;
  bmi?: number;
}