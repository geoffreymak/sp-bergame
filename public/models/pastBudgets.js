const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const pastBudgetSchema = new mongoose.Schema(
  {
    compte: {
      type: String,
      required: true
    },
    intitule: {
      type: String,
      required: true
    },
    entite: {
      type: String,
      required: true
    },
    prevision: {
      type: Number,
      required: true
    },
    exercice: {
      type: Number
    },
    type: {
      type: String
    },
    uuid: {
      type: String,
      default: uuid,
      unique: true
    }
  },
  { timestamps: true }
);

const pastBudgetModel = mongoose.model('PastBudget', pastBudgetSchema);

module.exports = pastBudgetModel;
