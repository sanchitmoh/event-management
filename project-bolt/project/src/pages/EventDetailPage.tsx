import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Link, useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Event } from '../types';
import VenueModel from '../components/3d/VenueModel';

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'Experience the ultimate summer music festival...',
    category: 'concert',
    date: '2024-07-15',
    time: '18:00',
    venue: 'Central Park',
    price: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    availableSeats: 1000,
    location: 'New York, NY',
    popularity: 4.8, // Add missing property
    createdAt: '2024-01-15T08:00:00Z', // Add missing property
    sections: [
      { id: 'vip', name: 'VIP', price: 299.99, availableSeats: 100 },
      { id: 'premium', name: 'Premium', price: 199.99, availableSeats: 200 },
      { id: 'standard', name: 'Standard', price: 99.99, availableSeats: 700 }
    ]
  },
  {
    id: '2',
    title: 'NBA Finals Game',
    description: 'Championship game of the season.',
    category: 'sports',
    date: '2024-06-10',
    time: '20:00',
    venue: 'Madison Square Garden',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a',
    availableSeats: 500,
    location: 'New York, NY',
    popularity: 4.9, // Added popularity
    createdAt: '2024-01-01T10:00:00Z', // Added createdAt
    sections: [
      { id: 'vip', name: 'VIP', price: 499.99, availableSeats: 50 },
      { id: 'premium', name: 'Premium', price: 299.99, availableSeats: 150 },
      { id: 'standard', name: 'Standard', price: 199.99, availableSeats: 300 }
    ]
  },
  {
    id: '3',
    title: 'Hamilton Musical',
    description: 'Award-winning Broadway musical.',
    category: 'theater',
    date: '2024-08-20',
    time: '19:30',
    venue: 'Broadway Theater',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf',
    availableSeats: 300,
    location: 'New York, NY',
    popularity: 4.8, // Added popularity
    createdAt: '2024-02-15T12:00:00Z', // Added createdAt
    sections: [
      { id: 'vip', name: 'VIP', price: 250.00, availableSeats: 50 },
      { id: 'premium', name: 'Premium', price: 199.99, availableSeats: 100 },
      { id: 'standard', name: 'Standard', price: 99.99, availableSeats: 150 }
    ]
  },
  {
    id: '4',
    title: 'Jazz Night at Blue Note',
    description: 'Evening of classic jazz and contemporary fusion.',
    category: 'concert',
    date: '2024-06-15',
    time: '21:00',
    venue: 'Blue Note Jazz Club',
    price: 75.00,
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f',
    availableSeats: 150,
    location: 'New York, NY',
    popularity: 4.5, // Added popularity
    createdAt: '2024-03-01T14:00:00Z', // Added createdAt
    sections: [
      { id: 'vip', name: 'VIP', price: 150.00, availableSeats: 20 },
      { id: 'standard', name: 'Standard', price: 75.00, availableSeats: 130 }
    ]
  },
  {
    id: '5',
    title: 'LA Lakers vs Golden State Warriors',
    description: 'Regular season NBA game.',
    category: 'sports',
    date: '2024-07-01',
    time: '19:30',
    venue: 'Crypto.com Arena',
    price: 150.00,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc',
    availableSeats: 800,
    location: 'Los Angeles, CA',
    popularity: 4.7, // Added popularity
    createdAt: '2024-01-01T10:00:00Z', // Added createdAt
    sections: [
      { id: 'vip', name: 'VIP', price: 300.00, availableSeats: 100 },
      { id: 'premium', name: 'Premium', price: 150.00, availableSeats: 200 },
      { id: 'standard', name: 'Standard', price: 90.00, availableSeats: 500 },
    ],
  },
  {
    id: '6',
    title: 'Phantom of the Opera',
    description: 'Classic Broadway musical performance.',
    category: 'theater',
    date: '2024-09-05',
    time: '19:00',
    venue: 'Majestic Theatre',
    price: 189.99,
    imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212',
    availableSeats: 400,
    location: 'New York, NY',
    popularity: 4.8, // Added popularity
    createdAt: '2024-02-15T12:00:00Z', // Added createdAt
    sections: [
      { id: 'vip', name: 'VIP', price: 250.00, availableSeats: 50 },
      { id: 'premium', name: 'Premium', price: 189.99, availableSeats: 150 },
      { id: 'standard', name: 'Standard', price: 99.99, availableSeats: 200 },
    ],
  },
  {
    id: '7',
    title: 'Electronic Dance Festival',
    description: 'All-night electronic music festival.',
    category: 'concert',
    date: '2024-08-01',
    time: '20:00',
    venue: 'Miami Beach Convention Center',
    price: 120.00,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    availableSeats: 2000,
    location: 'Miami, FL',
    popularity: 4.9, // Added popularity
    createdAt: '2024-03-01T14:00Z', // Added createdAt
    sections: [
      { id: 'vip', name: 'VIP', price: 250.00, availableSeats: 300 },
      { id: 'standard', name: 'Standard', price: 120.00, availableSeats: 1700 }
    ],
  },
  {
    id: '8',
    title: 'Chicago Bulls vs Miami Heat',
    description: 'Eastern Conference matchup.',
    category: 'sports',
    date: '2024-07-20',
    time: '19:00',
    venue: 'United Center',
    price: 85.00,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
    availableSeats: 600,
    location: 'Chicago, IL',
    popularity: 4.5, // Added popularity
    createdAt: '2024-01-15T10:00:00Z', // Added createdAt
    sections: [
      { id: 'vip', name: 'VIP', price: 200.00, availableSeats: 50 },
      { id: 'premium', name: 'Premium', price: 100.00, availableSeats: 150 },
      { id: 'standard', name: 'Standard', price: 85.00, availableSeats: 400 },
    ],
  },
  {
    id: '9',
    title: 'Chicago Symphony Orchestra',
    description: 'Classical music performance.',
    category: 'concert',
    date: '2024-09-15',
    time: '20:00',
    venue: 'Symphony Center',
    price: 95.00,
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6',
    availableSeats: 250,
    location: 'Chicago, IL',
    popularity: 4.8, // Added popularity
    createdAt: '2024-02-20T12:00Z', // Added createdAt
    sections: [
      { id: 'vip', name: 'VIP', price: 150.00, availableSeats: 50 },
      { id: 'standard', name: 'Standard', price: 95.00, availableSeats: 200 },
    ],
  },
  {
    id: '10',
    title: 'The Lion King',
    description: 'Award-winning musical production.',
    category: 'theater',
    date: '2024-08-10',
    time: '19:30',
    venue: 'Pantages Theatre',
    price: 159.99,
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
    availableSeats: 450,
    location: 'Los Angeles, CA',
    popularity: 4.9, // Added popularity
    createdAt: '2024-03-01T14:30Z', // Added createdAt    
    sections:
      [
      { id: 'vip', name: 'VIP', price: 250.00, availableSeats: 50 },
      { id: 'premium', name: 'Premium', price: 159.99, availableSeats: 150 },
      { id: 'standard', name: 'Standard', price: 99.99, availableSeats: 250 }
    ],
  },
    {
      id: '11',
      title: 'Rock the Beach Festival',
      description: 'Beachside rock music festival.',
      category: 'concert',
      date: '2024-07-25',
      time: '16:00',
      venue: 'South Beach',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
      availableSeats: 3000,
      location: 'Miami, FL',
      popularity: 4.6, // Added popularity
      createdAt: '2024-01-01T10:00:00Z', // Added createdAt
      sections: [
        { id: 'vip', name: 'VIP', price: 150.00, availableSeats: 500 },
        { id: 'standard', name: 'Standard', price: 89.99, availableSeats: 2500 }
      ],
    },
    {
      id: '12',
      title: 'Summer Music Festival',
      description:
        'An exciting three-day music festival featuring top artists from various genres.',
      category: 'concert',
      date: '2024-08-10',
      time: '16:00',
      venue: 'Central Park',
      location: 'New York, NY',
      price: 149.99,
      imageUrl:
        'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', // Updated image URL
      availableSeats: 5000,
      popularity: 4.9, // Added popularity
      createdAt: '2024-02-15T12:00Z', // Added createdAt
      sections: [
        { id: 'vip', name: 'VIP', price: 300.00, availableSeats: 200 },
        { id: 'premium', name: 'Premium', price: 149.99, availableSeats: 200 },
        { id: 'standard', name: 'Standard', price: 79.99, availableSeats: 4500 }
      ],
    },
    {
      id: '13',
      title: 'Wicked',
      description: 'Popular Broadway musical.',
      category: 'theater',
      date: '2024-09-20',
      time: '19:30',
      venue: 'Gershwin Theatre',
      price: 179.99,
      imageUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434',
      availableSeats: 350,
      location: 'New York, NY',
      popularity: 4.8, // Added popularity
      createdAt: '2024-01-15T10:00:00Z', // Added createdAt
      sections: [
        { id: 'vip', name: 'VIP', price: 250.00, availableSeats: 50 },
        { id: 'premium', name: 'Premium', price: 179.99, availableSeats: 100 },
        { id: 'standard', name: 'Standard', price: 99.99, availableSeats: 200 },
      ],
    },
    {
      id: '14',
      title: 'Latin Music Night',
      description: 'Celebration of Latin music and dance.',
      category: 'concert',
      date: '2024-08-05',
      time: '21:00',
      venue: 'Club Space',
      price: 65.00,
      imageUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4',
      availableSeats: 500,
      location: 'Miami, FL',
      popularity: 4.6, // Added popularity
      createdAt: '2024-02-20T12:00Z', // Added createdAt
      sections: [
        { id: 'vip', name: 'VIP', price: 120.00, availableSeats: 100 },
        { id: 'standard', name: 'Standard', price: 65.00, availableSeats: 400 },
      ],
    },
    {
      id: '15',
      title: 'UFC Championship Fight',
      description: 'Mixed martial arts championship event.',
      category: 'sports',
      date: '2024-09-01',
      time: '20:00',
      venue: 'T-Mobile Arena',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed',
      availableSeats: 700,
      location: 'Los Angeles, CA',
      popularity: 4.9, // Added popularity
      createdAt: '2024-01-10T12:00Z', // Added createdAt
      sections: [
        { id: 'vip', name: 'VIP', price: 500.00, availableSeats: 100 },
        { id: 'premium', name: 'Premium', price: 299.99, availableSeats: 200 },
        { id: 'standard', name: 'Standard', price: 199.99, availableSeats: 400 }
      ],
    },
    {
      id: '16',
      title: 'Chicago - The Musical',
      description: 'Tony Award-winning musical.',
      category: 'theater',
      date: '2024-08-15',
      time: '19:00',
      venue: 'Ambassador Theatre',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063',
      availableSeats: 300,
      location: 'New York, NY',
      popularity: 4.8, // Added popularity
      createdAt: '2024-02-05T15:00Z', // Added createdAt
      sections: [
        { id: 'vip', name: 'VIP', price: 250.00, availableSeats: 50 },
        { id: 'premium', name: 'Premium', price: 149.99, availableSeats: 100 },
        { id: 'standard', name: 'Standard', price: 99.99, availableSeats: 150 }
      ],
    },
    {
      id: '17',
      title: 'Country Music Festival',
      description: 'Two-day country music celebration.',
      category: 'concert',
      date: '2024-07-30',
      time: '17:00',
      venue: 'Grant Park',
      price: 110.00,
      imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec',
      availableSeats: 1500,
      location: 'Chicago, IL',
      popularity: 4.7, // Added popularity
      createdAt: '2024-01-15T10:00Z', // Added createdAt
      sections: [
        { id: 'vip', name: 'VIP', price: 200.00, availableSeats: 200 },
        { id: 'standard', name: 'Standard', price: 110.00, availableSeats: 1300 }
      ],
    },
    {
      id: '18',
      title: 'Tennis Grand Slam Final',
      description: 'Major tennis championship match.',
      category: 'sports',
      date: '2024-09-10',
      time: '15:00',
      venue: 'Arthur Ashe Stadium',
      price: 250.00,
      imageUrl: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653',
      availableSeats: 600,
      location: 'New York, NY',
      popularity: 4.9, // Added popularity
      createdAt: '2024-02-20T12:00Z', // Added createdAt
      sections: [
        { id: 'vip', name: 'VIP', price: 400.00, availableSeats: 100 },
        { id: 'premium', name: 'Premium', price: 250.00, availableSeats: 200 },
        { id: 'standard', name: 'Standard', price: 150.00, availableSeats: 300 }
      ],
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
      sections: [
        { id: 'vip', name: 'VIP', price: 150.00, availableSeats: 200 },
        { id: 'premium', name: 'Premium', price: 89.99, availableSeats: 800 },
        { id: 'standard', name: 'Standard', price: 49.99, availableSeats: 500 }
      ],
    },
    {
      id: '20',
      title: 'Symphony Under the Stars',
      description: 'Outdoor classical concert.',
      category: 'concert',
      date: '2024-08-25',
      time: '20:00',
      venue: 'Hollywood Bowl',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1475744214834-0cb9be6eb226',
      availableSeats: 800,
      location: 'Los Angeles, CA',
      popularity: 4.7, // Added popularity
      createdAt: '2024-02-10T12:00Z', // Added createdAt
      sections: [
        { id: 'vip', name: 'VIP', price: 150.00, availableSeats: 100 },
        { id: 'standard', name: 'Standard', price: 79.99, availableSeats: 700 }
      ]
    }
];
export default function EventDetailPage() {
  const { id } = useParams();
  const [selectedSection, setSelectedSection] = useState('');
  const [showAR, setShowAR] = useState(false);
  // Find the event based on the id from the URL
  const event = MOCK_EVENTS.find(event => event.id === id);
  // If the event is not found, handle it gracefully
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center">Event Not Found</h1>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                <p className="text-lg">{event.description}</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.venue}, {event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{event.availableSeats} seats available</span>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Select Your Section</h3>
                  <div className="space-y-4">
                    {event.sections && event.sections.map((section) => ( // Check if sections is defined
                      <div
                        key={section.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedSection === section.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-600'
                        }`}
                        onClick={() => setSelectedSection(section.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{section.name}</h4>
                            <p className="text-sm text-gray-500">
                              {section.availableSeats} seats available
                            </p>
                          </div>
                          <div className="text-xl font-bold">${section.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    disabled={!selectedSection}
                  > <Link to="/concert" className="w-full h-full flex items-center justify-center">
                    Book Tickets
                    </Link>
                  </button>
                </div>
              </div>
              <div>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Venue View</h3>
                    <button
                      onClick={() => setShowAR(!showAR)}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      {showAR ? 'Hide 3D View' : 'Show 3D View'}
                    </button>
                  </div>
                  {showAR && (
                    <div className="h-[400px] rounded-lg overflow-hidden">
                      <Canvas>
                        <Suspense fallback={null}>
                          <PerspectiveCamera makeDefault position={[0, 2, 5]} />
                          <ambientLight intensity={0.5} />
                          <pointLight position={[10, 10, 10]} />
                          <VenueModel selectedSection={selectedSection} />
                          <OrbitControls />
                        </Suspense>
                      </Canvas>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );}