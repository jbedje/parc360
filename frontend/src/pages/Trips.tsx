import React, { useState, useEffect } from 'react';
import { tripService, vehicleService, driverService } from '../services/api';
import TripModal from '../components/TripModal';

const Trips: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState({ statut: '', vehicule: '', search: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        tripService.getAll(),
        vehicleService.getAll(),
        driverService.getAll(),
      ]);      // L'API retourne { data: { success, count, data: [...] } }
      const tripsList = tripsData.data?.data || tripsData.data || [];
      const vehiclesList = vehiclesData.data?.data || vehiclesData.data || [];
      const driversList = driversData.data?.data || driversData.data || [];      setTrips(Array.isArray(tripsList) ? tripsList : []);
      setVehicles(Array.isArray(vehiclesList) ? vehiclesList : []);
      setDrivers(Array.isArray(driversList) ? driversList : []);
    } catch (error) {
      console.error('Erreur:', error);
      setTrips([]);
      setVehicles([]);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTrip(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (trip: any) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedTrip) {
        await tripService.update(selectedTrip._id, data);
      } else {
        await tripService.create(data);
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
        await tripService.delete(id);
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
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const filteredTrips = trips.filter((trip) => {
    if (filter.statut && trip.statut !== filter.statut) return false;
    if (filter.vehicule && trip.vehicule._id !== filter.vehicule) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        trip.objet.toLowerCase().includes(searchLower) ||
        trip.lieuDepart.toLowerCase().includes(searchLower) ||
        trip.lieuArrivee.toLowerCase().includes(searchLower) ||
        trip.vehicule.immatriculation.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    total: trips.length,
    planifie: trips.filter((t) => t.statut === 'planifie').length,
    enCours: trips.filter((t) => t.statut === 'en_cours').length,
    termine: trips.filter((t) => t.statut === 'termine').length,
    distanceTotale: trips.reduce((sum, t) => sum + (t.distanceParcourue || 0), 0),
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
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Trajets</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Créer un trajet</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <div className="text-sm text-blue-600">Planifiés</div>
          <div className="text-2xl font-bold text-blue-900">{stats.planifie}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <div className="text-sm text-yellow-600">En Cours</div>
          <div className="text-2xl font-bold text-yellow-900">{stats.enCours}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-sm text-green-600">Terminés</div>
          <div className="text-2xl font-bold text-green-900">{stats.termine}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <div className="text-sm text-purple-600">Distance Totale</div>
          <div className="text-xl font-bold text-purple-900">{stats.distanceTotale.toLocaleString()} km</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={filter.statut}
              onChange={(e) => setFilter({ ...filter, statut: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les statuts</option>
              <option value="planifie">Planifié</option>
              <option value="en_cours">En Cours</option>
              <option value="termine">Terminé</option>
              <option value="annule">Annulé</option>
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
              placeholder="Objet, lieu, immatriculation..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trajet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Aucun trajet trouvé
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => (
                  <tr key={trip._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {trip.vehicule.marque} {trip.vehicule.modele}
                      </div>
                      <div className="text-sm text-gray-500">{trip.vehicule.immatriculation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {trip.conducteur.utilisateur?.nom} {trip.conducteur.utilisateur?.prenom}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{trip.lieuDepart}</div>
                      <div className="text-sm text-gray-500">→ {trip.lieuArrivee}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{trip.objet}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(trip.dateDepart)}</div>
                      {trip.dateRetour && (
                        <div className="text-sm text-gray-500">{formatDate(trip.dateRetour)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trip.distanceParcourue ? `${trip.distanceParcourue} km` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(
                          trip.statut
                        )}`}
                      >
                        {getStatutLabel(trip.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(trip)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(trip._id)}
                          className={`${
                            deleteConfirm === trip._id
                              ? 'text-red-700 font-bold'
                              : 'text-red-600 hover:text-red-900'
                          }`}
                          title={deleteConfirm === trip._id ? 'Cliquez pour confirmer' : 'Supprimer'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
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

      <TripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        trip={selectedTrip}
        title={selectedTrip ? 'Modifier le trajet' : 'Créer un trajet'}
        vehicles={vehicles}
        drivers={drivers}
      />
    </div>
  );
};

export default Trips;
