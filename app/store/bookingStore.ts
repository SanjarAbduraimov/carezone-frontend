/**
 * Booking Draft Store with Zod Validation
 * 
 * Features:
 * - Booking form draft persistence
 * - Booking history cache
 * - Modal state management
 * - Zod validation before submission
 * - Auto-save draft to localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { z } from 'zod';

// ==================== ZOD SCHEMAS ====================

export const bookingDraftSchema = z.object({
  slotId: z.string().optional(),
  doctorSlug: z.string().optional(),
  clinicSlug: z.string().optional(),
  patientName: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  patientPhone: z.string()
    .min(9, 'Phone must be at least 9 digits')
    .max(20, 'Phone cannot exceed 20 characters')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Invalid phone format')
    .optional(),
  patientEmail: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  selectedDate: z.string().optional(), // ISO date string
  selectedTime: z.string().optional(), // HH:mm format
});

export const bookingDraftSubmitSchema = bookingDraftSchema.required({
  slotId: true,
  doctorSlug: true,
  patientName: true,
  patientPhone: true,
  selectedDate: true,
  selectedTime: true,
});

export const bookingHistoryItemSchema = z.object({
  id: z.string(),
  doctorName: z.string(),
  doctorSlug: z.string().optional(),
  clinicName: z.string().optional(),
  date: z.string(), // ISO date string
  time: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  timestamp: z.number(),
  notes: z.string().optional(),
});

export const bookingStateSchema = z.object({
  draft: bookingDraftSchema,
  history: z.array(bookingHistoryItemSchema).max(50),
  isBookingModalOpen: z.boolean(),
  selectedSlot: z.any().nullable(),
});

// ==================== TYPES ====================

export type BookingDraft = z.infer<typeof bookingDraftSchema>;
export type BookingDraftSubmit = z.infer<typeof bookingDraftSubmitSchema>;
export type BookingHistoryItem = z.infer<typeof bookingHistoryItemSchema>;
export type BookingState = z.infer<typeof bookingStateSchema>;

export interface BookingStore extends BookingState {
  // Draft Actions
  setDraft: (draft: Partial<BookingDraft>) => void;
  clearDraft: () => void;
  validateDraft: () => { valid: boolean; errors?: z.ZodError };
  isDraftValid: () => boolean;

  // History Actions
  addToHistory: (item: Omit<BookingHistoryItem, 'id' | 'timestamp'>) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  getHistoryByStatus: (status: BookingHistoryItem['status']) => BookingHistoryItem[];

  // Modal Actions
  openBookingModal: (slotData?: any) => void;
  closeBookingModal: () => void;
  
  // Utility
  loadDraftForBooking: (doctorSlug: string, slotId: string, date: string, time: string) => void;
}

// ==================== DEFAULT VALUES ====================

const defaultDraft: BookingDraft = {
  slotId: undefined,
  doctorSlug: undefined,
  clinicSlug: undefined,
  patientName: undefined,
  patientPhone: undefined,
  patientEmail: undefined,
  notes: undefined,
  selectedDate: undefined,
  selectedTime: undefined,
};

// ==================== STORE ====================

export const useBookingStore = create<BookingStore>()(
  persist(
    immer((set, get) => ({
      // Initial State
      draft: defaultDraft,
      history: [],
      isBookingModalOpen: false,
      selectedSlot: null,

      // Draft Actions
      setDraft: (draftUpdates) => {
        try {
          const currentDraft = get().draft;
          const updatedDraft = bookingDraftSchema.parse({
            ...currentDraft,
            ...draftUpdates,
          });

          set((state) => {
            state.draft = updatedDraft;
          });
        } catch (error) {
          console.error('Booking draft validation failed:', error);
          throw new Error('Invalid booking draft data');
        }
      },

      clearDraft: () => {
        set((state) => {
          state.draft = defaultDraft;
        });
      },

      validateDraft: () => {
        try {
          const draft = get().draft;
          bookingDraftSubmitSchema.parse(draft);
          return { valid: true };
        } catch (error) {
          if (error instanceof z.ZodError) {
            return { valid: false, errors: error };
          }
          return { valid: false };
        }
      },

      isDraftValid: () => {
        const result = get().validateDraft();
        return result.valid;
      },

      // History Actions
      addToHistory: (item) => {
        try {
          const newItem: BookingHistoryItem = bookingHistoryItemSchema.parse({
            ...item,
            id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
          });

          set((state) => {
            // Add to beginning of history
            state.history.unshift(newItem);

            // Keep only last 50 items
            if (state.history.length > 50) {
              state.history = state.history.slice(0, 50);
            }
          });
        } catch (error) {
          console.error('Booking history validation failed:', error);
          throw new Error('Invalid booking history data');
        }
      },

      removeFromHistory: (id) => {
        set((state) => {
          state.history = state.history.filter((item) => item.id !== id);
        });
      },

      clearHistory: () => {
        set((state) => {
          state.history = [];
        });
      },

      getHistoryByStatus: (status) => {
        return get().history.filter((item) => item.status === status);
      },

      // Modal Actions
      openBookingModal: (slotData) => {
        set((state) => {
          state.isBookingModalOpen = true;
          state.selectedSlot = slotData || null;
        });
      },

      closeBookingModal: () => {
        set((state) => {
          state.isBookingModalOpen = false;
          state.selectedSlot = null;
        });
      },

      // Utility
      loadDraftForBooking: (doctorSlug, slotId, date, time) => {
        try {
          const draftData = bookingDraftSchema.parse({
            doctorSlug,
            slotId,
            selectedDate: date,
            selectedTime: time,
            // Keep existing patient info if available
            patientName: get().draft.patientName,
            patientPhone: get().draft.patientPhone,
            patientEmail: get().draft.patientEmail,
            notes: get().draft.notes,
          });

          set((state) => {
            state.draft = draftData;
          });
        } catch (error) {
          console.error('Failed to load draft for booking:', error);
        }
      },
    })),
    {
      name: 'booking-storage',
      // Only persist draft and history, not modal state
      partialize: (state) => ({
        draft: state.draft,
        history: state.history,
      }),
      // Validate data when rehydrating from localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            // Validate draft
            if (state.draft) {
              state.draft = bookingDraftSchema.parse(state.draft);
            }

            // Validate and clean history
            if (state.history) {
              state.history = state.history
                .map((item) => {
                  try {
                    return bookingHistoryItemSchema.parse(item);
                  } catch {
                    return null;
                  }
                })
                .filter((item): item is BookingHistoryItem => item !== null)
                .slice(0, 50); // Ensure max 50 items
            }

            // Reset modal state (should not persist)
            state.isBookingModalOpen = false;
            state.selectedSlot = null;
          } catch (error) {
            console.error('Booking store rehydration validation failed:', error);
            // Reset to defaults if validation fails
            state.draft = defaultDraft;
            state.history = [];
            state.isBookingModalOpen = false;
            state.selectedSlot = null;
          }
        }
      },
    }
  )
);

// ==================== HOOKS ====================

// Draft
export const useBookingDraft = () => useBookingStore((state) => state.draft);
export const useIsDraftValid = () => useBookingStore((state) => state.isDraftValid());

// History
export const useBookingHistory = () => useBookingStore((state) => state.history);
export const useBookingHistoryByStatus = (status: BookingHistoryItem['status']) => {
  return useBookingStore((state) => state.getHistoryByStatus(status));
};

// Modal
export const useIsBookingModalOpen = () => useBookingStore((state) => state.isBookingModalOpen);
export const useSelectedSlot = () => useBookingStore((state) => state.selectedSlot);
