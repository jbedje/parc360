import React, { useEffect, useState } from 'react';
import { reportService } from '../services/api';
import {
  TruckIcon,
  CheckCircleIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  BeakerIcon,
  MapPinIcon,
  DocumentCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

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

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await reportService.getDashboard();
      setData(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-cipme-orange border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-cipme-gray">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4 text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />
          <p className="text-lg font-semibold text-red-600">Erreur de chargement des données</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 text-sm font-medium text-white bg-cipme-orange rounded-lg hover:bg-cipme-orange-dark transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ElementType;
    gradient: string;
    bgGradient: string;
    iconColor: string;
    subtitle?: string;
    trend?: 'up' | 'down';
    trendValue?: string;
  }> = ({ title, value, icon: Icon, gradient, bgGradient, iconColor, subtitle, trend, trendValue }) => (
    <div className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group`}>
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">{title}</p>
            <p className="text-4xl font-black text-white mt-3 mb-2">{value.toLocaleString('fr-FR')}</p>
            {subtitle && (
              <p className="text-xs font-medium text-white/70">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center mt-2 space-x-1">
                {trend === 'up' ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-white" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-white" />
                )}
                <span className="text-xs font-semibold text-white">{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-7 h-7 ${iconColor}`} />
          </div>
        </div>
      </div>
    </div>
  );

  const AlertCard: React.FC<{
    icon: React.ElementType;
    title: string;
    description: string;
    bgColor: string;
    borderColor: string;
    iconColor: string;
  }> = ({ icon: Icon, title, description, bgColor, borderColor, iconColor }) => (
    <div className={`flex items-start p-4 ${bgColor} border-l-4 ${borderColor} rounded-lg hover:shadow-md transition-shadow`}>
      <div className={`flex-shrink-0 w-10 h-10 ${iconColor} bg-white rounded-lg flex items-center justify-center`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="ml-4 flex-1">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-cipme-charcoal to-cipme-gray bg-clip-text text-transparent">
            Tableau de Bord
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Vue d'ensemble de votre parc automobile
          </p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Aujourd'hui</p>
          <p className="text-sm font-bold text-cipme-orange mt-1">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Véhicules Total"
          value={data.vehicules.total}
          icon={TruckIcon}
          gradient="from-cipme-orange to-cipme-orange-dark"
          bgGradient="from-cipme-orange to-cipme-orange-dark"
          iconColor="text-white"
          subtitle="Parc automobile"
        />
        <StatCard
          title="Disponibles"
          value={data.vehicules.disponibles}
          icon={CheckCircleIcon}
          gradient="from-cipme-green to-cipme-green-dark"
          bgGradient="from-cipme-green to-cipme-green-dark"
          iconColor="text-white"
          subtitle="Prêts à l'emploi"
        />
        <StatCard
          title="Conducteurs"
          value={data.conducteurs.total}
          icon={UserGroupIcon}
          gradient="from-cipme-ivory to-cipme-ivory-dark"
          bgGradient="from-cipme-ivory to-cipme-ivory-dark"
          iconColor="text-white"
          subtitle="Actifs"
        />
        <StatCard
          title="Maintenances"
          value={data.maintenances.enCours}
          icon={WrenchScrewdriverIcon}
          gradient="from-cipme-charcoal to-cipme-gray"
          bgGradient="from-cipme-charcoal to-cipme-gray"
          iconColor="text-white"
          subtitle="En cours"
        />
      </div>

      {/* Fleet Status & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Cards */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-cipme-orange to-cipme-ivory rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-900">En Service</h2>
          </div>
          <p className="text-4xl font-black text-cipme-orange">{data.vehicules.enService}</p>
          <p className="text-sm text-gray-500 mt-2">Véhicules actuellement utilisés</p>
          <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cipme-orange to-cipme-ivory h-2 rounded-full transition-all duration-500"
              style={{ width: `${(data.vehicules.enService / data.vehicules.total) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-900">En Maintenance</h2>
          </div>
          <p className="text-4xl font-black text-yellow-600">{data.vehicules.enMaintenance}</p>
          <p className="text-sm text-gray-500 mt-2">Véhicules en réparation</p>
          <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(data.vehicules.enMaintenance / data.vehicules.total) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-700 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-900">Documents Expirant</h2>
          </div>
          <p className="text-4xl font-black text-red-600">{data.documents.expirant}</p>
          <p className="text-sm text-gray-500 mt-2">À renouveler rapidement</p>
          {data.documents.expirant > 0 && (
            <div className="mt-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs font-semibold text-red-700">Action requise</p>
            </div>
          )}
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-cipme-orange to-cipme-ivory rounded-xl flex items-center justify-center">
            <BanknotesIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dépenses du Mois</h2>
            <p className="text-sm text-gray-500">Analyse financière en temps réel</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-cipme-orange to-cipme-orange-dark p-6 rounded-2xl shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <BanknotesIcon className="w-8 h-8 text-white/80 mb-3" />
            <p className="text-sm font-semibold text-white/90 uppercase tracking-wide">Total</p>
            <p className="text-3xl font-black text-white mt-2">
              {data.finances.depensesMois.toLocaleString('fr-FR')}
            </p>
            <p className="text-sm font-medium text-white/80 mt-1">FCFA</p>
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <WrenchScrewdriverIcon className="w-8 h-8 text-white/80 mb-3" />
            <p className="text-sm font-semibold text-white/90 uppercase tracking-wide">Maintenance</p>
            <p className="text-3xl font-black text-white mt-2">
              {data.finances.depensesMaintenance.toLocaleString('fr-FR')}
            </p>
            <p className="text-sm font-medium text-white/80 mt-1">FCFA</p>
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-cipme-green to-cipme-green-dark p-6 rounded-2xl shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <BeakerIcon className="w-8 h-8 text-white/80 mb-3" />
            <p className="text-sm font-semibold text-white/90 uppercase tracking-wide">Carburant</p>
            <p className="text-3xl font-black text-white mt-2">
              {data.finances.depensesCarburant.toLocaleString('fr-FR')}
            </p>
            <p className="text-sm font-medium text-white/80 mt-1">FCFA</p>
          </div>
        </div>
      </div>

      {/* Alerts & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <ExclamationTriangleIcon className="w-6 h-6 text-cipme-orange" />
            <h2 className="text-xl font-bold text-gray-900">Alertes et Notifications</h2>
          </div>
          <div className="space-y-4">
            {data.documents.expirant > 0 && (
              <AlertCard
                icon={DocumentCheckIcon}
                title={`${data.documents.expirant} document(s) à renouveler`}
                description="Vérifiez les documents expirant bientôt"
                bgColor="bg-red-50"
                borderColor="border-red-500"
                iconColor="text-red-600"
              />
            )}
            {data.maintenances.enCours > 0 && (
              <AlertCard
                icon={WrenchScrewdriverIcon}
                title={`${data.maintenances.enCours} maintenance(s) en cours`}
                description="Véhicules actuellement en réparation"
                bgColor="bg-orange-50"
                borderColor="border-orange-500"
                iconColor="text-orange-600"
              />
            )}
            {data.trajets.enCours > 0 && (
              <AlertCard
                icon={MapPinIcon}
                title={`${data.trajets.enCours} trajet(s) en cours`}
                description="Déplacements actuellement actifs"
                bgColor="bg-blue-50"
                borderColor="border-blue-500"
                iconColor="text-blue-600"
              />
            )}
            {data.documents.expirant === 0 && data.maintenances.enCours === 0 && data.trajets.enCours === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircleIcon className="w-16 h-16 text-cipme-green mb-3" />
                <p className="text-sm font-semibold text-gray-700">Aucune alerte active</p>
                <p className="text-xs text-gray-500 mt-1">Tout fonctionne correctement</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <ChartBarIcon className="w-6 h-6 text-cipme-orange" />
            <h2 className="text-xl font-bold text-gray-900">Statistiques Rapides</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cipme-green/10 to-transparent rounded-xl border border-cipme-green/20">
              <div>
                <span className="text-sm font-medium text-gray-700">Taux de disponibilité</span>
                <p className="text-xs text-gray-500 mt-1">Véhicules disponibles / Total</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-cipme-green">
                  {((data.vehicules.disponibles / data.vehicules.total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cipme-orange/10 to-transparent rounded-xl border border-cipme-orange/20">
              <div>
                <span className="text-sm font-medium text-gray-700">Véhicules par conducteur</span>
                <p className="text-xs text-gray-500 mt-1">Ratio moyen</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-cipme-orange">
                  {(data.vehicules.total / data.conducteurs.total).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cipme-ivory/10 to-transparent rounded-xl border border-cipme-ivory/20">
              <div>
                <span className="text-sm font-medium text-gray-700">Dépenses moyennes/véhicule</span>
                <p className="text-xs text-gray-500 mt-1">Ce mois-ci</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-cipme-ivory">
                  {(data.finances.depensesMois / data.vehicules.total).toLocaleString('fr-FR', {
                    maximumFractionDigits: 0,
                  })}
                </span>
                <p className="text-xs text-gray-500">FCFA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
