import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Activity,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  CheckCircle,
  Plus,
  ArrowRight,
  Zap,
  Users,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardAPI.getDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const stats = dashboardData ? [
    {
      title: 'Workflows Actifs',
      value: dashboardData.stats.active_workflows,
      total: dashboardData.stats.total_workflows,
      icon: Activity,
      color: 'from-blue-500 to-purple-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Exécutions ce mois',
      value: dashboardData.stats.total_executions,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      change: '+28%',
      changeType: 'positive'
    },
    {
      title: 'Temps économisé',
      value: `${dashboardData.stats.time_saved}h`,
      icon: Clock,
      color: 'from-orange-500 to-red-600',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Coûts économisés',
      value: `${dashboardData.stats.cost_saved}€`,
      icon: DollarSign,
      color: 'from-purple-500 to-pink-600',
      change: '+32%',
      changeType: 'positive'
    }
  ] : [];

  const quickActions = [
    {
      title: 'Créer un Workflow',
      description: 'Automatisez un nouveau processus',
      icon: Plus,
      color: 'from-blue-500 to-purple-600',
      link: '/workflows'
    },
    {
      title: 'Chat avec l\'IA',
      description: 'Obtenez de l\'aide instantanée',
      icon: Zap,
      color: 'from-green-500 to-emerald-600',
      link: '/chat'
    },
    {
      title: 'Voir Analytics',
      description: 'Analysez vos performances',
      icon: BarChart3,
      color: 'from-orange-500 to-red-600',
      link: '/analytics'
    }
  ];

  const StatusBadge = ({ status }) => {
    const config = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      draft: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      paused: { color: 'bg-gray-100 text-gray-800', icon: PauseCircle }
    };
    
    const { color, icon: Icon } = config[status] || config.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de vos automatisations aujourd'hui
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover-lift animate-slide-in">
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
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
                {stat.total && <span className="text-sm text-gray-500 ml-1">/ {stat.total}</span>}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Workflows */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Workflows Récents
                </h2>
                <Link
                  to="/workflows"
                  className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
                >
                  Voir tous <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData?.recent_workflows?.map((workflow) => (
                  <div key={workflow.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{workflow.icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                          <p className="text-sm text-gray-600">{workflow.description}</p>
                        </div>
                      </div>
                      <StatusBadge status={workflow.status} />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{workflow.executions} exécutions</span>
                        <span className="text-gray-300">•</span>
                        <span>{workflow.triggers} déclencheurs</span>
                      </div>
                      {workflow.last_run && (
                        <span>
                          Dernière exécution: {new Date(workflow.last_run).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">Aucun workflow récent</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Actions Rapides
              </h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="block p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Utilisation
              </h2>
              <div className="space-y-4">
                {dashboardData && (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Workflows actifs</span>
                        <span className="font-medium">{dashboardData.stats.active_workflows}/15</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(dashboardData.stats.active_workflows / 15) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Exécutions mensuelles</span>
                        <span className="font-medium">{dashboardData.stats.total_executions}/5000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(dashboardData.stats.total_executions / 5000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan actuel</span>
                    <span className="text-sm font-medium text-purple-600 capitalize">
                      Pro
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;