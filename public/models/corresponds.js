const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const correspondSchema = new mongoose.Schema(
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

const correspondModel = mongoose.model('Correspond', correspondSchema);

module.exports = correspondModel;
