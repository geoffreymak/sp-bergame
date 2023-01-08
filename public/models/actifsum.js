const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const actifsumSchema = new mongoose.Schema(
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

const actifsumModel = mongoose.model('Actifsum', actifsumSchema);

module.exports = actifsumModel;
