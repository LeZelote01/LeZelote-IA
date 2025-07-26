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
      name: 'Analyse de Prospects',
      description: 'Analyse automatique des prospects entrants avec scoring IA',
      status: 'active',
      triggers: 3,
      executions: 127,
      lastRun: '2024-07-20T14:30:00Z',
      category: 'Sales',
      icon: '🎯'
    },
    {
      id: '2',
      name: 'Rapport Financier Mensuel',
      description: 'Génération automatique des rapports financiers mensuels',
      status: 'active',
      triggers: 1,
      executions: 12,
      lastRun: '2024-07-01T09:00:00Z',
      category: 'Finance',
      icon: '📊'
    },
    {
      id: '3',
      name: 'Support Client Automatisé',
      description: 'Réponses automatiques aux questions fréquentes',
      status: 'draft',
      triggers: 5,
      executions: 0,
      lastRun: null,
      category: 'Support',
      icon: '🎧'
    }
  ],
  
  analytics: {
    overview: {
      totalWorkflows: 12,
      activeWorkflows: 8,
      totalExecutions: 1247,
      successRate: 94.2,
      timeSaved: 156,
      costSaved: 12450
    },
    charts: {
      executionsOverTime: [
        { date: '2024-07-01', executions: 89 },
        { date: '2024-07-02', executions: 145 },
        { date: '2024-07-03', executions: 123 },
        { date: '2024-07-04', executions: 167 },
        { date: '2024-07-05', executions: 198 },
        { date: '2024-07-06', executions: 178 },
        { date: '2024-07-07', executions: 156 }
      ],
      workflowsByCategory: [
        { category: 'Sales', count: 4, color: '#667eea' },
        { category: 'Finance', count: 3, color: '#764ba2' },
        { category: 'Support', count: 2, color: '#f093fb' },
        { category: 'Marketing', count: 3, color: '#f5576c' }
      ]
    }
  },
  
  chatHistory: [
    {
      id: '1',
      message: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      sender: 'ai',
      timestamp: '2024-07-20T10:00:00Z',
      type: 'text'
    },
    {
      id: '2',
      message: 'Je veux créer un workflow pour analyser mes emails entrants',
      sender: 'user',
      timestamp: '2024-07-20T10:01:00Z',
      type: 'text'
    },
    {
      id: '3',
      message: 'Parfait ! Je vais vous aider à créer un workflow d\'analyse d\'emails. Voici les étapes recommandées :',
      sender: 'ai',
      timestamp: '2024-07-20T10:01:30Z',
      type: 'text'
    },
    {
      id: '4',
      message: 'workflow_suggestion',
      sender: 'ai',
      timestamp: '2024-07-20T10:01:31Z',
      type: 'workflow_suggestion',
      data: {
        name: 'Analyse d\'emails entrants',
        steps: [
          'Connexion à votre boîte email',
          'Classification automatique des emails',
          'Extraction des informations clés',
          'Génération de rapports'
        ]
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
      category: 'Email'
    },
    {
      id: '2',
      name: 'Slack',
      description: 'Intégration avec Slack pour les notifications',
      status: 'connected',
      icon: '💬',
      category: 'Communication'
    },
    {
      id: '3',
      name: 'Google Drive',
      description: 'Accès aux fichiers Google Drive',
      status: 'available',
      icon: '📁',
      category: 'Storage'
    },
    {
      id: '4',
      name: 'Stripe',
      description: 'Intégration pour les paiements et factures',
      status: 'available',
      icon: '💳',
      category: 'Finance'
    }
  ]
};