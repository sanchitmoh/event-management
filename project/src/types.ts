export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'concert' | 'sports' | 'theater';
  date: string;
  time: string;
  venue: string;
  location?: string;
  price: number;
  imageUrl: string;
  videoUrl?: string;
  availableSeats: number;
  sections?: Section[];
}

export interface Section {
  id: string;
  name: string;
  price: number;
  availableSeats: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  seats: string[];
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'refunded';
  bookingDate: string;
}