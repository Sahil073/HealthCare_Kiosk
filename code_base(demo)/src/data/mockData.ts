import { User, Appointment, VideoContent, DietPlan, Analytics } from '../types';

export const mockUsers: User[] = [
  {
    id: 'patient_1',
    name: 'Raj Kumar',
    email: 'raj@example.com',
    phone: '+91-9876543210',
    role: 'patient',
    aadhaarId: '1234-5678-9012',
    dateOfBirth: new Date('1990-05-15'),
    gender: 'male',
    address: 'Village Rampur, District Meerut, UP',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-12-01')
  },
  {
    id: 'doctor_1',
    name: 'Dr. Priya Sharma',
    email: 'priya@example.com',
    phone: '+91-9876543211',
    role: 'doctor',
    specialization: 'General Medicine',
    experience: 8,
    department: 'Internal Medicine',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date('2024-12-01')
  },
  {
    id: 'doctor_2',
    name: 'Dr. Amit Verma',
    email: 'amit@example.com',
    phone: '+91-9876543212',
    role: 'doctor',
    specialization: 'Cardiology',
    experience: 12,
    department: 'Cardiology',
    isActive: true,
    createdAt: new Date('2024-01-08'),
    lastLogin: new Date('2024-12-01')
  },
  {
    id: 'admin_1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+91-9876543213',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-12-01')
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt_1',
    patientId: 'patient_1',
    doctorId: 'doctor_1',
    patientName: 'Raj Kumar',
    doctorName: 'Dr. Priya Sharma',
    department: 'Internal Medicine',
    date: new Date('2024-12-02'),
    time: '10:00 AM',
    status: 'scheduled',
    symptoms: 'Fever and headache for 3 days',
    createdAt: new Date('2024-11-30')
  },
  {
    id: 'apt_2',
    patientId: 'patient_1',
    doctorId: 'doctor_2',
    patientName: 'Raj Kumar',
    doctorName: 'Dr. Amit Verma',
    department: 'Cardiology',
    date: new Date('2024-11-29'),
    time: '2:00 PM',
    status: 'completed',
    symptoms: 'Chest pain and shortness of breath',
    prescription: 'Rest for 2 days, take prescribed medication',
    createdAt: new Date('2024-11-25')
  }
];

export const mockVideoContent: VideoContent[] = [
  {
    id: 'vid_1',
    title: 'Diabetes Diet Plan - Indian Foods',
    description: 'Learn about the best Indian foods for managing diabetes effectively',
    thumbnailUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 15,
    category: 'diet',
    tags: ['diabetes', 'indian food', 'nutrition'],
    viewCount: 1250,
    rating: 4.5,
    language: 'both',
    targetConditions: ['diabetes'],
    createdAt: new Date('2024-11-15')
  },
  {
    id: 'vid_2',
    title: 'Morning Yoga for Beginners',
    description: 'Simple yoga exercises to start your day with energy and peace',
    thumbnailUrl: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 20,
    category: 'yoga',
    tags: ['yoga', 'morning', 'beginner'],
    viewCount: 2180,
    rating: 4.8,
    language: 'hi',
    createdAt: new Date('2024-11-10')
  },
  {
    id: 'vid_3',
    title: 'Heart Health Awareness',
    description: 'Understanding heart disease prevention and early symptoms',
    thumbnailUrl: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 12,
    category: 'awareness',
    tags: ['heart', 'prevention', 'awareness'],
    viewCount: 890,
    rating: 4.3,
    language: 'en',
    targetConditions: ['hypertension', 'heart disease'],
    createdAt: new Date('2024-11-05')
  },
  {
    id: 'vid_4',
    title: 'Healthy Indian Breakfast Ideas',
    description: 'Nutritious breakfast options using traditional Indian ingredients',
    thumbnailUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 18,
    category: 'diet',
    tags: ['breakfast', 'indian', 'nutrition'],
    viewCount: 1560,
    rating: 4.6,
    language: 'both',
    createdAt: new Date('2024-10-28')
  }
];

export const mockDietPlans: DietPlan[] = [
  {
    id: 'diet_1',
    patientId: 'patient_1',
    title: 'Diabetes Management Diet',
    description: 'A balanced diet plan specifically designed for diabetes management using Indian foods',
    meals: {
      breakfast: ['Oats upma with vegetables', 'Green tea', 'A handful of almonds'],
      lunch: ['2 rotis with dal', 'Mixed vegetable curry', 'Brown rice (1/2 cup)', 'Buttermilk'],
      dinner: ['Grilled paneer', 'Sautéed spinach', '1 roti', 'Cucumber salad'],
      snacks: ['Apple slices', 'Roasted chana', 'Herbal tea']
    },
    targetCondition: 'diabetes',
    duration: '30 days',
    createdBy: 'Dr. Priya Sharma',
    createdAt: new Date('2024-11-20')
  }
];

export const mockAnalytics: Analytics = {
  totalPatients: 2456,
  totalDoctors: 89,
  totalAppointments: 5678,
  todayAppointments: 34,
  pendingPayments: 12,
  kioskUptime: 98.5,
  popularServices: [
    { name: 'General Consultation', count: 1245 },
    { name: 'Health Checkup', count: 890 },
    { name: 'Diabetes Care', count: 567 },
    { name: 'Cardiology', count: 432 }
  ],
  monthlyRevenue: [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 61000 },
    { month: 'May', amount: 55000 },
    { month: 'Jun', amount: 67000 }
  ],
  patientSatisfaction: 4.2
};