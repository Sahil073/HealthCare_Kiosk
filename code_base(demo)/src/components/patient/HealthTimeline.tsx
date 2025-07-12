import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Activity, Heart, Droplets } from 'lucide-react';
import { Vital, HealthTimeline as HealthTimelineType } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface HealthTimelineProps {
  vitals: Vital[];
}

const HealthTimeline: React.FC<HealthTimelineProps> = ({ vitals }) => {
  const { t } = useLanguage();

  // Process vitals data for charts
  const processedData = vitals.reduce((acc, vital) => {
    const date = new Date(vital.timestamp).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      if (vital.type === 'bp' && vital.unit === 'systolic') {
        existing.bp_systolic = vital.value;
      } else if (vital.type === 'bp' && vital.unit === 'diastolic') {
        existing.bp_diastolic = vital.value;
      } else {
        existing[vital.type] = vital.value;
      }
    } else {
      const newEntry: any = { date };
      if (vital.type === 'bp' && vital.unit === 'systolic') {
        newEntry.bp_systolic = vital.value;
      } else if (vital.type === 'bp' && vital.unit === 'diastolic') {
        newEntry.bp_diastolic = vital.value;
      } else {
        newEntry[vital.type] = vital.value;
      }
      acc.push(newEntry);
    }
    
    return acc;
  }, [] as HealthTimelineType[]);

  const getLatestVital = (type: string) => {
    const latest = vitals
      .filter(v => v.type === type)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    return latest;
  };

  const latestBP = vitals.filter(v => v.type === 'bp').slice(-2);
  const latestSugar = getLatestVital('sugar');
  const latestWeight = getLatestVital('weight');
  const latestBMI = getLatestVital('bmi');

  const vitalCards = [
    {
      title: t('health.bloodPressure'),
      value: latestBP.length >= 2 ? `${latestBP[0]?.value}/${latestBP[1]?.value}` : 'No data',
      unit: 'mmHg',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '+2%'
    },
    {
      title: t('health.bloodSugar'),
      value: latestSugar?.value?.toString() || 'No data',
      unit: 'mg/dL',
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '-1%'
    },
    {
      title: t('health.weight'),
      value: latestWeight?.value?.toString() || 'No data',
      unit: 'kg',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '-0.5%'
    },
    {
      title: t('health.bmi'),
      value: latestBMI?.value?.toString() || 'No data',
      unit: '',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+0.2%'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {t('dashboard.healthTimeline')}
      </h2>

      {/* Vital Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {vitalCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <span className="text-xs text-green-600 font-medium">{card.trend}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-900">{card.value}</span>
                {card.unit && <span className="text-sm text-gray-500">{card.unit}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      {processedData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blood Pressure Chart */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Blood Pressure Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="bp_systolic" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Systolic"
                />
                <Line 
                  type="monotone" 
                  dataKey="bp_diastolic" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  name="Diastolic"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weight/BMI Chart */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Weight & BMI Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="weight" fill="#10b981" name="Weight (kg)" />
                <Bar dataKey="bmi" fill="#8b5cf6" name="BMI" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Health Data Yet</h3>
          <p className="text-gray-600 mb-4">
            Start recording your vitals to see trends and insights
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Record First Reading
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthTimeline;