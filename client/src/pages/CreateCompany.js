import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { pageTransitions } from '../animations/pageTransitions';
import { motion } from 'framer-motion';

const CreateCompany = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();  // Access the authenticated user and logout function

  // State for company details
  const [companyDetails, setCompanyDetails] = useState({
    name: '',
    ta: '',
    da: '',
    hra: '',
    pf: '',
  });

  // State to store validation error messages
  const [errors, setErrors] = useState({});

  // Handle changes for the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Validate numeric fields
  const validate = () => {
    const validationErrors = {};
    if (!companyDetails.name.trim()) {
      validationErrors.name = 'Company name is required';
    }
    ['ta', 'da', 'hra', 'pf'].forEach((field) => {
      const value = parseFloat(companyDetails[field]);
      if (isNaN(value)) {
        validationErrors[field] = `${field.toUpperCase()} must be a number`;
      } else if (value > 100.0) {
        validationErrors[field] = `${field.toUpperCase()} must not exceed 100.00`;
      }
    });
    return validationErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      await axios.post('http://localhost:5000/api/companies', companyDetails);
      alert("Company created successfully...");
      navigate('/');
    } catch (error) {
      console.error('Error creating company: ', error);
    }
  };

  return (
     <motion.div 
          {...pageTransitions}
          className="container mx-auto px-4 py-8"
        >
    <div>
      {/* Header with Logout Button */}
      <div className="flex justify-end items-center mb-4">
        {/* <h2 className="text-2xl font-bold">Create Company</h2> */}
        <div>
          {user && <span className="mr-4 text-gray-700">Hi, {user.email}</span>}
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* Company Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={companyDetails.name}
            onChange={handleChange}
            placeholder="Enter company name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
        </div>

        {/* TA */}
        <div className="mb-4">
          <label htmlFor="ta" className="block text-gray-700 text-sm font-bold mb-2">
            TA
          </label>
          <input
            type="number"
            step="0.01"
            id="ta"
            name="ta"
            value={companyDetails.ta}
            onChange={handleChange}
            placeholder="Enter TA (max 100.00)"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {errors.ta && <p className="text-red-500 text-xs italic">{errors.ta}</p>}
        </div>

        {/* DA */}
        <div className="mb-4">
          <label htmlFor="da" className="block text-gray-700 text-sm font-bold mb-2">
            DA
          </label>
          <input
            type="number"
            step="0.01"
            id="da"
            name="da"
            value={companyDetails.da}
            onChange={handleChange}
            placeholder="Enter DA (max 100.00)"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {errors.da && <p className="text-red-500 text-xs italic">{errors.da}</p>}
        </div>

        {/* HRA */}
        <div className="mb-4">
          <label htmlFor="hra" className="block text-gray-700 text-sm font-bold mb-2">
            HRA
          </label>
          <input
            type="number"
            step="0.01"
            id="hra"
            name="hra"
            value={companyDetails.hra}
            onChange={handleChange}
            placeholder="Enter HRA (max 100.00)"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {errors.hra && <p className="text-red-500 text-xs italic">{errors.hra}</p>}
        </div>

        {/* PF */}
        <div className="mb-4">
          <label htmlFor="pf" className="block text-gray-700 text-sm font-bold mb-2">
            PF
          </label>
          <input
            type="number"
            step="0.01"
            id="pf"
            name="pf"
            value={companyDetails.pf}
            onChange={handleChange}
            placeholder="Enter PF (max 100.00)"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {errors.pf && <p className="text-red-500 text-xs italic">{errors.pf}</p>}
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Company
          </button>
        </div>
      </form>
    </div>
    </motion.div>
  );
};

export default CreateCompany;
