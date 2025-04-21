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
import UserProfile from './Components/Pages/UserProfile';
import EditFormPage from './Components/Pages/EditFormPage';
import AllStudentsPage from './Components/Pages/AllStudentsPage';
import AboutUsPage from './Components/Pages/AboutUsPage';

function App() {
  const [openLogin, setOpenLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCloseLogin = () => setOpenLogin(false);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = user.role;
    if (!user) {
      return <Navigate to="/" replace />;

    }
    if (allowedRoles.includes(role)) {
      return children;
    }
    return <Navigate to="/" replace />;
  };

  useEffect(() => {
    const attemptAutoLogin = async () => {
      const rememberMe = localStorage.getItem("rememberMe");
      let accessToken = localStorage.getItem("accessToken");

      if (rememberMe && !accessToken) {
        try {
          const response = await axios.post("/auth/refresh", {}, {
            withCredentials: true
          });

          accessToken = response.data.accessToken;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('rememberMe', "true");
          setUser({
            id: response.data.user.id,
            username: response.data.user.username,
            email: response.data.user.email,
            role: response.data.role,
          });

        } catch (error) {
          console.error("Error during token refresh:", error);
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('accessToken');
        }
      }

      if (accessToken) {
        try {
          const response = await axios.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setUser({
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            role: response.data.role,
          });
        } catch (error) {
          if (error.response && error.response.status === 401) {
            // Token expired, attempt to refresh
            try {
              const refreshResponse = await axios.post("/auth/refresh", {}, {
                withCredentials: true
              });

              const newAccessToken = refreshResponse.data.accessToken;
              localStorage.setItem('accessToken', newAccessToken);
              setUser({
                id: refreshResponse.data.id,
                username: refreshResponse.data.username,
                email: refreshResponse.data.email,
                role: refreshResponse.data.role,
              });
            } catch (refreshError) {
              console.error("Error during token refresh after expiration:", refreshError);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('rememberMe');
            }
          } else {
            console.error("Error during user authentication:", error);
          }
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
      <Navbar
        user={user}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
      />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/create-form" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateFormPage />
          </ProtectedRoute>
        } />
        <Route path="/student/form" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <FormPage />
          </ProtectedRoute>
        } />

        <Route path="/user/profile/:id" element={
          <ProtectedRoute allowedRoles={["admin", "student"]}>
            <UserProfile />
          </ProtectedRoute>
        } />

        <Route path="/admin/edit-form/:id" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EditFormPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/all-students" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AllStudentsPage />
          </ProtectedRoute>
        } />
      </Routes>

      {/* Login Modal globally */}
      <LoginModal
        open={openLogin}
        handleClose={handleCloseLogin}
        onLoginSuccess={handleLoginSuccess}
      />
    </Router>
  );
}

export default App;