import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Home from './pages/Home';
import CreateUser from './pages/CreateUser';
import CreateCompany from './pages/CreateCompany';
import EditUser from './pages/EditUser';
import Layout from './components/Layout';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/edit/:id" element={<EditUser />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/create_company"
            element={
              <PrivateRoute>
                <CreateCompany />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
