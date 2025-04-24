import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import PaymentPage from './pages/PaymentPage';
import MoviePage from './pages/MoviePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MovieDetailPage from './pages/MovieDetailPage';
import StadiumSelection from './pages/StadiumSelection';
import ConcertSeat from './pages/ConcertSeat';
import ConcertPage from './pages/ConcertPage';
import ConcertDetailPage from './pages/ConcertDetailPage';
import SportPage from './pages/SportPage';
import SportDetailPage from './pages/SportDetailPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RefundPage from './pages/RefundPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import FAQPage from './pages/FAQPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/NotificationToast';
import APITest from './components/APITest';

function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    // Display a loading spinner/message while checking authentication
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms" element={<TermsAndConditionsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/refund" element={<RefundPage />} />

            {/* Event listings (public) */}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/movies" element={<MoviePage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/concerts" element={<ConcertPage />} />
            <Route path="/concerts/:id" element={<ConcertDetailPage />} />
            <Route path="/sports" element={<SportPage />} />
            <Route path="/sports/:id" element={<SportDetailPage />} />

            {/* Protected routes - regular users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/seat-selection/:eventId" element={<SeatSelectionPage />} />
              <Route path="/stadium-selection/:eventId" element={<StadiumSelection />} />
              <Route path="/concert-seat/:eventId" element={<ConcertSeat />} />
              <Route path="/payment/:bookingId" element={<PaymentPage />} />
              <Route path="/checkout/:bookingId" element={<CheckoutPage />} />
            </Route>

            {/* Protected routes - admin only */}
            <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
              <Route path="/admin" element={<DashboardPage isAdmin={true} />} />
            </Route>

            {/* Error/Not Found route */}
            <Route
              path="*"
              element={
                <div className="flex h-screen flex-col items-center justify-center">
                  <h1 className="text-3xl font-bold text-gray-800">Page Not Found</h1>
                  <p className="mt-4 text-gray-600">The page you are looking for doesn't exist.</p>
                </div>
              }
            />

            {/* Unauthorized route */}
            <Route
              path="/unauthorized"
              element={
                <div className="flex h-screen flex-col items-center justify-center">
                  <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
                  <p className="mt-4 text-gray-600">You don't have permission to access this page.</p>
                </div>
              }
            />

            <Route path="/api-test" element={<APITest />} />
          </Routes>
        </main>
        <Footer />

        {/* Show notification toasts when authenticated */}
        {isAuthenticated && <NotificationToast />}
      </div>
    </NotificationProvider>
  );
}

export default App;