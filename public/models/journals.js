const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const journalSchema = new mongoose.Schema(
  {
    compte: {
      type: String,
      required: true,
      unique: true
    },
    intitule: {
      type: String,
      required: true,
      unique: true
    },
    no: {
      type: Number,
      default: 100
    },
    uuid: {
      type: String,
      default: uuid,
      unique: true
    }
  },
  { timestamps: true }
);

const journalModel = mongoose.model('Journal', journalSchema);

module.exports = journalModel;
