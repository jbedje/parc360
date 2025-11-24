const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    // System Settings
    nomEntreprise: {
      type: String,
      default: 'Côte d\'Ivoire PME',
    },
    logo: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: 'contact@cipme.ci',
    },
    telephone: {
      type: String,
      default: '+225 XX XX XX XX XX',
    },
    adresse: {
      type: String,
      default: 'Abidjan, Côte d\'Ivoire',
    },

    // Alert Thresholds
    alertes: {
      kilometrageEntretien: {
        type: Number,
        default: 5000, // Alert every 5000 km
      },
      joursAvantExpirationDocument: {
        type: Number,
        default: 30, // Alert 30 days before document expiration
      },
      joursAvantExpirationAssurance: {
        type: Number,
        default: 30,
      },
      seuilConsommationCarburant: {
        type: Number,
        default: 15, // L/100km - alert if consumption exceeds this
      },
    },

    // Standard Rates
    tarifsParDefaut: {
      prixCarburantDiesel: {
        type: Number,
        default: 615, // FCFA per liter
      },
      prixCarburantEssence: {
        type: Number,
        default: 730,
      },
      tauxMainOeuvre: {
        type: Number,
        default: 5000, // FCFA per hour
      },
    },

    // Email Configuration
    emailConfig: {
      enabled: {
        type: Boolean,
        default: false,
      },
      smtpHost: String,
      smtpPort: Number,
      smtpUser: String,
      smtpPassword: String,
      fromEmail: String,
    },

    // Notification Settings
    notifications: {
      emailActivated: {
        type: Boolean,
        default: false,
      },
      smsActivated: {
        type: Boolean,
        default: false,
      },
      notifierExpirationDocuments: {
        type: Boolean,
        default: true,
      },
      notifierMaintenanceProgrammee: {
        type: Boolean,
        default: true,
      },
      notifierInfractions: {
        type: Boolean,
        default: true,
      },
    },

    // System Preferences
    preferences: {
      devise: {
        type: String,
        default: 'FCFA',
      },
      langue: {
        type: String,
        enum: ['fr', 'en'],
        default: 'fr',
      },
      formatDate: {
        type: String,
        default: 'DD/MM/YYYY',
      },
      fuseauHoraire: {
        type: String,
        default: 'Africa/Abidjan',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', SettingsSchema);
