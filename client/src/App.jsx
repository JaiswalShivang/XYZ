import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserSignUp from "./pages/UserSignUp";
import AdminSignUp from "./pages/AdminSignUp";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdditionalDetails from "./pages/AdditionalDetails";
import Schemes from "./pages/Schemes";
import Feedback from "./pages/Feedback";
import SchemeDetail from "./pages/SchemeDetail";
import SignUp from "./pages/SignUp";
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/admin/signup" element={<AdminSignUp />} />
          <Route path="/register" element={<Register />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/schemes/:id" element={<SchemeDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <PrivateRoute roles={["User"]}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-details"
            element={
              <PrivateRoute roles={["User"]}>
                <AdditionalDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute roles={["User"]}>
                <Feedback />
              </PrivateRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute roles={["Admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </MainLayout>
  );
}

export default App;