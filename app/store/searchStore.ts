/**
 * Search Filters Store with Zod Validation
 * 
 * Features:
 * - Doctor and clinic search filters
 * - Recent search history
 * - Zod validation on filter updates
 * - LocalStorage persistence
 * - Auto-validation on rehydration
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { z } from 'zod';

// ==================== ZOD SCHEMAS ====================

export const searchFiltersSchema = z.object({
  query: z.string().default(''),
  city: z.string().optional(),
  specialtyId: z.string().optional(),
  clinicId: z.string().optional(),
  priceMin: z.number().min(0, 'Price must be positive').optional(),
  priceMax: z.number().min(0, 'Price must be positive').optional(),
  sortBy: z.enum(['createdAt', 'name', 'rating', 'price']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
}).refine(
  (data) => {
    // Ensure priceMax is greater than priceMin if both are set
    if (data.priceMin !== undefined && data.priceMax !== undefined) {
      return data.priceMax >= data.priceMin;
    }
    return true;
  },
  {
    message: 'Maximum price must be greater than or equal to minimum price',
    path: ['priceMax'],
  }
);

export const recentSearchSchema = z.object({
  id: z.string(),
  query: z.string().min(1, 'Search query cannot be empty'),
  type: z.enum(['doctor', 'clinic', 'general']),
  filters: searchFiltersSchema.partial().optional(),
  timestamp: z.number(),
});

export const searchStateSchema = z.object({
  doctorFilters: searchFiltersSchema,
  clinicFilters: searchFiltersSchema,
  recentSearches: z.array(recentSearchSchema).max(10),
});

// ==================== TYPES ====================

export type SearchFilters = z.infer<typeof searchFiltersSchema>;
export type RecentSearch = z.infer<typeof recentSearchSchema>;
export type SearchState = z.infer<typeof searchStateSchema>;

export interface SearchStore extends SearchState {
  // Doctor Filters
  setDoctorFilters: (filters: Partial<SearchFilters>) => void;
  clearDoctorFilters: () => void;
  setDoctorQuery: (query: string) => void;
  setDoctorPage: (page: number) => void;

  // Clinic Filters
  setClinicFilters: (filters: Partial<SearchFilters>) => void;
  clearClinicFilters: () => void;
  setClinicQuery: (query: string) => void;
  setClinicPage: (page: number) => void;

  // Recent Searches
  addRecentSearch: (search: Omit<RecentSearch, 'id' | 'timestamp'>) => void;
  removeRecentSearch: (id: string) => void;
  clearRecentSearches: () => void;
  getRecentSearchesByType: (type: RecentSearch['type']) => RecentSearch[];
}

// ==================== DEFAULT VALUES ====================

const defaultFilters: SearchFilters = {
  query: '',
  sortOrder: 'desc',
  page: 1,
  limit: 12,
};

// ==================== STORE ====================

export const useSearchStore = create<SearchStore>()(
  persist(
    immer((set, get) => ({
      // Initial State
      doctorFilters: defaultFilters,
      clinicFilters: defaultFilters,
      recentSearches: [],

      // Doctor Filter Actions
      setDoctorFilters: (filters) => {
        try {
          const currentFilters = get().doctorFilters;
          const updatedFilters = searchFiltersSchema.parse({
            ...currentFilters,
            ...filters,
          });

          set((state) => {
            state.doctorFilters = updatedFilters;
          });
        } catch (error) {
          console.error('Doctor filters validation failed:', error);
          throw new Error('Invalid doctor filter data');
        }
      },

      clearDoctorFilters: () => {
        set((state) => {
          state.doctorFilters = defaultFilters;
        });
      },

      setDoctorQuery: (query) => {
        set((state) => {
          state.doctorFilters.query = query;
          state.doctorFilters.page = 1; // Reset to first page on new search
        });
      },

      setDoctorPage: (page) => {
        try {
          if (page < 1) throw new Error('Page must be at least 1');
          
          set((state) => {
            state.doctorFilters.page = page;
          });
        } catch (error) {
          console.error('Invalid page number:', error);
        }
      },

      // Clinic Filter Actions
      setClinicFilters: (filters) => {
        try {
          const currentFilters = get().clinicFilters;
          const updatedFilters = searchFiltersSchema.parse({
            ...currentFilters,
            ...filters,
          });

          set((state) => {
            state.clinicFilters = updatedFilters;
          });
        } catch (error) {
          console.error('Clinic filters validation failed:', error);
          throw new Error('Invalid clinic filter data');
        }
      },

      clearClinicFilters: () => {
        set((state) => {
          state.clinicFilters = defaultFilters;
        });
      },

      setClinicQuery: (query) => {
        set((state) => {
          state.clinicFilters.query = query;
          state.clinicFilters.page = 1; // Reset to first page on new search
        });
      },

      setClinicPage: (page) => {
        try {
          if (page < 1) throw new Error('Page must be at least 1');
          
          set((state) => {
            state.clinicFilters.page = page;
          });
        } catch (error) {
          console.error('Invalid page number:', error);
        }
      },

      // Recent Searches Actions
      addRecentSearch: (search) => {
        try {
          const newSearch: RecentSearch = recentSearchSchema.parse({
            ...search,
            id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
          });

          set((state) => {
            // Remove duplicate searches (same query and type)
            state.recentSearches = state.recentSearches.filter(
              (s) => !(s.query === newSearch.query && s.type === newSearch.type)
            );

            // Add new search at the beginning
            state.recentSearches.unshift(newSearch);

            // Keep only last 10 searches
            if (state.recentSearches.length > 10) {
              state.recentSearches = state.recentSearches.slice(0, 10);
            }
          });
        } catch (error) {
          console.error('Recent search validation failed:', error);
          throw new Error('Invalid recent search data');
        }
      },

      removeRecentSearch: (id) => {
        set((state) => {
          state.recentSearches = state.recentSearches.filter((s) => s.id !== id);
        });
      },

      clearRecentSearches: () => {
        set((state) => {
          state.recentSearches = [];
        });
      },

      getRecentSearchesByType: (type) => {
        return get().recentSearches.filter((s) => s.type === type);
      },
    })),
    {
      name: 'search-storage',
      // Validate data when rehydrating from localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            // Validate doctor filters
            if (state.doctorFilters) {
              state.doctorFilters = searchFiltersSchema.parse(state.doctorFilters);
            }

            // Validate clinic filters
            if (state.clinicFilters) {
              state.clinicFilters = searchFiltersSchema.parse(state.clinicFilters);
            }

            // Validate and clean recent searches
            if (state.recentSearches) {
              state.recentSearches = state.recentSearches
                .map((search) => {
                  try {
                    return recentSearchSchema.parse(search);
                  } catch {
                    return null;
                  }
                })
                .filter((search): search is RecentSearch => search !== null)
                .slice(0, 10); // Ensure max 10 items
            }
          } catch (error) {
            console.error('Search store rehydration validation failed:', error);
            // Reset to defaults if validation fails
            state.doctorFilters = defaultFilters;
            state.clinicFilters = defaultFilters;
            state.recentSearches = [];
          }
        }
      },
    }
  )
);

// ==================== HOOKS ====================

// Doctor Filters
export const useDoctorFilters = () => useSearchStore((state) => state.doctorFilters);
export const useDoctorQuery = () => useSearchStore((state) => state.doctorFilters.query);

// Clinic Filters
export const useClinicFilters = () => useSearchStore((state) => state.clinicFilters);
export const useClinicQuery = () => useSearchStore((state) => state.clinicFilters.query);

// Recent Searches
export const useRecentSearches = () => useSearchStore((state) => state.recentSearches);
export const useRecentSearchesByType = (type: RecentSearch['type']) => {
  return useSearchStore((state) => state.getRecentSearchesByType(type));
};
