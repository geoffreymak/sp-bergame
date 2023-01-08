const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const compteSchema = new mongoose.Schema(
  {
    compte: {
      type: String,
      required: true,
      unique: true
    },
    intitule: {
      type: String,
      required: true
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

const compteModel = mongoose.model('Compte', compteSchema);

module.exports = compteModel;
