import React, { useState, useEffect } from 'react';
import { supportAPI } from '../services/api';
import { 
  MessageCircle,
  AlertCircle,
  Clock,
  CheckCircle,
  User,
  Plus,
  Search,
  Filter,
  Eye,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

const CustomerService = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await supportAPI.getTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await supportAPI.createTicket(newTicket);
      fetchTickets();
      setShowCreateModal(false);
      setNewTicket({ subject: '', category: '', description: '' });
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      open: { 
        color: 'bg-red-100 text-red-800', 
        icon: AlertCircle,
        label: 'Ouvert'
      },
      in_progress: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock,
        label: 'En cours'
      },
      resolved: { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle,
        label: 'Résolu'
      },
      closed: { 
        color: 'bg-gray-100 text-gray-800', 
        icon: Minus,
        label: 'Fermé'
      }
    };
    return configs[status] || configs.open;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      low: { color: 'text-green-600', label: 'Faible' },
      medium: { color: 'text-yellow-600', label: 'Moyenne' },
      high: { color: 'text-orange-600', label: 'Élevée' },
      urgent: { color: 'text-red-600', label: 'Urgente' }
    };
    return configs[priority] || configs.medium;
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Client</h1>
            <p className="text-gray-600">Gérez et résolvez les demandes de support</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau Ticket</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{ticketStats.total}</h3>
            <p className="text-gray-600 text-sm">Total tickets</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{ticketStats.open}</h3>
            <p className="text-gray-600 text-sm">Ouverts</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{ticketStats.inProgress}</h3>
            <p className="text-gray-600 text-sm">En cours</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{ticketStats.resolved}</h3>
            <p className="text-gray-600 text-sm">Résolus</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher des tickets..."
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
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="open">Ouverts</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Résolus</option>
                  <option value="closed">Fermés</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Tickets ({filteredTickets.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => {
              const statusConfig = getStatusConfig(ticket.status);
              const priorityConfig = getPriorityConfig(ticket.priority);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          #{ticket.id} - {ticket.subject}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </span>
                        <span className={`text-sm font-medium ${priorityConfig.color}`}>
                          {priorityConfig.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Client #{ticket.customer_id}
                        </span>
                        <span>{ticket.category}</span>
                        <span>
                          {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        {ticket.ai_sentiment && (
                          <div className="flex items-center space-x-1">
                            {getSentimentIcon(ticket.ai_sentiment)}
                            <span className="capitalize">{ticket.ai_sentiment}</span>
                          </div>
                        )}
                      </div>
                      
                      {ticket.description && (
                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                      )}
                      
                      {ticket.ai_summary && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                          <p className="text-sm text-blue-800">
                            <strong>Résumé IA:</strong> {ticket.ai_summary}
                          </p>
                        </div>
                      )}
                      
                      {ticket.ai_suggested_actions && ticket.ai_suggested_actions.length > 0 && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-3">
                          <p className="text-sm text-green-800 font-medium mb-2">
                            Actions suggérées par l'IA:
                          </p>
                          <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                            {ticket.ai_suggested_actions.map((action, index) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Ticket Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nouveau Ticket</h2>
              
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet
                  </label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Technical">Technique</option>
                    <option value="Billing">Facturation</option>
                    <option value="Integration">Intégration</option>
                    <option value="General">Général</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Décrivez votre problème ou votre demande..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Créer le ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerService;