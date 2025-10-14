import React, { useState, useEffect } from 'react';
import { fuelService, vehicleService, driverService } from '../services/api';
import FuelModal from '../components/FuelModal';
import { useNavigate } from 'react-router-dom';

const Fuel: React.FC = () => {
  const navigate = useNavigate();
  const [fuels, setFuels] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState<any>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState({ typeCarburant: '', vehicule: '', search: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fuelsData, vehiclesData, driversData] = await Promise.all([
        fuelService.getAll(),
        vehicleService.getAll(),
        driverService.getAll(),
      ]);
      // L'API retourne { data: { success, count, data: [...] } }
      const fuelsList = fuelsData.data?.data || fuelsData.data || [];
      const vehiclesList = vehiclesData.data?.data || vehiclesData.data || [];
      const driversList = driversData.data?.data || driversData.data || [];
      setFuels(Array.isArray(fuelsList) ? fuelsList : []);
      setVehicles(Array.isArray(vehiclesList) ? vehiclesList : []);
      setDrivers(Array.isArray(driversList) ? driversList : []);
    } catch (error) {
      console.error('Erreur:', error);
      setFuels([]);
      setVehicles([]);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedFuel(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (fuel: any) => {
    setSelectedFuel(fuel);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedFuel) {
        await fuelService.update(selectedFuel._id, data);
      } else {
        await fuelService.create(data);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      try {
        await fuelService.delete(id);
        await loadData();
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Erreur:', error);
      }
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
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
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const filteredFuels = fuels.filter((fuel) => {
    if (filter.typeCarburant && fuel.typeCarburant !== filter.typeCarburant) return false;
    if (filter.vehicule && fuel.vehicule._id !== filter.vehicule) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        fuel.vehicule.immatriculation.toLowerCase().includes(searchLower) ||
        fuel.stationService?.nom?.toLowerCase().includes(searchLower) ||
        fuel.numeroRecu?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    total: fuels.length,
    quantiteTotale: fuels.reduce((sum, f) => sum + f.quantite, 0),
    montantTotal: fuels.reduce((sum, f) => sum + f.montantTotal, 0),
    prixMoyen: fuels.length > 0 ? fuels.reduce((sum, f) => sum + f.prixUnitaire, 0) / fuels.length : 0,
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
        <h1 className="text-3xl font-bold text-gray-900">Gestion du Carburant</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Enregistrer un ravitaillement</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Ravitaillements</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <div className="text-sm text-blue-600">Quantité Totale</div>
          <div className="text-2xl font-bold text-blue-900">{stats.quantiteTotale.toFixed(2)} L</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-sm text-green-600">Montant Total</div>
          <div className="text-xl font-bold text-green-900">{stats.montantTotal.toLocaleString()} FCFA</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <div className="text-sm text-purple-600">Prix Moyen/L</div>
          <div className="text-2xl font-bold text-purple-900">{stats.prixMoyen.toFixed(0)} FCFA</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de carburant</label>
            <select
              value={filter.typeCarburant}
              onChange={(e) => setFilter({ ...filter, typeCarburant: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les types</option>
              <option value="essence">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="super">Super</option>
              <option value="sans_plomb">Sans Plomb</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule</label>
            <select
              value={filter.vehicule}
              onChange={(e) => setFilter({ ...filter, vehicule: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les véhicules</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.marque} {vehicle.modele} - {vehicle.immatriculation}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <input
              type="text"
              placeholder="Immatriculation, station, reçu..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Véhicule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conducteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix Unit.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kilométrage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFuels.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    Aucun ravitaillement trouvé
                  </td>
                </tr>
              ) : (
                filteredFuels.map((fuel) => (
                  <tr key={fuel._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {fuel.vehicule.marque} {fuel.vehicule.modele}
                      </div>
                      <div className="text-sm text-gray-500">{fuel.vehicule.immatriculation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {fuel.conducteur.utilisateur?.nom} {fuel.conducteur.utilisateur?.prenom}
                      </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(fuel)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(fuel._id)}
                          className={`${
                            deleteConfirm === fuel._id
                              ? 'text-red-700 font-bold'
                              : 'text-red-600 hover:text-red-900'
                          }`}
                          title={deleteConfirm === fuel._id ? 'Cliquez pour confirmer' : 'Supprimer'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FuelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        fuel={selectedFuel}
        title={selectedFuel ? 'Modifier le ravitaillement' : 'Enregistrer un ravitaillement'}
        vehicles={vehicles}
        drivers={drivers}
      />
    </div>
  );
};

export default Fuel;
