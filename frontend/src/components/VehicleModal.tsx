import React, { useState, useEffect } from 'react';

interface VehicleFormData {
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  type: string;
  couleur: string;
  numeroSerie: string;
  kilometrage: number;
  dateAchat: string;
  prixAchat: number;
  statut: string;
  carburant: string;
  capaciteReservoir: number;
  consommationMoyenne: number;
  departement: string;
  notes: string;
}

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  vehicle?: any;
  title: string;
}

const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vehicle,
  title,
}) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    immatriculation: '',
    marque: '',
    modele: '',
    annee: new Date().getFullYear(),
    type: 'voiture',
    couleur: '',
    numeroSerie: '',
    kilometrage: 0,
    dateAchat: new Date().toISOString().split('T')[0],
    prixAchat: 0,
    statut: 'disponible',
    carburant: 'essence',
    capaciteReservoir: 50,
    consommationMoyenne: 7,
    departement: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        immatriculation: vehicle.immatriculation || '',
        marque: vehicle.marque || '',
        modele: vehicle.modele || '',
        annee: vehicle.annee || new Date().getFullYear(),
        type: vehicle.type || 'voiture',
        couleur: vehicle.couleur || '',
        numeroSerie: vehicle.numeroSerie || '',
        kilometrage: vehicle.kilometrage || 0,
        dateAchat: vehicle.dateAchat ? vehicle.dateAchat.split('T')[0] : new Date().toISOString().split('T')[0],
        prixAchat: vehicle.prixAchat || 0,
        statut: vehicle.statut || 'disponible',
        carburant: vehicle.carburant || 'essence',
        capaciteReservoir: vehicle.capaciteReservoir || 50,
        consommationMoyenne: vehicle.consommationMoyenne || 7,
        departement: vehicle.departement || '',
        notes: vehicle.notes || '',
      });
    }
  }, [vehicle]);

  const validate = () => {
    const newErrors: any = {};

    if (!formData.immatriculation) newErrors.immatriculation = 'L\'immatriculation est requise';
    if (!formData.marque) newErrors.marque = 'La marque est requise';
    if (!formData.modele) newErrors.modele = 'Le modèle est requis';
    if (!formData.annee || formData.annee < 1900) newErrors.annee = 'L\'année est invalide';
    if (!formData.departement) newErrors.departement = 'Le département est requis';
    if (!formData.prixAchat || formData.prixAchat <= 0) newErrors.prixAchat = 'Le prix d\'achat est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      console.error('Erreur:', error);
      setErrors({ submit: error.response?.data?.message || 'Une erreur est survenue' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['annee', 'kilometrage', 'prixAchat', 'capaciteReservoir', 'consommationMoyenne'].includes(name)
        ? Number(value)
        : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
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
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {errors.submit}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Immatriculation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Immatriculation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="immatriculation"
                    value={formData.immatriculation}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.immatriculation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="AB 1234 CI"
                  />
                  {errors.immatriculation && (
                    <p className="mt-1 text-sm text-red-500">{errors.immatriculation}</p>
                  )}
                </div>

                {/* Marque */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marque <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="marque"
                    value={formData.marque}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.marque ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Toyota"
                  />
                  {errors.marque && <p className="mt-1 text-sm text-red-500">{errors.marque}</p>}
                </div>

                {/* Modèle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modèle <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="modele"
                    value={formData.modele}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.modele ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Hilux"
                  />
                  {errors.modele && <p className="mt-1 text-sm text-red-500">{errors.modele}</p>}
                </div>

                {/* Année */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="annee"
                    value={formData.annee}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.annee ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.annee && <p className="mt-1 text-sm text-red-500">{errors.annee}</p>}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="voiture">Voiture</option>
                    <option value="camion">Camion</option>
                    <option value="moto">Moto</option>
                    <option value="bus">Bus</option>
                    <option value="utilitaire">Utilitaire</option>
                  </select>
                </div>

                {/* Couleur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                  <input
                    type="text"
                    name="couleur"
                    value={formData.couleur}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Blanc"
                  />
                </div>

                {/* Numéro de série */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de série
                  </label>
                  <input
                    type="text"
                    name="numeroSerie"
                    value={formData.numeroSerie}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="TOY2021HILUX001"
                  />
                </div>

                {/* Kilométrage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kilométrage
                  </label>
                  <input
                    type="number"
                    name="kilometrage"
                    value={formData.kilometrage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                  />
                </div>

                {/* Date d'achat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'achat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateAchat"
                    value={formData.dateAchat}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Prix d'achat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix d'achat (FCFA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="prixAchat"
                    value={formData.prixAchat}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.prixAchat ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="0"
                  />
                  {errors.prixAchat && <p className="mt-1 text-sm text-red-500">{errors.prixAchat}</p>}
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="en_service">En Service</option>
                    <option value="en_maintenance">En Maintenance</option>
                    <option value="hors_service">Hors Service</option>
                  </select>
                </div>

                {/* Carburant */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carburant <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="carburant"
                    value={formData.carburant}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="essence">Essence</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybride">Hybride</option>
                    <option value="electrique">Électrique</option>
                  </select>
                </div>

                {/* Capacité réservoir */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacité réservoir (L)
                  </label>
                  <input
                    type="number"
                    name="capaciteReservoir"
                    value={formData.capaciteReservoir}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                  />
                </div>

                {/* Consommation moyenne */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consommation moyenne (L/100km)
                  </label>
                  <input
                    type="number"
                    name="consommationMoyenne"
                    value={formData.consommationMoyenne}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.1"
                  />
                </div>

                {/* Département */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Département <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="departement"
                    value={formData.departement}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.departement ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Commercial"
                  />
                  {errors.departement && <p className="mt-1 text-sm text-red-500">{errors.departement}</p>}
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
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
                {loading ? 'Enregistrement...' : vehicle ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;
