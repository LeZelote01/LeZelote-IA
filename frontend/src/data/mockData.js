export const mockData = {
  user: {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    company: 'TechCorp SAS',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    subscription: {
      plan: 'pro',
      status: 'active',
      nextBilling: '2024-08-15T00:00:00Z'
    }
  },
  
  workflows: [
    {
      id: '1',
      name: 'Analyse de Prospects IA',
      description: 'Analyse automatique des prospects entrants avec scoring IA multi-modèles',
      status: 'active',
      triggers: 3,
      executions: 127,
      lastRun: '2024-07-20T14:30:00Z',
      category: 'Lead Generation',
      icon: '🎯',
      aiModel: 'GPT-4'
    },
    {
      id: '2',
      name: 'Extraction Documents OCR',
      description: 'Extraction automatique de données depuis factures et contrats',
      status: 'active',
      triggers: 1,
      executions: 89,
      lastRun: '2024-07-20T10:15:00Z',
      category: 'Document Processing',
      icon: '📄',
      aiModel: 'Claude'
    },
    {
      id: '3',
      name: 'Support Client Intelligent',
      description: 'Chatbot IA pour support client 24/7 avec escalade automatique',
      status: 'active',
      triggers: 5,
      executions: 234,
      lastRun: '2024-07-20T16:45:00Z',
      category: 'Customer Service',
      icon: '🎧',
      aiModel: 'Mistral'
    },
    {
      id: '4',
      name: 'Email Marketing Automatisé',
      description: 'Campagnes email personnalisées avec segmentation IA',
      status: 'active',
      triggers: 2,
      executions: 156,
      lastRun: '2024-07-20T12:00:00Z',
      category: 'Marketing',
      icon: '📧',
      aiModel: 'GPT-4'
    },
    {
      id: '5',
      name: 'Analytics Prédictives',
      description: 'Prédictions de tendances business avec ML avancé',
      status: 'draft',
      triggers: 1,
      executions: 23,
      lastRun: '2024-07-19T09:30:00Z',
      category: 'Analytics',
      icon: '📊',
      aiModel: 'Claude'
    }
  ],
  
  aiModels: [
    {
      id: 'gpt-4',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      description: 'Modèle de pointe pour la compréhension et génération de texte',
      strengths: ['Raisonnement', 'Créativité', 'Code'],
      pricePerToken: 0.03,
      maxTokens: 128000,
      status: 'active'
    },
    {
      id: 'claude',
      name: 'Claude Sonnet',
      provider: 'Anthropic',
      description: 'Excellence en analyse et sécurité, parfait pour les données sensibles',
      strengths: ['Analyse', 'Sécurité', 'Éthique'],
      pricePerToken: 0.025,
      maxTokens: 200000,
      status: 'active'
    },
    {
      id: 'mistral',
      name: 'Mistral Large',
      provider: 'Mistral AI',
      description: 'Modèle français optimisé pour les langues européennes',
      strengths: ['Multilingue', 'Rapidité', 'Coût'],
      pricePerToken: 0.02,
      maxTokens: 32000,
      status: 'active'
    }
  ],
  
  documents: [
    {
      id: '1',
      name: 'Facture_TechCorp_2024-07-001.pdf',
      type: 'invoice',
      status: 'processed',
      extractedData: {
        amount: 1250.00,
        currency: 'EUR',
        date: '2024-07-15',
        vendor: 'TechCorp SAS',
        items: ['Licence Pro', 'Support technique']
      },
      confidence: 0.96,
      processedAt: '2024-07-20T14:30:00Z'
    },
    {
      id: '2',
      name: 'Contrat_Service_2024.pdf',
      type: 'contract',
      status: 'processing',
      extractedData: null,
      confidence: null,
      processedAt: null
    },
    {
      id: '3',
      name: 'Rapport_Mensuel_Juin.pdf',
      type: 'report',
      status: 'failed',
      extractedData: null,
      confidence: null,
      processedAt: '2024-07-20T10:15:00Z',
      error: 'Document illisible'
    }
  ],
  
  leads: [
    {
      id: '1',
      name: 'Marie Dubois',
      email: 'marie.dubois@innovacorp.fr',
      company: 'InnovaCorp',
      phone: '+33 1 23 45 67 89',
      source: 'Website',
      score: 85,
      status: 'hot',
      lastActivity: '2024-07-20T16:30:00Z',
      predictedValue: 2500,
      aiInsights: [
        'Forte probabilité de conversion (85%)',
        'Intérêt pour les solutions d\'automatisation',
        'Budget estimé: 2000-3000€'
      ]
    },
    {
      id: '2',
      name: 'Pierre Martin',
      email: 'p.martin@startup-tech.com',
      company: 'StartupTech',
      phone: '+33 6 78 90 12 34',
      source: 'LinkedIn',
      score: 72,
      status: 'warm',
      lastActivity: '2024-07-20T14:15:00Z',
      predictedValue: 1800,
      aiInsights: [
        'Évaluation active de solutions',
        'Comparaison avec concurrents',
        'Décision prévue fin du mois'
      ]
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      email: 'sophie.laurent@sme-solutions.fr',
      company: 'SME Solutions',
      phone: '+33 2 34 56 78 90',
      source: 'Email Campaign',
      score: 45,
      status: 'cold',
      lastActivity: '2024-07-19T10:30:00Z',
      predictedValue: 800,
      aiInsights: [
        'Intérêt initial faible',
        'Besoin de nurturing',
        'Relance recommandée dans 2 semaines'
      ]
    }
  ],
  
  emailCampaigns: [
    {
      id: '1',
      name: 'Onboarding Nouveaux Clients',
      status: 'active',
      type: 'automated',
      recipients: 1250,
      openRate: 68.5,
      clickRate: 24.3,
      conversionRate: 8.7,
      revenue: 15750,
      steps: [
        { order: 1, subject: 'Bienvenue chez LeZelote-IA !', delay: 0 },
        { order: 2, subject: 'Votre premier workflow en 5 minutes', delay: 24 },
        { order: 3, subject: 'Découvrez nos intégrations', delay: 72 },
        { order: 4, subject: 'Besoin d\'aide ? Nous sommes là !', delay: 168 }
      ]
    },
    {
      id: '2',
      name: 'Réactivation Clients Inactifs',
      status: 'draft',
      type: 'one-time',
      recipients: 340,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      revenue: 0,
      steps: [
        { order: 1, subject: 'Nous vous avons manqué !', delay: 0 },
        { order: 2, subject: 'Offre spéciale retour', delay: 48 }
      ]
    }
  ],
  
  supportTickets: [
    {
      id: '1',
      subject: 'Problème avec l\'intégration Slack',
      status: 'open',
      priority: 'high',
      customer: 'Marie Dubois',
      email: 'marie.dubois@innovacorp.fr',
      category: 'Integration',
      aiSentiment: 'frustrated',
      aiSummary: 'Client frustré par l\'échec de l\'intégration Slack. Besoin d\'aide technique urgente.',
      aiSuggestedActions: [
        'Vérifier les permissions Slack',
        'Proposer un appel de support',
        'Escalader vers l\'équipe technique'
      ],
      createdAt: '2024-07-20T14:30:00Z',
      lastUpdate: '2024-07-20T16:15:00Z'
    },
    {
      id: '2',
      subject: 'Question sur la facturation',
      status: 'resolved',
      priority: 'medium',
      customer: 'Pierre Martin',
      email: 'p.martin@startup-tech.com',
      category: 'Billing',
      aiSentiment: 'neutral',
      aiSummary: 'Question standard sur la facturation. Résolue avec succès.',
      aiSuggestedActions: [],
      createdAt: '2024-07-19T10:00:00Z',
      lastUpdate: '2024-07-19T15:30:00Z'
    }
  ],
  
  apiEndpoints: [
    {
      id: '1',
      name: 'Webhook Lead Creation',
      method: 'POST',
      endpoint: '/api/webhooks/leads',
      status: 'active',
      calls: 1547,
      avgResponseTime: 120,
      errorRate: 2.1,
      lastUsed: '2024-07-20T16:45:00Z'
    },
    {
      id: '2',
      name: 'Document Processing',
      method: 'POST',
      endpoint: '/api/documents/process',
      status: 'active',
      calls: 89,
      avgResponseTime: 2500,
      errorRate: 5.6,
      lastUsed: '2024-07-20T14:20:00Z'
    },
    {
      id: '3',
      name: 'Analytics Export',
      method: 'GET',
      endpoint: '/api/analytics/export',
      status: 'active',
      calls: 234,
      avgResponseTime: 450,
      errorRate: 1.3,
      lastUsed: '2024-07-20T12:30:00Z'
    }
  ],
  
  workflowTemplates: [
    {
      id: '1',
      name: 'Lead Qualification IA',
      description: 'Qualification automatique des leads avec scoring IA',
      category: 'Lead Generation',
      icon: '🎯',
      difficulty: 'beginner',
      estimatedTime: 15,
      steps: [
        'Réception du lead',
        'Enrichissement des données',
        'Scoring IA',
        'Assignation commerciale'
      ],
      integrations: ['CRM', 'Email', 'IA'],
      downloads: 1250
    },
    {
      id: '2',
      name: 'Traitement Factures OCR',
      description: 'Extraction automatique de données depuis les factures',
      category: 'Document Processing',
      icon: '📄',
      difficulty: 'intermediate',
      estimatedTime: 30,
      steps: [
        'Upload document',
        'OCR extraction',
        'Validation données',
        'Intégration ERP'
      ],
      integrations: ['OCR', 'ERP', 'Email'],
      downloads: 890
    },
    {
      id: '3',
      name: 'Support Client IA',
      description: 'Chatbot intelligent pour support client 24/7',
      category: 'Customer Service',
      icon: '🎧',
      difficulty: 'advanced',
      estimatedTime: 45,
      steps: [
        'Configuration chatbot',
        'Entraînement IA',
        'Intégration canaux',
        'Escalade automatique'
      ],
      integrations: ['IA', 'Chat', 'CRM', 'Email'],
      downloads: 567
    }
  ],
  
  analytics: {
    overview: {
      totalWorkflows: 12,
      activeWorkflows: 8,
      totalExecutions: 1247,
      successRate: 94.2,
      timeSaved: 156,
      costSaved: 12450,
      aiTokensUsed: 2450000,
      documentsProcessed: 1580,
      leadsGenerated: 234,
      emailsSent: 15670
    },
    predictions: {
      nextMonthExecutions: 1850,
      predictedROI: 340,
      churnRisk: 15,
      growthRate: 28,
      optimalModel: 'GPT-4',
      recommendedActions: [
        'Augmenter le budget IA de 20%',
        'Optimiser les workflows de lead generation',
        'Améliorer la segmentation email'
      ]
    },
    charts: {
      executionsOverTime: [
        { date: '2024-07-01', executions: 89, tokens: 145000 },
        { date: '2024-07-02', executions: 145, tokens: 234000 },
        { date: '2024-07-03', executions: 123, tokens: 189000 },
        { date: '2024-07-04', executions: 167, tokens: 267000 },
        { date: '2024-07-05', executions: 198, tokens: 312000 },
        { date: '2024-07-06', executions: 178, tokens: 289000 },
        { date: '2024-07-07', executions: 156, tokens: 245000 }
      ],
      workflowsByCategory: [
        { category: 'Lead Generation', count: 4, color: '#667eea' },
        { category: 'Document Processing', count: 3, color: '#764ba2' },
        { category: 'Customer Service', count: 2, color: '#f093fb' },
        { category: 'Marketing', count: 3, color: '#f5576c' }
      ],
      aiModelUsage: [
        { model: 'GPT-4', usage: 45, cost: 1250 },
        { model: 'Claude', usage: 35, cost: 875 },
        { model: 'Mistral', usage: 20, cost: 400 }
      ]
    }
  },
  
  chatHistory: [
    {
      id: '1',
      message: 'Bonjour ! Je suis votre assistant IA multi-modèles. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'ai',
      timestamp: '2024-07-20T10:00:00Z',
      type: 'text',
      model: 'GPT-4'
    },
    {
      id: '2',
      message: 'Je veux créer un workflow pour analyser automatiquement les CV reçus',
      sender: 'user',
      timestamp: '2024-07-20T10:01:00Z',
      type: 'text'
    },
    {
      id: '3',
      message: 'Excellente idée ! Je vais vous aider à créer un workflow d\'analyse de CV avec OCR et IA. Voici ma recommandation :',
      sender: 'ai',
      timestamp: '2024-07-20T10:01:30Z',
      type: 'text',
      model: 'Claude'
    },
    {
      id: '4',
      message: 'workflow_suggestion',
      sender: 'ai',
      timestamp: '2024-07-20T10:01:31Z',
      type: 'workflow_suggestion',
      model: 'Claude',
      data: {
        name: 'Analyse CV Automatique',
        steps: [
          'Réception CV par email',
          'Extraction texte OCR',
          'Analyse compétences IA',
          'Scoring automatique',
          'Notification RH'
        ],
        aiModel: 'Claude',
        estimatedTime: 25
      }
    }
  ],
  
  integrations: [
    {
      id: '1',
      name: 'Gmail',
      description: 'Connectez votre compte Gmail pour l\'analyse d\'emails',
      status: 'connected',
      icon: '📧',
      category: 'Email',
      apiCalls: 1450,
      lastSync: '2024-07-20T16:30:00Z'
    },
    {
      id: '2',
      name: 'Slack',
      description: 'Intégration avec Slack pour les notifications',
      status: 'connected',
      icon: '💬',
      category: 'Communication',
      apiCalls: 890,
      lastSync: '2024-07-20T15:45:00Z'
    },
    {
      id: '3',
      name: 'Salesforce',
      description: 'Synchronisation avec votre CRM Salesforce',
      status: 'connected',
      icon: '⚡',
      category: 'CRM',
      apiCalls: 567,
      lastSync: '2024-07-20T14:20:00Z'
    },
    {
      id: '4',
      name: 'DocuSign',
      description: 'Signatures électroniques automatisées',
      status: 'available',
      icon: '✍️',
      category: 'Document',
      apiCalls: 0,
      lastSync: null
    },
    {
      id: '5',
      name: 'Stripe',
      description: 'Intégration pour les paiements et factures',
      status: 'available',
      icon: '💳',
      category: 'Finance',
      apiCalls: 0,
      lastSync: null
    }
  ],
  
  security: {
    activities: [
      {
        id: '1',
        action: 'Login',
        user: 'jean.dupont@example.com',
        ip: '192.168.1.100',
        location: 'Paris, France',
        timestamp: '2024-07-20T16:30:00Z',
        status: 'success'
      },
      {
        id: '2',
        action: 'API Key Generated',
        user: 'jean.dupont@example.com',
        ip: '192.168.1.100',
        location: 'Paris, France',
        timestamp: '2024-07-20T14:15:00Z',
        status: 'success'
      },
      {
        id: '3',
        action: 'Failed Login',
        user: 'unknown@example.com',
        ip: '45.123.456.789',
        location: 'Unknown',
        timestamp: '2024-07-20T12:30:00Z',
        status: 'blocked'
      }
    ],
    apiKeys: [
      {
        id: '1',
        name: 'Production API',
        key: 'lz_prod_1234567890abcdef',
        permissions: ['read', 'write'],
        lastUsed: '2024-07-20T16:45:00Z',
        calls: 15670,
        status: 'active'
      },
      {
        id: '2',
        name: 'Development API',
        key: 'lz_dev_abcdef1234567890',
        permissions: ['read'],
        lastUsed: '2024-07-19T10:30:00Z',
        calls: 234,
        status: 'active'
      }
    ]
  }
};