import { Booking, Event, Guest, AnalyticsSummary, LoginResponse } from './api';

const TODAY = '2026-05-28';

export const MOCK_USERS: Record<string, LoginResponse> = {
  'demo@venue.ee': {
    access_token: 'mock-demo-token',
    user: { id: 'demo-1', email: 'demo@venue.ee', name: 'Demo User', role: 'demo' },
    rules: [{ action: 'read', subject: 'all' }],
  },
  'manager@venue.ee': {
    access_token: 'mock-manager-token',
    user: { id: 'mgr-1', email: 'manager@venue.ee', name: 'Carlos Rivera', role: 'manager' },
    rules: [{ action: 'manage', subject: 'all' }],
  },
};

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', guestName: 'James Whitmore', guestEmail: 'james@example.com', partySize: 6, date: TODAY, time: '21:00', table: { id: 't1', name: 'VIP-01', type: 'vip' }, status: 'confirmed' },
  { id: 'b2', guestName: 'Sophia Reyes', guestEmail: 'sophia@example.com', partySize: 4, date: TODAY, time: '22:00', table: { id: 't2', name: 'VIP-02', type: 'vip' }, status: 'confirmed' },
  { id: 'b3', guestName: 'Ella Fontaine', guestEmail: 'ella@example.com', partySize: 8, date: TODAY, time: '20:00', table: { id: 't8', name: 'M-08', type: 'table' }, status: 'pending' },
  { id: 'b4', guestName: 'Marcus Chen', guestEmail: 'marcus@example.com', partySize: 2, date: TODAY, time: '21:30', table: { id: 't5', name: 'M-05', type: 'table' }, status: 'confirmed' },
  { id: 'b5', guestName: 'Natalia Voss', guestEmail: 'natalia@example.com', partySize: 10, date: TODAY, time: '21:00', table: { id: 't3', name: 'VIP-03', type: 'vip' }, status: 'confirmed' },
  { id: 'b6', guestName: 'Liam Torres', guestEmail: 'liam@example.com', partySize: 3, date: TODAY, time: '23:00', table: { id: 't14', name: 'BAR-02', type: 'bar' }, status: 'pending' },
  { id: 'b7', guestName: 'Derek Hale', guestEmail: 'derek@example.com', partySize: 4, date: TODAY, time: '20:30', table: { id: 't16', name: 'T-01', type: 'table' }, status: 'cancelled' },
];

export const MOCK_EVENTS: Event[] = [
  { id: 'e1', name: 'Neon Nights', date: TODAY, time: '22:00', ticketsSold: 280, ticketsTotal: 300, status: 'live', genre: 'Techno & House' },
  { id: 'e2', name: 'Black Velvet Saturdays', date: '2026-05-30', time: '23:00', ticketsSold: 180, ticketsTotal: 300, status: 'upcoming', genre: 'Electronic' },
  { id: 'e3', name: 'Bass & Bourbon', date: '2026-06-06', time: '21:00', ticketsSold: 300, ticketsTotal: 300, status: 'upcoming', genre: 'Deep Bass' },
  { id: 'e4', name: 'Sundown Sessions', date: '2026-05-17', time: '19:00', ticketsSold: 210, ticketsTotal: 250, status: 'completed', genre: 'Nu-Disco' },
  { id: 'e5', name: 'Midnight Mirage', date: '2026-06-13', time: '22:30', ticketsSold: 90, ticketsTotal: 300, status: 'upcoming', genre: 'Ambient' },
];

export const MOCK_GUESTS: Guest[] = [
  { id: 'g1', name: 'James Whitmore', email: 'james@example.com', phone: '+1 555 0101', tier: 'vip', totalVisits: 24, totalSpend: 18600 },
  { id: 'g2', name: 'Sophia Reyes', email: 'sophia@example.com', phone: '+1 555 0102', tier: 'vip', totalVisits: 18, totalSpend: 12400 },
  { id: 'g3', name: 'Ella Fontaine', email: 'ella@example.com', phone: '+1 555 0104', tier: 'vvip', totalVisits: 31, totalSpend: 28900 },
  { id: 'g4', name: 'Natalia Voss', email: 'natalia@example.com', phone: '+1 555 0105', tier: 'vip', totalVisits: 12, totalSpend: 9800 },
  { id: 'g5', name: 'Marcus Chen', email: 'marcus@example.com', phone: '+1 555 0103', tier: 'standard', totalVisits: 7, totalSpend: 2100 },
  { id: 'g6', name: 'Priya Nair', email: 'priya@example.com', phone: '+1 555 0106', tier: 'standard', totalVisits: 4, totalSpend: 980 },
  { id: 'g7', name: 'Liam Torres', email: 'liam@example.com', phone: '+1 555 0107', tier: 'standard', totalVisits: 9, totalSpend: 3200 },
];

export const MOCK_SUMMARY: AnalyticsSummary = {
  todayRevenue: 4790,
  todayBookings: MOCK_BOOKINGS.filter(b => b.date === TODAY && b.status !== 'cancelled').length,
  totalGuests: MOCK_GUESTS.length,
  totalEvents: MOCK_EVENTS.length,
  liveEvent: { name: 'Neon Nights', ticketsSold: 280, ticketsTotal: 300 },
};

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

export const mockApi = {
  login: (email: string, password: string) => {
    const match = MOCK_USERS[email.toLowerCase()];
    if (!match || password !== 'demo1234') return Promise.reject(new Error('Invalid credentials'));
    return delay(match);
  },

  me: (token: string) => {
    const match = Object.values(MOCK_USERS).find(u => u.access_token === token);
    if (!match) return Promise.reject(new Error('Unauthorized'));
    return delay({ ...match.user, rules: match.rules });
  },

  getBookings: (date?: string) =>
    delay(date ? MOCK_BOOKINGS.filter(b => b.date === date) : MOCK_BOOKINGS),

  updateBookingStatus: (id: string, status: string) => {
    const booking = MOCK_BOOKINGS.find(b => b.id === id);
    if (!booking) return Promise.reject(new Error('Not found'));
    return delay({ ...booking, status: status as Booking['status'] });
  },

  getEvents: () => delay(MOCK_EVENTS),

  getGuests: () => delay(MOCK_GUESTS),

  getAnalyticsSummary: () => delay(MOCK_SUMMARY),
};
