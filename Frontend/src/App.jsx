import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CustomerProfile from "./pages/auth/CustomerProfile";

// Review Component
import ReviewSystem from './components/ReviewSystem';

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

// 🔥 Booking Flow (team code)
import ServiceCategories from "./pages/customer/ServiceCategories";
import MenServices from "./pages/customer/MenServices";
import WomenServices from "./pages/customer/WomenServices";
import AddonServices from "./pages/customer/AddonServices";
import BarberSelection from "./pages/customer/BarberSelection";
import CustomerDetails from "./pages/customer/CustomerDetails";   // ✅ added
import Booking from "./pages/customer/Booking";    
import BookingHistory from './pages/customer/BookingHistory';   
import CustomerBookingFlow from './pages/customer/CustomerBookingFlow';           

// ✅ YOUR PAGE
import SalonDetailPage from "./components/SalonDetailPage";

function App() {
  const demoBooking = {
    status: "completed",
    barberName: "Rahul",
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Customer Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customerprofile" element={<CustomerProfile />} />
        
        {/* Review Route) */}
        <Route path="/write-review" element={<ReviewSystem bookingData={demoBooking} />} />
        
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

        {/* ✅ YOUR ROUTE */}
        <Route path="/salon-detail" element={<SalonDetailPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;