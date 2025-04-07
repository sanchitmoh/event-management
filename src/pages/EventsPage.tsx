import React, { useState } from 'react';
import { Event } from '../types';
import EventCard from '../components/EventCard';
import { Sliders as Slider, MapPin, Calendar, Tag } from 'lucide-react';

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'A three-day music festival featuring top artists',
    category: 'concert',
    date: '2024-07-15',
    time: '18:00',
    venue: 'Central Park',
    location: 'New York, NY',
    price: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    availableSeats: 1000
  },
  {
    id: '2',
    title: 'NBA Finals Game',
    description: 'Championship game of the season',
    category: 'sports',
    date: '2024-06-10',
    time: '20:00',
    venue: 'Madison Square Garden',
    location: 'New York, NY',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a',
    availableSeats: 500
  },
  {
    id: '3',
    title: 'Hamilton Musical',
    description: 'Award-winning Broadway musical',
    category: 'theater',
    date: '2024-08-20',
    time: '19:30',
    venue: 'Broadway Theater',
    location: 'New York, NY',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf',
    availableSeats: 300
  }
];

const LOCATIONS = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL'];
const CATEGORIES = ['all', 'concert', 'sports', 'theater'];

export default function EventsPage() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesPrice = event.price >= priceRange[0] && event.price <= priceRange[1];
    const matchesLocation = selectedLocation === 'all' || event.location === selectedLocation;
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesDate = !selectedDate || event.date === selectedDate;
    return matchesPrice && matchesLocation && matchesCategory && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-sm h-fit">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="all">All Locations</option>
                  {LOCATIONS.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full px-3 py-2 text-left rounded-md ${
                        selectedCategory === category
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Events ({filteredEvents.length})
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No events found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}