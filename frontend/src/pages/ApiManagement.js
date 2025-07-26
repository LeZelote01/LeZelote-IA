import React, { useState, useEffect } from 'react';
import { apiKeysAPI } from '../services/api';
import { 
  Key,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Activity,
  Calendar,
  Shield,
  Code
} from 'lucide-react';

const ApiManagement = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);
  const [newApiKey, setNewApiKey] = useState({
    name: '',
    permissions: []
  });

  const availablePermissions = [
    { id: 'read', label: 'Lecture', description: 'Accès en lecture aux données' },
    { id: 'write', label: 'Écriture', description: 'Création et modification de données' },
    { id: 'delete', label: 'Suppression', description: 'Suppression de données' },
    { id: 'admin', label: 'Administration', description: 'Accès administrateur complet' }
  ];

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const data = await apiKeysAPI.getApiKeys();
      setApiKeys(data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiKey = async (e) => {
    e.preventDefault();
    try {
      await apiKeysAPI.createApiKey(newApiKey);
      fetchApiKeys();
      setShowCreateModal(false);
      setNewApiKey({ name: '', permissions: [] });
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = async (text, keyId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatKey = (key, isVisible) => {
    if (isVisible) {
      return key;
    }
    return key.substring(0, 8) + '•'.repeat(20) + key.substring(key.length - 4);
  };

  const handlePermissionToggle = (permission) => {
    setNewApiKey(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getUsageLevel = (callsCount) => {
    if (callsCount < 1000) return { color: 'text-green-600', label: 'Faible' };
    if (callsCount < 10000) return { color: 'text-yellow-600', label: 'Modéré' };
    return { color: 'text-red-600', label: 'Élevé' };
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
            <h1 className="text-3xl font-bold text-gray-900">Gestion des API</h1>
            <p className="text-gray-600">Gérez vos clés API et contrôlez l'accès à votre plateforme</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvelle Clé API</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{apiKeys.length}</h3>
            <p className="text-gray-600 text-sm">Clés actives</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {apiKeys.reduce((sum, key) => sum + key.calls_count, 0)}
            </h3>
            <p className="text-gray-600 text-sm">Appels API totaux</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {apiKeys.filter(key => key.is_active).length}
            </h3>
            <p className="text-gray-600 text-sm">Clés sécurisées</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {apiKeys.filter(key => key.last_used).length}
            </h3>
            <p className="text-gray-600 text-sm">Utilisées récemment</p>
          </div>
        </div>

        {/* API Keys List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Clés API</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {apiKeys.map((apiKey) => {
              const usageLevel = getUsageLevel(apiKey.calls_count);
              const isVisible = visibleKeys[apiKey.id];
              
              return (
                <div key={apiKey.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {apiKey.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apiKey.is_active)}`}>
                          {apiKey.is_active ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <code className="text-sm font-mono text-gray-700 bg-white px-3 py-2 rounded border flex-1 mr-3">
                            {formatKey(apiKey.key, isVisible)}
                          </code>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                              title={isVisible ? 'Masquer' : 'Afficher'}
                            >
                              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                              className={`p-2 hover:bg-gray-200 rounded-lg transition-colors ${
                                copiedKey === apiKey.id ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
                              }`}
                              title="Copier"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {copiedKey === apiKey.id && (
                          <p className="text-sm text-green-600 mt-2">Clé copiée dans le presse-papiers !</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Permissions</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {apiKey.permissions && apiKey.permissions.length > 0 ? (
                              apiKey.permissions.map((permission) => (
                                <span
                                  key={permission}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                >
                                  {permission}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-400">Aucune permission</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Utilisation</p>
                          <p className={`text-lg font-semibold ${usageLevel.color}`}>
                            {apiKey.calls_count.toLocaleString()} appels
                          </p>
                          <p className={`text-sm ${usageLevel.color}`}>
                            {usageLevel.label}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Dernière utilisation</p>
                          <p className="text-sm text-gray-900">
                            {apiKey.last_used 
                              ? new Date(apiKey.last_used).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Jamais utilisée'
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            Créée le {new Date(apiKey.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setKeyToDelete(apiKey);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create API Key Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle Clé API</h2>
              
              <form onSubmit={handleCreateApiKey} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la clé
                  </label>
                  <input
                    type="text"
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey({...newApiKey, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: Production API, Test API..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Donnez un nom descriptif pour identifier cette clé API
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permissions
                  </label>
                  <div className="space-y-3">
                    {availablePermissions.map((permission) => (
                      <label key={permission.id} className="flex items-start">
                        <input
                          type="checkbox"
                          checked={newApiKey.permissions.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                          className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {permission.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {permission.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">
                        Important
                      </h3>
                      <div className="text-sm text-yellow-700 mt-1">
                        <p>• Gardez vos clés API secrètes et sécurisées</p>
                        <p>• Ne partagez jamais vos clés dans du code public</p>
                        <p>• Supprimez les clés inutilisées</p>
                      </div>
                    </div>
                  </div>
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
                    Créer la clé
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && keyToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Supprimer la clé API
                </h3>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer la clé "{keyToDelete.name}" ? 
                  Cette action est irréversible.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setKeyToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement delete functionality
                      setShowDeleteModal(false);
                      setKeyToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiManagement;