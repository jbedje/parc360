import React, { useEffect, useState } from 'react';
import { vehicleService } from '../services/api';
import VehicleModal from '../components/VehicleModal';
import { useNavigate } from 'react-router-dom';

interface Vehicle {
  _id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  type: string;
  statut: string;
  kilometrage: number;
  carburant: string;
  departement: string;
  prixAchat?: number;
  dateAchat?: string;
  couleur?: string;
  numeroSerie?: string;
  capaciteReservoir?: number;
  consommationMoyenne?: number;
  notes?: string;
}

const Vehicles: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ statut: '', type: '', search: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, [filter]);

  const fetchVehicles = async () => {
    try {
      const response = await vehicleService.getAll(filter);
      setVehicles(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedVehicle) {
        await vehicleService.update(selectedVehicle._id, data);
      } else {
        await vehicleService.create(data);
      }
      setIsModalOpen(false);
      fetchVehicles();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      await vehicleService.delete(id);
      fetchVehicles();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/vehicles/${id}`);
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'en_service':
        return 'bg-blue-100 text-blue-800';
      case 'en_maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'hors_service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (statut: string) => {
    const labels: { [key: string]: string } = {
      disponible: 'Disponible',
      en_service: 'En Service',
      en_maintenance: 'En Maintenance',
      hors_service: 'Hors Service',
    };
    return labels[statut] || statut;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement des véhicules...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Véhicules</h1>
        <button
          onClick={handleAddVehicle}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Ajouter un véhicule</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={filter.statut}
            onChange={(e) => setFilter({ ...filter, statut: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les statuts</option>
            <option value="disponible">Disponible</option>
            <option value="en_service">En Service</option>
            <option value="en_maintenance">En Maintenance</option>
            <option value="hors_service">Hors Service</option>
          </select>
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les types</option>
            <option value="voiture">Voiture</option>
            <option value="camion">Camion</option>
            <option value="moto">Moto</option>
            <option value="bus">Bus</option>
            <option value="utilitaire">Utilitaire</option>
          </select>
          <button
            onClick={() => setFilter({ statut: '', type: '', search: '' })}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Liste des véhicules */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Immatriculation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Véhicule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kilométrage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Département
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {vehicle.immatriculation}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {vehicle.marque} {vehicle.modele}
                  </div>
                  <div className="text-sm text-gray-500">{vehicle.annee}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">
                    {vehicle.type}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {vehicle.kilometrage.toLocaleString()} km
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      vehicle.statut
                    )}`}
                  >
                    {getStatusLabel(vehicle.statut)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle.departement}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(vehicle._id)}
                      className="text-primary-600 hover:text-primary-900 font-medium"
                      title="Voir détails"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditVehicle(vehicle)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                      title="Modifier"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle._id)}
                      className={`font-medium ${
                        deleteConfirm === vehicle._id
                          ? 'text-red-900 font-bold'
                          : 'text-red-600 hover:text-red-900'
                      }`}
                      title={deleteConfirm === vehicle._id ? 'Cliquer pour confirmer' : 'Supprimer'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vehicles.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          <p className="mt-4 text-gray-500">Aucun véhicule trouvé</p>
          <button
            onClick={handleAddVehicle}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Ajouter le premier véhicule
          </button>
        </div>
      )}

      {/* Modal d'ajout/modification */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVehicle(null);
        }}
        onSubmit={handleSubmit}
        vehicle={selectedVehicle}
        title={selectedVehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
      />
    </div>
  );
};

export default Vehicles;
