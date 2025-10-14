const mongoose = require('mongoose');

const FuelSchema = new mongoose.Schema({
  vehicule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  conducteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  dateRavitaillement: {
    type: Date,
    required: true,
    default: Date.now
  },
  quantite: {
    type: Number,
    required: [true, 'La quantité est requise']
  },
  prixUnitaire: {
    type: Number,
    required: [true, 'Le prix unitaire est requis']
  },
  montantTotal: {
    type: Number,
    required: true
  },
  kilometrageActuel: {
    type: Number,
    required: true
  },
  typeCarburant: {
    type: String,
    enum: ['essence', 'diesel', 'super', 'sans_plomb'],
    required: true
  },
  stationService: {
    nom: String,
    adresse: String
  },
  numeroRecu: String,
  recu: String,
  reservoirPlein: {
    type: Boolean,
    default: false
  },
  notes: String
}, {
  timestamps: true
});

// Calculer la consommation
FuelSchema.virtual('consommation').get(function() {
  if (this.kilometrageActuel && this.quantite) {
    return (this.quantite / this.kilometrageActuel * 100).toFixed(2);
  }
  return 0;
});

module.exports = mongoose.model('Fuel', FuelSchema);
