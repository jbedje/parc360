import React, { useEffect, useState } from 'react';
import { driverService } from '../services/api';
import DriverModal from '../components/DriverModal';
import AssignVehicleModal from '../components/AssignVehicleModal';
import { useNavigate } from 'react-router-dom';

interface Driver {
  _id: string;
  user: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    avatar?: string;
  };
  numeroPermis: string;
  categoriePermis: string[];
  dateDelivrance: string;
  dateExpiration: string;
  adresse: string;
  ville: string;
  dateEmbauche: string;
  departement: string;
  statut: string;
  vehiculeAssigne?: {
    _id: string;
    immatriculation: string;
    marque: string;
    modele: string;
  };
  notes?: string;
}

const Drivers: React.FC = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ statut: '', departement: '', search: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isAssignVehicleModalOpen, setIsAssignVehicleModalOpen] = useState(false);
  const [driverToAssign, setDriverToAssign] = useState<Driver | null>(null);

  useEffect(() => {
    fetchDrivers();
  }, [filter]);

  const fetchDrivers = async () => {
    try {
      const response = await driverService.getAll(filter);
      setDrivers(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des conducteurs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = () => {
    setSelectedDriver(null);
    setIsModalOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedDriver) {
        await driverService.update(selectedDriver._id, data.driverData);
      } else {
        await driverService.create(data);
      }
      setIsModalOpen(false);
      fetchDrivers();
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
      await driverService.delete(id);
      fetchDrivers();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/drivers/${id}`);
  };

  const handleAssignVehicle = (driver: Driver) => {
    setDriverToAssign(driver);
    setIsAssignVehicleModalOpen(true);
  };

  const handleAssignSuccess = () => {
    fetchDrivers();
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'en_conge':
        return 'bg-blue-100 text-blue-800';
      case 'suspendu':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactif':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (statut: string) => {
    const labels: { [key: string]: string } = {
      actif: 'Actif',
      en_conge: 'En Congé',
      suspendu: 'Suspendu',
      inactif: 'Inactif',
    };
    return labels[statut] || statut;
  };

  const isPermisExpired = (dateExpiration: string) => {
    return new Date(dateExpiration) < new Date();
  };

  const isPermisExpiringSoon = (dateExpiration: string) => {
    const today = new Date();
    const expiration = new Date(dateExpiration);
    const daysUntilExpiration = Math.floor((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration > 0 && daysUntilExpiration <= 30;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement des conducteurs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Conducteurs</h1>
        <button
          onClick={handleAddDriver}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Ajouter un conducteur</span>
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
            <option value="actif">Actif</option>
            <option value="en_conge">En Congé</option>
            <option value="suspendu">Suspendu</option>
            <option value="inactif">Inactif</option>
          </select>
          <input
            type="text"
            placeholder="Département..."
            value={filter.departement}
            onChange={(e) => setFilter({ ...filter, departement: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={() => setFilter({ statut: '', departement: '', search: '' })}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Liste des conducteurs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conducteur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégories
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Véhicule Assigné
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Département
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {driver.user.nom} {driver.user.prenom}
                      </div>
                      <div className="text-sm text-gray-500">{driver.user.telephone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{driver.numeroPermis}</div>
                  <div className="text-sm text-gray-500">
                    Exp: {new Date(driver.dateExpiration).toLocaleDateString('fr-FR')}
                    {isPermisExpired(driver.dateExpiration) && (
                      <span className="ml-2 text-red-600 font-medium">Expiré</span>
                    )}
                    {isPermisExpiringSoon(driver.dateExpiration) && !isPermisExpired(driver.dateExpiration) && (
                      <span className="ml-2 text-yellow-600 font-medium">Bientôt</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {driver.categoriePermis.map((cat: string) => (
                      <span
                        key={cat}
                        className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-between">
                    {driver.vehiculeAssigne ? (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {driver.vehiculeAssigne.immatriculation}
                        </div>
                        <div className="text-gray-500">
                          {driver.vehiculeAssigne.marque} {driver.vehiculeAssigne.modele}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Aucun</span>
                    )}
                    <button
                      onClick={() => handleAssignVehicle(driver)}
                      className="ml-2 px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      title={driver.vehiculeAssigne ? 'Changer le véhicule' : 'Affecter un véhicule'}
                    >
                      {driver.vehiculeAssigne ? '✏️' : '➕'}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {driver.departement}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      driver.statut
                    )}`}
                  >
                    {getStatusLabel(driver.statut)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(driver._id)}
                      className="text-primary-600 hover:text-primary-900 font-medium"
                      title="Voir détails"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditDriver(driver)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                      title="Modifier"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(driver._id)}
                      className={`font-medium ${
                        deleteConfirm === driver._id
                          ? 'text-red-900 font-bold'
                          : 'text-red-600 hover:text-red-900'
                      }`}
                      title={deleteConfirm === driver._id ? 'Cliquer pour confirmer' : 'Supprimer'}
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

      {drivers.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="mt-4 text-gray-500">Aucun conducteur trouvé</p>
          <button
            onClick={handleAddDriver}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Ajouter le premier conducteur
          </button>
        </div>
      )}

      {/* Modal d'ajout/modification */}
      <DriverModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDriver(null);
        }}
        onSubmit={handleSubmit}
        driver={selectedDriver}
        title={selectedDriver ? 'Modifier le conducteur' : 'Ajouter un conducteur'}
      />

      {/* Modal d'affectation de véhicule */}
      {driverToAssign && (
        <AssignVehicleModal
          isOpen={isAssignVehicleModalOpen}
          onClose={() => {
            setIsAssignVehicleModalOpen(false);
            setDriverToAssign(null);
          }}
          driverId={driverToAssign._id}
          driverInfo={`${driverToAssign.user.nom} ${driverToAssign.user.prenom}`}
          currentVehicleId={driverToAssign.vehiculeAssigne?._id}
          onSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
};

export default Drivers;
