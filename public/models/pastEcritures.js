const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const pastEcritureSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    date2: {
      type: Date
    },
    piece: {
      type: String,
      required: true
    },
    compte: {
      type: String,
      required: true
    },
    compte_code: {
      type: String,
      required: true
    },
    imputation: {
      type: String,
      required: true
    },
    imputation_code: {
      type: String,
      required: true
    },
    libelle: {
      type: String,
      required: true
    },
    devise: {
      type: String
    },
    taux: {
      type: Number,
      default: 0
    },
    parite: {
      type: Number,
      default: 0
    },
    exercice: {
      type: Number,
      required: true
    },
    user: {
      type: String
    },
    site: {
      type: String
    },
    update_user: {
      type: String
    },
    deleted: {
      type: Boolean,
      default: false
    },
    montant_usd: {
      type: Number,
      default: 0
    },
    montant_cdf: {
      type: Number,
      default: 0
    },
    montant_eur: {
      type: Number,
      default: 0
    },
    montant_total_eur: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: ['D', 'C']
    },
    category: {
      type: String,
      enum: ['CASH', 'VARIOUS', 'ACCOUNT']
    },
    uuid: {
      type: String,
      default: uuid,
      unique: true
    }
  },
  { timestamps: true }
);

const pastEcritureModel = mongoose.model('PastEcriture', pastEcritureSchema);
// const ecritureModel = mongoose.model('EcriturePast', ecritureSchema);
// const ecritureModel = mongoose.model('EcritureDev', ecritureSchema);

module.exports = pastEcritureModel;
