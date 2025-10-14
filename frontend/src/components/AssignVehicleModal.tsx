import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/api';

interface AssignVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverId: string;
  driverInfo: string;
  currentVehicleId?: string;
  onSuccess: () => void;
}

interface Vehicle {
  _id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  type: string;
  statut: string;
  conducteurActuel?: any;
}

const AssignVehicleModal: React.FC<AssignVehicleModalProps> = ({
  isOpen,
  onClose,
  driverId,
  driverInfo,
  currentVehicleId,
  onSuccess,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadVehicles();
      setSelectedVehicleId(currentVehicleId || '');
    }
  }, [isOpen, currentVehicleId]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getAll();
      setVehicles(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVehicleId) {
      alert('Veuillez sélectionner un véhicule');
      return;
    }

    try {
      setSubmitting(true);
      await vehicleService.assignDriver(selectedVehicleId, driverId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'affectation:', error);
      alert('Erreur lors de l\'affectation du véhicule');
    } finally {
      setSubmitting(false);
    }
  };

  const getVehicleAvailability = (vehicle: Vehicle) => {
    if (vehicle._id === currentVehicleId) {
      return { available: true, message: 'Véhicule actuel' };
    }
    if (vehicle.statut === 'disponible' && !vehicle.conducteurActuel) {
      return { available: true, message: 'Disponible' };
    }
    if (vehicle.statut === 'en_service' && vehicle.conducteurActuel) {
      return { available: false, message: 'Déjà assigné à un autre conducteur' };
    }
    if (vehicle.statut === 'en_maintenance') {
      return { available: false, message: 'En maintenance' };
    }
    if (vehicle.statut === 'hors_service') {
      return { available: false, message: 'Hors service' };
    }
    return { available: true, message: '' };
  };

  const getStatusBadge = (statut: string) => {
    const styles: { [key: string]: string } = {
      disponible: 'bg-green-100 text-green-800',
      en_service: 'bg-blue-100 text-blue-800',
      en_maintenance: 'bg-yellow-100 text-yellow-800',
      hors_service: 'bg-red-100 text-red-800',
    };
    const labels: { [key: string]: string } = {
      disponible: 'Disponible',
      en_service: 'En service',
      en_maintenance: 'En maintenance',
      hors_service: 'Hors service',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[statut] || 'bg-gray-100 text-gray-800'}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Affecter un véhicule
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Conducteur: <span className="font-medium">{driverInfo}</span>
                    </p>
                  </div>

                  {/* Vehicle selection */}
                  <div className="mt-4">
                    <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionnez un véhicule
                    </label>

                    {loading ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">Chargement des véhicules...</p>
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-md">
                        <div className="divide-y divide-gray-200">
                          {vehicles.map((vehicle) => {
                            const availability = getVehicleAvailability(vehicle);
                            const isDisabled = !availability.available;
                            return (
                              <label
                                key={vehicle._id}
                                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                                } ${selectedVehicleId === vehicle._id ? 'bg-blue-50' : ''}`}
                              >
                                <input
                                  type="radio"
                                  name="vehicle"
                                  value={vehicle._id}
                                  checked={selectedVehicleId === vehicle._id}
                                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                                  disabled={isDisabled}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                />
                                <div className="ml-3 flex-1">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {vehicle.marque} {vehicle.modele} ({vehicle.annee})
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {vehicle.immatriculation} - {vehicle.type}
                                      </p>
                                    </div>
                                    <div className="ml-4">
                                      {getStatusBadge(vehicle.statut)}
                                    </div>
                                  </div>
                                  {!availability.available && (
                                    <p className="text-xs text-orange-600 mt-1">
                                      ⚠️ {availability.message}
                                    </p>
                                  )}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {!loading && vehicles.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Aucun véhicule disponible
                      </p>
                    )}

                    {selectedVehicleId && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-md">
                        {vehicles.find((v) => v._id === selectedVehicleId) && (
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">Véhicule sélectionné:</p>
                            <p className="text-gray-700">
                              {vehicles.find((v) => v._id === selectedVehicleId)?.marque}{' '}
                              {vehicles.find((v) => v._id === selectedVehicleId)?.modele} -{' '}
                              {vehicles.find((v) => v._id === selectedVehicleId)?.immatriculation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={submitting || !selectedVehicleId}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Affectation...' : 'Affecter'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignVehicleModal;
