const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  numeroPermis: {
    type: String,
    required: [true, 'Le numéro de permis est requis'],
    unique: true
  },
  categoriePermis: {
    type: [String],
    enum: ['A', 'B', 'C', 'D', 'E'],
    required: true
  },
  dateDelivrance: {
    type: Date,
    required: true
  },
  dateExpiration: {
    type: Date,
    required: true
  },
  adresse: {
    type: String,
    required: true
  },
  ville: {
    type: String,
    required: true
  },
  dateEmbauche: {
    type: Date,
    required: true
  },
  departement: {
    type: String,
    required: true
  },
  statut: {
    type: String,
    enum: ['actif', 'en_conge', 'suspendu', 'inactif'],
    default: 'actif'
  },
  vehiculeAssigne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  infractions: [{
    date: Date,
    type: String,
    montantAmende: Number,
    points: Number,
    description: String
  }],
  formations: [{
    type: String,
    date: Date,
    organisme: String,
    certificat: String
  }],
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Driver', DriverSchema);
