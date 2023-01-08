const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const resultcompteSchema = new mongoose.Schema(
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
    ordre: {
      type: Number
    },
    uuid: {
      type: String,
      default: uuid,
      unique: true
    }
  },
  { timestamps: true }
);

const resultcompteModel = mongoose.model('Resultcompte', resultcompteSchema);

module.exports = resultcompteModel;
