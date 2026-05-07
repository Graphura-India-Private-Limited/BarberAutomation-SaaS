import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage            from "./pages/HomePage";
import Login               from "./pages/auth/Login";
import Signup              from "./pages/auth/Signup";
import CustomerProfile     from "./pages/auth/CustomerProfile";
import BarberLogin         from "./pages/barber/BarberLogin";
import BarberProfile       from "./pages/barber/BarberProfile";
import BarberDashboard     from "./pages/barber/BarberDashboard";
import ServiceConsole      from "./pages/barber/ServiceConsole";
import BreakManagement     from "./pages/barber/BreakManagement";
import SalonRegistration   from "./pages/owner/SalonRegistration";
import OwnerDashboard      from "./pages/owner/OwnerDashboard";
import ManageServices      from "./pages/owner/ManageServices";
import AdminLogin          from "./pages/admin/AdminLogin";
import AdminOnboarding     from "./pages/admin/AdminOnboarding";
import ServiceCategories   from "./pages/customer/ServiceCategories";
import MenServices         from "./pages/customer/MenServices";
import WomenServices       from "./pages/customer/WomenServices";
import AddonServices       from "./pages/customer/AddonServices";
import BarberSelection     from "./pages/customer/BarberSelection";
import CustomerDetails     from "./pages/customer/CustomerDetails";
import Booking             from "./pages/customer/Booking";
import BookingHistory      from "./pages/customer/BookingHistory";
import CustomerBookingFlow from "./pages/customer/CustomerBookingFlow";
import ServiceHandler from "./pages/barber/ServiceHandler";

/* ── Capital C Components (our folder) ── */
import ReviewSystem    from "./Components/ReviewSystem";
import SalonDetailPage from "./Components/SalonDetailPage";
import NearbyBarbers   from "./Components/NearbyBarbers";
import NoShowDelayPage from "./Components/NoShowDelayPage";

const demoBooking = { status:"completed", barberName:"Rahul" };

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── HOME — our HomePage at / ── */}
        <Route path="/"         element={<HomePage />} />
        <Route path="/home"     element={<HomePage />} />
        <Route path="/HomePage" element={<HomePage />} />

        {/* ── AUTH ── */}
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/customerprofile" element={<CustomerProfile />} />

        {/* ── CUSTOMER BOOKING (sir's routes) ── */}
        <Route path="/customer/services"        element={<ServiceCategories />} />
        <Route path="/customer/services/men"    element={<MenServices />} />
        <Route path="/customer/services/women"  element={<WomenServices />} />
        <Route path="/customer/services/addon"  element={<AddonServices />} />
        <Route path="/customer/services/addons" element={<AddonServices />} />
        <Route path="/customer/barber"          element={<BarberSelection />} />
        <Route path="/customer/details"         element={<CustomerDetails />} />
        <Route path="/customer/booking"         element={<Booking />} />
        <Route path="/customer/history"         element={<BookingHistory />} />
        <Route path="/customer/flow"            element={<CustomerBookingFlow />} />
        <Route path="/booking-history"          element={<BookingHistory />} />
        <Route path="/booking-flow"             element={<CustomerBookingFlow />} />

        {/* ── DISCOVERY ── */}
        <Route path="/nearby"       element={<NearbyBarbers />} />
        <Route path="/salon-detail" element={<SalonDetailPage />} />
        <Route path="/salon/:id"    element={<SalonDetailPage />} />
        <Route path="/write-review" element={<ReviewSystem bookingData={demoBooking} />} />

        {/* ── BARBER ── */}
        <Route path="/barber/login"     element={<BarberLogin />} />
        <Route path="/barber/profile"   element={<BarberProfile />} />
        <Route path="/barber/dashboard" element={<BarberDashboard />} />
        <Route path="/barber/breaks"    element={<BreakManagement />} />
        <Route path="/live-session"     element={<ServiceConsole />} />
        <Route path="/noshow-delay"     element={<NoShowDelayPage />} />
        <Route path="/service-handler"   element={<ServiceHandler />} />

        {/* ── OWNER ── */}
        <Route path="/register-salon"        element={<SalonRegistration />} />
        <Route path="/owner/dashboard"       element={<OwnerDashboard />} />
        <Route path="/owner/manage-services" element={<ManageServices />} />

        {/* ── ADMIN ── */}
        <Route path="/admin/login"     element={<AdminLogin />} />
        <Route path="/admin/requests"  element={<AdminOnboarding />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;