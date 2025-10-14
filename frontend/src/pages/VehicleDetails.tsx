import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/api';
import AssignDriverModal from '../components/AssignDriverModal';

interface Vehicle {
  _id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  type: string;
  couleur?: string;
  numeroSerie?: string;
  kilometrage: number;
  dateAchat: string;
  prixAchat: number;
  statut: string;
  carburant: string;
  capaciteReservoir: number;
  consommationMoyenne?: number;
  conducteurActuel?: any;
  departement: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface VehicleHistory {
  maintenances: any[];
  fuels: any[];
  trips: any[];
}

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [history, setHistory] = useState<VehicleHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVehicleDetails();
      fetchVehicleHistory();
    }
  }, [id]);

  const fetchVehicleDetails = async () => {
    try {
      const response = await vehicleService.getOne(id!);
      setVehicle(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement du véhicule', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleHistory = async () => {
    try {
      const response = await vehicleService.getHistory(id!);
      setHistory(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique', error);
    }
  };

  const handleAssignSuccess = () => {
    fetchVehicleDetails();
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
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Véhicule non trouvé</p>
        <button
          onClick={() => navigate('/vehicles')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/vehicles')}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicle.marque} {vehicle.modele}
            </h1>
            <p className="text-gray-500">{vehicle.immatriculation}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(vehicle.statut)}`}>
          {getStatusLabel(vehicle.statut)}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Historique
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations générales */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations Générales</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Marque</dt>
                <dd className="text-sm font-medium text-gray-900">{vehicle.marque}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Modèle</dt>
                <dd className="text-sm font-medium text-gray-900">{vehicle.modele}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Année</dt>
                <dd className="text-sm font-medium text-gray-900">{vehicle.annee}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Type</dt>
                <dd className="text-sm font-medium text-gray-900 capitalize">{vehicle.type}</dd>
              </div>
              {vehicle.couleur && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Couleur</dt>
                  <dd className="text-sm font-medium text-gray-900">{vehicle.couleur}</dd>
                </div>
              )}
              {vehicle.numeroSerie && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Numéro de série</dt>
                  <dd className="text-sm font-medium text-gray-900">{vehicle.numeroSerie}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Département</dt>
                <dd className="text-sm font-medium text-gray-900">{vehicle.departement}</dd>
              </div>
            </dl>
          </div>

          {/* Kilométrage et Carburant */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kilométrage & Carburant</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Kilométrage actuel</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {vehicle.kilometrage.toLocaleString()} km
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Type de carburant</dt>
                <dd className="text-sm font-medium text-gray-900 capitalize">{vehicle.carburant}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Capacité réservoir</dt>
                <dd className="text-sm font-medium text-gray-900">{vehicle.capaciteReservoir} L</dd>
              </div>
              {vehicle.consommationMoyenne && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Consommation moyenne</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {vehicle.consommationMoyenne} L/100km
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Informations financières */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations Financières</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Date d'achat</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(vehicle.dateAchat).toLocaleDateString('fr-FR')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Prix d'achat</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {vehicle.prixAchat.toLocaleString()} FCFA
                </dd>
              </div>
            </dl>
          </div>

          {/* Conducteur actuel */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Conducteur Actuel</h2>
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {vehicle.conducteurActuel ? 'Changer' : 'Affecter'}
              </button>
            </div>
            {vehicle.conducteurActuel ? (
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {vehicle.conducteurActuel.user?.nom} {vehicle.conducteurActuel.user?.prenom}
                  </p>
                  <p className="text-sm text-gray-500">
                    Permis: {vehicle.conducteurActuel.numeroPermis}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucun conducteur affecté</p>
            )}
          </div>

          {/* Notes */}
          {vehicle.notes && (
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{vehicle.notes}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && history && (
        <div className="space-y-6">
          {/* Maintenances récentes */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenances Récentes</h2>
            {history.maintenances.length > 0 ? (
              <div className="space-y-3">
                {history.maintenances.map((maintenance: any) => (
                  <div key={maintenance._id} className="border-l-4 border-yellow-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{maintenance.description}</p>
                        <p className="text-sm text-gray-500 capitalize">{maintenance.type}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(maintenance.dateDebut).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {maintenance.coutTotal?.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune maintenance enregistrée</p>
            )}
          </div>

          {/* Ravitaillements récents */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ravitaillements Récents</h2>
            {history.fuels.length > 0 ? (
              <div className="space-y-3">
                {history.fuels.map((fuel: any) => (
                  <div key={fuel._id} className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{fuel.quantite} L</p>
                        <p className="text-sm text-gray-500 capitalize">{fuel.typeCarburant}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(fuel.dateRavitaillement).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {fuel.montantTotal?.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucun ravitaillement enregistré</p>
            )}
          </div>

          {/* Trajets récents */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trajets Récents</h2>
            {history.trips.length > 0 ? (
              <div className="space-y-3">
                {history.trips.map((trip: any) => (
                  <div key={trip._id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {trip.lieuDepart} → {trip.lieuArrivee}
                        </p>
                        <p className="text-sm text-gray-500">{trip.objet}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(trip.dateDepart).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      {trip.distanceParcourue && (
                        <span className="text-sm font-medium text-gray-900">
                          {trip.distanceParcourue} km
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucun trajet enregistré</p>
            )}
          </div>
        </div>
      )}

      {/* Assign Driver Modal */}
      <AssignDriverModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        vehicleId={vehicle._id}
        vehicleInfo={`${vehicle.marque} ${vehicle.modele} (${vehicle.immatriculation})`}
        currentDriverId={vehicle.conducteurActuel?._id}
        onSuccess={handleAssignSuccess}
      />
    </div>
  );
};

export default VehicleDetails;
