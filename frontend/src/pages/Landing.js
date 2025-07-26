import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Brain, 
  Zap, 
  Users, 
  TrendingUp, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  Play,
  Star,
  ChevronRight
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let result;
      if (isLoginMode) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData);
      }
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        alert(result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      alert('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'Intelligence Artificielle Avancée',
      description: 'Powered by GPT-4 et Mistral pour une compréhension contextuelle parfaite'
    },
    {
      icon: Zap,
      title: 'Automatisation Intelligente',
      description: 'Automatisez vos processus métier avec des workflows intelligents'
    },
    {
      icon: Users,
      title: 'Collaboration d\'Équipe',
      description: 'Travaillez ensemble efficacement avec des outils collaboratifs'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Prédictives',
      description: 'Analysez vos données et anticipez les tendances futures'
    },
    {
      icon: Shield,
      title: 'Sécurité Enterprise',
      description: 'Sécurité de niveau entreprise avec conformité RGPD'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      role: 'CEO, TechStart',
      content: 'LeZelote-IA a transformé notre productivité. Nous avons économisé 40% de temps sur nos processus.',
      rating: 5
    },
    {
      name: 'Pierre Martin',
      role: 'CTO, InnovaCorp',
      content: 'La meilleure solution d\'automatisation que j\'ai testée. Interface intuitive et résultats exceptionnels.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="animate-slide-in">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">L</span>
                </div>
                <span className="text-3xl font-bold text-white">LeZelote-IA</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Automatisation <br />
                <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Intelligente
                </span>
                <br />
                pour PME
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Transformez votre entreprise avec notre plateforme d'automatisation IA. 
                Économisez du temps, réduisez les coûts et boostez votre productivité.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => setIsLoginMode(false)}
                  className="gradient-button flex items-center justify-center space-x-2 text-lg px-8 py-4 hover-lift"
                >
                  <span>Commencer gratuitement</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Voir la démo</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>14 jours gratuits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Sans engagement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Support 24/7</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Login Form */}
            <div className="animate-fade-in">
              <div className="glass-morphism p-8 rounded-2xl">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {isLoginMode ? 'Connexion' : 'Inscription'}
                  </h2>
                  <p className="text-gray-300">
                    {isLoginMode ? 'Connectez-vous à votre compte' : 'Créez votre compte gratuitement'}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLoginMode && (
                    <>
                      <input
                        type="text"
                        placeholder="Nom complet"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Entreprise"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        required
                      />
                    </>
                  )}
                  
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    required
                  />
                  
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    required
                  />
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-button py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                  >
                    {loading ? 'Chargement...' : (isLoginMode ? 'Se connecter' : 'Créer le compte')}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    {isLoginMode ? 'Pas de compte ? Inscrivez-vous' : 'Déjà inscrit ? Connectez-vous'}
                  </button>
                </div>
                
                {isLoginMode && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-400">
                      Demo: jean.dupont@example.com / password
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir LeZelote-IA ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre plateforme combine l'intelligence artificielle de pointe avec une interface intuitive 
              pour révolutionner votre façon de travailler.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group hover-lift neumorphism p-8 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-morphism p-8 rounded-2xl hover-lift">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-lg italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;