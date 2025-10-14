import React, { useState, useEffect } from 'react';
import { maintenanceService, vehicleService, driverService } from '../services/api';
import MaintenanceModal from '../components/MaintenanceModal';
import { useNavigate } from 'react-router-dom';


interface Maintenance {
  _id: string;
  vehicule: {
    _id: string;
    marque: string;
    modele: string;
    immatriculation: string;
  };
  type: string;
  description: string;
  dateDebut: string;
  dateFin?: string;
  statut: string;
  kilometrageActuel: number;
  prochainEntretien?: number;
  garage?: {
    nom: string;
    adresse: string;
    telephone: string;
  };
  technicien?: {
    _id: string;
    nom: string;
    prenom: string;
  };
  pieces: Array<{
    nom: string;
    reference: string;
    quantite: number;
    prixUnitaire: number;
  }>;
  mainOeuvre: number;
  coutTotal: number;
  facture?: {
    numero: string;
  };
  notes?: string;
  createdAt: string;
}

const Maintenance: React.FC = () => {
  const navigate = useNavigate();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    type: '',
    statut: '',
    vehicule: '',
    search: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [maintenancesData, vehiclesData, driversData] = await Promise.all([
        maintenanceService.getAll(),
        vehicleService.getAll(),
        driverService.getAll(),
      ]);

      // L'API retourne { data: { success, count, data: [...] } }
      const maintenancesList = maintenancesData.data?.data || maintenancesData.data || [];
      const vehiclesList = vehiclesData.data?.data || vehiclesData.data || [];

      setMaintenances(Array.isArray(maintenancesList) ? maintenancesList : []);
      setVehicles(Array.isArray(vehiclesList) ? vehiclesList : []);
      // Map drivers to users format for the modal
      const drivers = Array.isArray(driversData.data) ? driversData.data : [];
      setUsers(drivers.map((d: any) => d.user || { _id: d._id, nom: 'N/A', prenom: '' }));
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setMaintenances([]);
      setVehicles([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedMaintenance(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedMaintenance) {
        await maintenanceService.update(selectedMaintenance._id, data);
      } else {
        await maintenanceService.create(data);
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
        await maintenanceService.delete(id);
        await loadData();
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      preventive: 'Préventive',
      corrective: 'Corrective',
      revision: 'Révision',
      reparation: 'Réparation',
      autre: 'Autre',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      preventive: 'bg-blue-100 text-blue-800',
      corrective: 'bg-orange-100 text-orange-800',
      revision: 'bg-purple-100 text-purple-800',
      reparation: 'bg-red-100 text-red-800',
      autre: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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

  const filteredMaintenances = maintenances.filter((maintenance) => {
    if (filter.type && maintenance.type !== filter.type) return false;
    if (filter.statut && maintenance.statut !== filter.statut) return false;
    if (filter.vehicule && maintenance.vehicule._id !== filter.vehicule) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        maintenance.description.toLowerCase().includes(searchLower) ||
        maintenance.vehicule.immatriculation.toLowerCase().includes(searchLower) ||
        maintenance.vehicule.marque.toLowerCase().includes(searchLower) ||
        maintenance.vehicule.modele.toLowerCase().includes(searchLower) ||
        maintenance.garage?.nom?.toLowerCase().includes(searchLower) ||
        maintenance.facture?.numero?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    total: maintenances.length,
    planifie: maintenances.filter((m) => m.statut === 'planifie').length,
    enCours: maintenances.filter((m) => m.statut === 'en_cours').length,
    termine: maintenances.filter((m) => m.statut === 'termine').length,
    coutTotal: maintenances
      .filter((m) => m.statut === 'termine')
      .reduce((sum, m) => sum + m.coutTotal, 0),
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion de la Maintenance</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Planifier une maintenance</span>
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
          <div className="text-sm text-purple-600">Coût Total</div>
          <div className="text-xl font-bold text-purple-900">
            {stats.coutTotal.toLocaleString()} FCFA
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les types</option>
              <option value="preventive">Préventive</option>
              <option value="corrective">Corrective</option>
              <option value="revision">Révision</option>
              <option value="reparation">Réparation</option>
              <option value="autre">Autre</option>
            </select>
          </div>

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
              placeholder="Description, immatriculation, garage..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kilométrage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coût
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaintenances.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Aucune maintenance trouvée
                  </td>
                </tr>
              ) : (
                filteredMaintenances.map((maintenance) => (
                  <tr
                    key={maintenance._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/maintenance/${maintenance._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {maintenance.vehicule.marque} {maintenance.vehicule.modele}
                      </div>
                      <div className="text-sm text-gray-500">{maintenance.vehicule.immatriculation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                          maintenance.type
                        )}`}
                      >
                        {getTypeLabel(maintenance.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {maintenance.description}
                      </div>
                      {maintenance.garage?.nom && (
                        <div className="text-sm text-gray-500">{maintenance.garage.nom}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Début: {formatDate(maintenance.dateDebut)}</div>
                      {maintenance.dateFin && (
                        <div className="text-sm text-gray-500">Fin: {formatDate(maintenance.dateFin)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {maintenance.kilometrageActuel.toLocaleString()} km
                      </div>
                      {maintenance.prochainEntretien && (
                        <div className="text-sm text-gray-500">
                          Prochain: {maintenance.prochainEntretien.toLocaleString()} km
                        </div>
                      )}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {maintenance.coutTotal.toLocaleString()} FCFA
                      </div>
                      {maintenance.facture?.numero && (
                        <div className="text-sm text-gray-500">Fact. {maintenance.facture.numero}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEdit(maintenance)}
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
                          onClick={() => handleDelete(maintenance._id)}
                          className={`${
                            deleteConfirm === maintenance._id
                              ? 'text-red-700 font-bold'
                              : 'text-red-600 hover:text-red-900'
                          }`}
                          title={deleteConfirm === maintenance._id ? 'Cliquez pour confirmer' : 'Supprimer'}
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

      {/* Modal */}
      <MaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        maintenance={selectedMaintenance}
        title={selectedMaintenance ? 'Modifier la maintenance' : 'Planifier une maintenance'}
        vehicles={vehicles}
        users={users}
      />
    </div>
  );
};

export default Maintenance;
