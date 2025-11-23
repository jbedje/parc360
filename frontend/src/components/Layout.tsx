import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  TruckIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  MapPinIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Tableau de bord', path: '/', icon: HomeIcon },
    { name: 'Véhicules', path: '/vehicles', icon: TruckIcon },
    { name: 'Conducteurs', path: '/drivers', icon: UserGroupIcon },
    { name: 'Maintenance', path: '/maintenance', icon: WrenchScrewdriverIcon },
    { name: 'Carburant', path: '/fuel', icon: BeakerIcon },
    { name: 'Trajets', path: '/trips', icon: MapPinIcon },
    { name: 'Documents', path: '/documents', icon: DocumentTextIcon },
    { name: 'Rapports', path: '/reports', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-cipme-charcoal to-cipme-gray text-white transition-all duration-300 shadow-2xl ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Logo & Brand Header */}
        <div className="relative px-6 py-5 border-b border-white/10 bg-gradient-to-r from-cipme-orange to-cipme-orange-dark">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-lg">
                  <span className="text-2xl font-black text-cipme-orange">P</span>
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-white">PARC360</h1>
                  <p className="text-xs font-medium text-white/80">Côte d'Ivoire PME</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-10 h-10 mx-auto bg-white rounded-lg shadow-lg">
                <span className="text-xl font-black text-cipme-orange">P</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {sidebarOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
          </div>
          {sidebarOpen && (
            <div className="mt-3 text-xs font-semibold text-white/60 uppercase tracking-wide">
              Accompagner l'avenir
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="px-3 mt-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cipme-orange to-cipme-orange-dark text-white shadow-cipme'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-cipme-orange'} transition-colors`} />
                {sidebarOpen && (
                  <span className="ml-4 font-medium">{item.name}</span>
                )}
                {isActive && sidebarOpen && (
                  <div className="w-1.5 h-1.5 ml-auto bg-white rounded-full shadow-lg animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-cipme-gray">
            <div className="flex items-center space-x-3 px-3 py-2 bg-white/5 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-cipme-orange rounded-full text-white font-bold text-sm">
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-72' : 'ml-20'
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-8 bg-gradient-to-b from-cipme-orange to-cipme-ivory rounded-full"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cipme-charcoal to-cipme-gray bg-clip-text text-transparent">
                  Gestion du Parc Auto
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs font-medium text-cipme-orange capitalize">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cipme-orange to-cipme-orange-dark rounded-lg hover:shadow-cipme-lg transition-all duration-200 group"
              >
                <span>Déconnexion</span>
                <ArrowRightOnRectangleIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="mt-12 py-6 px-8 bg-cipme-gray text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cipme-orange rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold">CI</span>
              </div>
              <div>
                <p className="text-sm font-semibold">Côte d'Ivoire PME</p>
                <p className="text-xs text-gray-400">Accompagner l'avenir</p>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              © {new Date().getFullYear()} PARC360 - Tous droits réservés
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
