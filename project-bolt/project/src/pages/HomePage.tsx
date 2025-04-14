import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import EventVideoCard from '../components/EventVideoCard';
import { Event } from '../types';
import { Music, Trophy, Theater, Clock, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import ReactPlayer from 'react-player';
import newsletterService from '../services/newsletter.service';
import eventService from '../services/event.service';
// Mock event data for initial render or fallback
const MOCK_EVENTS: Event[] = [
  {
    id: '8',
    title: 'Les Misérables',
    description: 'Experience the powerful story of Les Misérables.',
    date: '2024-10-10',
    time: '18:00',
    venue: 'West End Theater, London',
    price: 60.00,
    location: 'London',
    category: 'theater',
    imageUrl: 'https://staticeu.sweet.tv/images/cache/horizontal_posters/BCYGYEQCMVXCAHJKAIEAE===/13872-les-miserables_.jpg',
  },
  {
    id: '9',
    title: 'Concert: Acoustic Evening',
    description: 'An intimate evening of acoustic performances by local artists.',
    date: '2024-10-20',
    time: '19:00',
    venue: 'Cafe, San Francisco',
    price: 20.00,
    location: 'San Francisco',
    category: 'concert',
    imageUrl: 'https://t4.ftcdn.net/jpg/08/52/43/17/360_F_852431753_mSZMX9iaxe7pIBjY4SB8pOwEc0qDR2iZ.jpg',
  },
  {
    id: '10',
    title: 'Romeo and Juliet',
    description: 'A timeless tale of love and tragedy performed live.',
    date: '2024-11-01',
    time: '19:30',
    venue: 'Shakespeare Theater, London',
    price: 45.00,
    location: 'London',
    category: 'theater',
    imageUrl: 'https://webapp2.wright.edu/web1/newsroom/files/2014/11/RomeoAndJuliet2.jpg',
  },
  {
    id: '11',
    title: 'Kanye West: Donda Tour',
    description: 'Catch Kanye West live on his Donda tour!',
    date: '2024-09-20',
    time: '20:00',
    venue: 'United Center, Chicago',
    price: 300.00,
    location: 'Chicago',
    category: 'Concert',
    imageUrl: 'https://www.usatoday.com/gcdn/-mm-/98c88f66dedc33e13e6cc28e741e44d38281b35f/c=0-0-2760-2075/local/-/media/2016/11/21/USATODAY/USATODAY/636153602053989898-538401266.jpg',
  },
  {
    id: '12',
    title: 'The Nutcracker',
    description: 'A magical ballet performance perfect for the holiday season.',
    date: '2024-12-01',
    time: '15:00',
    venue: 'Ballet Theater, Chicago',
    price: 50.00,
    location: 'Chicago',
    category: 'theater',
    imageUrl: 'https://nevadaballetorg-1faa6.kxcdn.com/wp-content/uploads/2024/06/NBT-TheNutcracker-TSC-Website-Image-864x490-1-1.jpg',
  },
];
// Categories with links
const CATEGORIES = [
  { id: 'events', label: 'All Events', icon: Music, link: '/events' },
  { id: 'concert', label: 'Concerts', icon: Music, link: '/concert' },
  { id: 'sports', label: 'Sports', icon: Trophy, link: '/sport' },
  { id: 'movies', label: 'Movies', icon: Theater, link: '/movies' }, // Added Movies category
];
export default function HomePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await eventService.getAllEvents() as unknown as Event[];
        if (data && data.length > 0) {
          setEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Fallback to mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);
  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      return; // Don't search on empty query
    }
    
    try {
      setIsLoading(true);
      setSearchError(null);
      
      // Navigate to search results page
      navigate(`/events?search=${encodeURIComponent(query)}`);
      
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Sort events by date
  const sortedEvents: Event[] = [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });
  const latestEvents: Event[] = sortedEvents.slice(0, 4);
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !email.includes('@')) {
      setSubscriptionStatus({
        success: false,
        message: 'Please enter a valid email address.'
      });
      return;
    }
    
    setIsSubscribing(true);
    setSubscriptionStatus(null);
    
    try {
      await newsletterService.subscribe({ email, name });
      setSubscriptionStatus({
        success: true,
        message: 'Thanks for subscribing! You\'ll receive updates about upcoming events.'
      });
      // Clear form
      setEmail('');
      setName('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to subscribe. Please try again.';
      
      setSubscriptionStatus({
        success: false,
        message: errorMessage
      });
    } finally {
      setIsSubscribing(false);
    }
  };
  // Filter events based on category and search query
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
              <SearchBar onSearch={handleSearch} />
              {searchError && (
                <p className="mt-2 text-red-300">{searchError}</p>
              )}
              {isLoading && (
                <div className="mt-4 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
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
            {subscriptionStatus && (
              <div className={`mb-4 p-3 rounded-lg ${subscriptionStatus.success ? 'bg-green-800/70' : 'bg-red-800/70'}`}>
                <div className="flex items-center">
                  {subscriptionStatus.success ? (
                    <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-300 mr-2" />
                  )}
                  <p className="text-white">{subscriptionStatus.message}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:border-white"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="px-6 py-3 bg-white text-indigo-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSubscribing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-900"></div>
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:border-white"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}