const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  vehicule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  type: {
    type: String,
    enum: ['preventive', 'corrective', 'revision', 'reparation', 'autre'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: Date,
  statut: {
    type: String,
    enum: ['planifie', 'en_cours', 'termine', 'annule'],
    default: 'planifie'
  },
  kilometrageActuel: {
    type: Number,
    required: true
  },
  prochainEntretien: {
    type: Number,
    comment: 'Kilométrage du prochain entretien'
  },
  garage: {
    nom: String,
    adresse: String,
    telephone: String
  },
  technicien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pieces: [{
    nom: String,
    reference: String,
    quantite: Number,
    prixUnitaire: Number
  }],
  mainOeuvre: {
    type: Number,
    default: 0
  },
  coutTotal: {
    type: Number,
    required: true
  },
  facture: {
    numero: String,
    fichier: String
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
