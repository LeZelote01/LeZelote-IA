import React, { useState, useRef } from 'react';
import { mockData } from '../data/mockData';
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Zap,
  Plus,
  X,
  Settings,
  ArrowRight,
  ChevronDown,
  Code,
  Eye,
  Grid,
  List,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';

const NoCodeBuilder = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [workflow, setWorkflow] = useState({
    name: 'Nouveau Workflow',
    description: 'Description du workflow...',
    steps: [],
    aiModel: 'GPT-4'
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const canvasRef = useRef(null);

  const nodeTypes = [
    {
      category: 'Déclencheurs',
      nodes: [
        { id: 'email-trigger', name: 'Email Reçu', icon: '📧', color: 'bg-blue-500' },
        { id: 'webhook-trigger', name: 'Webhook', icon: '🔗', color: 'bg-green-500' },
        { id: 'schedule-trigger', name: 'Planificateur', icon: '⏰', color: 'bg-orange-500' },
        { id: 'form-trigger', name: 'Formulaire', icon: '📝', color: 'bg-purple-500' }
      ]
    },
    {
      category: 'Actions IA',
      nodes: [
        { id: 'ai-analysis', name: 'Analyse IA', icon: '🧠', color: 'bg-pink-500' },
        { id: 'ai-generation', name: 'Génération Contenu', icon: '✨', color: 'bg-indigo-500' },
        { id: 'ai-classification', name: 'Classification', icon: '📊', color: 'bg-cyan-500' },
        { id: 'ai-extraction', name: 'Extraction Données', icon: '🔍', color: 'bg-teal-500' }
      ]
    },
    {
      category: 'Intégrations',
      nodes: [
        { id: 'slack-send', name: 'Envoyer Slack', icon: '💬', color: 'bg-purple-600' },
        { id: 'email-send', name: 'Envoyer Email', icon: '📤', color: 'bg-red-500' },
        { id: 'crm-update', name: 'Mettre à jour CRM', icon: '⚡', color: 'bg-yellow-500' },
        { id: 'database-save', name: 'Sauvegarder BDD', icon: '💾', color: 'bg-gray-500' }
      ]
    },
    {
      category: 'Logique',
      nodes: [
        { id: 'condition', name: 'Condition', icon: '❓', color: 'bg-amber-500' },
        { id: 'loop', name: 'Boucle', icon: '🔄', color: 'bg-emerald-500' },
        { id: 'delay', name: 'Attendre', icon: '⏸️', color: 'bg-slate-500' },
        { id: 'filter', name: 'Filtrer', icon: '🔽', color: 'bg-rose-500' }
      ]
    }
  ];

  const WorkflowCanvas = () => {
    const handleDrop = (e) => {
      e.preventDefault();
      const nodeData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newStep = {
        id: Date.now().toString(),
        type: nodeData.id,
        name: nodeData.name,
        icon: nodeData.icon,
        color: nodeData.color,
        x,
        y,
        config: {}
      };

      setWorkflow(prev => ({
        ...prev,
        steps: [...prev.steps, newStep]
      }));
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    return (
      <div className="flex-1 bg-gray-50 relative">
        <div
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full h-full min-h-[600px] bg-white bg-grid-pattern relative"
        >
          {/* Grid dots */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="#ddd" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Workflow Steps */}
          {workflow.steps.map((step, index) => (
            <div
              key={step.id}
              className={`absolute w-32 h-20 ${step.color} rounded-lg flex flex-col items-center justify-center text-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 ${
                selectedNode === step.id ? 'ring-4 ring-purple-500' : ''
              }`}
              style={{ left: step.x - 64, top: step.y - 40 }}
              onClick={() => setSelectedNode(step.id)}
            >
              <div className="text-2xl mb-1">{step.icon}</div>
              <div className="text-xs text-center font-medium">{step.name}</div>
            </div>
          ))}

          {/* Connections */}
          {workflow.steps.map((step, index) => {
            if (index === workflow.steps.length - 1) return null;
            const nextStep = workflow.steps[index + 1];
            return (
              <svg
                key={`connection-${index}`}
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 1 }}
              >
                <line
                  x1={step.x}
                  y1={step.y}
                  x2={nextStep.x}
                  y2={nextStep.y}
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6" />
                  </marker>
                </defs>
              </svg>
            );
          })}

          {/* Empty State */}
          {workflow.steps.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Créez votre workflow</h3>
                <p className="text-gray-600 mb-4">Glissez-déposez des éléments depuis la palette</p>
                <button 
                  onClick={() => setShowTemplates(true)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
                >
                  Utiliser un template
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const NodePalette = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handleDragStart = (e, node) => {
      e.dataTransfer.setData('application/json', JSON.stringify(node));
    };

    const filteredNodes = nodeTypes.flatMap(category => 
      category.nodes.filter(node => 
        (selectedCategory === 'all' || category.category === selectedCategory) &&
        node.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Palette d'outils</h3>
          
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Toutes les catégories</option>
            {nodeTypes.map(category => (
              <option key={category.category} value={category.category}>
                {category.category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {nodeTypes.map(category => (
            <div key={category.category} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">{category.category}</h4>
              <div className="space-y-2">
                {category.nodes
                  .filter(node => 
                    (selectedCategory === 'all' || selectedCategory === category.category) &&
                    node.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(node => (
                    <div
                      key={node.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, node)}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className={`w-8 h-8 ${node.color} rounded-md flex items-center justify-center`}>
                        <span className="text-white text-sm">{node.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{node.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PropertiesPanel = () => {
    const selectedStep = workflow.steps.find(step => step.id === selectedNode);

    if (!selectedStep) {
      return (
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <div className="text-center text-gray-500 mt-8">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Sélectionnez un élément pour voir ses propriétés</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Propriétés</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'étape
              </label>
              <input
                type="text"
                value={selectedStep.name}
                onChange={(e) => {
                  setWorkflow(prev => ({
                    ...prev,
                    steps: prev.steps.map(step => 
                      step.id === selectedNode 
                        ? { ...step, name: e.target.value }
                        : step
                    )
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {selectedStep.type.includes('ai') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle IA
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="gpt-4">GPT-4 Turbo</option>
                  <option value="claude">Claude Sonnet</option>
                  <option value="mistral">Mistral Large</option>
                </select>
              </div>
            )}

            {selectedStep.type === 'condition' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <textarea
                  placeholder="Exemple: {{email.subject}} contient 'urgent'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                />
              </div>
            )}

            {selectedStep.type === 'email-send' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinataire
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet
                  </label>
                  <input
                    type="text"
                    placeholder="Sujet de l'email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setWorkflow(prev => ({
                    ...prev,
                    steps: prev.steps.filter(step => step.id !== selectedNode)
                  }));
                  setSelectedNode(null);
                }}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Supprimer l'étape</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TemplateModal = () => {
    if (!showTemplates) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Templates de Workflows</h2>
            <button
              onClick={() => setShowTemplates(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockData.workflowTemplates.map(template => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{template.icon}</span>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    template.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {template.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-gray-500">Étapes:</div>
                  {template.steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-600">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>⏱️ {template.estimatedTime} min</span>
                  <span>📥 {template.downloads} utilisations</span>
                </div>
                
                <button
                  onClick={() => {
                    // Ici on chargerait le template dans le workflow
                    setShowTemplates(false);
                    alert(`Template "${template.name}" chargé !`);
                  }}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
                >
                  Utiliser ce template
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-purple-500" />
                <h1 className="text-2xl font-bold text-gray-900">Visual Builder</h1>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={workflow.name}
                  onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
                  className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTemplates(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
              >
                <Grid className="w-4 h-4" />
                <span>Templates</span>
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Prévisualiser</span>
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Sauvegarder</span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Déployer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          <NodePalette />
          <WorkflowCanvas />
          <PropertiesPanel />
        </div>

        {/* Template Modal */}
        <TemplateModal />
      </div>
    </div>
  );
};

export default NoCodeBuilder;