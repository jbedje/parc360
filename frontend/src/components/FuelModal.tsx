import React, { useState, useEffect } from 'react';

interface FuelFormData {
  vehicule: string;
  conducteur: string;
  dateRavitaillement: string;
  quantite: string;
  prixUnitaire: string;
  montantTotal: string;
  kilometrageActuel: string;
  typeCarburant: string;
  stationNom: string;
  stationAdresse: string;
  numeroRecu: string;
  reservoirPlein: boolean;
  notes: string;
}

interface FuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  fuel?: any;
  title: string;
  vehicles: any[];
  drivers: any[];
}

const FuelModal: React.FC<FuelModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fuel,
  title,
  vehicles,
  drivers,
}) => {
  const [formData, setFormData] = useState<FuelFormData>({
    vehicule: '',
    conducteur: '',
    dateRavitaillement: new Date().toISOString().split('T')[0],
    quantite: '',
    prixUnitaire: '',
    montantTotal: '0',
    kilometrageActuel: '',
    typeCarburant: 'essence',
    stationNom: '',
    stationAdresse: '',
    numeroRecu: '',
    reservoirPlein: false,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});  useEffect(() => {
    if (isOpen) {    }
  }, [isOpen, vehicles, drivers]);

  useEffect(() => {
    if (fuel) {
      setFormData({
        vehicule: fuel.vehicule?._id || fuel.vehicule || '',
        conducteur: fuel.conducteur?._id || fuel.conducteur || '',
        dateRavitaillement: fuel.dateRavitaillement ? fuel.dateRavitaillement.split('T')[0] : '',
        quantite: fuel.quantite?.toString() || '',
        prixUnitaire: fuel.prixUnitaire?.toString() || '',
        montantTotal: fuel.montantTotal?.toString() || '0',
        kilometrageActuel: fuel.kilometrageActuel?.toString() || '',
        typeCarburant: fuel.typeCarburant || 'essence',
        stationNom: fuel.stationService?.nom || '',
        stationAdresse: fuel.stationService?.adresse || '',
        numeroRecu: fuel.numeroRecu || '',
        reservoirPlein: fuel.reservoirPlein || false,
        notes: fuel.notes || '',
      });
    }
  }, [fuel]);

  const validate = () => {
    const newErrors: any = {};

    if (!formData.vehicule) newErrors.vehicule = 'Le véhicule est requis';
    if (!formData.conducteur) newErrors.conducteur = 'Le conducteur est requis';
    if (!formData.dateRavitaillement) newErrors.dateRavitaillement = 'La date est requise';
    if (!formData.quantite) newErrors.quantite = 'La quantité est requise';
    if (!formData.prixUnitaire) newErrors.prixUnitaire = 'Le prix unitaire est requis';
    if (!formData.kilometrageActuel) newErrors.kilometrageActuel = 'Le kilométrage est requis';

    // Validation des nombres
    if (formData.quantite && isNaN(Number(formData.quantite))) {
      newErrors.quantite = 'La quantité doit être un nombre';
    }
    if (formData.prixUnitaire && isNaN(Number(formData.prixUnitaire))) {
      newErrors.prixUnitaire = 'Le prix unitaire doit être un nombre';
    }
    if (formData.kilometrageActuel && isNaN(Number(formData.kilometrageActuel))) {
      newErrors.kilometrageActuel = 'Le kilométrage doit être un nombre';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        vehicule: formData.vehicule,
        conducteur: formData.conducteur,
        dateRavitaillement: formData.dateRavitaillement,
        quantite: Number(formData.quantite),
        prixUnitaire: Number(formData.prixUnitaire),
        montantTotal: Number(formData.montantTotal),
        kilometrageActuel: Number(formData.kilometrageActuel),
        typeCarburant: formData.typeCarburant,
        stationService: {
          nom: formData.stationNom,
          adresse: formData.stationAdresse,
        },
        numeroRecu: formData.numeroRecu,
        reservoirPlein: formData.reservoirPlein,
        notes: formData.notes,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error: any) {
      console.error('Erreur:', error);
      setErrors({ submit: error.response?.data?.message || 'Une erreur est survenue' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    if (errors[name]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Calcul automatique du montant total
  useEffect(() => {
    const quantite = Number(formData.quantite) || 0;
    const prixUnitaire = Number(formData.prixUnitaire) || 0;
    const total = quantite * prixUnitaire;
    setFormData(prev => ({ ...prev, montantTotal: total.toString() }));
  }, [formData.quantite, formData.prixUnitaire]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-primary-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-white hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4 max-h-[75vh] overflow-y-auto">
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {errors.submit}
                </div>
              )}

              {/* Informations Principales */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">
                  Informations Principales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Véhicule <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="vehicule"
                      value={formData.vehicule}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.vehicule ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionner un véhicule</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle._id} value={vehicle._id}>
                          {vehicle.marque} {vehicle.modele} - {vehicle.immatriculation}
                        </option>
                      ))}
                    </select>
                    {errors.vehicule && <p className="mt-1 text-sm text-red-500">{errors.vehicule}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conducteur <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="conducteur"
                      value={formData.conducteur}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.conducteur ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionner un conducteur</option>
                      {drivers.map(driver => (
                        <option key={driver._id} value={driver._id}>
                          {driver.user?.nom || driver.nom || 'N/A'} {driver.user?.prenom || driver.prenom || ''}
                        </option>
                      ))}
                    </select>
                    {errors.conducteur && <p className="mt-1 text-sm text-red-500">{errors.conducteur}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de ravitaillement <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateRavitaillement"
                      value={formData.dateRavitaillement}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.dateRavitaillement ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateRavitaillement && <p className="mt-1 text-sm text-red-500">{errors.dateRavitaillement}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de carburant <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="typeCarburant"
                      value={formData.typeCarburant}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="essence">Essence</option>
                      <option value="diesel">Diesel</option>
                      <option value="super">Super</option>
                      <option value="sans_plomb">Sans Plomb</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité (litres) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="quantite"
                      value={formData.quantite}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.quantite ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="50.00"
                    />
                    {errors.quantite && <p className="mt-1 text-sm text-red-500">{errors.quantite}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix unitaire (FCFA) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="prixUnitaire"
                      value={formData.prixUnitaire}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.prixUnitaire ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="650"
                    />
                    {errors.prixUnitaire && <p className="mt-1 text-sm text-red-500">{errors.prixUnitaire}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Montant total (FCFA) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="montantTotal"
                      value={formData.montantTotal}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kilométrage actuel (km) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="kilometrageActuel"
                      value={formData.kilometrageActuel}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.kilometrageActuel ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="25000"
                    />
                    {errors.kilometrageActuel && <p className="mt-1 text-sm text-red-500">{errors.kilometrageActuel}</p>}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="reservoirPlein"
                      checked={formData.reservoirPlein}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Réservoir plein
                    </label>
                  </div>
                </div>
              </div>

              {/* Station Service */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">
                  Station Service
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      name="stationNom"
                      value={formData.stationNom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Total Cocody"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      name="stationAdresse"
                      value={formData.stationAdresse}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Boulevard Latrille, Cocody"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de reçu</label>
                    <input
                      type="text"
                      name="numeroRecu"
                      value={formData.numeroRecu}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="REC-2024-001"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Notes supplémentaires..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : fuel ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FuelModal;
