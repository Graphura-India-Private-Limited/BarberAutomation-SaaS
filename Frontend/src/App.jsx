import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Customer Pages
import CustomerProfile from './pages/auth/CustomerProfile';

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Barber Pages
import BarberLogin from "./pages/barber/BarberLogin";
import BarberProfile from "./pages/barber/BarberProfile";
import BarberDashboard from "./pages/barber/BarberDashboard";

// Owner Pages
import SalonRegistration from "./pages/owner/SalonRegistration";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ManageServices from "./pages/owner/ManageServices";

// Admin Pages 
import AdminLogin from "./pages/admin/AdminLogin"; 
import AdminOnboarding from "./pages/admin/AdminOnboarding";

// 🔥 YOUR BOOKING FLOW IMPORTS (FIXED PATHS)
import ServiceCategories from "./pages/customer/ServiceCategories";
import MenServices from "./pages/customer/MenServices";
import WomenServices from "./pages/customer/WomenServices";
import AddonServices from "./pages/customer/AddonServices";
import BarberSelection from "./pages/customer/BarberSelection";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Customer Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customerprofile" element={<CustomerProfile />} />

        {/* 🔥 BOOKING FLOW */}
        <Route path="/customer/services" element={<ServiceCategories />} />
        <Route path="/customer/services/men" element={<MenServices />} />
        <Route path="/customer/services/women" element={<WomenServices />} />
        <Route path="/customer/services/addon" element={<AddonServices />} />
        <Route path="/customer/barber" element={<BarberSelection />} />

        {/* Barber Routes */}
        <Route path="/barber/login" element={<BarberLogin />} />
        <Route path="/barber/profile" element={<BarberProfile />} />
        <Route path="/barber/dashboard" element={<BarberDashboard />} />

        {/* Owner Routes */}
        <Route path="/register-salon" element={<SalonRegistration />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/manage-services" element={<ManageServices />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/requests" element={<AdminOnboarding />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;