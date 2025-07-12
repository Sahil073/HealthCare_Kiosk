import React, { useState, useEffect } from 'react';
import { Calendar, Heart, MessageSquare, Video, TrendingUp, Clock, User, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { appointmentsAPI, vitalsAPI } from '../../services/api';
import { Appointment, Vital } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import HealthTimeline from './HealthTimeline';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [appointmentsData, vitalsData] = await Promise.all([
          appointmentsAPI.getAll(user.id),
          vitalsAPI.getAll(user.id)
        ]);
        setAppointments(appointmentsData);
        setVitals(vitalsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) > new Date())
    .slice(0, 3);

  const recentVitals = vitals.slice(-3).reverse();

  const quickActions = [
    {
      id: 'book-appointment',
      title: t('appointments.book'),
      icon: Calendar,
      color: 'bg-blue-500',
      description: 'Schedule with a doctor'
    },
    {
      id: 'health-chat',
      title: t('nav.chatbot'),
      icon: MessageSquare,
      color: 'bg-green-500',
      description: 'AI health assistant'
    },
    {
      id: 'health-videos',
      title: t('nav.videos'),
      icon: Video,
      color: 'bg-purple-500',
      description: 'Educational content'
    },
    {
      id: 'record-vitals',
      title: 'Record Vitals',
      icon: Heart,
      color: 'bg-red-500',
      description: 'Log health metrics'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {t('dashboard.welcome')}, {user?.name}!
            </h1>
            <p className="text-blue-100">
              Your health journey starts here
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
              <div className="text-sm text-blue-200">{t('dashboard.todayAppointments')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{vitals.length}</div>
              <div className="text-sm text-blue-200">Health Records</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('dashboard.todayAppointments')}
            </h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          {todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                    <p className="text-sm text-gray-600">{appointment.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{appointment.time}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No appointments scheduled for today</p>
            </div>
          )}
        </div>

        {/* Recent Vitals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('dashboard.recentVitals')}
            </h2>
            <Heart className="w-5 h-5 text-gray-400" />
          </div>
          
          {recentVitals.length > 0 ? (
            <div className="space-y-3">
              {recentVitals.map((vital) => (
                <div
                  key={vital.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{vital.type}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(vital.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {vital.value} {vital.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No vitals recorded yet</p>
              <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                Record your first reading
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('dashboard.upcomingAppointments')}
        </h2>
        
        {upcomingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${appointment.doctorName}&background=3B82F6&color=fff`}
                    alt={appointment.doctorName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                    <p className="text-sm text-gray-600">{appointment.department}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming appointments</p>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <Plus className="w-4 h-4 inline mr-2" />
              {t('appointments.book')}
            </button>
          </div>
        )}
      </div>

      {/* Health Timeline */}
      <HealthTimeline vitals={vitals} />
    </div>
  );
};

export default PatientDashboard;