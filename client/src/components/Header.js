import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              <Link to="/" className="text-gray-800 hover:text-gray-600 transition-colors">
                User Management
              </Link>
            </h1>
            <div className="space-x-4">
            <Link 
                to="/" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/create" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create User
              </Link>
              <Link 
                to="/create_company" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Company
              </Link>
            </div>
          </div>
        </nav>
      </header>
    );
  };

export default Header;