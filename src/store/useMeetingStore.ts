import { create } from 'zustand';

export interface MeetingEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  type: 'availability' | 'meeting' | 'request';
  status?: 'confirmed' | 'pending' | 'declined';
  withWho?: string;
  description?: string;
}

interface MeetingStore {
  events: MeetingEvent[];
  addEvent: (event: Omit<MeetingEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<MeetingEvent>) => void;
  deleteEvent: (id: string) => void;
  acceptRequest: (id: string) => void;
  declineRequest: (id: string) => void;
}

// Initial mock data
const initialEvents: MeetingEvent[] = [
  {
    id: '1',
    title: 'Investor Pitch - TechNova',
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    type: 'meeting',
    status: 'confirmed',
    withWho: 'Sarah Jenkins (TechNova)',
  },
  {
    id: '2',
    title: 'Initial Screening',
    start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 0, 0, 0)).toISOString(),
    type: 'request',
    status: 'pending',
    withWho: 'Michael Chen (Angel Investor)',
  },
];

export const useMeetingStore = create<MeetingStore>((set) => ({
  events: initialEvents,
  
  addEvent: (event) => set((state) => ({
    events: [...state.events, { ...event, id: Math.random().toString(36).substring(2, 9) }],
  })),

  updateEvent: (id, updatedFields) => set((state) => ({
    events: state.events.map((event) => 
      event.id === id ? { ...event, ...updatedFields } : event
    ),
  })),

  deleteEvent: (id) => set((state) => ({
    events: state.events.filter((event) => event.id !== id),
  })),

  acceptRequest: (id) => set((state) => ({
    events: state.events.map((event) => 
      event.id === id ? { ...event, status: 'confirmed', type: 'meeting' } : event
    ),
  })),

  declineRequest: (id) => set((state) => ({
    events: state.events.map((event) => 
      event.id === id ? { ...event, status: 'declined' } : event
    ),
  })),
}));
