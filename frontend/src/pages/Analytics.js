import React, { useState } from 'react';
import { mockData } from '../data/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Clock, 
  DollarSign,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('executions');
  const { analytics } = mockData;

  const stats = [
    {
      title: 'Total Workflows',
      value: analytics.overview.totalWorkflows,
      change: '+12%',
      changeType: 'positive',
      icon: Activity,
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Exécutions',
      value: analytics.overview.totalExecutions,
      change: '+28%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Taux de Réussite',
      value: `${analytics.overview.successRate}%`,
      change: '+2.4%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Temps Économisé',
      value: `${analytics.overview.timeSaved}h`,
      change: '+15%',
      changeType: 'positive',
      icon: Clock,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const ExecutionChart = () => {
    const maxValue = Math.max(...analytics.charts.executionsOverTime.map(item => item.executions));
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Exécutions au fil du temps</h3>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">3 derniers mois</option>
            </select>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="h-64 flex items-end space-x-2">
          {analytics.charts.executionsOverTime.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-300 hover:from-purple-600 hover:to-pink-600"
                style={{ height: `${(item.executions / maxValue) * 100}%` }}
              ></div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(item.date).toLocaleDateString('fr-FR', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CategoryChart = () => {
    const total = analytics.charts.workflowsByCategory.reduce((sum, item) => sum + item.count, 0);
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Workflows par catégorie</h3>
          <PieChart className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="space-y-4">
          {analytics.charts.workflowsByCategory.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium text-gray-900">{item.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{item.count}</span>
                <span className="text-xs text-gray-500">
                  ({Math.round((item.count / total) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full flex">
            {analytics.charts.workflowsByCategory.map((item, index) => (
              <div
                key={index}
                className="transition-all duration-300"
                style={{
                  width: `${(item.count / total) * 100}%`,
                  backgroundColor: item.color
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const PerformanceMetrics = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Métriques de Performance</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {analytics.overview.successRate}%
          </div>
          <div className="text-sm text-gray-600">Taux de Réussite</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            2.3s
          </div>
          <div className="text-sm text-gray-600">Temps Moyen</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            99.2%
          </div>
          <div className="text-sm text-gray-600">Disponibilité</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            34
          </div>
          <div className="text-sm text-gray-600">Erreurs ce mois</div>
        </div>
      </div>
    </div>
  );

  const TopWorkflows = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Workflows</h3>
      
      <div className="space-y-4">
        {mockData.workflows.slice(0, 5).map((workflow, index) => (
          <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">{index + 1}</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{workflow.name}</div>
                <div className="text-sm text-gray-600">{workflow.category}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">{workflow.executions}</div>
              <div className="text-sm text-gray-600">exécutions</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Analysez les performances de vos automatisations</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
              <Calendar className="w-4 h-4" />
              <span>Planifier Rapport</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  stat.changeType === 'positive' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ExecutionChart />
          </div>
          <div>
            <CategoryChart />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <PerformanceMetrics />
          <TopWorkflows />
        </div>
      </div>
    </div>
  );
};

export default Analytics;