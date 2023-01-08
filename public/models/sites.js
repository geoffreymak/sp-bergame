const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const siteSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true
    },
    libelle: {
      type: String,
      required: true
    },
    ville: {
      type: String
    },
    province: {
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

const siteModel = mongoose.model('Site', siteSchema);

module.exports = siteModel;
