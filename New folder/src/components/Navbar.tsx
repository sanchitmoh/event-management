import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Calendar, LogIn, ShoppingCart } from 'lucide-react';
import Cart from './Cart';

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-900">EventHub</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/events" className="text-gray-700 hover:text-indigo-600">Events</Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
              <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1">
                  {cartItems.length}
                </span>
              </button>
              <Link to="/login" className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Cart 
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={(eventId) => {
          setCartItems(cartItems.filter(item => item.eventId !== eventId));
        }}
      />
    </>
  );
}