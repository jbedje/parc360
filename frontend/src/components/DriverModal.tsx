import React, { useState, useEffect } from 'react';

interface DriverFormData {
  // Données utilisateur
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;

  // Données conducteur
  numeroPermis: string;
  categoriePermis: string[];
  dateDelivrance: string;
  dateExpiration: string;
  adresse: string;
  ville: string;
  dateEmbauche: string;
  departement: string;
  statut: string;
  notes: string;
}

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  driver?: any;
  title: string;
}

const DriverModal: React.FC<DriverModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  driver,
  title,
}) => {
  const [formData, setFormData] = useState<DriverFormData>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    numeroPermis: '',
    categoriePermis: [],
    dateDelivrance: new Date().toISOString().split('T')[0],
    dateExpiration: new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0],
    adresse: '',
    ville: '',
    dateEmbauche: new Date().toISOString().split('T')[0],
    departement: '',
    statut: 'actif',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categoriesPermis = ['A', 'B', 'C', 'D', 'E'];

  useEffect(() => {
    if (driver) {
      setFormData({
        nom: driver.user?.nom || '',
        prenom: driver.user?.prenom || '',
        email: driver.user?.email || '',
        password: '',
        telephone: driver.user?.telephone || '',
        numeroPermis: driver.numeroPermis || '',
        categoriePermis: driver.categoriePermis || [],
        dateDelivrance: driver.dateDelivrance ? driver.dateDelivrance.split('T')[0] : '',
        dateExpiration: driver.dateExpiration ? driver.dateExpiration.split('T')[0] : '',
        adresse: driver.adresse || '',
        ville: driver.ville || '',
        dateEmbauche: driver.dateEmbauche ? driver.dateEmbauche.split('T')[0] : '',
        departement: driver.departement || '',
        statut: driver.statut || 'actif',
        notes: driver.notes || '',
      });
      setSelectedCategories(driver.categoriePermis || []);
    } else {
      // Reset pour création
      setSelectedCategories([]);
    }
  }, [driver]);

  const validate = () => {
    const newErrors: any = {};

    // Validation utilisateur
    if (!formData.nom) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    if (!driver && !formData.password) newErrors.password = 'Le mot de passe est requis';
    if (!driver && formData.password && formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (!formData.telephone) newErrors.telephone = 'Le téléphone est requis';

    // Validation conducteur
    if (!formData.numeroPermis) newErrors.numeroPermis = 'Le numéro de permis est requis';
    if (selectedCategories.length === 0) newErrors.categoriePermis = 'Au moins une catégorie est requise';
    if (!formData.dateDelivrance) newErrors.dateDelivrance = 'La date de délivrance est requise';
    if (!formData.dateExpiration) newErrors.dateExpiration = 'La date d\'expiration est requise';
    if (!formData.adresse) newErrors.adresse = 'L\'adresse est requise';
    if (!formData.ville) newErrors.ville = 'La ville est requise';
    if (!formData.dateEmbauche) newErrors.dateEmbauche = 'La date d\'embauche est requise';
    if (!formData.departement) newErrors.departement = 'Le département est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        userData: {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          ...(formData.password && { password: formData.password }),
        },
        driverData: {
          numeroPermis: formData.numeroPermis,
          categoriePermis: selectedCategories,
          dateDelivrance: formData.dateDelivrance,
          dateExpiration: formData.dateExpiration,
          adresse: formData.adresse,
          ville: formData.ville,
          dateEmbauche: formData.dateEmbauche,
          departement: formData.departement,
          statut: formData.statut,
          notes: formData.notes,
        },
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

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
    if (errors.categoriePermis) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors.categoriePermis;
        return newErrors;
      });
    }
  };

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
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {errors.submit}
                </div>
              )}

              {/* Informations Utilisateur */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">
                  Informations Personnelles
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.nom ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Diallo"
                    />
                    {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.prenom ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Mohamed"
                    />
                    {errors.prenom && <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!!driver}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } ${driver ? 'bg-gray-100' : ''}`}
                      placeholder="mohamed.diallo@parc360.ci"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  {!driver && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                      />
                      {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.telephone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+225 0701010101"
                    />
                    {errors.telephone && <p className="mt-1 text-sm text-red-500">{errors.telephone}</p>}
                  </div>
                </div>
              </div>

              {/* Informations Permis */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">
                  Permis de Conduire
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de permis <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroPermis"
                      value={formData.numeroPermis}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.numeroPermis ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="CI2015001234"
                    />
                    {errors.numeroPermis && <p className="mt-1 text-sm text-red-500">{errors.numeroPermis}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégories <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {categoriesPermis.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`px-4 py-2 rounded-lg border-2 transition ${
                            selectedCategories.includes(cat)
                              ? 'border-primary-600 bg-primary-50 text-primary-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    {errors.categoriePermis && <p className="mt-1 text-sm text-red-500">{errors.categoriePermis}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de délivrance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateDelivrance"
                      value={formData.dateDelivrance}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.dateDelivrance ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateDelivrance && <p className="mt-1 text-sm text-red-500">{errors.dateDelivrance}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date d'expiration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateExpiration"
                      value={formData.dateExpiration}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.dateExpiration ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateExpiration && <p className="mt-1 text-sm text-red-500">{errors.dateExpiration}</p>}
                  </div>
                </div>
              </div>

              {/* Informations d'Embauche */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">
                  Informations Professionnelles
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.adresse ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Cocody, Abidjan"
                    />
                    {errors.adresse && <p className="mt-1 text-sm text-red-500">{errors.adresse}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.ville ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Abidjan"
                    />
                    {errors.ville && <p className="mt-1 text-sm text-red-500">{errors.ville}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date d'embauche <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateEmbauche"
                      value={formData.dateEmbauche}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.dateEmbauche ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateEmbauche && <p className="mt-1 text-sm text-red-500">{errors.dateEmbauche}</p>}
                  </div>

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
                      placeholder="Transport"
                    />
                    {errors.departement && <p className="mt-1 text-sm text-red-500">{errors.departement}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      name="statut"
                      value={formData.statut}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="actif">Actif</option>
                      <option value="en_conge">En Congé</option>
                      <option value="suspendu">Suspendu</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>

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
                {loading ? 'Enregistrement...' : driver ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverModal;
