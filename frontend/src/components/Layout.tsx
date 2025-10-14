import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Tableau de bord', path: '/', icon: '📊' },
    { name: 'Véhicules', path: '/vehicles', icon: '🚗' },
    { name: 'Conducteurs', path: '/drivers', icon: '👤' },
    { name: 'Maintenance', path: '/maintenance', icon: '🔧' },
    { name: 'Carburant', path: '/fuel', icon: '⛽' },
    { name: 'Trajets', path: '/trips', icon: '🗺️' },
    { name: 'Documents', path: '/documents', icon: '📄' },
    { name: 'Rapports', path: '/reports', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-gray-900 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen && (
            <h1 className="text-2xl font-bold text-primary-400">PARC360</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="mt-6">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Gestion du Parc Auto
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
