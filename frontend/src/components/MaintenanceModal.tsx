import React, { useState, useEffect } from 'react';

interface Piece {
  nom: string;
  reference: string;
  quantite: number;
  prixUnitaire: number;
}

interface MaintenanceFormData {
  vehicule: string;
  type: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  kilometrageActuel: string;
  prochainEntretien: string;
  garageNom: string;
  garageAdresse: string;
  garageTelephone: string;
  technicien: string;
  mainOeuvre: string;
  coutTotal: string;
  factureNumero: string;
  notes: string;
}

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  maintenance?: any;
  title: string;
  vehicles: any[];
  users: any[];
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  maintenance,
  title,
  vehicles,
  users,
}) => {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    vehicule: '',
    type: 'preventive',
    description: '',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    statut: 'planifie',
    kilometrageActuel: '',
    prochainEntretien: '',
    garageNom: '',
    garageAdresse: '',
    garageTelephone: '',
    technicien: '',
    mainOeuvre: '0',
    coutTotal: '0',
    factureNumero: '',
    notes: '',
  });

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Debug: log vehicles when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('MaintenanceModal opened with vehicles:', vehicles);
      console.log('Number of vehicles:', vehicles.length);
    }
  }, [isOpen, vehicles]);

  useEffect(() => {
    if (maintenance) {
      setFormData({
        vehicule: maintenance.vehicule?._id || maintenance.vehicule || '',
        type: maintenance.type || 'preventive',
        description: maintenance.description || '',
        dateDebut: maintenance.dateDebut ? maintenance.dateDebut.split('T')[0] : '',
        dateFin: maintenance.dateFin ? maintenance.dateFin.split('T')[0] : '',
        statut: maintenance.statut || 'planifie',
        kilometrageActuel: maintenance.kilometrageActuel?.toString() || '',
        prochainEntretien: maintenance.prochainEntretien?.toString() || '',
        garageNom: maintenance.garage?.nom || '',
        garageAdresse: maintenance.garage?.adresse || '',
        garageTelephone: maintenance.garage?.telephone || '',
        technicien: maintenance.technicien?._id || maintenance.technicien || '',
        mainOeuvre: maintenance.mainOeuvre?.toString() || '0',
        coutTotal: maintenance.coutTotal?.toString() || '0',
        factureNumero: maintenance.facture?.numero || '',
        notes: maintenance.notes || '',
      });
      setPieces(maintenance.pieces || []);
    } else {
      // Reset pour création
      setPieces([]);
    }
  }, [maintenance]);

  const validate = () => {
    const newErrors: any = {};

    if (!formData.vehicule) newErrors.vehicule = 'Le véhicule est requis';
    if (!formData.type) newErrors.type = 'Le type est requis';
    if (!formData.description) newErrors.description = 'La description est requise';
    if (!formData.dateDebut) newErrors.dateDebut = 'La date de début est requise';
    if (!formData.kilometrageActuel) newErrors.kilometrageActuel = 'Le kilométrage actuel est requis';
    if (!formData.coutTotal) newErrors.coutTotal = 'Le coût total est requis';

    // Validation des nombres
    if (formData.kilometrageActuel && isNaN(Number(formData.kilometrageActuel))) {
      newErrors.kilometrageActuel = 'Le kilométrage doit être un nombre';
    }
    if (formData.prochainEntretien && isNaN(Number(formData.prochainEntretien))) {
      newErrors.prochainEntretien = 'Le kilométrage doit être un nombre';
    }
    if (formData.mainOeuvre && isNaN(Number(formData.mainOeuvre))) {
      newErrors.mainOeuvre = 'La main d\'œuvre doit être un nombre';
    }
    if (formData.coutTotal && isNaN(Number(formData.coutTotal))) {
      newErrors.coutTotal = 'Le coût total doit être un nombre';
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
        type: formData.type,
        description: formData.description,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin || undefined,
        statut: formData.statut,
        kilometrageActuel: Number(formData.kilometrageActuel),
        prochainEntretien: formData.prochainEntretien ? Number(formData.prochainEntretien) : undefined,
        garage: {
          nom: formData.garageNom,
          adresse: formData.garageAdresse,
          telephone: formData.garageTelephone,
        },
        technicien: formData.technicien || undefined,
        pieces: pieces,
        mainOeuvre: Number(formData.mainOeuvre),
        coutTotal: Number(formData.coutTotal),
        facture: {
          numero: formData.factureNumero,
        },
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addPiece = () => {
    setPieces([...pieces, { nom: '', reference: '', quantite: 1, prixUnitaire: 0 }]);
  };

  const removePiece = (index: number) => {
    setPieces(pieces.filter((_, i) => i !== index));
  };

  const updatePiece = (index: number, field: keyof Piece, value: string | number) => {
    const newPieces = [...pieces];
    newPieces[index] = { ...newPieces[index], [field]: value };
    setPieces(newPieces);
  };

  const calculateTotal = () => {
    const piecesCost = pieces.reduce((sum, piece) => sum + (piece.quantite * piece.prixUnitaire), 0);
    const mainOeuvreCost = Number(formData.mainOeuvre) || 0;
    return piecesCost + mainOeuvreCost;
  };

  useEffect(() => {
    const total = calculateTotal();
    setFormData(prev => ({ ...prev, coutTotal: total.toString() }));
  }, [pieces, formData.mainOeuvre]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
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

              {/* Informations Générales */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">
                  Informations Générales
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
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="preventive">Préventive</option>
                      <option value="corrective">Corrective</option>
                      <option value="revision">Révision</option>
                      <option value="reparation">Réparation</option>
                      <option value="autre">Autre</option>
                    </select>
                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Décrivez la maintenance..."
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateDebut"
                      value={formData.dateDebut}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.dateDebut ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateDebut && <p className="mt-1 text-sm text-red-500">{errors.dateDebut}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      name="dateFin"
                      value={formData.dateFin}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      name="statut"
                      value={formData.statut}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="planifie">Planifié</option>
                      <option value="en_cours">En Cours</option>
                      <option value="termine">Terminé</option>
                      <option value="annule">Annulé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kilométrage actuel <span className="text-red-500">*</span>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prochain entretien (km)
                    </label>
                    <input
                      type="number"
                      name="prochainEntretien"
                      value={formData.prochainEntretien}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.prochainEntretien ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="30000"
                    />
                    {errors.prochainEntretien && <p className="mt-1 text-sm text-red-500">{errors.prochainEntretien}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technicien</label>
                    <select
                      name="technicien"
                      value={formData.technicien}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Sélectionner un technicien</option>
                      {users.filter(u => u.role === 'mecanicien' || u.role === 'admin').map(user => (
                        <option key={user._id} value={user._id}>
                          {user.nom} {user.prenom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Informations Garage */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">
                  Informations Garage
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du garage</label>
                    <input
                      type="text"
                      name="garageNom"
                      value={formData.garageNom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Garage du Plateau"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      name="garageAdresse"
                      value={formData.garageAdresse}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Plateau, Abidjan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="garageTelephone"
                      value={formData.garageTelephone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="+225 0701020304"
                    />
                  </div>
                </div>
              </div>

              {/* Pièces */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3 border-b pb-2">
                  <h4 className="text-md font-semibold text-gray-900">Pièces</h4>
                  <button
                    type="button"
                    onClick={addPiece}
                    className="text-sm px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
                  >
                    + Ajouter une pièce
                  </button>
                </div>
                {pieces.length === 0 ? (
                  <p className="text-gray-500 text-sm">Aucune pièce ajoutée</p>
                ) : (
                  <div className="space-y-3">
                    {pieces.map((piece, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <input
                            type="text"
                            placeholder="Nom"
                            value={piece.nom}
                            onChange={(e) => updatePiece(index, 'nom', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Référence"
                            value={piece.reference}
                            onChange={(e) => updatePiece(index, 'reference', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Quantité"
                            value={piece.quantite}
                            onChange={(e) => updatePiece(index, 'quantite', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Prix unitaire"
                            value={piece.prixUnitaire}
                            onChange={(e) => updatePiece(index, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{(piece.quantite * piece.prixUnitaire).toLocaleString()} FCFA</span>
                          <button
                            type="button"
                            onClick={() => removePiece(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coûts */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">
                  Coûts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main d'œuvre (FCFA)
                    </label>
                    <input
                      type="number"
                      name="mainOeuvre"
                      value={formData.mainOeuvre}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.mainOeuvre ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="50000"
                    />
                    {errors.mainOeuvre && <p className="mt-1 text-sm text-red-500">{errors.mainOeuvre}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de facture</label>
                    <input
                      type="text"
                      name="factureNumero"
                      value={formData.factureNumero}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="FAC-2024-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coût total (FCFA) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="coutTotal"
                      value={formData.coutTotal}
                      onChange={handleChange}
                      disabled
                      className={`w-full px-3 py-2 border rounded-lg bg-gray-100 ${
                        errors.coutTotal ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.coutTotal && <p className="mt-1 text-sm text-red-500">{errors.coutTotal}</p>}
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
                {loading ? 'Enregistrement...' : maintenance ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModal;
