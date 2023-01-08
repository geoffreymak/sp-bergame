const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const balanceSchema = new mongoose.Schema(
  {
    compt1: {
      type: String,
      required: true,
      unique: true
    },
    compt2: {
      type: String
    },
    debit: {
      type: Number,
      required: true,
      default: 0
    },
    credit: {
      type: Number,
      required: true,
      default: 0
    },
    debit1: {
      type: Number,
      required: true,
      default: 0
    },
    credit1: {
      type: Number,
      required: true,
      default: 0
    },
    date1: {
      type: Date,
      required: true
    },
    date2: {
      type: Date,
      required: true
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

const balanceModel = mongoose.model('BalanceCorresp', balanceSchema);

module.exports = balanceModel;
