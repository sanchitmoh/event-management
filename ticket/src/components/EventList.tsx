import React from 'react';
import { MapPin, Clock, Users, MoreVertical } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Tech Conference 2024',
    date: '2024-04-15',
    time: '09:00 AM',
    location: 'Convention Center',
    attendees: 250,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070',
  },
  {
    id: 2,
    title: 'Product Launch',
    date: '2024-04-20',
    time: '02:00 PM',
    location: 'Innovation Hub',
    attendees: 150,
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=2070',
  },
];

function EventList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="h-48 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {event.title}
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Clock size={18} className="mr-2" />
                <span>{event.date} at {event.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users size={18} className="mr-2" />
                <span>{event.attendees} attendees</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventList;