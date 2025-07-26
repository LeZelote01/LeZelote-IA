import React, { useState, useRef, useEffect } from 'react';
import { mockData } from '../data/mockData';
import { 
  Send, 
  Bot, 
  User, 
  Paperclip, 
  MoreHorizontal,
  Sparkles,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Trash2
} from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState(mockData.chatHistory);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        message: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const responses = [
      "Je comprends votre demande. Laissez-moi vous expliquer comment vous pouvez automatiser ce processus avec LeZelote-IA.",
      "Excellente question ! Voici comment nous pouvons optimiser votre workflow pour gagner du temps et améliorer l'efficacité.",
      "Je peux vous aider à créer un workflow personnalisé pour cette tâche. Voici les étapes que je recommande :",
      "Parfait ! Cette automatisation peut vous faire économiser beaucoup de temps. Voici comment procéder :",
      "Je vais vous guider dans la création d'un workflow intelligent pour répondre à vos besoins spécifiques."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleClearChat = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer toute la conversation ?')) {
      setMessages([]);
    }
  };

  const handleCopyMessage = (message) => {
    navigator.clipboard.writeText(message);
    // You could add a toast notification here
  };

  const WorkflowSuggestion = ({ data }) => (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 my-4">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{data.name}</h4>
          <div className="space-y-2">
            {data.steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-purple-600">{index + 1}</span>
                </div>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex space-x-2">
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
              Créer ce workflow
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              Personnaliser
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';
    const [showActions, setShowActions] = useState(false);

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex items-start space-x-3 max-w-4xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}>
            {isUser ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>
          
          <div className="flex-1">
            <div className={`relative group ${isUser ? 'text-right' : 'text-left'}`}>
              <div
                className={`inline-block px-4 py-3 rounded-2xl ${
                  isUser
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                } shadow-lg`}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
              >
                {message.type === 'workflow_suggestion' ? (
                  <WorkflowSuggestion data={message.data} />
                ) : (
                  <p className="text-sm leading-relaxed">{message.message}</p>
                )}
                
                {showActions && !isUser && (
                  <div className="absolute right-2 top-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleCopyMessage(message.message)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100 transition-colors duration-200">
                      <ThumbsUp className="w-3 h-3 text-gray-500" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100 transition-colors duration-200">
                      <ThumbsDown className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-lg">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const quickActions = [
    "Comment créer un workflow ?",
    "Intégrer Gmail à mon workspace",
    "Analyser mes données de vente",
    "Automatiser mes rapports",
    "Configurer des notifications Slack"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chat Assistant IA
            </h1>
            <p className="text-gray-600">
              Posez vos questions et obtenez de l'aide pour vos automatisations
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMessages([])}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={handleClearChat}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Trash2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Bonjour ! Je suis votre assistant IA
                </h3>
                <p className="text-gray-600 mb-6">
                  Comment puis-je vous aider aujourd'hui ?
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(action)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors duration-200"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}
            
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isTyping}
                />
              </div>
              
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;