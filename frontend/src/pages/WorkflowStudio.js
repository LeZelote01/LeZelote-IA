import React, { useState } from 'react';
import { mockData } from '../data/mockData';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  PlayCircle,
  PauseCircle,
  Edit,
  Trash2,
  Copy,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Settings,
  Zap
} from 'lucide-react';

const WorkflowStudio = () => {
  const [workflows, setWorkflows] = useState(mockData.workflows);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (workflowId) => {
    setWorkflows(workflows.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, status: workflow.status === 'active' ? 'paused' : 'active' }
        : workflow
    ));
  };

  const handleDuplicate = (workflowId) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      const newWorkflow = {
        ...workflow,
        id: Date.now().toString(),
        name: `${workflow.name} (Copie)`,
        status: 'draft',
        executions: 0,
        lastRun: null
      };
      setWorkflows([...workflows, newWorkflow]);
    }
  };

  const handleDelete = (workflowId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce workflow ?')) {
      setWorkflows(workflows.filter(w => w.id !== workflowId));
    }
  };

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

  const WorkflowCard = ({ workflow }) => {
    const [showActions, setShowActions] = useState(false);

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 hover-lift transition-all duration-300 border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">{workflow.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{workflow.name}</h3>
              <p className="text-sm text-gray-600">{workflow.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <StatusBadge status={workflow.status} />
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={() => handleToggleStatus(workflow.id)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {workflow.status === 'active' ? (
                      <>
                        <PauseCircle className="w-4 h-4 mr-2" />
                        Mettre en pause
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Activer
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedWorkflow(workflow)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDuplicate(workflow.id)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Dupliquer
                  </button>
                  <button
                    onClick={() => handleDelete(workflow.id)}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">{workflow.executions}</div>
            <div className="text-xs text-gray-500">Exécutions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{workflow.triggers}</div>
            <div className="text-xs text-gray-500">Déclencheurs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{workflow.category}</div>
            <div className="text-xs text-gray-500">Catégorie</div>
          </div>
        </div>
        
        {workflow.lastRun && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            Dernière exécution: {new Date(workflow.lastRun).toLocaleDateString('fr-FR')}
          </div>
        )}
      </div>
    );
  };

  const CreateWorkflowModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      category: 'Sales',
      icon: '🎯'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newWorkflow = {
        id: Date.now().toString(),
        ...formData,
        status: 'draft',
        triggers: 0,
        executions: 0,
        lastRun: null
      };
      setWorkflows([...workflows, newWorkflow]);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', category: 'Sales', icon: '🎯' });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer un nouveau workflow</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du workflow
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
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Support">Support</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Créer
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Studio de Workflows</h1>
            <p className="text-gray-600">Créez et gérez vos automatisations intelligentes</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="gradient-button flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau Workflow</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des workflows..."
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
                <option value="active">Actif</option>
                <option value="draft">Brouillon</option>
                <option value="paused">En pause</option>
              </select>
            </div>
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>

        {filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun workflow trouvé
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Essayez de modifier vos critères de recherche' 
                : 'Créez votre premier workflow pour commencer'}
            </p>
          </div>
        )}

        {/* Create Workflow Modal */}
        {showCreateModal && <CreateWorkflowModal />}
      </div>
    </div>
  );
};

export default WorkflowStudio;