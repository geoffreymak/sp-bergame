const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const passifsumSchema = new mongoose.Schema(
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
    index: {
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

const passifsumModel = mongoose.model('Passifsum', passifsumSchema);

module.exports = passifsumModel;
