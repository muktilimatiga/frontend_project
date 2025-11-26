
import { create } from 'zustand';
import { User, Ticket } from '../../../types';
import { MockService } from '../../../mock';

interface TicketFormData {
  name: string;
  address: string;
  contact: string;
  noInternet: string; // ID
  ticketRef: string;
  priority: string;
  type: string;
  description: string;
}

const INITIAL_FORM_DATA: TicketFormData = {
  name: '',
  address: '',
  contact: '',
  noInternet: '',
  ticketRef: '',
  priority: '',
  type: '',
  description: ''
};

interface TicketStore {
  // State
  step: number;
  selectedUser: User | null;
  formData: TicketFormData;
  searchQuery: string;
  searchResults: User[];
  isSearching: boolean;

  // Actions
  setStep: (step: number) => void;
  setSearchQuery: (query: string) => void;
  searchCustomers: (query: string) => Promise<void>;
  selectUser: (user: User) => void;
  updateFormData: (updates: Partial<TicketFormData>) => void;
  
  // Initialize from existing ticket (for Process/Edit modals)
  initializeFromTicket: (ticket: Ticket) => void;
  
  // Reset
  reset: () => void;
}

export const useTicketStore = create<TicketStore>((set, get) => ({
  step: 1,
  selectedUser: null,
  formData: INITIAL_FORM_DATA,
  searchQuery: '',
  searchResults: [],
  isSearching: false,

  setStep: (step) => set({ step }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  searchCustomers: async (query) => {
    if (query.length <= 1) {
        set({ searchResults: [], isSearching: false });
        return;
    }
    
    set({ isSearching: true });
    try {
        // In a real app, this would be an API call
        // We use the mock service directly here
        const res = await MockService.searchUsers(query);
        set({ searchResults: res, isSearching: false });
    } catch (error) {
        set({ searchResults: [], isSearching: false });
    }
  },

  selectUser: (user) => {
    // Generate a random ticket ref for demo purposes
    const randomRef = `TN${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`;
    
    set({
        selectedUser: user,
        step: 2,
        formData: {
            ...INITIAL_FORM_DATA,
            name: user.name.toUpperCase(),
            address: 'RT/RW.005/005, DSN. BENDILJET, DS. KARANGTALUN, KALID', // Mock Address logic
            contact: '6282244311034', // Mock Contact
            noInternet: '101037012073', // Mock ID
            ticketRef: randomRef,
        }
    });
  },

  updateFormData: (updates) => set((state) => ({
      formData: { ...state.formData, ...updates }
  })),

  initializeFromTicket: (ticket) => {
      // Create a mock user context based on ticket assignee or generic
      const mockUser: User = {
          id: 'u-temp',
          name: 'ALEX CARTER', // In real app, fetch from ticket.userId
          email: 'alex@nexus.com',
          role: 'user',
          avatarUrl: 'https://i.pravatar.cc/150?u=alex',
          coordinates: { lat: 40.7128, lng: -74.0060 }
      };

      set({
          step: 2, // Skip search
          selectedUser: mockUser,
          formData: {
            name: mockUser.name,
            address: '123 FIBER OPTIC LANE, TECH CITY, NY 10001',
            contact: '+1 555 019 2834',
            noInternet: 'ONT-8293-X2',
            ticketRef: ticket.id,
            priority: ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1),
            type: 'Technical',
            description: ticket.title + ' - Investigating reported latency issues.'
          }
      });
  },

  reset: () => set({
      step: 1,
      selectedUser: null,
      formData: INITIAL_FORM_DATA,
      searchQuery: '',
      searchResults: [],
      isSearching: false
  })
}));
