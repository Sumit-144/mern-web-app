// client/src/pages/CreateUser.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/userService'; 
import { pageTransitions } from '../animations/pageTransitions';
import { motion } from 'framer-motion';

const CreateUser = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // State for personal details (Step 1)
  const [personalData, setPersonalData] = useState({
    name: '',
    email: '',
    profilePic: null,
  });
  
  // State for professional details (Step 2)
  const [professionalData, setProfessionalData] = useState({
    company: '',
    salary: '', // This is the actual salary input by the user.
  });

  // State for companies list (fetched from the server)
  const [companies, setCompanies] = useState([]);

  // Fetch companies from the server when the component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/companies');
        setCompanies(res.data);
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    };
    fetchCompanies();
  }, []);

  // Handle changes for personal details form
  const handlePersonalChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      setPersonalData({ ...personalData, profilePic: files[0] });
    } else {
      setPersonalData({ ...personalData, [name]: value });
    }
  };

  // Handle changes for professional details form
  const handleProfessionalChange = (e) => {
    const { name, value } = e.target;
    setProfessionalData({ ...professionalData, [name]: value });
  };

  // Save personal details and move to next step
  const handleSaveAndContinue = (e) => {
    e.preventDefault();
    // Optionally, save to localStorage if needed:
    localStorage.setItem('personalData', JSON.stringify(personalData));
    setStep(2);
  };

  // Submit the combined data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert the actual salary input into a number
    const actualSalary = parseFloat(professionalData.salary);
    if (isNaN(actualSalary)) {
      console.error('Invalid salary input');
      return;
    }

    // Find the selected company (by its _id)
    const selectedCompany = companies.find(
      (comp) => comp._id === professionalData.company
    );
    if (!selectedCompany) {
      console.error('Selected company not found.');
      return;
    }

    // Calculate net salary:
    // netSalary = actualSalary * (1 + ((ta + da + hra - pf) / 100))
    const netSalary =
      actualSalary *
      (1 +
        (selectedCompany.ta +
          selectedCompany.da +
          selectedCompany.hra -
          selectedCompany.pf) /
          100);

    // Combine both data sets using FormData (for file upload support)
    const formData = new FormData();
    formData.append('name', personalData.name);
    formData.append('email', personalData.email);
    if (personalData.profilePic) {
      formData.append('profilePic', personalData.profilePic);
    }
    // Append the selected company's _id and the computed net salary
    formData.append('company', professionalData.company);
    formData.append('salary', netSalary.toString());

    try {
      // Use the service function instead of axios directly
      await createUser(formData);
      // Redirect back to the Home page upon success
      navigate('/');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <motion.div 
          {...pageTransitions}
          className="container mx-auto px-4 py-8"
        >
    <div className="container mx-auto px-4 py-8">
      {step === 1 && (
        <form
          onSubmit={handleSaveAndContinue}
          className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Personal Details
          </h2>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={personalData.name}
              onChange={handlePersonalChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={personalData.email}
              onChange={handlePersonalChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="profilePic"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Profile Picture
            </label>
            <input
              id="profilePic"
              name="profilePic"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handlePersonalChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save and Continue
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Professional Details
          </h2>
          <div className="mb-4">
            <label
              htmlFor="company"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Company
            </label>
            <select
              id="company"
              name="company"
              value={professionalData.company}
              onChange={handleProfessionalChange}
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a company</option>
              {companies.map((comp) => (
                <option key={comp._id} value={comp._id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="salary"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Actual Salary
            </label>
            <input
              id="salary"
              name="salary"
              type="text"
              placeholder="Enter your actual salary"
              value={professionalData.salary}
              onChange={handleProfessionalChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
    </motion.div>
  );
};

export default CreateUser;
