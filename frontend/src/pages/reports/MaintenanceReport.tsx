import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/api';
import { Link } from 'react-router-dom';

const MaintenanceReport: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ dateDebut: '', dateFin: '', type: '' });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.dateDebut) params.dateDebut = filters.dateDebut;
      if (filters.dateFin) params.dateFin = filters.dateFin;
      if (filters.type) params.type = filters.type;

      const response = await reportService.getMaintenance(params);
      setReportData(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    loadReport();
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      preventive: 'Préventive',
      corrective: 'Corrective',
      inspection: 'Inspection',
      reparation: 'Réparation',
    };
    return labels[type] || type;
  };

  const getStatutLabel = (statut: string) => {
    const labels: { [key: string]: string } = {
      planifie: 'Planifié',
      en_cours: 'En Cours',
      termine: 'Terminé',
      annule: 'Annulé',
    };
    return labels[statut] || statut;
  };

  const getStatutColor = (statut: string) => {
    const colors: { [key: string]: string } = {
      planifie: 'bg-blue-100 text-blue-800',
      en_cours: 'bg-yellow-100 text-yellow-800',
      termine: 'bg-green-100 text-green-800',
      annule: 'bg-red-100 text-red-800',
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Aucune donnée disponible</div>
      </div>
    );
  }

  const stats = reportData.stats || { total: 0, coutTotal: 0, moyenneCout: 0, parType: {}, parStatut: {} };
  const maintenances = Array.isArray(reportData.maintenances) ? reportData.maintenances : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/reports" className="text-primary-600 hover:text-primary-700 flex items-center mb-2">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux rapports
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Rapport Maintenance</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Début</label>
            <input
              type="date"
              value={filters.dateDebut}
              onChange={(e) => setFilters({ ...filters, dateDebut: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Fin</label>
            <input
              type="date"
              value={filters.dateFin}
              onChange={(e) => setFilters({ ...filters, dateFin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les types</option>
              <option value="preventive">Préventive</option>
              <option value="corrective">Corrective</option>
              <option value="inspection">Inspection</option>
              <option value="reparation">Réparation</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFilter}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Total Maintenances</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Coût Total</div>
          <div className="text-2xl font-bold text-gray-900">{stats.coutTotal.toLocaleString()} FCFA</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Coût Moyen</div>
          <div className="text-2xl font-bold text-gray-900">{stats.moyenneCout.toLocaleString()} FCFA</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Types Différents</div>
          <div className="text-2xl font-bold text-gray-900">{Object.keys(stats.parType || {}).length}</div>
        </div>
      </div>

      {/* Stats by Type */}
      {stats.parType && Object.keys(stats.parType).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Répartition par Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.parType).map(([type, count]: [string, any]) => (
              <div key={type} className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">{getTypeLabel(type)}</div>
                <div className="text-xl font-bold text-gray-900">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats by Status */}
      {stats.parStatut && Object.keys(stats.parStatut).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Répartition par Statut</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.parStatut).map(([statut, count]: [string, any]) => (
              <div key={statut} className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">{getStatutLabel(statut)}</div>
                <div className="text-xl font-bold text-gray-900">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Véhicule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Début</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Fin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coût</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Aucune maintenance trouvée
                  </td>
                </tr>
              ) : (
                maintenances.map((maintenance: any) => (
                  <tr key={maintenance._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {maintenance.vehicule?.marque} {maintenance.vehicule?.modele}
                      </div>
                      <div className="text-sm text-gray-500">{maintenance.vehicule?.immatriculation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getTypeLabel(maintenance.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(maintenance.dateDebut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(maintenance.dateFin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {maintenance.coutTotal.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(
                          maintenance.statut
                        )}`}
                      >
                        {getStatutLabel(maintenance.statut)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceReport;
