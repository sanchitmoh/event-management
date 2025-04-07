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
  popularity: number;
  createdAt: string;
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
  role: 'admin' | 'user' | 'organizer';
}

export interface CartItem {
  eventId: string;
  quantity: number;
  sectionId?: string;
  price: number;
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