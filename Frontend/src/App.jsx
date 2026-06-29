import React, { useState } from "react";
// import { BrowserRouter, Routes, Route, useNavigate, Outlet } from "react-router-dom";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Outlet, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminActivityTracker from "./components/auth/AdminActivityTracker";
import ScrollToTop from "./components/common/ScrollToTop";

/* ── Pages ── */
import HomePage from "./pages/public/HomePage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CustomerProfile from "./pages/auth/CustomerProfile";
import OTPLogin from "./pages/auth/OTPLogin";
import OTPVerify from "./pages/auth/OTPVerify";
import Register from "./pages/auth/Register";
import DuplicateAccount from "./pages/auth/DuplicateAccount";
import RateLimit from "./pages/auth/RateLimit";
import Payment from "./pages/auth/Payment";
import StaffLogin from "./pages/auth/StaffLogin";
import BarberLogin from "./pages/barber/BarberLogin";
import BarberProfile from "./pages/barber/BarberProfile";
import BarberDashboard from "./pages/barber/BarberDashboard";
import ServiceConsole from "./pages/barber/ServiceConsole";
import ServiceHandler from "./pages/barber/ServiceHandler";
import BreakManagement from "./pages/barber/BreakManagement";
import BarberSettings from "./pages/barber/BarberSettings";
import BarberBookings from "./pages/barber/BarberBookings";
import BarberEarnings from "./pages/barber/BarberEarnings";
import BarberReviews from "./pages/barber/BarberReviews";
import BarberServices from "./pages/barber/BarberServices";
import BarberLayout from "./components/layout/BarberLayout";
import AdminLayout from "./components/layout/AdminLayout";
import SmartQueue from "./pages/barber/SmartQueue";
import OwnerLogin from "./pages/owner/OwnerLogin";
import SalonRegistration from "./pages/owner/SalonRegistration";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ManageServices from "./pages/owner/ManageServices";
import HomeOverview from "./pages/barber/HomeOverview";
import PaymentDashboard from "./pages/owner/PaymentDashboard";
import SettingsPage from "./pages/owner/SettingsPage";
import BreakApprovalDashboard from "./pages/owner/BreakApprovalDashboard";
import FinancialAnalytics from "./pages/owner/FinancialAnalytics";
import OwnerLayout from "./components/layout/OwnerLayout";
import BarberTeam from "./pages/owner/BarberTeam";
import OwnerLiveMonitoring from "./pages/owner/OwnerLiveMonitoring";
import AddBarber from "./pages/owner/AddBarber";
import OwnerSupportPage from "./pages/owner/OwnerSupportPage";
import SalonSettlements from "./pages/owner/SalonSettlements";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOnboarding from "./pages/admin/AdminOnboarding";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { TicketsPage } from "./pages/admin/TicketsPage";
import { ReportsPage } from "./pages/admin/ReportsPage";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { useTickets } from "./utils/useTickets";
import { TICKET_TYPE } from "./utils/tickets";
import ServiceCategories from "./pages/customer/ServiceCategories";
import MenServices from "./pages/customer/MenServices";
import WomenServices from "./pages/customer/WomenServices";
import AddonServices from "./pages/customer/AddonServices";
import BarberSelection from "./pages/customer/BarberSelection";
import SelectLook from "./pages/customer/SelectLook";
import CustomerDetails from "./pages/customer/CustomerDetails";
import Booking from "./pages/customer/Booking";
import BookingHistory from "./pages/customer/BookingHistory";
import CustomerBookingFlow from "./pages/customer/CustomerBookingFlow";
import CustomerInteractionView from "./pages/customer/CustomerInteractionView";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import BookingManagement from "./pages/owner/BookingManagement";
import SalonManagement from "./pages/admin/SalonManagement";
import CustomerManagement from "./pages/customer/CustomerManagement";
import AllReviews from "./pages/customer/AllReviews";
import FaqPage from "./pages/public/FaqPage";
import AboutPage from "./pages/public/AboutPage";
import VisitRelaxPage from "./pages/public/VisitRelaxPage";
import TermsPage from "./pages/public/TermsPage";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ContactSupport from "./pages/customer/ContactSupport";
import RefundPage from "./pages/customer/RefundPage";

/* ── Components ── */
import ReviewSystem from "./components/reviews/ReviewSystem";
import BookingReviewSystem from "./components/reviews/BookingReviewSystem";
import SalonDetailPage from "./components/salon/SalonDetailPage";
import AllSalonsPage from "./components/salon/AllSalonsPage";
import NearbyBarbers from "./components/queue/NearbyBarbers";
import LiveQueue from "./pages/owner/LiveQueue";


function WriteReviewRoute() {
  const { state } = useLocation();
  return <ReviewSystem bookingData={state || {}} />;
}

function WriteBookingReviewRoute() {
  const { state } = useLocation();
  return <BookingReviewSystem bookingData={state || {}} />;
}

function App() {
  const ticketState = useTickets();


  const [status, setStatus] = useState("available");
  const [profile, setProfile] = useState({
    name: "Rahul Kumar",
    salonName: "The Royal Touch Salon",
    initials: "RK",
    specialization: "Hair Stylist & Grooming Expert"
  });

  const [queue, setQueue] = useState([]);
  const [currentSvc, setCurrentSvc] = useState(null);
  const [breakRequests, setBreakRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, clients: 0, rating: 5.0 });
  const [toast, setToast] = useState(null);

  const getElapsed = () => 0;
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        {/* --- HOME --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/HomePage" element={<HomePage />} />

        {/* --- CUSTOMER AUTH --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customerprofile" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerProfile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerProfile /></ProtectedRoute>} />
        <Route path="/otp-login" element={<OTPLogin />} />
        <Route path="/otp-verify" element={<OTPVerify />} />
        <Route path="/register" element={<Register />} />
        <Route path="/duplicate-account" element={<DuplicateAccount />} />
        <Route path="/rate-limit" element={<RateLimit />} />
        <Route path="/payment" element={<Payment />} />

        {/* --- CUSTOMER BOOKING & DASHBOARD --- */}
        <Route path="/customer" element={<Outlet />}>
          {/* Public customer booking paths */}
          <Route path="services" element={<ServiceCategories />} />
          <Route path="services/men" element={<MenServices />} />
          <Route path="services/women" element={<WomenServices />} />
          <Route path="services/addon" element={<AddonServices />} />
          <Route path="services/addons" element={<AddonServices />} />
          <Route path="barber" element={<BarberSelection />} />
          {/* Protected customer booking paths */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]}><Outlet /></ProtectedRoute>}>
            <Route path="look" element={<SelectLook />} />
            <Route path="details" element={<CustomerDetails />} />
            <Route path="booking" element={<CustomerBookingFlow />} />
            <Route path="history" element={<BookingHistory />} />
            <Route path="flow" element={<CustomerBookingFlow />} />
            <Route path="refund/:bookingId" element={<RefundPage />} />
          </Route>
        </Route>

        {/* --- DISCOVERY & REVIEWS --- */}
        <Route path="/nearby" element={<NearbyBarbers />} />
        <Route path="/barbers" element={<NearbyBarbers />} />
        <Route path="/salon" element={<SalonDetailPage />} />
        <Route path="/salon/:id" element={<SalonDetailPage />} />
        <Route path="/salons" element={<AllSalonsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/visit-relax" element={<VisitRelaxPage />} />
       <Route path="/write-review" element={<ProtectedRoute allowedRoles={["customer"]}><WriteReviewRoute /></ProtectedRoute>} />
       <Route path="/write-booking-review" element={<ProtectedRoute allowedRoles={["customer"]}><WriteBookingReviewRoute /></ProtectedRoute>} />

        {/* --- BARBER PROFILE & ACTIONS (RESTRICTED BY RBAC) --- */}
        <Route path="/barber/login" element={<BarberLogin />} />
        <Route path="/barber" element={<ProtectedRoute allowedRoles={["barber"]}><Outlet /></ProtectedRoute>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="dashboard" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}> <BarberDashboard stats={stats} currentSvc={currentSvc} setCurrentSvc={setCurrentSvc} getElapsed={getElapsed} showToast={showToast} queue={queue} breakRequests={breakRequests} reviews={reviews} /></BarberLayout>} />
          <Route path="overview" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}><HomeOverview /></BarberLayout>} />
          <Route path="profile" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}><BarberProfile /></BarberLayout>} />
          <Route path="breaks" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}> <BreakManagement /></BarberLayout>} />
          <Route path="break" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}> <BreakManagement /></BarberLayout>} />
          <Route path="live-session" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}> <ServiceConsole /> </BarberLayout>} />
          <Route path="service-handler" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}> <ServiceConsole /> </BarberLayout>} />
          <Route path="service-console" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}> <ServiceConsole /> </BarberLayout>} />
          <Route path="noshow-delay" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}><ServiceConsole /> </BarberLayout>} />
          <Route path="noshow-handle" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}> <ServiceConsole /> </BarberLayout>} />
          <Route path="settings" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}><BarberSettings /> </BarberLayout>} />
          <Route path="queue" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}> <SmartQueue /> </BarberLayout>} />
          <Route path="bookings" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}> <BarberBookings /></BarberLayout>} />
          <Route path="earnings" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}><BarberEarnings /> </BarberLayout>} />
          <Route path="reviews" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}> <BarberReviews /></BarberLayout>} />
          <Route path="services" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}><BarberServices /></BarberLayout>} />
          <Route path="interactions" element={<BarberLayout profile={profile} status={status} setStatus={setStatus} toast={toast}><CustomerInteractionView /></BarberLayout>} />
        </Route>

        {/* --- OWNER HUB CONTROL (RESTRICTED BY RBAC) --- */}
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/register-salon" element={<SalonRegistration />} />
        <Route path="/owner" element={<ProtectedRoute allowedRoles={["owner"]}><OwnerLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="dashboard/analytics" element={<FinancialAnalytics />} />
          <Route path="financial-analytics" element={<FinancialAnalytics />} />
          <Route path="payments" element={<PaymentDashboard />} />
          <Route path="revenue" element={<FinancialAnalytics />} />
          <Route path="manage-services" element={<ManageServices />} />
          <Route path="approvals" element={<BreakApprovalDashboard />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="finance" element={<FinancialAnalytics />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="queue" element={<LiveQueue />} />
          <Route path="live" element={<OwnerLiveMonitoring />} />
          <Route path="barbers" element={<BarberTeam />} />
          <Route path="add-barber" element={<AddBarber />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="support" element={<OwnerSupportPage ticketState={ticketState} />} />
          <Route path="settlements" element={<SalonSettlements />} />
        </Route>

        {/* --- SUPER ADMIN CENTRAL PANEL (RESTRICTED BY RBAC) --- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminActivityTracker /></ProtectedRoute>}>
          <Route path="customers" element={<AdminOnboarding />} />
          <Route path="salon-management" element={<AdminOnboarding />} />
          <Route path="appointments" element={<AdminOnboarding />} />
          <Route path="services" element={<AdminOnboarding />} />
          <Route path="payments" element={<AdminOnboarding />} />
          <Route path="reviews" element={<AdminOnboarding />} />
          <Route path="live" element={<AdminOnboarding />} />
          <Route path="platform-settings" element={<AdminOnboarding />} />
          <Route index element={<AdminOnboarding />} />
          <Route path="onboarding" element={<AdminOnboarding />} />
          <Route path="user-management" element={<AdminLayout page="users"><AdminUserManagement /></AdminLayout>} />
          <Route path="analytics" element={<AdminLayout page="analytics"><AdminAnalytics /></AdminLayout>} />
          <Route path="dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="tickets" element={<AdminOnboarding />} />
          <Route path="reports" element={<Navigate to="/admin" replace />} />
          <Route path="settings" element={<AdminOnboarding />} />
          <Route path="customer-issues" element={<AdminOnboarding />} />
          <Route path="salon-issues" element={<AdminOnboarding />} />
          <Route path="owner-requests" element={<AdminOnboarding />} />
        </Route>

        {/* --- UTILITY & FALLBACK SECURITY CORE --- */}
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/reviews" element={<AllReviews />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/support" element={<ContactSupport onCreateTicket={ticketState.addTicket} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;