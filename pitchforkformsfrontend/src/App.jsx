import Navbar from '../src/Components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainPage from './Components/Pages/MainPage';
import AdminPage from './Components/Pages/AdminPage';
import StudentPage from './Components/Pages/StudentPage';
import CreateFormPage from './Components/Pages/CreateFormPage';
import FormPage from './Components/Pages/FormPage';
import LoginModal from './Components/LoginModal';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [openLogin, setOpenLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCloseLogin = () => setOpenLogin(false);

  const ProtectedRoute = ({ children }) => {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken)
    if (!accessToken) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  useEffect(() => {
    const attemptAutoLogin = async () => {
      const rememberMe = localStorage.getItem("rememberMe");
      const accessToken = localStorage.getItem("accessToken");

      if (rememberMe && !accessToken) {
        try {
          const response = await axios.post("/auth/refresh", {}, {
            withCredentials: true
          });

          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('rememberMe', "true");
          setUser({ username: response.data.username });
        } catch (error) {
          localStorage.removeItem('rememberMe');
          console.log("autologin remove token 1")
          localStorage.removeItem('accessToken');
          console.log(error)
        }
      } else if (accessToken) {
        try {
          const response = await axios.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setUser({ username: response.data.username });
        } catch (error) {
          console.log(error)
          console.log("autologin remove token 2")
        }
      }
      setIsLoading(false);
    };

    attemptAutoLogin();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    handleCloseLogin();
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("rememberMe");
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess} />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="/student" element={
          <ProtectedRoute>
            <StudentPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/create-form" element={
          <ProtectedRoute>
            <CreateFormPage />
          </ProtectedRoute>
        } />
        <Route path="/student/form" element={
          <ProtectedRoute>
            <FormPage />
          </ProtectedRoute>
        } />
      </Routes>

      {/* Login Modal globally */}
      <LoginModal open={openLogin} handleClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} />
    </Router>
  );
}

export default App;