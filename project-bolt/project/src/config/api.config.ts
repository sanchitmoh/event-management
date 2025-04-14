export const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/signin`,
  REGISTER: `${API_BASE_URL}/auth/signup`,
  
  // Event endpoints 
  EVENTS: `${API_BASE_URL}/events`,
  EVENT_DETAIL: (id: number) => `${API_BASE_URL}/events/${id}`,
  
  // Concert endpoints
  CONCERTS: `${API_BASE_URL}/concerts`,
  CONCERT_DETAIL: (id: number) => `${API_BASE_URL}/concerts/${id}`,
  
  // Movie endpoints
  MOVIES: `${API_BASE_URL}/movies`,
  MOVIE_DETAIL: (id: number) => `${API_BASE_URL}/movies/${id}`,
  
  // Sports endpoints
  SPORTS: `${API_BASE_URL}/sports`,
  SPORT_DETAIL: (id: number) => `${API_BASE_URL}/sports/${id}`,
  
  // Booking endpoints
  BOOKINGS: `${API_BASE_URL}/bookings`,
  BOOKING_DETAIL: (id: number) => `${API_BASE_URL}/bookings/${id}`,
  
  // Seat selection
  SEATS: `${API_BASE_URL}/seats`,
  
  // User profile
  PROFILE: `${API_BASE_URL}/users/profile`,
  
  // Payment
  PAYMENT: `${API_BASE_URL}/payment`,
  
  // Newsletter
  NEWSLETTER: {
    SUBSCRIBE: `${API_BASE_URL}/newsletter/subscribe`,
    UNSUBSCRIBE: `${API_BASE_URL}/newsletter/unsubscribe`,
    STATUS: `${API_BASE_URL}/newsletter/status`
  }
}; 