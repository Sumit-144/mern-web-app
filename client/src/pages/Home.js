// client/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUsers } from '../services/userService';
import UserTable from '../components/UserTable';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import { pageTransitions } from '../animations/pageTransitions';

const Home = () => {
  // State to hold the list of users and loading status
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Function to fetch users and update state
  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      // Sort users so that the latest one is at the top
      const sortedUsers = usersData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate the users to display on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // While data is loading, show the spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <motion.div 
      {...pageTransitions}
      className="container mx-auto px-4 py-8"
    >
      {/* Render the table of users */}
      <UserTable users={currentUsers} refreshUsers={fetchUsers} />

      {/* Render pagination */}
      <Pagination
        usersPerPage={usersPerPage}
        totalUsers={users.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </motion.div>
  );
};

export default Home;
