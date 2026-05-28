import { mockApi } from './mock-data';

export type LoginResponse = {
  access_token: string;
  user: { id: string; email: string; name: string; role: string };
  rules: any[];
};

export type Booking = {
  id: string;
  guestName: string;
  guestEmail: string;
  partySize: number;
  date: string;
  time: string;
  table: { id: string; name: string; type: string };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
};

export type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  ticketsSold: number;
  ticketsTotal: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  genre?: string;
};

export type Guest = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tier: 'standard' | 'vip' | 'vvip';
  totalVisits: number;
  totalSpend: number;
};

export type AnalyticsSummary = {
  todayRevenue: number;
  todayBookings: number;
  totalGuests: number;
  totalEvents: number;
  liveEvent: { name: string; ticketsSold: number; ticketsTotal: number } | null;
};

export const api = mockApi;
