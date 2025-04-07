import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import PaymentPage from './pages/PaymentPage';
import MoviePage from './pages/MoviePage'; // Adjust the import path as necessary
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MovieDetailPage from './pages/MovieDetailPage';
import StadiumSelection from './pages/StadiumSelection';
import ConcertSeat from './pages/ConcertSeat';
import ConcertPage from './pages/ConcertPage';
import ConcertDetailPage from './pages/ConcertDetailPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/movies" element={<MoviePage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/select-seats" element={<SeatSelectionPage />} />
            <Route path="/checkout" element={<PaymentPage />} />
            <Route path="/about" element={<AboutPage/>} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/seat" Component={SeatSelectionPage} /> 
            <Route path="/stadium" Component={StadiumSelection} /> 
            <Route path="/concertseat" Component={ConcertSeat} /> 
            <Route path="/concert" Component={ConcertPage} /> 
            <Route path="/concert/:id" element={<ConcertDetailPage />} />
            <Route path="/concert/:id/book" Component={PaymentPage} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;