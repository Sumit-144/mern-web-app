const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ta: { type: Number, required: true },
    da: { type: Number, required: true },
    hra: { type: Number, required: true },
    pf: { type: Number, required: true }
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Company', companySchema);
