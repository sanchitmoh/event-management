import React from 'react';
import { Calendar, Users, MapPin, Clock, Plus } from 'lucide-react';
import EventList from './components/EventList';
import Sidebar from './components/Sidebar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EventTicket from './components/EventTicket';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // Set to true to show the ticket
  const [showLogin, setShowLogin] = React.useState(true);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        
        {showLogin ? (
          <Login 
            onSuccess={() => setIsAuthenticated(true)}
            onRegisterClick={() => setShowLogin(false)}
          />
        ) : (
          <Register
            onSuccess={() => setIsAuthenticated(true)}
            onLoginClick={() => setShowLogin(true)}
          />
        )}
      </div>
    );
  }

  // Show the ticket instead of the dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12">
      <EventTicket
        eventName="Tech Conference 2024"
        date="April 15, 2024"
        time="09:00 AM"
        location="Convention Center, New York"
        ticketHolder="John Doe"
        ticketNumber="TC2024-1234"
      />
    </div>
  );
}

export default App;