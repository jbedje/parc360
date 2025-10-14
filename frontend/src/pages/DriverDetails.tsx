import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { driverService } from '../services/api';

const DriverDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDriverDetails();
    }
  }, [id]);

  const fetchDriverDetails = async () => {
    try {
      const response = await driverService.getOne(id!);
      setDriver(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut: string) => {
    const colors: any = {
      actif: 'bg-green-100 text-green-800',
      en_conge: 'bg-blue-100 text-blue-800',
      suspendu: 'bg-yellow-100 text-yellow-800',
      inactif: 'bg-red-100 text-red-800',
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (statut: string) => {
    const labels: any = {
      actif: 'Actif',
      en_conge: 'En Congé',
      suspendu: 'Suspendu',
      inactif: 'Inactif',
    };
    return labels[statut] || statut;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-lg text-gray-600">Chargement...</div></div>;
  if (!driver) return <div className="text-center py-12"><p className="text-gray-500">Conducteur non trouvé</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/drivers')} className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{driver.user?.nom} {driver.user?.prenom}</h1>
            <p className="text-gray-500">{driver.user?.email}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(driver.statut)}`}>
          {getStatusLabel(driver.statut)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations Personnelles</h2>
          <dl className="space-y-3">
            <div className="flex justify-between"><dt className="text-sm text-gray-500">Nom complet</dt><dd className="text-sm font-medium text-gray-900">{driver.user?.nom} {driver.user?.prenom}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500">Email</dt><dd className="text-sm font-medium text-gray-900">{driver.user?.email}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500">Téléphone</dt><dd className="text-sm font-medium text-gray-900">{driver.user?.telephone}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500">Adresse</dt><dd className="text-sm font-medium text-gray-900">{driver.adresse}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500">Ville</dt><dd className="text-sm font-medium text-gray-900">{driver.ville}</dd></div>
          </dl>
        </div>

        {/* Permis de conduire */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Permis de Conduire</h2>
          <dl className="space-y-3">
            <div className="flex justify-between"><dt className="text-sm text-gray-500">Numéro</dt><dd className="text-sm font-medium text-gray-900">{driver.numeroPermis}</dd></div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Catégories</dt>
              <dd className="flex gap-1">
                {driver.categoriePermis?.map((cat: string) => (
                  <span key={cat} className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">{cat}</span>
                ))}
              </dd>
            </div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500">Délivrance</dt><dd className="text-sm font-medium text-gray-900">{new Date(driver.dateDelivrance).toLocaleDateString('fr-FR')}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500">Expiration</dt><dd className="text-sm font-medium text-gray-900">{new Date(driver.dateExpiration).toLocaleDateString('fr-FR')}</dd></div>
          </dl>
        </div>

        {/* Informations professionnelles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations Professionnelles</h2>
          <dl className="space-y-3">
            <div className="flex justify-between"><dt className="text-sm text-gray-500">Date d'embauche</dt><dd className="text-sm font-medium text-gray-900">{new Date(driver.dateEmbauche).toLocaleDateString('fr-FR')}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500">Département</dt><dd className="text-sm font-medium text-gray-900">{driver.departement}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500">Statut</dt><dd className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(driver.statut)}`}>{getStatusLabel(driver.statut)}</dd></div>
          </dl>
        </div>

        {/* Véhicule assigné */}
        {driver.vehiculeAssigne && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Véhicule Assigné</h2>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{driver.vehiculeAssigne.immatriculation}</p>
              <p className="text-sm text-gray-500">{driver.vehiculeAssigne.marque} {driver.vehiculeAssigne.modele}</p>
            </div>
          </div>
        )}

        {/* Infractions */}
        {driver.infractions && driver.infractions.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Infractions</h2>
            <div className="space-y-3">
              {driver.infractions.map((inf: any, index: number) => (
                <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-medium text-gray-900">{inf.type}</p>
                  <p className="text-sm text-gray-500">{new Date(inf.date).toLocaleDateString('fr-FR')} - {inf.montantAmende} FCFA</p>
                  {inf.description && <p className="text-sm text-gray-600 mt-1">{inf.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formations */}
        {driver.formations && driver.formations.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Formations</h2>
            <div className="space-y-3">
              {driver.formations.map((form: any, index: number) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-medium text-gray-900">{form.type}</p>
                  <p className="text-sm text-gray-500">{new Date(form.date).toLocaleDateString('fr-FR')} - {form.organisme}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {driver.notes && (
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{driver.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDetails;
