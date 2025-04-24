// Get the API base URL from environment or default to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

// A helper function to construct endpoint URLs dynamically
const createEndpoint = (path: string) => `${API_BASE_URL}${path}`;

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: createEndpoint('/auth/signin'),
  REGISTER: createEndpoint('/auth/signup'),

  // Event endpoints
  EVENTS: createEndpoint('/events'),
  EVENT_DETAIL: (id: number) => createEndpoint(`/events/${id}`),

  // Concert endpoints
  CONCERTS: createEndpoint('/concerts'),
  CONCERT_DETAIL: (id: number) => createEndpoint(`/concerts/${id}`),

  // Movie endpoints
  MOVIES: createEndpoint('/movies'),
  MOVIE_DETAIL: (id: number) => createEndpoint(`/movies/${id}`),

  // Sports endpoints
  SPORTS: createEndpoint('/sports'),
  SPORT_DETAIL: (id: number) => createEndpoint(`/sports/${id}`),

  // Booking endpoints
  BOOKINGS: createEndpoint('/bookings'),
  BOOKING_DETAIL: (id: number) => createEndpoint(`/bookings/${id}`),

  // Seat selection
  SEATS: createEndpoint('/seats'),

  // User profile
  PROFILE: createEndpoint('/users/profile'),

  // Payment
  PAYMENT: createEndpoint('/payment'),

  // Newsletter
  NEWSLETTER: {
    SUBSCRIBE: createEndpoint('/newsletter/subscribe'),
    UNSUBSCRIBE: createEndpoint('/newsletter/unsubscribe'),
    STATUS: createEndpoint('/newsletter/status'),
  }
};
