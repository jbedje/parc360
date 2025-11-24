import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChartBarIcon,
  TruckIcon,
  BanknotesIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardData {
  vehicules: {
    total: number;
    disponibles: number;
    enService: number;
    enMaintenance: number;
  };
  conducteurs: {
    total: number;
  };
  maintenances: {
    enCours: number;
  };
  trajets: {
    enCours: number;
  };
  documents: {
    expirant: number;
  };
  finances: {
    depensesMois: number;
    depensesMaintenance: number;
    depensesCarburant: number;
  };
}

const COLORS = {
  orange: '#ED6D11',
  green: '#009E60',
  blue: '#3B82F6',
  yellow: '#F7931E',
  red: '#EF4444',
  gray: '#6B7280',
};

const Analytics: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
    generateMonthlyData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reports/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setLoading(false);
    }
  };

  const generateMonthlyData = () => {
    // Generate sample monthly data for demonstration
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    const monthlyStats = months.map((month, index) => ({
      month,
      maintenance: Math.floor(Math.random() * 500000) + 300000,
      carburant: Math.floor(Math.random() * 800000) + 400000,
      total: 0,
    }));
    monthlyStats.forEach((stat) => {
      stat.total = stat.maintenance + stat.carburant;
    });
    setMonthlyData(monthlyStats);
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cipme-orange"></div>
      </div>
    );
  }

  const vehicleStatusData = [
    { name: 'Disponibles', value: data.vehicules.disponibles, color: COLORS.green },
    { name: 'En Service', value: data.vehicules.enService, color: COLORS.blue },
    { name: 'En Maintenance', value: data.vehicules.enMaintenance, color: COLORS.yellow },
  ];

  const maintenanceData = [
    { name: 'En Cours', value: data.maintenances.enCours, color: COLORS.orange },
    { name: 'Trajets en Cours', value: data.trajets.enCours, color: COLORS.blue },
    { name: 'Docs Expirants', value: data.documents.expirant, color: COLORS.red },
  ];

  const costsData = [
    { name: 'Maintenance', value: data.finances.depensesMaintenance, color: COLORS.orange },
    { name: 'Carburant', value: data.finances.depensesCarburant, color: COLORS.blue },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-800 flex items-center">
          <ChartBarIcon className="w-8 h-8 mr-3 text-cipme-orange" />
          Tableau de Bord Analytique
        </h1>
        <p className="text-gray-600 mt-1">Visualisations et statistiques détaillées</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-cipme-orange to-cipme-orange-dark rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <TruckIcon className="w-8 h-8 text-white/80 mb-2" />
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">
            Total Véhicules
          </p>
          <p className="text-4xl font-black text-white mt-3">{data.vehicules.total}</p>
        </div>
        <div className="bg-gradient-to-br from-cipme-green to-cipme-green-dark rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <BeakerIcon className="w-8 h-8 text-white/80 mb-2" />
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">
            Carburant
          </p>
          <p className="text-2xl font-black text-white mt-3">
            {(data.finances.depensesCarburant / 1000).toLocaleString()}K F
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <WrenchScrewdriverIcon className="w-8 h-8 text-white/80 mb-2" />
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">
            Maintenances
          </p>
          <p className="text-4xl font-black text-white mt-3">{data.maintenances.enCours}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <BanknotesIcon className="w-8 h-8 text-white/80 mb-2" />
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Dépenses Mois</p>
          <p className="text-2xl font-black text-white mt-3">
            {(data.finances.depensesMois / 1000000).toFixed(1)}M F
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Status Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-cipme-orange rounded-full mr-3"></div>
            Statut des Véhicules
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {vehicleStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Costs Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-cipme-orange rounded-full mr-3"></div>
            Répartition des Coûts
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => `${value.toLocaleString()} FCFA`} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {costsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Costs Trend */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-cipme-orange rounded-full mr-3"></div>
            Évolution Mensuelle des Coûts
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.orange} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => `${value.toLocaleString()} FCFA`} />
              <Area
                type="monotone"
                dataKey="total"
                stroke={COLORS.orange}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-cipme-orange rounded-full mr-3"></div>
            État des Maintenances
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={maintenanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {maintenanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Breakdown Line Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-1 h-6 bg-cipme-orange rounded-full mr-3"></div>
          Analyse Mensuelle Détaillée (Maintenance vs Carburant)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: any) => `${value.toLocaleString()} FCFA`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="maintenance"
              stroke={COLORS.orange}
              strokeWidth={3}
              name="Maintenance"
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="carburant"
              stroke={COLORS.blue}
              strokeWidth={3}
              name="Carburant"
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-l-4 border-cipme-orange">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
            Total Conducteurs
          </p>
          <p className="text-3xl font-black text-gray-900">
            {data.conducteurs.total}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-l-4 border-cipme-green">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
            Documents Expirants
          </p>
          <p className="text-3xl font-black text-gray-900">
            {data.documents.expirant}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-l-4 border-blue-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
            Véhicules Disponibles
          </p>
          <p className="text-3xl font-black text-gray-900">
            {data.vehicules.total > 0 ? ((data.vehicules.disponibles / data.vehicules.total) * 100).toFixed(0) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
