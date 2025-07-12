import React from 'react';
import { 
  Calendar, 
  Heart, 
  MessageSquare, 
  Video, 
  CreditCard, 
  User,
  BarChart3,
  Users,
  Settings,
  Home,
  FileText,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'dashboard', onTabChange }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', icon: Home, label: t('nav.dashboard') }
    ];

    if (user?.role === 'patient') {
      return [
        ...commonItems,
        { id: 'appointments', icon: Calendar, label: t('nav.appointments') },
        { id: 'health', icon: Heart, label: t('nav.health') },
        { id: 'chatbot', icon: MessageSquare, label: t('nav.chatbot') },
        { id: 'videos', icon: Video, label: t('nav.videos') },
        { id: 'payments', icon: CreditCard, label: t('nav.payments') },
        { id: 'profile', icon: User, label: t('nav.profile') }
      ];
    }

    if (user?.role === 'doctor') {
      return [
        ...commonItems,
        { id: 'appointments', icon: Calendar, label: t('nav.appointments') },
        { id: 'patients', icon: Users, label: t('nav.patients') },
        { id: 'prescriptions', icon: FileText, label: t('nav.prescriptions') },
        { id: 'profile', icon: User, label: t('nav.profile') }
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { id: 'analytics', icon: BarChart3, label: t('nav.analytics') },
        { id: 'doctors', icon: Users, label: t('nav.doctors') },
        { id: 'patients', icon: Users, label: t('nav.patients') },
        { id: 'appointments', icon: Calendar, label: t('nav.appointments') },
        { id: 'settings', icon: Settings, label: t('nav.settings') }
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">HealthKiosk</h1>
            <p className="text-xs text-gray-500">स्वास्थ्य कियोस्क</p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange?.(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff`}
            alt={user?.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;