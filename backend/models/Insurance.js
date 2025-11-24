const mongoose = require('mongoose');

const InsuranceSchema = new mongoose.Schema(
  {
    vehicule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Le véhicule est requis'],
    },
    compagnie: {
      type: String,
      required: [true, 'La compagnie d\'assurance est requise'],
      trim: true,
    },
    numeroPolice: {
      type: String,
      required: [true, 'Le numéro de police est requis'],
      unique: true,
      trim: true,
    },
    typeAssurance: {
      type: String,
      enum: ['tiers', 'tiers_complet', 'tous_risques'],
      required: [true, 'Le type d\'assurance est requis'],
    },
    montantPrime: {
      type: Number,
      required: [true, 'Le montant de la prime est requis'],
      min: 0,
    },
    dateDebut: {
      type: Date,
      required: [true, 'La date de début est requise'],
    },
    dateExpiration: {
      type: Date,
      required: [true, 'La date d\'expiration est requise'],
    },
    statut: {
      type: String,
      enum: ['valide', 'expire', 'suspendu', 'annule'],
      default: function () {
        const today = new Date();
        if (this.dateExpiration < today) {
          return 'expire';
        } else if (this.dateDebut > today) {
          return 'suspendu';
        }
        return 'valide';
      },
    },
    franchises: {
      collision: { type: Number, default: 0 },
      vol: { type: Number, default: 0 },
      incendie: { type: Number, default: 0 },
      brisDeGlace: { type: Number, default: 0 },
    },
    garanties: {
      type: [String],
      default: [],
    },
    contactAssureur: {
      nom: String,
      telephone: String,
      email: String,
    },
    sinistres: [
      {
        date: { type: Date, required: true },
        type: {
          type: String,
          enum: ['accident', 'vol', 'incendie', 'bris_de_glace', 'vandalisme', 'autre'],
          required: true,
        },
        description: String,
        montantDommages: { type: Number, default: 0 },
        montantIndemnise: { type: Number, default: 0 },
        statut: {
          type: String,
          enum: ['declare', 'en_cours', 'accepte', 'refuse', 'clos'],
          default: 'declare',
        },
        numeroDeclaration: String,
        dateDeclaration: Date,
        dateReglement: Date,
      },
    ],
    documents: [
      {
        type: {
          type: String,
          enum: ['attestation', 'police', 'avenant', 'quittance', 'autre'],
        },
        nom: String,
        url: String,
        dateUpload: { type: Date, default: Date.now },
      },
    ],
    notes: {
      type: String,
      maxlength: 1000,
    },
    historiqueRenouvellements: [
      {
        dateRenouvellement: Date,
        montantPrime: Number,
        numeroPolice: String,
        modifie: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for quick search
InsuranceSchema.index({ vehicule: 1, dateExpiration: 1 });
InsuranceSchema.index({ numeroPolice: 1 });
InsuranceSchema.index({ statut: 1 });

// Virtual for days until expiration
InsuranceSchema.virtual('joursAvantExpiration').get(function () {
  const today = new Date();
  const diffTime = this.dateExpiration - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to update status based on dates
InsuranceSchema.methods.updateStatut = function () {
  const today = new Date();
  if (this.dateExpiration < today) {
    this.statut = 'expire';
  } else if (this.dateDebut > today) {
    this.statut = 'suspendu';
  } else if (this.statut !== 'annule') {
    this.statut = 'valide';
  }
  return this.save();
};

// Pre-save hook to auto-update status
InsuranceSchema.pre('save', function (next) {
  const today = new Date();
  if (this.dateExpiration < today && this.statut !== 'annule') {
    this.statut = 'expire';
  } else if (this.dateDebut > today && this.statut !== 'annule') {
    this.statut = 'suspendu';
  } else if (this.statut !== 'annule' && this.statut !== 'suspendu') {
    this.statut = 'valide';
  }
  next();
});

module.exports = mongoose.model('Insurance', InsuranceSchema);
