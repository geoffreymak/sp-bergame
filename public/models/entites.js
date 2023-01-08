const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const entiteSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    intitule: {
      type: String,
      required: true
    },
    uuid: {
      type: String,
      default: uuid,
      unique: true
    }
  },
  { timestamps: true }
);

const entiteModel = mongoose.model('Entite', entiteSchema);

module.exports = entiteModel;
