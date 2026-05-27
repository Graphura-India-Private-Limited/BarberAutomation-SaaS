import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrowserRouter, Routes, Route, useNavigate, Outlet  } from "react-router-dom";
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
import StaffLogin          from "./pages/auth/StaffLogin";
import BarberLogin         from "./pages/barber/BarberLogin";
import BarberProfile       from "./pages/barber/BarberProfile";
import BarberDashboard     from "./pages/barber/BarberDashboard";
import ServiceConsole      from "./pages/barber/ServiceConsole";
import ServiceHandler      from "./pages/barber/ServiceHandler";
import BreakManagement     from "./pages/barber/BreakManagement";
import NoShowHandle        from "./pages/barber/NoShowHandle";
import QueuePage           from "./pages/barber/QueuePage";
import BarberSettings      from "./pages/barber/BarberSettings";
import SmartQueue          from "./pages/customer/SmartQueue";
import OwnerLogin          from "./pages/owner/OwnerLogin";
import SalonRegistration   from "./pages/owner/SalonRegistration";
import OwnerDashboard      from "./pages/owner/OwnerDashboard";
import ManageServices      from "./pages/owner/ManageServices";
import HomeOverview        from "./pages/owner/HomeOverview";
import FinancePage         from "./pages/owner/FinancePage";
import PaymentDashboard    from "./pages/owner/PaymentDashboard";
import RevenueDashboard    from "./pages/owner/RevenueDashboard";
import SettingsPage        from "./pages/owner/SettingsPage";
import BreakApprovalDashboard from "./pages/owner/BreakApprovalDashboard";
import AnalyticsDashboard    from "./pages/owner/AnalyticsDashboard";
import AdminLogin          from "./pages/admin/AdminLogin";
import AdminOnboarding     from "./pages/admin/AdminOnboarding";
import { Sidebar, Header } from "./Components/AppLayout";
import { DashboardPage }  from "./pages/admin/DashboardPage";
import { TicketsPage }    from "./pages/admin/TicketsPage";
import { ReportsPage }    from "./pages/admin/ReportsPage";
import { AdminSettings }  from "./pages/admin/AdminSettings";
import { useTickets } from "./utils/useTickets";
import { TICKET_TYPE } from "./utils/tickets";
import AdminRequests from "./pages/admin/AdminRequests";
// import AdminSubscriptionDashboard from "./subscription/pages/AdminSubscriptionDashboard";
// import OwnerBillingPage    from "./subscription/pages/OwnerBillingPage";
import ServiceCategories   from "./pages/customer/ServiceCategories";
import MenServices         from "./pages/customer/MenServices";
import WomenServices       from "./pages/customer/WomenServices";
import AddonServices       from "./pages/customer/AddonServices";
import BarberSelection     from "./pages/customer/BarberSelection";
import CustomerDetails     from "./pages/customer/CustomerDetails";
import Booking             from "./pages/customer/Booking";
import BookingHistory      from "./pages/customer/BookingHistory";
import CustomerBookingFlow from "./pages/customer/CustomerBookingFlow";
import CustomerInteractionView                from "./pages/customer/CustomerInteractionView";
import AdminUserManagement                from "./pages/admin/AdminUserManagement";
import AdminAnalytics                from "./pages/admin/AdminAnalytics";
import BookingManagement                from "./pages/owner/BookingManagement";
import SalonViewPage                from "./pages/admin/SalonViewPage";
import SalonManagement                from "./pages/admin/SalonManagement";
import CustomerManagement                from "./pages/customer/CustomerManagement";
import AllReviews                from "./pages/customer/AllReviews";
import FaqPage                from "./pages/FaqPage";
import TermsPage                from "./pages/TermsPage";
import PrivacyPolicy                from "./pages/PrivacyPolicy";



/* ── Components (Capital C) ── */

import ReviewSystem    from "./components/reviews/ReviewSystem";
import SalonDetailPage from "./components/salon/SalonDetailPage";
import NearbyBarbers   from "./components/queue/NearbyBarbers";
import NoShowDelayPage from "./components/queue/NoShowDelayPage";
import MembershipSection from "./components/membership/MembershipSection";
import LiveQueue from "./pages/owner/LiveQueue";
// import Navbar             from "./components/layout/Navbar";


function AdminLayout({ page, children }) {
  const navigate = useNavigate();
  // const pageMap = { dashboard:'/admin/dashboard', tickets:'/admin/tickets', reports:'/admin/reports', settings:'/admin/settings' };
  const pageMap = { dashboard: '/admin/dashboard',tickets:   '/admin/tickets',customer:  '/admin/customer-issues', salon:     '/admin/salon-issues',reports:   '/admin/reports', settings:  '/admin/settings' };
  return (
    <div className="flex min-h-screen bg-orange-50">
      <div className="hidden lg:flex shrink-0">
        <Sidebar activePage={page} setActivePage={(p) => navigate(pageMap[p])} />
      </div>
      <div className="flex-1 flex flex-col">
        {/* <Header activePage={page} unreadCount={0} onBellClick={() => {}} /> */}
        <Header activePage={page} unreadCount={0} onBellClick={() => navigate('/admin/tickets')} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}




const demoBooking = { status:"completed", barberName:"Rahul" };


function App() {
   const ticketState = useTickets();
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- HOME --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home"     element={<HomePage />} />
        <Route path="/HomePage" element={<HomePage />} />

        {/* --- CUSTOMER AUTH --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customerprofile" element={<CustomerProfile />} />
        <Route path="/otp-login" element={<OTPLogin />} />
        <Route path="/otp-verify" element={<OTPVerify />} />
        <Route path="/register" element={<Register />} />
        <Route path="/duplicate-account" element={<DuplicateAccount />} />
        <Route path="/rate-limit" element={<RateLimit />} />
        <Route path="/payment" element={<Payment />} />

        {/* --- CUSTOMER BOOKING & DASHBOARD --- */}
        <Route path="/customer/services" element={<ServiceCategories />} />
        <Route path="/customer/services/men" element={<MenServices />} />
        <Route path="/customer/services/women" element={<WomenServices />} />
        <Route path="/customer/services/addons" element={<AddonServices />} />
        <Route path="/customer/barber" element={<BarberSelection />} />
        <Route path="/customer/details" element={<CustomerDetails />} />
        <Route path="/customer/booking" element={<CustomerBookingFlow />} />
        <Route path="/customer/history" element={<BookingHistory />} />
        <Route path="/customer/flow" element={<CustomerBookingFlow />} />
        <Route path="/customer/interactions" element={<CustomerInteractionView />} />
        <Route path="/smart-queue" element={<SmartQueue />} />
        <Route path="/customer/customers" element={<CustomerManagement />} />

        {/* --- DISCOVERY & REVIEWS --- */}
        <Route path="/nearby" element={<NearbyBarbers />} />
        <Route path="/salon-detail" element={<SalonDetailPage />} />
        <Route path="/barbers" element={<NearbyBarbers />} />
        <Route path="/salon/:id" element={<SalonDetailPage />} />
        <Route path="/write-review" element={<ReviewSystem bookingData={demoBooking} />} />
        <Route path="/membership" element={<MembershipSection />} />

        {/* --- BARBER PROFILE & ACTIONS --- */}
        <Route path="/barber/login" element={<BarberLogin />} />
        <Route path="/barber/profile" element={<BarberProfile />} />
        <Route path="/barber/dashboard" element={<BarberDashboard />} />
        <Route path="/barber/breaks" element={<BreakManagement />} />
        <Route path="/barber/live-session" element={<ServiceConsole />} />
        <Route path="/barber/service-handler" element={<ServiceHandler />} />
        <Route path="/barber/noshow-delay" element={<NoShowDelayPage />} />
        <Route path="/barber/noshow-handle" element={<NoShowHandle />} />
        <Route path="/barber/settings" element={<BarberSettings />} />

        {/* --- OWNER HUB CONTROL --- */}
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/register-salon" element={<SalonRegistration />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/dashboard/analytics" element={<AnalyticsDashboard />} />
        <Route path="/owner/payments" element={<PaymentDashboard />} />
        <Route path="/owner/revenue" element={<RevenueDashboard />} />
        <Route path="/owner/manage-services" element={<ManageServices />} />
        <Route path="/owner/approvals" element={<BreakApprovalDashboard />} />
        <Route path="/owner/bookings" element={<BookingManagement />} />

        {/* --- SUPER ADMIN CENTRAL PANEL --- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/requests" element={<AdminRequests initialTab="dashboard" />} />
        <Route path="/admin/customers" element={<AdminRequests initialTab="customers" />} />
        <Route path="/admin/barbers" element={<AdminRequests initialTab="barbers" />} />
        <Route path="/admin/add-barber" element={<AdminRequests initialTab="addbarber" />} />
        <Route path="/admin/appointments" element={<AdminRequests initialTab="appointments" />} />
        <Route path="/admin/services" element={<AdminRequests initialTab="services" />} />
        <Route path="/admin/payments" element={<AdminRequests initialTab="payments" />} />
        <Route path="/admin/reviews" element={<AdminRequests initialTab="reviews" />} />
        <Route path="/admin/live" element={<AdminRequests initialTab="live" />} />
        <Route path="/admin/platform-settings" element={<AdminRequests initialTab="settings" />} />
        <Route path="/admin/onboarding" element={<AdminOnboarding />} />
        <Route path="/admin/user-management" element={<AdminUserManagement />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/salon-management" element={<AdminRequests initialTab="salons" />} />
        <Route path="/admin/dashboard" element={<AdminLayout page="dashboard"><DashboardPage tickets={ticketState.tickets} onSelectTicket={(t) => ticketState.setSelectedTicket(t)} /></AdminLayout>} />
        <Route path="/admin/tickets"   element={<AdminLayout page="tickets"><TicketsPage {...ticketState} /></AdminLayout>} />
        <Route path="/admin/reports"   element={<AdminLayout page="reports"><ReportsPage tickets={ticketState.tickets} /></AdminLayout>} />
        <Route path="/admin/settings"  element={<AdminLayout page="settings"><AdminSettings /></AdminLayout>} />
        <Route path="/admin/customer-issues" element={<AdminLayout page="customer"><TicketsPage {...ticketState} typeFilter={TICKET_TYPE.CUSTOMER} /></AdminLayout>} />
        <Route path="/admin/salon-issues"    element={<AdminLayout page="salon"><TicketsPage {...ticketState} typeFilter={TICKET_TYPE.SALON} /></AdminLayout>} />
        <Route path="/admin/salon-management"element={<SalonManagement />}/>    
        <Route path="/admin/salon-view" element={<SalonViewPage />} />

        {/* --- UTILITY & FALLBACK SECURITY CORE --- */}
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/owner/overview" element={<HomeOverview />} />
        <Route path="/barber/queue" element={<QueuePage />} />
        <Route path="/owner/finance" element={<FinancePage />} />
        <Route path="/owner/settings" element={<SettingsPage />} />
         <Route path="/owner/queue" element={<LiveQueue />} />
         <Route path="/reviews" element={<AllReviews />} /> 
         <Route path="/faq" element={<FaqPage />} />
         <Route path="/terms" element={<TermsPage />} />
         <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
