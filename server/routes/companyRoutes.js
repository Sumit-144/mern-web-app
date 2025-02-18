// server/routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const { createCompany, getAllCompanies } = require('../controllers/companyController');

router.post('/', createCompany);
router.get('/', getAllCompanies);

module.exports = router;
