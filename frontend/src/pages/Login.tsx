import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cipme-orange via-cipme-orange-dark to-cipme-charcoal relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cipme-ivory/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-cipme-green/10 rounded-full blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                <TruckIcon className="w-10 h-10 text-cipme-orange" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight">PARC360</h1>
                <p className="text-lg font-semibold text-white/90 mt-1">Gestion du Parc Auto</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Suivi en temps réel</h3>
                <p className="text-white/80 text-sm">Gérez l'ensemble de votre flotte automobile depuis une interface intuitive</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Optimisation des coûts</h3>
                <p className="text-white/80 text-sm">Suivez les dépenses de maintenance, carburant et réduisez vos coûts</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Rapports détaillés</h3>
                <p className="text-white/80 text-sm">Analysez les performances avec des rapports complets et exportables</p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2">
                <img src="/cipme-logo.png" alt="CI-PME Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="font-bold text-lg">Côte d'Ivoire PME</p>
                <p className="text-white/70 text-sm font-medium">Accompagner l'avenir</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cipme-orange to-cipme-orange-dark rounded-2xl shadow-lg mb-4">
              <TruckIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-cipme-charcoal">PARC360</h1>
            <p className="text-sm font-semibold text-cipme-orange mt-1">Côte d'Ivoire PME</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-cipme-charcoal mb-2">Connexion</h2>
              <p className="text-sm text-gray-600">Accédez à votre tableau de bord</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
                <ExclamationCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Erreur de connexion</p>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cipme-orange focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cipme-orange focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-cipme-orange to-cipme-orange-dark hover:shadow-cipme-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cipme-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} PARC360 - Côte d'Ivoire PME. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
