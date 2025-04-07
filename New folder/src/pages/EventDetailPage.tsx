import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Event } from '../types';
import VenueModel from '../components/3d/VenueModel';

const MOCK_EVENT: Event = {
  id: '1',
  title: 'Summer Music Festival',
  description: 'Experience the ultimate summer music festival with top artists from around the world.',
  category: 'concert',
  date: '2024-07-15',
  time: '18:00',
  venue: 'Central Park',
  price: 99.99,
  imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
  availableSeats: 1000,
  location: 'New York, NY',
  sections: [
    { id: 'vip', name: 'VIP', price: 299.99, availableSeats: 100 },
    { id: 'premium', name: 'Premium', price: 199.99, availableSeats: 200 },
    { id: 'standard', name: 'Standard', price: 99.99, availableSeats: 700 }
  ]
};

export default function EventDetailPage() {
  const { id } = useParams();
  const [selectedSection, setSelectedSection] = useState('');
  const [showAR, setShowAR] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={MOCK_EVENT.imageUrl}
              alt={MOCK_EVENT.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">{MOCK_EVENT.title}</h1>
                <p className="text-lg">{MOCK_EVENT.description}</p>
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
                    <span>{MOCK_EVENT.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{MOCK_EVENT.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{MOCK_EVENT.venue}, {MOCK_EVENT.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{MOCK_EVENT.availableSeats} seats available</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Select Your Section</h3>
                  <div className="space-y-4">
                    {MOCK_EVENT.sections.map((section) => (
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
                  >
                    Continue to Checkout
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
  );
}