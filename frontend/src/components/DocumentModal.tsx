import React, { useState, useEffect } from 'react';

interface DocumentFormData {
  type: string;
  referenceVehicule: string;
  referenceConducteur: string;
  referenceMaintenance: string;
  categorie: string;
  nom: string;
  description: string;
  numeroDocument: string;
  dateEmission: string;
  dateExpiration: string;
}

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  document?: any;
  title: string;
  vehicles: any[];
  drivers: any[];
  maintenances: any[];
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  document,
  title,
  vehicles,
  drivers,
  maintenances,
}) => {
  const [formData, setFormData] = useState<DocumentFormData>({
    type: 'vehicule',
    referenceVehicule: '',
    referenceConducteur: '',
    referenceMaintenance: '',
    categorie: '',
    nom: '',
    description: '',
    numeroDocument: '',
    dateEmission: '',
    dateExpiration: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (document) {
      setFormData({
        type: document.type || 'vehicule',
        referenceVehicule: document.reference?.vehicule?._id || document.reference?.vehicule || '',
        referenceConducteur: document.reference?.conducteur?._id || document.reference?.conducteur || '',
        referenceMaintenance: document.reference?.maintenance?._id || document.reference?.maintenance || '',
        categorie: document.categorie || '',
        nom: document.nom || '',
        description: document.description || '',
        numeroDocument: document.numeroDocument || '',
        dateEmission: document.dateEmission ? document.dateEmission.split('T')[0] : '',
        dateExpiration: document.dateExpiration ? document.dateExpiration.split('T')[0] : '',
      });
    }
  }, [document]);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.type) newErrors.type = 'Le type est requis';
    if (!formData.categorie) newErrors.categorie = 'La catégorie est requise';
    if (!formData.nom) newErrors.nom = 'Le nom du document est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const reference: any = {};
      if (formData.type === 'vehicule' && formData.referenceVehicule) {
        reference.vehicule = formData.referenceVehicule;
      } else if (formData.type === 'conducteur' && formData.referenceConducteur) {
        reference.conducteur = formData.referenceConducteur;
      } else if (formData.type === 'maintenance' && formData.referenceMaintenance) {
        reference.maintenance = formData.referenceMaintenance;
      }

      const submitData = {
        type: formData.type,
        reference,
        categorie: formData.categorie,
        nom: formData.nom,
        description: formData.description,
        numeroDocument: formData.numeroDocument,
        dateEmission: formData.dateEmission || undefined,
        dateExpiration: formData.dateExpiration || undefined,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
                  <select name="type" value={formData.type} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.type ? 'border-red-500' : 'border-gray-300'}`}>
                    <option value="vehicule">Véhicule</option>
                    <option value="conducteur">Conducteur</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="assurance">Assurance</option>
                    <option value="autre">Autre</option>
                  </select>
                  {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                </div>

                {formData.type === 'vehicule' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule</label>
                    <select name="referenceVehicule" value={formData.referenceVehicule} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">Sélectionner</option>
                      {vehicles.map(v => <option key={v._id} value={v._id}>{v.marque} {v.modele} - {v.immatriculation}</option>)}
                    </select>
                  </div>
                )}

                {formData.type === 'conducteur' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conducteur</label>
                    <select name="referenceConducteur" value={formData.referenceConducteur} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">Sélectionner</option>
                      {drivers.map(d => <option key={d._id} value={d._id}>{d.user?.nom || d.nom || 'N/A'} {d.user?.prenom || d.prenom || ''}</option>)}
                    </select>
                  </div>
                )}

                {formData.type === 'maintenance' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance</label>
                    <select name="referenceMaintenance" value={formData.referenceMaintenance} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">Sélectionner</option>
                      {maintenances.map(m => <option key={m._id} value={m._id}>{m.vehicule?.immatriculation} - {new Date(m.dateDebut).toLocaleDateString()}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie <span className="text-red-500">*</span></label>
                  <input type="text" name="categorie" value={formData.categorie} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors.categorie ? 'border-red-500' : 'border-gray-300'}`} placeholder="Carte grise, Permis, Facture..." />
                  {errors.categorie && <p className="mt-1 text-sm text-red-500">{errors.categorie}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du document <span className="text-red-500">*</span></label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors.nom ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro du document</label>
                  <input type="text" name="numeroDocument" value={formData.numeroDocument} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'émission</label>
                  <input type="date" name="dateEmission" value={formData.dateEmission} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                  <input type="date" name="dateExpiration" value={formData.dateExpiration} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100" disabled={loading}>Annuler</button>
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50" disabled={loading}>
                {loading ? 'Enregistrement...' : document ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
