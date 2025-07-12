import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, FileText, TrendingUp, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { appointmentsAPI } from '../../services/api';
import { Appointment } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      try {
        const data = await appointmentsAPI.getAll();
        // Filter appointments for this doctor
        const doctorAppointments = data.filter(apt => apt.doctorId === user.id);
        setAppointments(doctorAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const completedToday = todayAppointments.filter(apt => apt.status === 'completed').length;
  const pendingToday = todayAppointments.filter(apt => apt.status === 'scheduled').length;

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+5%'
    },
    {
      title: 'Completed Today',
      value: completedToday,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Pending Today',
      value: pendingToday,
      icon: Clock,
      color: 'bg-orange-500',
      change: '-2%'
    },
    {
      title: 'Total Patients',
      value: appointments.length,
      icon: Users,
      color: 'bg-purple-500',
      change: '+12%'
    }
  ];

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      await appointmentsAPI.update(appointmentId, { status: 'completed' });
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
        )
      );
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

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
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-green-100">
              {user?.specialization} • {user?.experience} years experience
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{todayAppointments.length}</div>
            <div className="text-sm text-green-200">Today's Schedule</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          {todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${appointment.patientName}&background=10B981&color=fff`}
                        alt={appointment.patientName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.time}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  {appointment.symptoms && (
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                    </p>
                  )}
                  
                  {appointment.status === 'scheduled' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCompleteAppointment(appointment.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                    </div>
                  )}
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

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${appointment.patientName}&background=6B7280&color=fff`}
                      alt={appointment.patientName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{appointment.patientName}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'View All Patients', icon: Users, color: 'bg-blue-500' },
            { title: 'Create Prescription', icon: FileText, color: 'bg-green-500' },
            { title: 'Schedule Management', icon: Calendar, color: 'bg-purple-500' },
            { title: 'Patient Reports', icon: TrendingUp, color: 'bg-orange-500' }
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                className="p-4 text-left hover:shadow-md transition-shadow border border-gray-200 rounded-lg group"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-900">{action.title}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;