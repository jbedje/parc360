import React, { useState, useEffect } from 'react';
import { insuranceService, vehicleService } from '../services/api';
import {
  DocumentCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

interface Insurance {
  _id: string;
  vehicule: {
    _id: string;
    immatriculation: string;
    marque: string;
    modele: string;
  };
  compagnie: string;
  numeroPolice: string;
  typeAssurance: 'tiers' | 'tiers_complet' | 'tous_risques';
  montantPrime: number;
  dateDebut: string;
  dateExpiration: string;
  statut: 'valide' | 'expire' | 'suspendu' | 'annule';
  sinistres?: any[];
}

interface Vehicle {
  _id: string;
  immatriculation: string;
  marque: string;
  modele: string;
}

const Insurances: React.FC = () => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<Insurance | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    valides: 0,
    expires: 0,
    expiringSoon: 0,
    totalPrimes: 0,
  });
  const [formData, setFormData] = useState({
    vehicule: '',
    compagnie: '',
    numeroPolice: '',
    typeAssurance: 'tiers' as Insurance['typeAssurance'],
    montantPrime: 0,
    dateDebut: '',
    dateExpiration: '',
  });

  useEffect(() => {
    fetchInsurances();
    fetchVehicles();
    fetchStats();
  }, []);

  const fetchInsurances = async () => {
    try {
      const response = await insuranceService.getAll();
      setInsurances(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des assurances:', error);
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await vehicleService.getAll();
      setVehicles(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des véhicules:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await insuranceService.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInsurance) {
        await insuranceService.update(editingInsurance._id, formData);
      } else {
        await insuranceService.create(formData);
      }
      fetchInsurances();
      fetchStats();
      closeModal();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette assurance ?')) {
      return;
    }
    try {
      await insuranceService.delete(id);
      fetchInsurances();
      fetchStats();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const openModal = (insurance?: Insurance) => {
    if (insurance) {
      setEditingInsurance(insurance);
      setFormData({
        vehicule: insurance.vehicule._id,
        compagnie: insurance.compagnie,
        numeroPolice: insurance.numeroPolice,
        typeAssurance: insurance.typeAssurance,
        montantPrime: insurance.montantPrime,
        dateDebut: insurance.dateDebut.split('T')[0],
        dateExpiration: insurance.dateExpiration.split('T')[0],
      });
    } else {
      setEditingInsurance(null);
      setFormData({
        vehicule: '',
        compagnie: '',
        numeroPolice: '',
        typeAssurance: 'tiers',
        montantPrime: 0,
        dateDebut: '',
        dateExpiration: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingInsurance(null);
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'valide':
        return 'bg-cipme-green/10 text-cipme-green';
      case 'expire':
        return 'bg-red-100 text-red-600';
      case 'suspendu':
        return 'bg-yellow-100 text-yellow-600';
      case 'annule':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tiers':
        return 'Tiers';
      case 'tiers_complet':
        return 'Tiers Complet';
      case 'tous_risques':
        return 'Tous Risques';
      default:
        return type;
    }
  };

  const getDaysUntilExpiration = (dateExpiration: string) => {
    const today = new Date();
    const expDate = new Date(dateExpiration);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cipme-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center">
            <DocumentCheckIcon className="w-8 h-8 mr-3 text-cipme-orange" />
            Gestion des Assurances
          </h1>
          <p className="text-gray-600 mt-1">Suivi des polices d'assurance et sinistres</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-cipme-orange to-cipme-orange-dark text-white rounded-xl shadow-lg hover:shadow-cipme-lg transition-all"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nouvelle Assurance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-cipme-orange to-cipme-orange-dark rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Total</p>
          <p className="text-4xl font-black text-white mt-3">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-cipme-green to-cipme-green-dark rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Valides</p>
          <p className="text-4xl font-black text-white mt-3">{stats.valides}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Expirées</p>
          <p className="text-4xl font-black text-white mt-3">{stats.expires}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">À renouveler</p>
          <p className="text-4xl font-black text-white mt-3">{stats.expiringSoon}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Primes Total</p>
          <p className="text-2xl font-black text-white mt-3">
            {stats.totalPrimes.toLocaleString()} F
          </p>
        </div>
      </div>

      {/* Insurances Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-cipme-charcoal to-cipme-gray text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Compagnie
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  N° Police
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Prime
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Expiration
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {insurances.map((insurance) => {
                const daysLeft = getDaysUntilExpiration(insurance.dateExpiration);
                return (
                  <tr key={insurance._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">
                        {insurance.vehicule.marque} {insurance.vehicule.modele}
                      </div>
                      <div className="text-sm text-gray-500">
                        {insurance.vehicule.immatriculation}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {insurance.compagnie}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{insurance.numeroPolice}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">
                        {getTypeLabel(insurance.typeAssurance)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {insurance.montantPrime.toLocaleString()} F
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(insurance.dateExpiration).toLocaleDateString('fr-FR')}
                      </div>
                      {insurance.statut === 'valide' && daysLeft <= 30 && (
                        <div className="text-xs text-yellow-600 font-medium mt-1 flex items-center">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {daysLeft} jours restants
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                          insurance.statut
                        )}`}
                      >
                        {insurance.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(insurance)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Modifier"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(insurance._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Supprimer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-cipme-orange to-cipme-orange-dark p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white flex items-center">
                  <DocumentCheckIcon className="w-6 h-6 mr-2" />
                  {editingInsurance ? 'Modifier Assurance' : 'Nouvelle Assurance'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Véhicule</label>
                <select
                  required
                  value={formData.vehicule}
                  onChange={(e) => setFormData({ ...formData, vehicule: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
                >
                  <option value="">Sélectionner un véhicule</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.marque} {vehicle.modele} ({vehicle.immatriculation})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Compagnie</label>
                  <input
                    type="text"
                    required
                    value={formData.compagnie}
                    onChange={(e) => setFormData({ ...formData, compagnie: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
                    placeholder="Ex: NSIA, AXA..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">N° Police</label>
                  <input
                    type="text"
                    required
                    value={formData.numeroPolice}
                    onChange={(e) => setFormData({ ...formData, numeroPolice: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Type d'Assurance
                  </label>
                  <select
                    required
                    value={formData.typeAssurance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        typeAssurance: e.target.value as Insurance['typeAssurance'],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
                  >
                    <option value="tiers">Tiers</option>
                    <option value="tiers_complet">Tiers Complet</option>
                    <option value="tous_risques">Tous Risques</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Montant Prime (FCFA)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.montantPrime}
                    onChange={(e) =>
                      setFormData({ ...formData, montantPrime: parseFloat(e.target.value) })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date Début</label>
                  <input
                    type="date"
                    required
                    value={formData.dateDebut}
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Date Expiration
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateExpiration}
                    onChange={(e) => setFormData({ ...formData, dateExpiration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cipme-orange to-cipme-orange-dark text-white rounded-xl shadow-lg hover:shadow-cipme-lg transition-all font-bold"
                >
                  {editingInsurance ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insurances;
