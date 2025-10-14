import React, { useState, useEffect } from 'react';
import { driverService, vehicleService } from '../services/api';

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  vehicleInfo: string;
  currentDriverId?: string;
  onSuccess: () => void;
}

interface Driver {
  _id: string;
  user: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  numeroPermis: string;
  categoriePermis: string[];
  statut: string;
  vehiculeAssigne?: any;
}

const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
  isOpen,
  onClose,
  vehicleId,
  vehicleInfo,
  currentDriverId,
  onSuccess,
}) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDrivers();
      setSelectedDriverId(currentDriverId || '');
    }
  }, [isOpen, currentDriverId]);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const response = await driverService.getAll({ statut: 'actif' });
      setDrivers(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des conducteurs:', error);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDriverId) {
      alert('Veuillez sélectionner un conducteur');
      return;
    }

    try {
      setSubmitting(true);
      await vehicleService.assignDriver(vehicleId, selectedDriverId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'affectation:', error);
      alert('Erreur lors de l\'affectation du conducteur');
    } finally {
      setSubmitting(false);
    }
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Affecter un conducteur
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Véhicule: <span className="font-medium">{vehicleInfo}</span>
                    </p>
                  </div>

                  {/* Driver selection */}
                  <div className="mt-4">
                    <label htmlFor="driver" className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionnez un conducteur
                    </label>

                    {loading ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">Chargement des conducteurs...</p>
                      </div>
                    ) : (
                      <select
                        id="driver"
                        value={selectedDriverId}
                        onChange={(e) => setSelectedDriverId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        required
                      >
                        <option value="">-- Choisir un conducteur --</option>
                        {drivers.map((driver) => (
                          <option key={driver._id} value={driver._id}>
                            {driver.user?.nom} {driver.user?.prenom} - {driver.numeroPermis}
                            {driver.vehiculeAssigne && ' (Déjà affecté)'}
                          </option>
                        ))}
                      </select>
                    )}

                    {selectedDriverId && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-md">
                        {drivers.find((d) => d._id === selectedDriverId) && (
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {drivers.find((d) => d._id === selectedDriverId)?.user?.nom}{' '}
                              {drivers.find((d) => d._id === selectedDriverId)?.user?.prenom}
                            </p>
                            <p className="text-gray-600">
                              Permis: {drivers.find((d) => d._id === selectedDriverId)?.numeroPermis}
                            </p>
                            <p className="text-gray-600">
                              Catégories:{' '}
                              {drivers.find((d) => d._id === selectedDriverId)?.categoriePermis.join(', ')}
                            </p>
                            {drivers.find((d) => d._id === selectedDriverId)?.vehiculeAssigne && (
                              <p className="text-orange-600 mt-1">
                                ⚠️ Ce conducteur est déjà affecté à un autre véhicule
                              </p>
                            )}
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
                disabled={submitting || !selectedDriverId}
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

export default AssignDriverModal;
