import React, { useState, useCallback } from 'react';
import { mockData } from '../data/mockData';
import { 
  Upload, 
  File, 
  FileText, 
  Eye, 
  Download, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Clock,
  Brain,
  Scan,
  Search,
  Filter,
  RefreshCw,
  Plus,
  X,
  FileImage,
  FileSpreadsheet
} from 'lucide-react';

const DocumentProcessor = () => {
  const [documents, setDocuments] = useState(mockData.documents);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dragOver, setDragOver] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleFileUpload = useCallback((files) => {
    Array.from(files).forEach(file => {
      const newDocument = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: getDocumentType(file.type),
        status: 'processing',
        extractedData: null,
        confidence: null,
        processedAt: null,
        size: file.size
      };
      
      setDocuments(prev => [...prev, newDocument]);
      
      // Simulate processing
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDocument.id 
            ? { 
                ...doc, 
                status: 'processed',
                confidence: 0.9 + Math.random() * 0.1,
                processedAt: new Date().toISOString(),
                extractedData: generateMockExtractedData(doc.type)
              }
            : doc
        ));
      }, 3000);
    });
    setUploadModal(false);
  }, []);

  const getDocumentType = (mimeType) => {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    return 'document';
  };

  const generateMockExtractedData = (type) => {
    const mockData = {
      invoice: {
        amount: (Math.random() * 5000 + 500).toFixed(2),
        currency: 'EUR',
        date: new Date().toISOString().split('T')[0],
        vendor: 'Société Exemple',
        items: ['Produit A', 'Service B']
      },
      contract: {
        parties: ['Partie A', 'Partie B'],
        duration: '12 mois',
        value: (Math.random() * 50000 + 5000).toFixed(2),
        startDate: new Date().toISOString().split('T')[0]
      },
      report: {
        pages: Math.floor(Math.random() * 20 + 5),
        sections: ['Introduction', 'Analyse', 'Conclusion'],
        tables: Math.floor(Math.random() * 5 + 1),
        charts: Math.floor(Math.random() * 3 + 1)
      }
    };
    return mockData[type] || mockData.report;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'image':
        return <FileImage className="w-8 h-8 text-blue-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
      default:
        return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const UploadModal = () => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileUpload(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Uploader des documents</h2>
            <button
              onClick={() => setUploadModal(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              isDragOver ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 cursor-pointer"
            >
              Sélectionner des fichiers
            </label>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Formats supportés: PDF, Images (JPG, PNG), Excel, Word
          </div>
        </div>
      </div>
    );
  };

  const DocumentDetails = ({ document }) => {
    if (!document) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {getDocumentIcon(document.type)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
              <p className="text-sm text-gray-600">
                {document.type} • {document.size ? `${(document.size / 1024).toFixed(1)} KB` : 'Taille inconnue'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(document.status)}
            <span className="text-sm font-medium text-gray-700 capitalize">{document.status}</span>
          </div>
        </div>

        {document.status === 'processed' && document.extractedData && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-purple-500" />
              <h4 className="font-semibold text-gray-900">Données extraites</h4>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {Math.round(document.confidence * 100)}% confiance
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(document.extractedData).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-gray-900">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {document.status === 'processing' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scan className="w-8 h-8 text-purple-500 animate-pulse" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Traitement en cours...</h4>
            <p className="text-gray-600">L'IA analyse votre document avec OCR avancé</p>
          </div>
        )}

        {document.status === 'failed' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Échec du traitement</h4>
            <p className="text-gray-600">{document.error || 'Erreur inconnue'}</p>
            <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200">
              Réessayer
            </button>
          </div>
        )}
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
              Traitement de Documents
            </h1>
            <p className="text-gray-600">
              Extraction intelligente de données avec OCR et IA
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <RefreshCw className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={() => setUploadModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Uploader</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Documents traités', value: documents.length, icon: FileText, color: 'bg-blue-500' },
            { title: 'Traitement réussi', value: documents.filter(d => d.status === 'processed').length, icon: CheckCircle, color: 'bg-green-500' },
            { title: 'En cours', value: documents.filter(d => d.status === 'processing').length, icon: Clock, color: 'bg-yellow-500' },
            { title: 'Échecs', value: documents.filter(d => d.status === 'failed').length, icon: AlertCircle, color: 'bg-red-500' }
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
                placeholder="Rechercher des documents..."
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
                <option value="processed">Traités</option>
                <option value="processing">En cours</option>
                <option value="failed">Échecs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Document List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
            
            {filteredDocuments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun document trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Commencez par uploader vos premiers documents
                </p>
                <button
                  onClick={() => setUploadModal(true)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
                >
                  Uploader des documents
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className={`bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-all duration-200 ${
                      selectedDocument?.id === document.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDocument(document)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getDocumentIcon(document.type)}
                        <div>
                          <h3 className="font-medium text-gray-900">{document.name}</h3>
                          <p className="text-sm text-gray-600">
                            {document.type} • {document.processedAt ? new Date(document.processedAt).toLocaleDateString('fr-FR') : 'Non traité'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(document.status)}
                        {document.confidence && (
                          <span className="text-xs font-medium text-gray-600">
                            {Math.round(document.confidence * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails</h2>
            
            {selectedDocument ? (
              <DocumentDetails document={selectedDocument} />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez un document
                </h3>
                <p className="text-gray-600">
                  Cliquez sur un document pour voir ses détails et les données extraites
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {uploadModal && <UploadModal />}
      </div>
    </div>
  );
};

export default DocumentProcessor;
