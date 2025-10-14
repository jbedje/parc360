import React, { useEffect, useState } from 'react';
import { reportService } from '../services/api';

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
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erreur de chargement des données</div>
      </div>
    );
  }

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: string;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Véhicules Total"
          value={data.vehicules.total}
          icon="🚗"
          color="border-blue-500"
        />
        <StatCard
          title="Véhicules Disponibles"
          value={data.vehicules.disponibles}
          icon="✅"
          color="border-green-500"
        />
        <StatCard
          title="Conducteurs Actifs"
          value={data.conducteurs.total}
          icon="👤"
          color="border-purple-500"
        />
        <StatCard
          title="Maintenances en Cours"
          value={data.maintenances.enCours}
          icon="🔧"
          color="border-orange-500"
        />
      </div>

      {/* État du parc */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Véhicules en Service"
          value={data.vehicules.enService}
          icon="🚙"
          color="border-blue-500"
          subtitle="Actuellement utilisés"
        />
        <StatCard
          title="Véhicules en Maintenance"
          value={data.vehicules.enMaintenance}
          icon="🔧"
          color="border-yellow-500"
          subtitle="En réparation"
        />
        <StatCard
          title="Documents Expirant"
          value={data.documents.expirant}
          icon="⚠️"
          color="border-red-500"
          subtitle="À renouveler"
        />
      </div>

      {/* Finances */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Dépenses du Mois
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {data.finances.depensesMois.toLocaleString('fr-FR')} FCFA
            </p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Maintenance</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {data.finances.depensesMaintenance.toLocaleString('fr-FR')} FCFA
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Carburant</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {data.finances.depensesCarburant.toLocaleString('fr-FR')} FCFA
            </p>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Alertes et Notifications
          </h2>
          <div className="space-y-3">
            {data.documents.expirant > 0 && (
              <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded">
                <span className="text-xl mr-3">⚠️</span>
                <div>
                  <p className="font-medium text-red-900">
                    {data.documents.expirant} document(s) à renouveler
                  </p>
                  <p className="text-sm text-red-700">
                    Vérifiez les documents expirant bientôt
                  </p>
                </div>
              </div>
            )}
            {data.maintenances.enCours > 0 && (
              <div className="flex items-start p-3 bg-orange-50 border border-orange-200 rounded">
                <span className="text-xl mr-3">🔧</span>
                <div>
                  <p className="font-medium text-orange-900">
                    {data.maintenances.enCours} maintenance(s) en cours
                  </p>
                  <p className="text-sm text-orange-700">
                    Véhicules actuellement en réparation
                  </p>
                </div>
              </div>
            )}
            {data.trajets.enCours > 0 && (
              <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded">
                <span className="text-xl mr-3">🗺️</span>
                <div>
                  <p className="font-medium text-blue-900">
                    {data.trajets.enCours} trajet(s) en cours
                  </p>
                  <p className="text-sm text-blue-700">
                    Déplacements actuellement actifs
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Statistiques Rapides
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Taux de disponibilité</span>
              <span className="text-lg font-bold text-green-600">
                {((data.vehicules.disponibles / data.vehicules.total) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Véhicules par conducteur</span>
              <span className="text-lg font-bold text-blue-600">
                {(data.vehicules.total / data.conducteurs.total).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Dépenses moyennes/véhicule</span>
              <span className="text-lg font-bold text-orange-600">
                {(data.finances.depensesMois / data.vehicules.total).toLocaleString('fr-FR', {
                  maximumFractionDigits: 0,
                })}{' '}
                FCFA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
