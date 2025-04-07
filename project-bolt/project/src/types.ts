import { ReactNode } from "react";

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
  popularity?: number;
  createdAt?: string;
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

// src/types.ts
export interface Movie {
  posterUrl: string | undefined;
  description: ReactNode;
  priceRange: ReactNode;
  location: ReactNode;
  id: string;
  title: string;
  genre: string[]; // Ensure this is an array if you want to use map
  releaseDate: string;
  rating: number;
  imageUrl: string;
  duration: string;
  cast: string[]; // Ensure this is an array
  director: string;
  language: string;
  reviews: { user: string; comment: string; rating: number }[]; // Array of review objects
}

export interface Cast {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount?: number;
  maxDiscount?: number;
  validUntil: string;
}
// src/types.ts
export interface Seat {
  id: string; // Unique identifier for the seat
  row: string; // Row letter (e.g., 'A', 'B', etc.)
  number: number; // Seat number
  price: number; // Price of the seat
  status: 'available' | 'sold'; // Status of the seat
}