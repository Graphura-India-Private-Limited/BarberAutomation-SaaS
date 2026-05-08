import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Pages
import Login               from "./pages/auth/Login";
import Signup              from "./pages/auth/Signup";
import CustomerProfile     from "./pages/auth/CustomerProfile";
import OTPLogin            from "./pages/auth/OTPLogin";
import OTPVerify           from "./pages/auth/OTPVerify";
import Register            from "./pages/auth/Register";
import DuplicateAccount    from "./pages/auth/DuplicateAccount";
import RateLimit           from "./pages/auth/RateLimit";
import Payment             from "./pages/auth/Payment";

// Barber Pages
import BarberLogin         from "./pages/barber/BarberLogin";
import BarberProfile       from "./pages/barber/BarberProfile";
import BarberDashboard     from "./pages/barber/BarberDashboard";
import ServiceConsole      from "./pages/barber/ServiceConsole";
import BreakManagement     from "./pages/barber/BreakManagement";

// Owner Pages
import SalonRegistration   from "./pages/owner/SalonRegistration";
import OwnerDashboard      from "./pages/owner/OwnerDashboard";
import ManageServices      from "./pages/owner/ManageServices";

// Admin Pages
import AdminLogin          from "./pages/admin/AdminLogin";
import AdminOnboarding     from "./pages/admin/AdminOnboarding";

// Customer Booking Flow
import ServiceCategories   from "./pages/customer/ServiceCategories";
import MenServices         from "./pages/customer/MenServices";
import WomenServices       from "./pages/customer/WomenServices";
import AddonServices       from "./pages/customer/AddonServices";
import BarberSelection     from "./pages/customer/BarberSelection";
import CustomerDetails     from "./pages/customer/CustomerDetails";
import Booking             from "./pages/customer/Booking";
import BookingHistory      from "./pages/customer/BookingHistory";
import CustomerBookingFlow from "./pages/customer/CustomerBookingFlow";
import CustomerInteractionView from "./pages/customer/CustomerInteractionView";

// Components
import ReviewSystem    from "./Components/ReviewSystem";
import SalonDetailPage from "./Components/SalonDetailPage";
import NearbyBarbers   from "./Components/NearbyBarbers";
import NoShowDelayPage from "./Components/NoShowDelayPage";

// Other Pages
import HomePage from "./pages/HomePage";

const demoBooking = { status: "completed", barberName: "Rahul" };

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route path="/"          element={<Login />} />
        <Route path="/home"      element={<HomePage />} />

        {/* Auth */}
        <Route path="/login"              element={<Login />} />
        <Route path="/signup"             element={<Signup />} />
        <Route path="/customerprofile"    element={<CustomerProfile />} />
        <Route path="/otp-login"          element={<OTPLogin />} />
        <Route path="/otp-verify"         element={<OTPVerify />} />
        <Route path="/register"           element={<Register />} />
        <Route path="/duplicate-account"  element={<DuplicateAccount />} />
        <Route path="/rate-limit"         element={<RateLimit />} />
        <Route path="/payment"            element={<Payment />} />

        {/* Customer Booking */}
        <Route path="/booking"                   element={<CustomerBookingFlow />} />
        <Route path="/customer/services"         element={<ServiceCategories />} />
        <Route path="/customer/services/men"     element={<MenServices />} />
        <Route path="/customer/services/women"   element={<WomenServices />} />
        <Route path="/customer/services/addon"   element={<AddonServices />} />
        <Route path="/customer/services/addons"  element={<AddonServices />} />
        <Route path="/customer/barber"           element={<BarberSelection />} />
        <Route path="/customer/details"          element={<CustomerDetails />} />
        <Route path="/customer/booking"          element={<Booking />} />
        <Route path="/customer/history"          element={<BookingHistory />} />
        <Route path="/customer/flow"             element={<CustomerBookingFlow />} />
        <Route path="/customer/interactions"     element={<CustomerInteractionView />} />
        <Route path="/booking-history"           element={<BookingHistory />} />
        <Route path="/booking-flow"              element={<CustomerBookingFlow />} />

        {/* Discovery */}
        <Route path="/nearby"       element={<NearbyBarbers />} />
        <Route path="/salon-detail" element={<SalonDetailPage />} />
        <Route path="/salon/:id"    element={<SalonDetailPage />} />
        <Route path="/write-review" element={<ReviewSystem bookingData={demoBooking} />} />

        {/* Barber */}
        <Route path="/barber/login"     element={<BarberLogin />} />
        <Route path="/barber/profile"   element={<BarberProfile />} />
        <Route path="/barber/dashboard" element={<BarberDashboard />} />
        <Route path="/barber/breaks"    element={<BreakManagement />} />
        <Route path="/live-session"     element={<ServiceConsole />} />
        <Route path="/noshow-delay"     element={<NoShowDelayPage />} />

        {/* Owner */}
        <Route path="/register-salon"        element={<SalonRegistration />} />
        <Route path="/owner/dashboard"       element={<OwnerDashboard />} />
        <Route path="/owner/manage-services" element={<ManageServices />} />

        {/* Admin */}
        <Route path="/admin/login"    element={<AdminLogin />} />
        <Route path="/admin/requests" element={<AdminOnboarding />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
