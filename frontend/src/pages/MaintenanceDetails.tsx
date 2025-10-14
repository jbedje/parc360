import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { maintenanceService } from '../services/api';

interface Maintenance {
  _id: string;
  vehicule: {
    _id: string;
    marque: string;
    modele: string;
    immatriculation: string;
    type: string;
  };
  type: string;
  description: string;
  dateDebut: string;
  dateFin?: string;
  statut: string;
  kilometrageActuel: number;
  prochainEntretien?: number;
  garage?: {
    nom: string;
    adresse: string;
    telephone: string;
  };
  technicien?: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  pieces: Array<{
    nom: string;
    reference: string;
    quantite: number;
    prixUnitaire: number;
  }>;
  mainOeuvre: number;
  coutTotal: number;
  facture?: {
    numero: string;
    fichier?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const MaintenanceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaintenance();
  }, [id]);

  const loadMaintenance = async () => {
    try {
      setLoading(true);
      const response = await maintenanceService.getOne(id!);
      setMaintenance(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      preventive: 'Préventive',
      corrective: 'Corrective',
      revision: 'Révision',
      reparation: 'Réparation',
      autre: 'Autre',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      preventive: 'bg-blue-100 text-blue-800',
      corrective: 'bg-orange-100 text-orange-800',
      revision: 'bg-purple-100 text-purple-800',
      reparation: 'bg-red-100 text-red-800',
      autre: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatutLabel = (statut: string) => {
    const labels: { [key: string]: string } = {
      planifie: 'Planifié',
      en_cours: 'En Cours',
      termine: 'Terminé',
      annule: 'Annulé',
    };
    return labels[statut] || statut;
  };

  const getStatutColor = (statut: string) => {
    const colors: { [key: string]: string } = {
      planifie: 'bg-blue-100 text-blue-800',
      en_cours: 'bg-yellow-100 text-yellow-800',
      termine: 'bg-green-100 text-green-800',
      annule: 'bg-red-100 text-red-800',
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!maintenance) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Maintenance non trouvée</p>
        <button
          onClick={() => navigate('/maintenance')}
          className="mt-4 text-primary-600 hover:text-primary-800"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const piecesCost = maintenance.pieces.reduce(
    (sum, piece) => sum + piece.quantite * piece.prixUnitaire,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/maintenance')}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Détails de la Maintenance</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(
              maintenance.type
            )}`}
          >
            {getTypeLabel(maintenance.type)}
          </span>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatutColor(
              maintenance.statut
            )}`}
          >
            {getStatutLabel(maintenance.statut)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Véhicule</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Marque et Modèle:</span>
                <span className="font-medium text-gray-900">
                  {maintenance.vehicule.marque} {maintenance.vehicule.modele}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Immatriculation:</span>
                <span className="font-medium text-gray-900">{maintenance.vehicule.immatriculation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900">{maintenance.vehicule.type}</span>
              </div>
              <button
                onClick={() => navigate(`/vehicles/${maintenance.vehicule._id}`)}
                className="w-full mt-2 text-primary-600 hover:text-primary-800 text-sm"
              >
                Voir le véhicule →
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700">{maintenance.description}</p>
          </div>

          {/* Dates and Mileage */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dates et Kilométrage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Date de début</span>
                <p className="font-medium text-gray-900">{formatDate(maintenance.dateDebut)}</p>
              </div>
              {maintenance.dateFin && (
                <div>
                  <span className="text-sm text-gray-600">Date de fin</span>
                  <p className="font-medium text-gray-900">{formatDate(maintenance.dateFin)}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-600">Kilométrage actuel</span>
                <p className="font-medium text-gray-900">
                  {maintenance.kilometrageActuel.toLocaleString()} km
                </p>
              </div>
              {maintenance.prochainEntretien && (
                <div>
                  <span className="text-sm text-gray-600">Prochain entretien</span>
                  <p className="font-medium text-gray-900">
                    {maintenance.prochainEntretien.toLocaleString()} km
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Garage Info */}
          {maintenance.garage && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Garage</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom:</span>
                  <span className="font-medium text-gray-900">{maintenance.garage.nom}</span>
                </div>
                {maintenance.garage.adresse && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adresse:</span>
                    <span className="font-medium text-gray-900">{maintenance.garage.adresse}</span>
                  </div>
                )}
                {maintenance.garage.telephone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Téléphone:</span>
                    <span className="font-medium text-gray-900">{maintenance.garage.telephone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pieces */}
          {maintenance.pieces.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pièces Utilisées</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Nom
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Référence
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Qté
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Prix Unit.
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {maintenance.pieces.map((piece, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{piece.nom}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{piece.reference}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{piece.quantite}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                          {piece.prixUnitaire.toLocaleString()} FCFA
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                          {(piece.quantite * piece.prixUnitaire).toLocaleString()} FCFA
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        Total Pièces:
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                        {piecesCost.toLocaleString()} FCFA
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Notes */}
          {maintenance.notes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-700 whitespace-pre-line">{maintenance.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Summary & Additional Info */}
        <div className="space-y-6">
          {/* Cost Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Coûts</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Pièces:</span>
                <span className="font-medium text-gray-900">{piecesCost.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Main d'œuvre:</span>
                <span className="font-medium text-gray-900">
                  {maintenance.mainOeuvre.toLocaleString()} FCFA
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-primary-600">
                  {maintenance.coutTotal.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Facture */}
          {maintenance.facture?.numero && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Facture</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro:</span>
                  <span className="font-medium text-gray-900">{maintenance.facture.numero}</span>
                </div>
                {maintenance.facture.fichier && (
                  <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Télécharger la facture
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Technicien */}
          {maintenance.technicien && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Technicien</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom:</span>
                  <span className="font-medium text-gray-900">
                    {maintenance.technicien.nom} {maintenance.technicien.prenom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{maintenance.technicien.email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Créé le</span>
                <p className="font-medium text-gray-900">{formatDateTime(maintenance.createdAt)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Modifié le</span>
                <p className="font-medium text-gray-900">{formatDateTime(maintenance.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetails;
