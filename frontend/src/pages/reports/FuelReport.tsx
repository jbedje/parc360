import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/api';
import { Link } from 'react-router-dom';

const FuelReport: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ dateDebut: '', dateFin: '', vehicule: '' });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.dateDebut) params.dateDebut = filters.dateDebut;
      if (filters.dateFin) params.dateFin = filters.dateFin;
      if (filters.vehicule) params.vehicule = filters.vehicule;

      const response = await reportService.getFuel(params);
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
      essence: 'Essence',
      diesel: 'Diesel',
      super: 'Super',
      sans_plomb: 'Sans Plomb',
    };
    return labels[type] || type;
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

  const stats = reportData.stats || { total: 0, quantiteTotale: 0, coutTotal: 0, moyenneCout: 0 };
  const ravitaillements = Array.isArray(reportData.ravitaillements) ? reportData.ravitaillements : [];

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
          <h1 className="text-3xl font-bold text-gray-900">Rapport Carburant</h1>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule ID (optionnel)</label>
            <input
              type="text"
              placeholder="ID du véhicule"
              value={filters.vehicule}
              onChange={(e) => setFilters({ ...filters, vehicule: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
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
          <div className="text-sm text-gray-600 mb-1">Total Ravitaillements</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Quantité Totale</div>
          <div className="text-2xl font-bold text-gray-900">{stats.quantiteTotale.toFixed(2)} L</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Coût Total</div>
          <div className="text-2xl font-bold text-gray-900">{stats.coutTotal.toLocaleString()} FCFA</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Coût Moyen</div>
          <div className="text-2xl font-bold text-gray-900">{stats.moyenneCout.toLocaleString()} FCFA</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Véhicule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix Unit.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kilométrage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ravitaillements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Aucun ravitaillement trouvé
                  </td>
                </tr>
              ) : (
                ravitaillements.map((fuel: any) => (
                  <tr key={fuel._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {fuel.vehicule?.marque} {fuel.vehicule?.modele}
                      </div>
                      <div className="text-sm text-gray-500">{fuel.vehicule?.immatriculation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(fuel.dateRavitaillement)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getTypeLabel(fuel.typeCarburant)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {fuel.quantite} L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {fuel.prixUnitaire.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {fuel.montantTotal.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {fuel.kilometrageActuel.toLocaleString()} km
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

export default FuelReport;
