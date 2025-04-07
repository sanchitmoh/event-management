import React from 'react';
import { Calendar, MapPin, Clock, Ticket, Code as QRCode, User, Music, Star } from 'lucide-react';

interface EventTicketProps {
  eventName: string;
  date: string;
  time: string;
  location: string;
  ticketHolder: string;
  ticketNumber: string;
  qrCode?: string;
}

function EventTicket({
  eventName,
  date,
  time,
  location,
  ticketHolder,
  ticketNumber,
}: EventTicketProps) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Floating decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-500/10 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-500/10 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative bg-white rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(168,_85,_247,_0.7)] group">
        {/* Holographic effect background */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(45deg,transparent_25%,rgba(68,_68,_68,_0.2)_50%,transparent_75%,transparent_100%)] bg-[length:60px_60px] animate-[gradient_3s_linear_infinite]"></div>
        
        {/* Main ticket content */}
        <div className="flex relative">
          {/* Left section (main ticket) */}
          <div className="flex-grow p-8 border-r border-dashed border-gray-300 relative backdrop-blur-sm backdrop-filter">
            {/* Perforation circles */}
            <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gray-100 rounded-full -translate-y-1/2 shadow-inner"></div>
            <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gray-100 rounded-full -translate-y-1/2 shadow-inner"></div>
            
            {/* Header with event name and logo */}
            <div className="flex items-start justify-between mb-8">
              <div className="relative">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent pb-1 group-hover:bg-gradient-to-l transition-all duration-500">
                  {eventName}
                </h3>
                <div className="mt-1 flex items-center text-gray-600">
                  <Ticket className="w-4 h-4 mr-1" />
                  <span className="text-sm font-mono">{ticketNumber}</span>
                </div>
                {/* Decorative underline */}
                <div className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gradient-to-r from-purple-600 to-transparent"></div>
              </div>
              <div className="relative group-hover:rotate-180 transition-all duration-700">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 p-[2px] rotate-45 transform-gpu">
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                    <Music className="w-10 h-10 text-indigo-600 -rotate-45" />
                  </div>
                </div>
              </div>
            </div>

            {/* Event details with hover effects */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 p-[2px] group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300">
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date</p>
                  <p className="font-bold text-gray-800">{date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 p-[2px] group-hover:from-indigo-500 group-hover:to-pink-500 transition-all duration-300">
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Time</p>
                  <p className="font-bold text-gray-800">{time}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 p-[2px] group-hover:from-purple-500 group-hover:to-indigo-500 transition-all duration-300">
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Venue</p>
                  <p className="font-bold text-gray-800">{location}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px] group-hover:from-indigo-500 group-hover:to-blue-500 transition-all duration-300">
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Attendee</p>
                  <p className="font-bold text-gray-800">{ticketHolder}</p>
                </div>
              </div>
            </div>

            {/* VIP badge */}
            <div className="absolute top-4 right-8 flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              <Star className="w-4 h-4" />
              <span>VIP</span>
            </div>
          </div>

          {/* Right section (ticket stub) with enhanced QR */}
          <div className="w-48 p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white via-gray-50 to-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent)] pointer-events-none"></div>
            <div className="w-32 h-32 relative group-hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-xl rotate-6 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white p-2 rounded-xl shadow-lg">
                <QRCode className="w-full h-full text-gray-800" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium text-gray-600">Scan to verify</div>
              <div className="text-xs font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                #{ticketNumber}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventTicket;