import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/api';
import { Link } from 'react-router-dom';

const CostsReport: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ dateDebut: '', dateFin: '' });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const params = dateRange.dateDebut && dateRange.dateFin ? dateRange : undefined;
      const response = await reportService.getCosts(params);
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

  const coutMaintenance = reportData.coutMaintenance || 0;
  const coutCarburant = reportData.coutCarburant || 0;
  const coutTrajets = reportData.coutTrajets || 0;
  const coutTotal = reportData.coutTotal || 0;
  const pourcentages = reportData.pourcentages || { maintenance: '0', carburant: '0', trajets: '0' };

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
          <h1 className="text-3xl font-bold text-gray-900">Analyse des Coûts</h1>
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

      {/* Total Cost Card */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Coût Total</div>
          <div className="text-5xl font-bold">{coutTotal.toLocaleString()} FCFA</div>
          {dateRange.dateDebut && dateRange.dateFin && (
            <div className="text-sm mt-2 opacity-90">
              Du {new Date(dateRange.dateDebut).toLocaleDateString('fr-FR')} au{' '}
              {new Date(dateRange.dateFin).toLocaleDateString('fr-FR')}
            </div>
          )}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Maintenance</h3>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{coutMaintenance.toLocaleString()} FCFA</div>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${pourcentages.maintenance}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600">{pourcentages.maintenance}%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Carburant</h3>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{coutCarburant.toLocaleString()} FCFA</div>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${pourcentages.carburant}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600">{pourcentages.carburant}%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Trajets</h3>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{coutTrajets.toLocaleString()} FCFA</div>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${pourcentages.trajets}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600">{pourcentages.trajets}%</span>
          </div>
        </div>
      </div>

      {/* Visual Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Répartition des Coûts</h2>
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-64 h-64">
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  fill="none"
                  stroke="#FCD34D"
                  strokeWidth="40"
                  strokeDasharray={`${(parseFloat(pourcentages.maintenance) / 100) * 628} 628`}
                  transform="rotate(-90 128 128)"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="40"
                  strokeDasharray={`${(parseFloat(pourcentages.carburant) / 100) * 628} 628`}
                  strokeDashoffset={`-${(parseFloat(pourcentages.maintenance) / 100) * 628}`}
                  transform="rotate(-90 128 128)"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="40"
                  strokeDasharray={`${(parseFloat(pourcentages.trajets) / 100) * 628} 628`}
                  strokeDashoffset={`-${
                    ((parseFloat(pourcentages.maintenance) + parseFloat(pourcentages.carburant)) / 100) * 628
                  }`}
                  transform="rotate(-90 128 128)"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-sm text-gray-700">
                Maintenance ({pourcentages.maintenance}%)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-sm text-gray-700">Carburant ({pourcentages.carburant}%)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span className="text-sm text-gray-700">Trajets ({pourcentages.trajets}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostsReport;
