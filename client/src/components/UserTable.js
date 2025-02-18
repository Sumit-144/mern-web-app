// client/src/components/UserTable.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../services/userService';

const UserTable = ({ users, refreshUsers }) => {
  const navigate = useNavigate();

  // Function to handle deletion using the service function
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        // Option 1: Call a callback prop to update the state in Home component if provided
        if (refreshUsers) {
          refreshUsers();
        } else {
          // Option 2: Refresh the page if no callback provided
          window.location.reload();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Use 24-hour format
    });
  };

  const formatSalary = (salary) => {
    const parsedSalary = parseFloat(salary);
    return isNaN(parsedSalary) ? 'N/A' : parsedSalary.toFixed(2);
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Pic</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creation date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users?.length > 0 ? (
          users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.profilePic ? (
                  <img
                    src={`http://localhost:5000/${user.profilePic}`}
                    alt={user.name}
                    className="h-24 w-24 object-cover transition-transform hover:scale-110 hover:shadow-lg cursor-pointer"
                  />
                ) : (
                  'No Image'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.professionalInfo && user.professionalInfo.company
                  ? user.professionalInfo.company.name
                  : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatSalary(user.professionalInfo?.salary)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  onClick={() => navigate(`/edit/${user._id}`)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
