import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import EventVideoCard from '../components/EventVideoCard';
import { Event } from '../types';
import { Calendar, Music, Trophy, Theater, Flame, Clock } from 'lucide-react';
import ReactPlayer from 'react-player';
// Mock event data
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'A three-day music festival featuring top artists from around the world',
    category: 'concert',
    date: '2024-07-15',
    time: '18:00',
    venue: 'Central Park',
    price: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    videoUrl: 'https://player.vimeo.com/video/164949806',
    availableSeats: 1000,
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
    videoUrl: 'https://player.vimeo.com/video/162947210',
    availableSeats: 500,
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
    videoUrl: 'https://player.vimeo.com/video/165006795',
    availableSeats: 300,
  },
  {
    id: '4',
    title: 'Electronic Dance Festival',
    description: 'The biggest EDM festival of the year',
    category: 'concert',
    date: '2024-09-05',
    time: '20:00',
    venue: 'Randalls Island',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    videoUrl: 'https://player.vimeo.com/video/163231391',
    availableSeats: 800,
  },
  {
    id: '5',
    title: 'World Cup Soccer Finals',
    description: 'The ultimate soccer championship match',
    category: 'sports',
    date: '2024-07-20',
    time: '15:00',
    venue: 'MetLife Stadium',
    price: 399.99,
    imageUrl: 'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253',
    videoUrl: 'https://player.vimeo.com/video/162947210',
    availableSeats: 600,
  },
  {
    id: '6',
    title: 'The Phantom of the Opera',
    description: 'Classic Broadway musical spectacular',
    category: 'theater',
    date: '2024-08-15',
    time: '19:00',
    venue: 'Majestic Theatre',
    price: 179.99,
    imageUrl: 'https://images.unsplash.com/photo-1507676385008-e7fb562d11f8',
    videoUrl: 'https://player.vimeo.com/video/165006795',
    availableSeats: 400,
  },
  {
    id: '7',
    title: 'Jazz & Blues Festival',
    description: 'A night of soulful music under the stars',
    category: 'concert',
    date: '2024-06-25',
    time: '19:00',
    venue: 'Blue Note Jazz Club',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629',
    videoUrl: 'https://player.vimeo.com/video/164949806',
    availableSeats: 200,
  },
  {
    id: '8',
    title: 'Cirque du Soleil',
    description: 'Breathtaking acrobatic performances',
    category: 'theater',
    date: '2024-07-30',
    time: '20:00',
    venue: 'Barclays Center',
    price: 159.99,
    imageUrl: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84',
    videoUrl: 'https://player.vimeo.com/video/165006795',
    availableSeats: 700,
  },
];
// Categories with links
const CATEGORIES = [
  { id: 'all', label: 'All Events', icon: Calendar, link: '/events' },
  { id: 'concert', label: 'Concerts', icon: Music, link: '/concert' },
  { id: 'sports', label: 'Sports', icon: Trophy, link: '/sports' },
  { id: 'movies', label: 'Movies', icon: Theater, link: '/movies' }, // Added Movies category
];
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Sort events by date
  const sortedEvents: Event[] = [...MOCK_EVENTS].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });
  const latestEvents: Event[] = sortedEvents.slice(0, 4);
  const popularEvents: Event[] = [...MOCK_EVENTS].slice(0, 4); // Adjusted to just take first 4 events for popular
  // Filter events based on category and search query
  const filteredEvents: Event[] = MOCK_EVENTS.filter(event => {
    const matchesCategory: boolean = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch: boolean = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Video Background Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <ReactPlayer
            url="https://player.vimeo.com/video/459849442"
            playing
            loop
            muted
            width="100%"
            height="100%"
            config={{
              vimeo: {
                playerOptions: {
                  background: true,
                  autoplay: true,
                  controls: false,
                  responsive: true,
                },
              },
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-indigo-900/90 backdrop-blur-sm"></div>
        </div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in-up">
              Experience Unforgettable Events
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fade-in-up stagger-delay-1">
              Discover and book the most exciting events happening around you
            </p>
            <div className="animate-fade-in-up stagger-delay-2">
              <SearchBar onSearch={setSearchQuery} />
            </div>
          </div>
        </div>
      </div>
      {/* Latest Events Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-indigo-400" />
            <h2 className="text-3xl font-bold text-white">Latest Events</h2>
          </div>
          <Link to="/events" className="text-indigo-400 hover:text-indigo-300">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestEvents.map((event, index) => (
            <div key={event.id} className={`animate-scale-in stagger-delay-${index + 1}`}>
              <EventVideoCard event={event} />
            </div>
          ))}
        </div>
      </div>
      {/* Popular Events Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-orange-400" />
            <h2 className="text-3xl font-bold text-white">Popular Events</h2>
          </div>
          <Link to="/events" className="text-indigo-400 hover:text-indigo-300">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularEvents.map((event, index) => (
            <div key={event.id} className={`animate-scale-in stagger-delay-${index + 1}`}>
              <EventVideoCard event={event} />
            </div>
          ))}
        </div>
      </div>
      {/* Categories Section */}
      <div className="mb-12 animate-fade-in-up stagger-delay-3">
        <div className="flex justify-center space-x-6">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={category.link}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-105'
                    : 'glass-effect text-white hover:bg-white/20'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{category.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in-up">Stay Updated</h2>
          <p className="text-gray-200 mb-8 animate-fade-in-up stagger-delay-1">
            Get notified about upcoming events and exclusive offers
          </p>
          <div className="max-w-md mx-auto animate-fade-in-up stagger-delay-2">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:border-white"
              />
              <button className="px-6 py-3 bg-white text-indigo-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}