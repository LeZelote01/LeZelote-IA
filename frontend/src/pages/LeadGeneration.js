import React, { useState } from 'react';
import { mockData } from '../data/mockData';
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Phone, 
  Mail, 
  Building, 
  Calendar,
  Brain,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowRight,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

const LeadGeneration = () => {
  const [leads, setLeads] = useState(mockData.leads);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'hot':
        return 'bg-red-100 text-red-800';
      case 'warm':
        return 'bg-yellow-100 text-yellow-800';
      case 'cold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'hot':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'warm':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cold':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const LeadCard = ({ lead, isSelected, onClick }) => (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {lead.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{lead.name}</h3>
            <p className="text-sm text-gray-600">{lead.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
            {lead.status}
          </span>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">{lead.score}/100</div>
            <div className="text-xs text-gray-500">Score IA</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <DollarSign className="w-4 h-4" />
          <span>{lead.predictedValue}€</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(lead.lastActivity).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );

  const LeadDetails = ({ lead }) => {
    if (!lead) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sélectionnez un lead
          </h3>
          <p className="text-gray-600">
            Cliquez sur un lead pour voir ses détails et insights IA
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
              <p className="text-gray-600">{lead.company}</p>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon(lead.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{lead.score}/100</div>
            <div className="text-sm text-gray-500">Score IA</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900">{lead.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900">{lead.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900">{lead.company}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700">Source</div>
              <div className="text-gray-900">{lead.source}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Valeur prédite</div>
              <div className="text-gray-900">{lead.predictedValue}€</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Dernière activité</div>
              <div className="text-gray-900">{new Date(lead.lastActivity).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-gray-900">Insights IA</h3>
          </div>
          <div className="space-y-2">
            {lead.aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{insight}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
            Contacter
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <Edit className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const AddLeadModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      company: '',
      phone: '',
      source: 'Website'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newLead = {
        id: Date.now().toString(),
        ...formData,
        score: Math.floor(Math.random() * 40 + 60),
        status: 'cold',
        lastActivity: new Date().toISOString(),
        predictedValue: Math.floor(Math.random() * 2000 + 500),
        aiInsights: [
          'Nouveau lead à qualifier',
          'Recommandé pour nurturing',
          'Potentiel intéressant'
        ]
      };
      setLeads([...leads, newLead]);
      setShowAddModal(false);
      setFormData({ name: '', email: '', company: '', phone: '', source: 'Website' });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Ajouter un lead</h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Génération de Leads IA
            </h1>
            <p className="text-gray-600">
              Qualification automatique et scoring intelligent des prospects
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter Lead</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Leads', value: leads.length, icon: Users, color: 'bg-blue-500' },
            { title: 'Leads Chauds', value: leads.filter(l => l.status === 'hot').length, icon: TrendingUp, color: 'bg-red-500' },
            { title: 'Valeur Prédite', value: `${leads.reduce((sum, l) => sum + l.predictedValue, 0)}€`, icon: DollarSign, color: 'bg-green-500' },
            { title: 'Score Moyen', value: Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length), icon: Target, color: 'bg-purple-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="hot">Chauds</option>
                <option value="warm">Tièdes</option>
                <option value="cold">Froids</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Leads List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Leads ({filteredLeads.length})</h2>
            
            {filteredLeads.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun lead trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Commencez par ajouter vos premiers leads
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
                >
                  Ajouter un lead
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    isSelected={selectedLead?.id === lead.id}
                    onClick={() => setSelectedLead(lead)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Lead Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails du Lead</h2>
            <LeadDetails lead={selectedLead} />
          </div>
        </div>

        {/* Add Lead Modal */}
        {showAddModal && <AddLeadModal />}
      </div>
    </div>
  );
};

export default LeadGeneration;