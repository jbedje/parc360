import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/api';
import { Link } from 'react-router-dom';

const DriversReport: React.FC = () => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await reportService.getDrivers();
      setReportData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erreur:', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const totalStats = {
    totalTrajets: reportData.reduce((sum, d) => sum + d.nombreTrajets, 0),
    totalDistance: reportData.reduce((sum, d) => sum + d.distanceTotale, 0),
    totalInfractions: reportData.reduce((sum, d) => sum + d.nombreInfractions, 0),
    totalFormations: reportData.reduce((sum, d) => sum + d.nombreFormations, 0),
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
          <h1 className="text-3xl font-bold text-gray-900">Rapport Conducteurs</h1>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Total Trajets</div>
          <div className="text-2xl font-bold text-gray-900">{totalStats.totalTrajets}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Distance Totale</div>
          <div className="text-2xl font-bold text-gray-900">{totalStats.totalDistance.toLocaleString()} km</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Total Infractions</div>
          <div className="text-2xl font-bold text-red-600">{totalStats.totalInfractions}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Total Formations</div>
          <div className="text-2xl font-bold text-green-600">{totalStats.totalFormations}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conducteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Véhicule Assigné</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trajets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Infractions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Formations</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Aucun conducteur trouvé
                  </td>
                </tr>
              ) : (
                reportData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.conducteur.user?.nom} {item.conducteur.user?.prenom}
                      </div>
                      <div className="text-sm text-gray-500">{item.conducteur.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {item.conducteur.vehiculeAssigne ? (
                        <div className="text-sm text-gray-900">
                          {item.conducteur.vehiculeAssigne.marque} {item.conducteur.vehiculeAssigne.modele}
                          <div className="text-sm text-gray-500">
                            {item.conducteur.vehiculeAssigne.immatriculation}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.conducteur.numeroPermis || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.nombreTrajets}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.distanceTotale.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.nombreInfractions > 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {item.nombreInfractions}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.nombreFormations}
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

export default DriversReport;
