import { Event } from '../types';
import EventCard from '../components/EventCard';
//import { Sliders as Slider, MapPin, Calendar, Tag } from 'lucide-react';
import { useState } from 'react';

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
    availableSeats: 1000,
    popularity: 4.8, // Added popularity
    createdAt: '2024-01-01T10:00Z', // Added createdAt
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
    availableSeats: 500,
    popularity: 4.9, // Added popularity
    createdAt: '2024-01-01T10:00Z', // Added createdAt
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
    availableSeats: 300,
    popularity: 4.8, // Added popularity
    createdAt: '2024-02-15T12:00Z', // Added createdAt
  },
  {
    id: '4',
    title: 'Jazz Night at Blue Note',
    description: 'Evening of classic jazz and contemporary fusion',
    category: 'concert',
    date: '2024-06-15',
    time: '21:00',
    venue: 'Blue Note Jazz Club',
    location: 'New York, NY',
    price: 75.00,
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f',
    availableSeats: 150,
    popularity: 4.7, // Added popularity
    createdAt: '2024-03-01T14:00Z', // Added createdAt
  },
  {
    id: '5',
    title: 'LA Lakers vs Golden State Warriors',
    description: 'Regular season NBA game',
    category: 'sports',
    date: '2024-07-01',
    time: '19:30',
    venue: 'Crypto.com Arena',
    location: 'Los Angeles, CA',
    price: 150.00,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc',
    availableSeats: 800,
    popularity: 4.6, // Added popularity
    createdAt: '2024-04-01T10:30Z', // Added createdAt
  },
  {
    id: '6',
    title: 'Phantom of the Opera',
    description: 'Classic Broadway musical performance',
    category: 'theater',
    date: '2024-09-05',
    time: '19:00',
    venue: 'Majestic Theatre',
    location: 'New York, NY',
    price: 189.99,
    imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212',
    availableSeats: 400,
    popularity: 4.8, // Added popularity
    createdAt: '2024-01-15T10:00Z', // Added createdAt
  },
  {
    id: '7',
    title: 'Electronic Dance Festival',
    description: 'All-night electronic music festival',
    category: 'concert',
    date: '2024-08-01',
    time: '20:00',
    venue: 'Miami Beach Convention Center',
    location: 'Miami, FL',
    price: 120.00,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    availableSeats: 2000,
    popularity: 4.9, // Added popularity
    createdAt: '2024-02-10T12:00Z', // Added createdAt
  },
  {
    id: '8',
    title: 'Chicago Bulls vs Miami Heat',
    description: 'Eastern Conference matchup',
    category: 'sports',
    date: '2024-07-20',
    time: '19:00',
    venue: 'United Center',
    location: 'Chicago, IL',
    price: 85.00,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
    availableSeats: 600,
    popularity: 4.6, // Added popularity
    createdAt: '2024-03-01T14:00Z', // Added createdAt
  },
  {
    id: '9',
    title: 'Chicago Symphony Orchestra',
    description: 'Classical music performance',
    category: 'concert',
    date: '2024-09-15',
    time: '20:00',
    venue: 'Symphony Center',
    location: 'Chicago, IL',
    price: 95.00,
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6',
    availableSeats: 250,
    popularity: 4.7, // Added popularity
    createdAt: '2024-02-20T12:00Z', // Added createdAt
  },
  {
    id: '10',
    title: 'The Lion King',
    description: 'Award-winning musical production',
    category: 'theater',
    date: '2024-08-10',
    time: '19:30',
    venue: 'Pantages Theatre',
    location: 'Los Angeles, CA',
    price: 159.99,
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
    availableSeats: 450,
    popularity: 4.9, // Added popularity
    createdAt: '2024-01-15T10:00Z', // Added createdAt
  },
  {
    id: '11',
    title: 'Rock the Beach Festival',
    description: 'Beachside rock music festival',
    category: 'concert',
    date: '2024-07-25',
    time: '16:00',
    venue: 'South Beach',
    location: 'Miami, FL',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
    availableSeats: 3000,
    popularity: 4.7, // Added popularity
    createdAt: '2024-02-01T12:00Z', // Added createdAt
  },
  {
    id: '12',
    title: 'Summer Music Festival',
    description: 'An exciting three-day music festival featuring top artists from various genres.',
    category: 'concert',
    date: '2024-08-10',
    time: '16:00',
    venue: 'Central Park',
    location: 'New York, NY',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', // Updated image URL
    availableSeats: 5000,
    popularity: 4.9, // Added popularity
    createdAt: '2024-01-15T10:00Z', // Added createdAt
  },
  {
    id: '13',
    title: 'Wicked',
    description: 'Popular Broadway musical',
    category: 'theater',
    date: '2024-09-20',
    time: '19:30',
    venue: 'Gershwin Theatre',
    location: 'New York, NY',
    price: 179.99,
    imageUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434',
    availableSeats: 350,
    popularity: 4.9, // Added popularity
    createdAt: '2024-04-15T10:00Z', // Added createdAt
  },
  {
    id: '14',
    title: 'Latin Music Night',
    description: 'Celebration of Latin music and dance',
    category: 'concert',
    date: '2024-08-05',
    time: '21:00',
    venue: 'Club Space',
    location: 'Miami, FL',
    price: 65.00,
    imageUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4',
    availableSeats: 500,
    popularity: 4.6, // Added popularity
    createdAt: '2024-01-15T12:00Z', // Added createdAt
  },
  {
    id: '15',
    title: 'UFC Championship Fight',
    description: 'Mixed martial arts championship event',
    category: 'sports',
    date: '2024-09-01',
    time: '20:00',
    venue: 'T-Mobile Arena',
    location: 'Los Angeles, CA',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed',
    availableSeats: 700,
    popularity: 4.9, // Added popularity
    createdAt: '2024-02-10T14:30Z', // Added createdAt
  },
  {
    id: '16',
    title: 'Chicago - The Musical',
    description: 'Tony Award-winning musical.',
    category: 'theater',
    date: '2024-08-15',
    time: '19:00',
    venue: 'Ambassador Theatre',
    location: 'New York, NY',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063',
    availableSeats: 300,
    popularity: 4.8, // Added popularity
    createdAt: '2024-01-10T12:00Z', // Added createdAt
  },
  {
    id: '17',
    title: 'Country Music Festival',
    description: 'Two-day country music celebration',
    category: 'concert',
    date: '2024-07-30',
    time: '17:00',
    venue: 'Grant Park',
    location: 'Chicago, IL',
    price: 110.00,
    imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec',
    availableSeats: 1500,
    popularity: 4.7, // Added popularity
    createdAt: '2024-02-01T12:00Z', // Added createdAt
  },
  {
    id: '18',
    title: 'Tennis Grand Slam Final',
    description: 'Major tennis championship match',
    category: 'sports',
    date: '2024-09-10',
    time: '15:00',
    venue: 'Arthur Ashe Stadium',
    location: 'New York, NY',
    price: 250.00,
    imageUrl: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653',
    availableSeats: 600,
    popularity: 4.8, // Added popularity
    createdAt: '2024-03-01T14:30Z', // Added createdAt
  },
  {
    id: '19',
      title: 'Broadway Under the Stars',
      description: 'An outdoor concert featuring live performances of popular Broadway hits.',
      category: 'concert',
      date: '2024-11-05',
      time: '19:00',
      venue: 'Central Park',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', // Updated image URL
      availableSeats: 1500,
      location: 'New York, NY',
      popularity: 4.7, // Added popularity
      createdAt: '2024-01-25T10:00Z', // Added createdAt
  },
  {
    id: '20',
    title: 'Symphony Under the Stars',
    description: 'Outdoor classical concert',
    category: 'concert',
    date: '2024-08-25',
    time: '20:00',
    venue: 'Hollywood Bowl',
    location: 'Los Angeles, CA',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1475744214834-0cb9be6eb226',
    availableSeats: 800,
    popularity: 4.7, // Added popularity
    createdAt: '2024-02-10T12:00Z', // Added createdAt
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