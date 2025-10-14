import React, { useState, useEffect } from 'react';

interface Passager {
  nom: string;
  telephone: string;
}

interface TripFormData {
  vehicule: string;
  conducteur: string;
  dateDepart: string;
  dateRetour: string;
  lieuDepart: string;
  lieuArrivee: string;
  objet: string;
  kilometrageDepart: string;
  kilometrageArrivee: string;
  statut: string;
  fraisPeage: string;
  fraisParking: string;
  autresFrais: string;
  observations: string;
}

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  trip?: any;
  title: string;
  vehicles: any[];
  drivers: any[];
}

const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  trip,
  title,
  vehicles,
  drivers,
}) => {
  const [formData, setFormData] = useState<TripFormData>({
    vehicule: '',
    conducteur: '',
    dateDepart: new Date().toISOString().split('T')[0],
    dateRetour: '',
    lieuDepart: '',
    lieuArrivee: '',
    objet: '',
    kilometrageDepart: '',
    kilometrageArrivee: '',
    statut: 'planifie',
    fraisPeage: '0',
    fraisParking: '0',
    autresFrais: '0',
    observations: '',
  });

  const [passagers, setPassagers] = useState<Passager[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});  useEffect(() => {
    if (isOpen) {    }
  }, [isOpen, vehicles, drivers]);

  useEffect(() => {
    if (trip) {
      setFormData({
        vehicule: trip.vehicule?._id || trip.vehicule || '',
        conducteur: trip.conducteur?._id || trip.conducteur || '',
        dateDepart: trip.dateDepart ? trip.dateDepart.split('T')[0] : '',
        dateRetour: trip.dateRetour ? trip.dateRetour.split('T')[0] : '',
        lieuDepart: trip.lieuDepart || '',
        lieuArrivee: trip.lieuArrivee || '',
        objet: trip.objet || '',
        kilometrageDepart: trip.kilometrageDepart?.toString() || '',
        kilometrageArrivee: trip.kilometrageArrivee?.toString() || '',
        statut: trip.statut || 'planifie',
        fraisPeage: trip.fraisPeage?.toString() || '0',
        fraisParking: trip.fraisParking?.toString() || '0',
        autresFrais: trip.autresFrais?.toString() || '0',
        observations: trip.observations || '',
      });
      setPassagers(trip.passagers || []);
    }
  }, [trip]);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.vehicule) newErrors.vehicule = 'Le véhicule est requis';
    if (!formData.conducteur) newErrors.conducteur = 'Le conducteur est requis';
    if (!formData.dateDepart) newErrors.dateDepart = 'La date de départ est requise';
    if (!formData.lieuDepart) newErrors.lieuDepart = 'Le lieu de départ est requis';
    if (!formData.lieuArrivee) newErrors.lieuArrivee = 'Le lieu d\'arrivée est requis';
    if (!formData.objet) newErrors.objet = 'L\'objet du déplacement est requis';
    if (!formData.kilometrageDepart) newErrors.kilometrageDepart = 'Le kilométrage de départ est requis';

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
        dateDepart: formData.dateDepart,
        dateRetour: formData.dateRetour || undefined,
        lieuDepart: formData.lieuDepart,
        lieuArrivee: formData.lieuArrivee,
        objet: formData.objet,
        passagers,
        kilometrageDepart: Number(formData.kilometrageDepart),
        kilometrageArrivee: formData.kilometrageArrivee ? Number(formData.kilometrageArrivee) : undefined,
        statut: formData.statut,
        fraisPeage: Number(formData.fraisPeage),
        fraisParking: Number(formData.fraisParking),
        autresFrais: Number(formData.autresFrais),
        observations: formData.observations,
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

  const addPassager = () => {
    setPassagers([...passagers, { nom: '', telephone: '' }]);
  };

  const removePassager = (index: number) => {
    setPassagers(passagers.filter((_, i) => i !== index));
  };

  const updatePassager = (index: number, field: keyof Passager, value: string) => {
    const newPassagers = [...passagers];
    newPassagers[index] = { ...newPassagers[index], [field]: value };
    setPassagers(newPassagers);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-primary-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">{title}</h3>
                <button type="button" onClick={onClose} className="text-white hover:text-gray-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-4 max-h-[75vh] overflow-y-auto">
              {errors.submit && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{errors.submit}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule <span className="text-red-500">*</span></label>
                  <select name="vehicule" value={formData.vehicule} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.vehicule ? 'border-red-500' : 'border-gray-300'}`}>
                    <option value="">Sélectionner</option>
                    {vehicles.map(v => <option key={v._id} value={v._id}>{v.marque} {v.modele} - {v.immatriculation}</option>)}
                  </select>
                  {errors.vehicule && <p className="mt-1 text-sm text-red-500">{errors.vehicule}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conducteur <span className="text-red-500">*</span></label>
                  <select name="conducteur" value={formData.conducteur} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.conducteur ? 'border-red-500' : 'border-gray-300'}`}>
                    <option value="">Sélectionner</option>
                    {drivers.map(d => <option key={d._id} value={d._id}>{d.user?.nom || d.nom || 'N/A'} {d.user?.prenom || d.prenom || ''}</option>)}
                  </select>
                  {errors.conducteur && <p className="mt-1 text-sm text-red-500">{errors.conducteur}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date départ <span className="text-red-500">*</span></label>
                  <input type="date" name="dateDepart" value={formData.dateDepart} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors.dateDepart ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.dateDepart && <p className="mt-1 text-sm text-red-500">{errors.dateDepart}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date retour</label>
                  <input type="date" name="dateRetour" value={formData.dateRetour} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu départ <span className="text-red-500">*</span></label>
                  <input type="text" name="lieuDepart" value={formData.lieuDepart} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors.lieuDepart ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.lieuDepart && <p className="mt-1 text-sm text-red-500">{errors.lieuDepart}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu arrivée <span className="text-red-500">*</span></label>
                  <input type="text" name="lieuArrivee" value={formData.lieuArrivee} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors.lieuArrivee ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.lieuArrivee && <p className="mt-1 text-sm text-red-500">{errors.lieuArrivee}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Objet du déplacement <span className="text-red-500">*</span></label>
                  <textarea name="objet" value={formData.objet} onChange={handleChange} rows={2} className={`w-full px-3 py-2 border rounded-lg ${errors.objet ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.objet && <p className="mt-1 text-sm text-red-500">{errors.objet}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage départ <span className="text-red-500">*</span></label>
                  <input type="number" name="kilometrageDepart" value={formData.kilometrageDepart} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors.kilometrageDepart ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.kilometrageDepart && <p className="mt-1 text-sm text-red-500">{errors.kilometrageDepart}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage arrivée</label>
                  <input type="number" name="kilometrageArrivee" value={formData.kilometrageArrivee} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select name="statut" value={formData.statut} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="planifie">Planifié</option>
                    <option value="en_cours">En Cours</option>
                    <option value="termine">Terminé</option>
                    <option value="annule">Annulé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frais péage (FCFA)</label>
                  <input type="number" name="fraisPeage" value={formData.fraisPeage} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frais parking (FCFA)</label>
                  <input type="number" name="fraisParking" value={formData.fraisParking} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Autres frais (FCFA)</label>
                  <input type="number" name="autresFrais" value={formData.autresFrais} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Passagers</label>
                  <button type="button" onClick={addPassager} className="text-sm px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700">+ Ajouter</button>
                </div>
                {passagers.map((p, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                    <input type="text" placeholder="Nom" value={p.nom} onChange={(e) => updatePassager(i, 'nom', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                    <input type="text" placeholder="Téléphone" value={p.telephone} onChange={(e) => updatePassager(i, 'telephone', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                    <button type="button" onClick={() => removePassager(i)} className="text-red-600 hover:text-red-800">Retirer</button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
                <textarea name="observations" value={formData.observations} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100" disabled={loading}>Annuler</button>
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50" disabled={loading}>
                {loading ? 'Enregistrement...' : trip ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TripModal;
