const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String },
    professionalInfo: {
      salary: { type: String, required: true },
      company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }
    }
  },
  { timestamps: true } 
);

module.exports = mongoose.model('User', userSchema);
