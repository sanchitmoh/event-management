import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import { Event } from '../types';

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'A three-day music festival featuring top artists',
    category: 'concert',
    date: '2024-07-15',
    time: '18:00',
    venue: 'Central Park',
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
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf',
    availableSeats: 300
  }
];

const CATEGORIES = ['all', 'concert', 'sports', 'theater'];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find and book tickets for the best events in your area
          </p>
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}