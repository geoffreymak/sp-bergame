const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const exerciceSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      required: true
    },
    libelle: {
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

const exerciceModel = mongoose.model('Exercice', exerciceSchema);

module.exports = exerciceModel;
