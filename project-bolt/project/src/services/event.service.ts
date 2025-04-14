import { get, post, put, del } from './api';

export interface Event {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  venue: string;
  category: string;
  price: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  availableSeats: number;
  totalSeats: number;
}

export interface Seat {
  id: number;
  number: string;
  row: string;
  section: string;
  price: number;
  status: 'AVAILABLE' | 'RESERVED' | 'BOOKED';
  eventId: number;
}

export interface Booking {
  id: number;
  userId: number;
  eventId: number;
  seats: Seat[];
  totalAmount: number;
  bookingDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
}

class EventService {
  // Events
  public async getAllEvents(): Promise<Event[]> {
    return get<Event[]>('/events');
  }

  public async getEventById(id: number): Promise<Event> {
    return get<Event>(`/events/${id}`);
  }

  public async getEventsByCategory(category: string): Promise<Event[]> {
    return get<Event[]>(`/events/category/${category}`);
  }

  public async searchEvents(query: string): Promise<Event[]> {
    return get<Event[]>(`/events/search?query=${encodeURIComponent(query)}`);
  }

  // New comprehensive search function that can filter by multiple criteria
  public async searchEventsByFilters(filters: {
    query?: string;
    category?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  }): Promise<Event[]> {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters.query) queryParams.append('query', filters.query);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters.status) queryParams.append('status', filters.status);
    
    return get<Event[]>(`/events/search?${queryParams.toString()}`);
  }

  // Seats
  public async getAvailableSeats(eventId: number): Promise<Seat[]> {
    return get<Seat[]>(`/events/${eventId}/seats/available`);
  }

  public async reserveSeats(eventId: number, seatIds: number[]): Promise<Booking> {
    return post<Booking>(`/events/${eventId}/seats/reserve`, { seatIds });
  }

  // Bookings
  public async getBookingById(bookingId: number): Promise<Booking> {
    return get<Booking>(`/bookings/${bookingId}`);
  }

  public async getUserBookings(): Promise<Booking[]> {
    return get<Booking[]>('/bookings/user');
  }

  public async confirmBooking(bookingId: number): Promise<Booking> {
    return put<Booking>(`/bookings/${bookingId}/confirm`, {});
  }

  public async cancelBooking(bookingId: number): Promise<Booking> {
    return put<Booking>(`/bookings/${bookingId}/cancel`, {});
  }

  // Admin operations
  public async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
    return post<Event>('/admin/events', event);
  }

  public async updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    return put<Event>(`/admin/events/${id}`, event);
  }

  public async deleteEvent(id: number): Promise<void> {
    return del<void>(`/admin/events/${id}`);
  }

  public async updateSeat(eventId: number, seatId: number, seat: Partial<Seat>): Promise<Seat> {
    return put<Seat>(`/admin/events/${eventId}/seats/${seatId}`, seat);
  }
}

export default new EventService(); 