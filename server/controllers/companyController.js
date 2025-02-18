// server/controllers/companyController.js
const Company = require('../models/Company');

const createCompany = async (req, res) => {
  try {
    const { name, ta, da, hra, pf } = req.body;
    const company = await Company.create({ name, ta, da, hra, pf });
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
};
