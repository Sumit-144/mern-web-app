import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../services/userService';
import { pageTransitions } from '../animations/pageTransitions';
import { motion } from 'framer-motion';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State to hold the user data
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profilePic: '',
    professionalInfo: {
      salary: '',
      company: { _id: '', name: '' },
    },
  });

  // State to hold a new profile picture file (if updated)
  const [newProfilePic, setNewProfilePic] = useState(null);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserById(id);
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [id]);

  // Handle change for text inputs (name, email)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setNewProfilePic(e.target.files[0]);
  };

  // Handle form submission to update the user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      // Only update profilePic if a new one was selected
      if (newProfilePic) {
        formData.append('profilePic', newProfilePic);
      }
      // Include the professional info so that company and salary remain unchanged
      formData.append(
        'company',
        userData.professionalInfo.company._id
      );
      formData.append(
        'salary',
        userData.professionalInfo.salary
      );

      // Send PUT request to update the user
      await updateUser(id, formData);
      navigate('/');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <motion.div
      {...pageTransitions}
      className="container mx-auto px-4 py-8"
    >
      <div>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Edit User</h2>

          {/* Editable Fields: Name and Email */}
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
              value={userData.name}
              onChange={handleInputChange}
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
              value={userData.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Profile Picture Field */}
          <div className="mb-4">
            <label
              htmlFor="profilePic"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Profile Picture
            </label>
            {userData.profilePic && !newProfilePic && (
              <div className="mb-2">
                <img
                  src={`http://localhost:5000/${userData.profilePic}`}
                  alt={userData.name}
                  className="h-12 w-12 rounded-full"
                />
              </div>
            )}
            <input
              id="profilePic"
              name="profilePic"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>

          {/* Read-only Fields: Company and Salary */}
          <div className="mb-4">
            <label
              htmlFor="company"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={
                userData.professionalInfo.company
                  ? userData.professionalInfo.company.name
                  : ''
              }
              disabled
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-200 cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="salary"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Salary
            </label>
            <input
              id="salary"
              name="salary"
              type="text"
              value={userData.professionalInfo.salary}
              disabled
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-200 cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditUser;
