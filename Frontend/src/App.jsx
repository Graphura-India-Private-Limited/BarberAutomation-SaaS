import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
/* ── Pages ── */

import HomePage            from "./pages/HomePage";
import Login               from "./pages/auth/Login";
import Signup              from "./pages/auth/Signup";
import CustomerProfile     from "./pages/auth/CustomerProfile";
import OTPLogin            from "./pages/auth/OTPLogin";
import OTPVerify           from "./pages/auth/OTPVerify";
import Register            from "./pages/auth/Register";
import DuplicateAccount    from "./pages/auth/DuplicateAccount";
import RateLimit           from "./pages/auth/RateLimit";
import Payment             from "./pages/auth/Payment";
// import StaffLogin          from "./pages/auth/StaffLogin";
import BarberLogin         from "./pages/barber/BarberLogin";
import BarberProfile       from "./pages/barber/BarberProfile";
import BarberDashboard     from "./pages/barber/BarberDashboard";
import ServiceConsole      from "./pages/barber/ServiceConsole";
// import ServiceHandler      from "./pages/barber/ServiceHandler";
import BreakManagement     from "./pages/barber/BreakManagement";
// import NoShowHandle from "./pages/barber/NoShowHandle";
// import QueuePage           from "./pages/barber/QueuePage";
// import SmartQueue          from "./pages/customer/SmartQueue";
// import OwnerLogin          from "./pages/owner/OwnerLogin";
import OwnerLogin          from "./pages/owner/OwnerLogin";
import SalonRegistration   from "./pages/owner/SalonRegistration";
import OwnerDashboard      from "./pages/owner/OwnerDashboard";
import ManageServices      from "./pages/owner/ManageServices";
import OwnerNotifications  from "./pages/owner/OwnerNotifications";
// import HomeOverview        from "./pages/owner/HomeOverview";
// import FinancePage         from "./pages/owner/FinancePage";
// import SettingsPage        from "./pages/owner/SettingsPage";
// import BreakApprovalDashboard from "./pages/owner/BreakApprovalDashboard";
// import AnalyticsDashboard    from "./pages/owner/AnalyticsDashboard";
import AdminLogin          from "./pages/admin/AdminLogin";
import AdminOnboarding     from "./pages/admin/AdminOnboarding";
import AdminSubscriptionDashboard from "./subscription/pages/AdminSubscriptionDashboard";
import OwnerBillingPage    from "./subscription/pages/OwnerBillingPage";
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



/* ── Components (Capital C) ── */

import ReviewSystem    from "./Components/ReviewSystem";
import SalonDetailPage from "./Components/SalonDetailPage";
import NearbyBarbers   from "./Components/NearbyBarbers";
import NoShowDelayPage from "./Components/NoShowDelayPage";
// import MembershipSection from "./Components/MembershipSection";
// import LiveQueue from "./pages/owner/LiveQueue";
// import Navbar             from "./Components/Navbar";
import GlobalToasts          from "./Components/notifications/GlobalToasts";



const demoBooking = { status:"completed", barberName:"Rahul" };


function App() {
  return (
    <BrowserRouter>
      <GlobalToasts />
      <Routes>
        {/* ── HOME ── */}
        <Route path="/"         element={<HomePage />} />
        <Route path="/home"     element={<HomePage />} />
        <Route path="/HomePage" element={<HomePage />} />
        {/* ── CUSTOMER AUTH ── */}
        <Route path="/login"            element={<Login />} />
        <Route path="/signup"           element={<Signup />} />
        <Route path="/customerprofile"  element={<CustomerProfile />} />
        <Route path="/otp-login"        element={<OTPLogin />} />
        <Route path="/otp-verify"       element={<OTPVerify />} />
        <Route path="/register"         element={<Register />} />
        <Route path="/duplicate-account"element={<DuplicateAccount />} />
        <Route path="/rate-limit"       element={<RateLimit />} />
        <Route path="/payment"          element={<Payment />} />

        {/* ── CUSTOMER BOOKING ── */}

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
        <Route path="/customer/interactions"    element={<CustomerInteractionView />} />
        <Route path="/booking"                  element={<CustomerBookingFlow />} />
        <Route path="/booking-history"          element={<BookingHistory />} />
        <Route path="/booking-flow"             element={<CustomerBookingFlow />} />
        <Route path="/customer/interactions" element={<CustomerInteractionView />} />
        {/* <Route path="/smart-queue" element={<SmartQueue />} /> */}

        {/* ── DISCOVERY ── */}

        <Route path="/nearby"       element={<NearbyBarbers />} />
        <Route path="/salon-detail" element={<SalonDetailPage />} />
        <Route path="/salon/:id"    element={<SalonDetailPage />} />
        <Route path="/write-review" element={<ReviewSystem bookingData={demoBooking} />} />
        {/* <Route path="/membership"   element={<MembershipSection />} /> */}

        {/* ── BARBER ── */}

        <Route path="/barber/login"     element={<BarberLogin />} />
        <Route path="/barber/profile"   element={<BarberProfile />} />
        <Route path="/barber/dashboard" element={<BarberDashboard />} />
        <Route path="/barber/breaks"    element={<BreakManagement />} />
        <Route path="/live-session"     element={<ServiceConsole />} />
        {/* <Route path="/service-handler"  element={<ServiceHandler />} /> */}
        <Route path="/noshow-delay"     element={<NoShowDelayPage />} />
        {/* <Route path="/barber/noshow-handle" element={<NoShowHandle />} /> */}

        {/* ── OWNER ── */}

        <Route path="/owner/login"           element={<OwnerLogin />} />
        <Route path="/register-salon"        element={<SalonRegistration />} />
        <Route path="/owner/dashboard"       element={<OwnerDashboard />} />
        {/* <Route path="/owner/analytics"       element={<AnalyticsDashboard />} /> */}
        <Route path="/owner/manage-services" element={<ManageServices />} />
        <Route path="/owner/notifications"   element={<OwnerNotifications />} />
        {/* <Route path="/owner/approvals"       element={<BreakApprovalDashboard />} /> */}

        {/* ── ADMIN ── */}

        <Route path="/admin/login"         element={<AdminLogin />} />
        <Route path="/admin/requests"      element={<AdminOnboarding />} />
        <Route path="/admin/subscription"  element={<AdminSubscriptionDashboard />} />

        {/* ── OWNER BILLING ── */}
        <Route path="/owner/billing"       element={<OwnerBillingPage />} />

         {/* ── SECURITY & ACCESS CONTROL ── */}

        {/* <Route path="/staff-login"    element={<StaffLogin />} /> */}
        <Route path="/owner/overview" element={<OwnerDashboard />} />
        {/* <Route path="/barber/queue"   element={<QueuePage />} /> */}
        {/* <Route path="/owner/finance"  element={<FinancePage />} /> */}
        {/* <Route path="/owner/settings" element={<SettingsPage />} /> */}
        {/* <Route path="/owner/queue" element={<LiveQueue />} /> */} 
      </Routes>
    </BrowserRouter>
  );
}
export default App;