// client/src/pages/Login.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { pageTransitions } from '../animations/pageTransitions';
import { motion } from 'framer-motion';

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await signInWithGoogle();
    navigate('/create_company'); // Redirect to Create Company page after login
  };

  return (
    <motion.div 
              {...pageTransitions}
              className="container mx-auto px-4 py-8"
            >
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
    </motion.div>
  );
};

export default Login;
