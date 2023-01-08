const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const deviseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    usd_cdf: {
      type: Number,
      required: true
    },
    eur_cdf: {
      type: Number,
      required: true
    },
    cdf_cdf: {
      type: Number,
      default: 1
    },
    cfa_cdf: {
      type: Number,
      required: true
    },
    uuid: {
      type: String,
      default: uuid,
      unique: true
    },
    isCurrent: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const deviseModel = mongoose.model('Devise', deviseSchema);

module.exports = deviseModel;
