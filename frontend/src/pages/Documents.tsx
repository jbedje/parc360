import React, { useState, useEffect } from 'react';
import { documentService, vehicleService, driverService, maintenanceService } from '../services/api';
import DocumentModal from '../components/DocumentModal';

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState({ type: '', statut: '', search: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [documentsData, vehiclesData, driversData, maintenancesData] = await Promise.all([
        documentService.getAll(),
        vehicleService.getAll(),
        driverService.getAll(),
        maintenanceService.getAll(),
      ]);

      // L'API retourne { data: { success, count, data: [...] } }
      const documentsList = documentsData.data?.data || documentsData.data || [];
      const vehiclesList = vehiclesData.data?.data || vehiclesData.data || [];
      const driversList = driversData.data?.data || driversData.data || [];
      const maintenancesList = maintenancesData.data?.data || maintenancesData.data || [];

      setDocuments(Array.isArray(documentsList) ? documentsList : []);
      setVehicles(Array.isArray(vehiclesList) ? vehiclesList : []);
      setDrivers(Array.isArray(driversList) ? driversList : []);
      setMaintenances(Array.isArray(maintenancesList) ? maintenancesList : []);
    } catch (error) {
      console.error('Erreur:', error);
      setDocuments([]);
      setVehicles([]);
      setDrivers([]);
      setMaintenances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDocument(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (document: any) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedDocument) {
        await documentService.update(selectedDocument._id, data);
      } else {
        await documentService.create(data);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      try {
        await documentService.delete(id);
        await loadData();
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Erreur:', error);
      }
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      vehicule: 'Véhicule',
      conducteur: 'Conducteur',
      maintenance: 'Maintenance',
      assurance: 'Assurance',
      autre: 'Autre',
    };
    return labels[type] || type;
  };

  const getStatutLabel = (statut: string) => {
    const labels: { [key: string]: string } = {
      valide: 'Valide',
      expire: 'Expiré',
      a_renouveler: 'À Renouveler',
    };
    return labels[statut] || statut;
  };

  const getStatutColor = (statut: string) => {
    const colors: { [key: string]: string } = {
      valide: 'bg-green-100 text-green-800',
      expire: 'bg-red-100 text-red-800',
      a_renouveler: 'bg-yellow-100 text-yellow-800',
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getReference = (document: any) => {
    if (!document.reference) return '-';

    if (document.type === 'vehicule' && document.reference.vehicule) {
      const v = document.reference.vehicule;
      return `${v.marque} ${v.modele} - ${v.immatriculation}`;
    } else if (document.type === 'conducteur' && document.reference.conducteur) {
      const d = document.reference.conducteur;
      return `${d.utilisateur?.nom} ${d.utilisateur?.prenom}`;
    } else if (document.type === 'maintenance' && document.reference.maintenance) {
      const m = document.reference.maintenance;
      return `${m.vehicule?.immatriculation} - ${formatDate(m.dateDebut)}`;
    }
    return '-';
  };

  const filteredDocuments = documents.filter((doc) => {
    if (filter.type && doc.type !== filter.type) return false;
    if (filter.statut && doc.statut !== filter.statut) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        doc.nom?.toLowerCase().includes(searchLower) ||
        doc.categorie?.toLowerCase().includes(searchLower) ||
        doc.numeroDocument?.toLowerCase().includes(searchLower) ||
        getReference(doc).toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    total: documents.length,
    valide: documents.filter((d) => d.statut === 'valide').length,
    aRenouveler: documents.filter((d) => d.statut === 'a_renouveler').length,
    expire: documents.filter((d) => d.statut === 'expire').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Documents</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Ajouter un document</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Documents</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-sm text-green-600">Valides</div>
          <div className="text-2xl font-bold text-green-900">{stats.valide}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <div className="text-sm text-yellow-600">À Renouveler</div>
          <div className="text-2xl font-bold text-yellow-900">{stats.aRenouveler}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <div className="text-sm text-red-600">Expirés</div>
          <div className="text-2xl font-bold text-red-900">{stats.expire}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les types</option>
              <option value="vehicule">Véhicule</option>
              <option value="conducteur">Conducteur</option>
              <option value="maintenance">Maintenance</option>
              <option value="assurance">Assurance</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={filter.statut}
              onChange={(e) => setFilter({ ...filter, statut: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les statuts</option>
              <option value="valide">Valide</option>
              <option value="a_renouveler">À Renouveler</option>
              <option value="expire">Expiré</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <input
              type="text"
              placeholder="Nom, catégorie, numéro..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Émission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Expiration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    Aucun document trouvé
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((document) => (
                  <tr key={document._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getTypeLabel(document.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {getReference(document)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{document.categorie}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{document.nom}</div>
                      {document.description && (
                        <div className="text-sm text-gray-500 max-w-xs truncate">{document.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.numeroDocument || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(document.dateEmission)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(document.dateExpiration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(
                          document.statut
                        )}`}
                      >
                        {getStatutLabel(document.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(document)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(document._id)}
                          className={`${
                            deleteConfirm === document._id
                              ? 'text-red-700 font-bold'
                              : 'text-red-600 hover:text-red-900'
                          }`}
                          title={deleteConfirm === document._id ? 'Cliquez pour confirmer' : 'Supprimer'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        document={selectedDocument}
        title={selectedDocument ? 'Modifier le document' : 'Ajouter un document'}
        vehicles={vehicles}
        drivers={drivers}
        maintenances={maintenances}
      />
    </div>
  );
};

export default Documents;
