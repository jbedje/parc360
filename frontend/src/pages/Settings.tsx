import React, { useState, useEffect } from 'react';
import { settingsService } from '../services/api';
import {
  Cog6ToothIcon,
  BuildingOfficeIcon,
  BellAlertIcon,
  BanknotesIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Settings {
  _id?: string;
  nomEntreprise: string;
  email: string;
  telephone: string;
  adresse: string;
  alertes: {
    kilometrageEntretien: number;
    joursAvantExpirationDocument: number;
    joursAvantExpirationAssurance: number;
    seuilConsommationCarburant: number;
  };
  tarifsParDefaut: {
    prixCarburantDiesel: number;
    prixCarburantEssence: number;
    tauxMainOeuvre: number;
  };
  notifications: {
    emailActivated: boolean;
    smsActivated: boolean;
    notifierExpirationDocuments: boolean;
    notifierMaintenanceProgrammee: boolean;
    notifierInfractions: boolean;
  };
  preferences: {
    devise: string;
    langue: string;
    formatDate: string;
    fuseauHoraire: string;
  };
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    nomEntreprise: 'Côte d\'Ivoire PME',
    email: 'contact@cipme.ci',
    telephone: '+225 XX XX XX XX XX',
    adresse: 'Abidjan, Côte d\'Ivoire',
    alertes: {
      kilometrageEntretien: 5000,
      joursAvantExpirationDocument: 30,
      joursAvantExpirationAssurance: 30,
      seuilConsommationCarburant: 15,
    },
    tarifsParDefaut: {
      prixCarburantDiesel: 615,
      prixCarburantEssence: 730,
      tauxMainOeuvre: 5000,
    },
    notifications: {
      emailActivated: false,
      smsActivated: false,
      notifierExpirationDocuments: true,
      notifierMaintenanceProgrammee: true,
      notifierInfractions: true,
    },
    preferences: {
      devise: 'FCFA',
      langue: 'fr',
      formatDate: 'DD/MM/YYYY',
      fuseauHoraire: 'Africa/Abidjan',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsService.get();
      setSettings(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.update(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
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
            <Cog6ToothIcon className="w-8 h-8 mr-3 text-cipme-orange" />
            Paramètres Système
          </h1>
          <p className="text-gray-600 mt-1">Configuration générale de l'application</p>
        </div>
        {saved && (
          <div className="flex items-center px-4 py-2 bg-cipme-green/10 text-cipme-green rounded-lg">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Paramètres sauvegardés
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <BuildingOfficeIcon className="w-6 h-6 text-cipme-orange mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Informations de l'Entreprise</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nom de l'Entreprise
              </label>
              <input
                type="text"
                value={settings.nomEntreprise}
                onChange={(e) => setSettings({ ...settings, nomEntreprise: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
              <input
                type="text"
                value={settings.telephone}
                onChange={(e) => setSettings({ ...settings, telephone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Adresse</label>
              <input
                type="text"
                value={settings.adresse}
                onChange={(e) => setSettings({ ...settings, adresse: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <BellAlertIcon className="w-6 h-6 text-cipme-orange mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Seuils d'Alertes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Kilométrage Entretien (km)
              </label>
              <input
                type="number"
                value={settings.alertes.kilometrageEntretien}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    alertes: {
                      ...settings.alertes,
                      kilometrageEntretien: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Alerte tous les X kilomètres</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Expiration Documents (jours)
              </label>
              <input
                type="number"
                value={settings.alertes.joursAvantExpirationDocument}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    alertes: {
                      ...settings.alertes,
                      joursAvantExpirationDocument: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Alerter X jours avant expiration</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Expiration Assurance (jours)
              </label>
              <input
                type="number"
                value={settings.alertes.joursAvantExpirationAssurance}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    alertes: {
                      ...settings.alertes,
                      joursAvantExpirationAssurance: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Alerter X jours avant expiration</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Seuil Consommation (L/100km)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.alertes.seuilConsommationCarburant}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    alertes: {
                      ...settings.alertes,
                      seuilConsommationCarburant: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Alerter si consommation dépasse</p>
            </div>
          </div>
        </div>

        {/* Default Rates */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <BanknotesIcon className="w-6 h-6 text-cipme-orange mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Tarifs par Défaut</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Prix Diesel (FCFA/L)
              </label>
              <input
                type="number"
                value={settings.tarifsParDefaut.prixCarburantDiesel}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    tarifsParDefaut: {
                      ...settings.tarifsParDefaut,
                      prixCarburantDiesel: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Prix Essence (FCFA/L)
              </label>
              <input
                type="number"
                value={settings.tarifsParDefaut.prixCarburantEssence}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    tarifsParDefaut: {
                      ...settings.tarifsParDefaut,
                      prixCarburantEssence: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Main d'œuvre (FCFA/h)
              </label>
              <input
                type="number"
                value={settings.tarifsParDefaut.tauxMainOeuvre}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    tarifsParDefaut: {
                      ...settings.tarifsParDefaut,
                      tauxMainOeuvre: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cipme-orange focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <EnvelopeIcon className="w-6 h-6 text-cipme-orange mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-gray-900">Notifications Email</p>
                <p className="text-sm text-gray-500">Activer les notifications par email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailActivated}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        emailActivated: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cipme-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cipme-orange"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-gray-900">Notifications SMS</p>
                <p className="text-sm text-gray-500">Activer les notifications par SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.smsActivated}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        smsActivated: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cipme-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cipme-orange"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-gray-900">Expiration Documents</p>
                <p className="text-sm text-gray-500">Notifier lors de l'expiration de documents</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.notifierExpirationDocuments}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        notifierExpirationDocuments: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cipme-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cipme-orange"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-gray-900">Maintenance Programmée</p>
                <p className="text-sm text-gray-500">Notifier des maintenances à venir</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.notifierMaintenanceProgrammee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        notifierMaintenanceProgrammee: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cipme-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cipme-orange"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-gray-900">Infractions</p>
                <p className="text-sm text-gray-500">Notifier des nouvelles infractions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.notifierInfractions}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        notifierInfractions: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cipme-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cipme-orange"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-gradient-to-r from-cipme-orange to-cipme-orange-dark text-white rounded-xl shadow-lg hover:shadow-cipme-lg transition-all font-bold text-lg disabled:opacity-50"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder les Paramètres'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
