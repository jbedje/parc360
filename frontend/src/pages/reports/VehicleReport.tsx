import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/api';
import { Link } from 'react-router-dom';

const VehicleReport: React.FC = () => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ dateDebut: '', dateFin: '' });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const params = dateRange.dateDebut && dateRange.dateFin ? dateRange : undefined;
      const response = await reportService.getVehicles(params);
      setReportData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erreur:', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    loadReport();
  };

  const totalStats = {
    coutMaintenance: reportData.reduce((sum, v) => sum + v.coutMaintenance, 0),
    coutCarburant: reportData.reduce((sum, v) => sum + v.coutCarburant, 0),
    coutTotal: reportData.reduce((sum, v) => sum + v.coutTotal, 0),
    distanceTotale: reportData.reduce((sum, v) => sum + v.distanceParcourue, 0),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Rapport Véhicules</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Début</label>
            <input
              type="date"
              value={dateRange.dateDebut}
              onChange={(e) => setDateRange({ ...dateRange, dateDebut: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Fin</label>
            <input
              type="date"
              value={dateRange.dateFin}
              onChange={(e) => setDateRange({ ...dateRange, dateFin: e.target.value })}
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
          <div className="text-sm text-gray-600 mb-1">Coût Total Maintenance</div>
          <div className="text-2xl font-bold text-gray-900">{totalStats.coutMaintenance.toLocaleString()} FCFA</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Coût Total Carburant</div>
          <div className="text-2xl font-bold text-gray-900">{totalStats.coutCarburant.toLocaleString()} FCFA</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Coût Total Global</div>
          <div className="text-2xl font-bold text-gray-900">{totalStats.coutTotal.toLocaleString()} FCFA</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Distance Totale</div>
          <div className="text-2xl font-bold text-gray-900">{totalStats.distanceTotale.toLocaleString()} km</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Véhicule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maintenances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coût Maint.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ravitaillements</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coût Carb.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trajets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coût Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Aucun véhicule trouvé
                  </td>
                </tr>
              ) : (
                reportData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.vehicule.marque} {item.vehicule.modele}
                      </div>
                      <div className="text-sm text-gray-500">{item.vehicule.immatriculation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.nombreMaintenances}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.coutMaintenance.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.nombreRavitaillements}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.coutCarburant.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.nombreTrajets}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.distanceParcourue.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.coutTotal.toLocaleString()} FCFA
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

export default VehicleReport;
