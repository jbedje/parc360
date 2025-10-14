const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
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
  dateDepart: {
    type: Date,
    required: true
  },
  dateRetour: Date,
  lieuDepart: {
    type: String,
    required: true
  },
  lieuArrivee: {
    type: String,
    required: true
  },
  objet: {
    type: String,
    required: [true, 'L\'objet du déplacement est requis']
  },
  passagers: [{
    nom: String,
    telephone: String
  }],
  kilometrageDepart: {
    type: Number,
    required: true
  },
  kilometrageArrivee: Number,
  distanceParcourue: Number,
  statut: {
    type: String,
    enum: ['planifie', 'en_cours', 'termine', 'annule'],
    default: 'planifie'
  },
  fraisPeage: {
    type: Number,
    default: 0
  },
  fraisParking: {
    type: Number,
    default: 0
  },
  autresFrais: {
    type: Number,
    default: 0
  },
  coutTotal: Number,
  observations: String,
  validePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Calculer la distance parcourue
TripSchema.pre('save', function(next) {
  if (this.kilometrageArrivee && this.kilometrageDepart) {
    this.distanceParcourue = this.kilometrageArrivee - this.kilometrageDepart;
  }
  if (this.fraisPeage || this.fraisParking || this.autresFrais) {
    this.coutTotal = (this.fraisPeage || 0) + (this.fraisParking || 0) + (this.autresFrais || 0);
  }
  next();
});

module.exports = mongoose.model('Trip', TripSchema);
