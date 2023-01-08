const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const balancescorrespPastSchema = new mongoose.Schema(
  {
    compte: {
      type: String,
      required: true,
      unique: true
    },
    intitule: {
      type: String
    },
    debit: {
      type: Number,
      required: true,
      default: 0
    },
    credit: {
      type: Number,
      required: true,
      default: 0
    },
    solde: {
      type: Number,
      required: true,
      default: 0
    },
    solde_usd: {
      type: Number,
      default: 0
    },
    debit_usd: {
      type: Number,
      default: 0
    },
    credit_usd: {
      type: Number,
      default: 0
    },

    solde_eur: {
      type: Number,
      default: 0
    },
    debit_eur: {
      type: Number,
      default: 0
    },
    credit_eur: {
      type: Number,
      default: 0
    },

    solde_cfa: {
      type: Number,
      default: 0
    },
    debit_cfa: {
      type: Number,
      default: 0
    },
    credit_cfa: {
      type: Number,
      default: 0
    },
    date: {
      type: Date
    },
    uuid: {
      type: String,
      default: uuid,
      unique: true
    }
  },
  { timestamps: true }
);

const balancescorrespPastModel = mongoose.model(
  'BalancescorrespPast',
  balancescorrespPastSchema
);

module.exports = balancescorrespPastModel;
