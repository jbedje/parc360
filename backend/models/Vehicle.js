const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  immatriculation: {
    type: String,
    required: [true, 'L\'immatriculation est requise'],
    unique: true,
    uppercase: true,
    trim: true
  },
  marque: {
    type: String,
    required: [true, 'La marque est requise']
  },
  modele: {
    type: String,
    required: [true, 'Le modèle est requis']
  },
  annee: {
    type: Number,
    required: [true, 'L\'année est requise']
  },
  type: {
    type: String,
    enum: ['voiture', 'camion', 'moto', 'bus', 'utilitaire'],
    required: [true, 'Le type est requis']
  },
  couleur: String,
  numeroSerie: {
    type: String,
    unique: true,
    sparse: true
  },
  kilometrage: {
    type: Number,
    default: 0
  },
  dateAchat: {
    type: Date,
    required: true
  },
  prixAchat: {
    type: Number,
    required: true
  },
  statut: {
    type: String,
    enum: ['disponible', 'en_service', 'en_maintenance', 'hors_service'],
    default: 'disponible'
  },
  carburant: {
    type: String,
    enum: ['essence', 'diesel', 'hybride', 'electrique'],
    required: true
  },
  capaciteReservoir: {
    type: Number,
    required: true
  },
  consommationMoyenne: {
    type: Number,
    comment: 'Litres/100km'
  },
  conducteurActuel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  departement: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'default-vehicle.png'
  },
  documents: [{
    type: {
      type: String,
      enum: ['carte_grise', 'assurance', 'visite_technique', 'autre']
    },
    numero: String,
    dateExpiration: Date,
    fichier: String
  }],
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
