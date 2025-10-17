/**
 * Zustand Store Exports with Zod Validation
 * 
 * Central export point for all application stores.
 * Each store includes full Zod validation and localStorage persistence.
 * 
 * Stores Available:
 * - userStore: Authentication and RBAC
 * - searchStore: Search filters and history
 * - bookingStore: Booking drafts and history
 * - uiStore: UI preferences and theme
 */

// ==================== USER STORE ====================
export {
  useUserStore,
  // Hooks
  useIsAuthenticated,
  useCurrentUser,
  useUserToken,
  useHasRole,
  useHasPermission,
  // Types
  type User,
  type AuthState,
  type UserStore,
  // Schemas
  userSchema,
  authStateSchema,
} from './userStore';

// ==================== SEARCH STORE ====================
export {
  useSearchStore,
  // Hooks
  useDoctorFilters,
  useDoctorQuery,
  useClinicFilters,
  useClinicQuery,
  useRecentSearches,
  useRecentSearchesByType,
  // Types
  type SearchFilters,
  type RecentSearch,
  type SearchState,
  type SearchStore,
  // Schemas
  searchFiltersSchema,
  recentSearchSchema,
  searchStateSchema,
} from './searchStore';

// ==================== BOOKING STORE ====================
export {
  useBookingStore,
  // Hooks
  useBookingDraft,
  useIsDraftValid,
  useBookingHistory,
  useBookingHistoryByStatus,
  useIsBookingModalOpen,
  useSelectedSlot,
  // Types
  type BookingDraft,
  type BookingDraftSubmit,
  type BookingHistoryItem,
  type BookingState,
  type BookingStore,
  // Schemas
  bookingDraftSchema,
  bookingDraftSubmitSchema,
  bookingHistoryItemSchema,
  bookingStateSchema,
} from './bookingStore';

// ==================== UI STORE ====================
export {
  useUIStore,
  // Hooks
  useTheme,
  useIsDarkMode,
  useLocale,
  useSidebarOpen,
  useSidebarCollapsed,
  useUIPreferences,
  useToasts,
  useIsLoading,
  useIsMobileMenuOpen,
  useIsSearchModalOpen,
  // Types
  type Theme,
  type Locale,
  type Toast,
  type UIPreferences,
  type UIState,
  type UIStore,
  // Schemas
  themeSchema,
  localeSchema,
  toastSchema,
  uiPreferencesSchema,
  uiStateSchema,
} from './uiStore';

// ==================== STORE USAGE GUIDE ====================

/**
 * USAGE EXAMPLES:
 * 
 * 1. Authentication:
 * ```tsx
 * import { useUserStore, useIsAuthenticated, useCurrentUser } from '@/app/store';
 * 
 * function MyComponent() {
 *   const { login, logout } = useUserStore();
 *   const isAuthenticated = useIsAuthenticated();
 *   const user = useCurrentUser();
 *   
 *   return <div>{user?.name}</div>;
 * }
 * ```
 * 
 * 2. Search Filters:
 * ```tsx
 * import { useSearchStore, useDoctorFilters } from '@/app/store';
 * 
 * function SearchComponent() {
 *   const { setDoctorFilters, clearDoctorFilters } = useSearchStore();
 *   const filters = useDoctorFilters();
 *   
 *   const handleSearch = (query: string) => {
 *     setDoctorFilters({ query });
 *   };
 *   
 *   return <input onChange={(e) => handleSearch(e.target.value)} />;
 * }
 * ```
 * 
 * 3. Booking Draft:
 * ```tsx
 * import { useBookingStore, useBookingDraft, useIsDraftValid } from '@/app/store';
 * 
 * function BookingForm() {
 *   const { setDraft, validateDraft } = useBookingStore();
 *   const draft = useBookingDraft();
 *   const isValid = useIsDraftValid();
 *   
 *   const handleSubmit = () => {
 *     const { valid, errors } = validateDraft();
 *     if (valid) {
 *       // Submit booking
 *     }
 *   };
 *   
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 * 
 * 4. UI Preferences:
 * ```tsx
 * import { useUIStore, useTheme, useToasts } from '@/app/store';
 * 
 * function ThemeToggle() {
 *   const { setTheme, addToast } = useUIStore();
 *   const theme = useTheme();
 *   
 *   const handleToggle = () => {
 *     const newTheme = theme === 'light' ? 'dark' : 'light';
 *     setTheme(newTheme);
 *     addToast({
 *       type: 'success',
 *       message: `Theme changed to ${newTheme}`,
 *     });
 *   };
 *   
 *   return <button onClick={handleToggle}>Toggle Theme</button>;
 * }
 * ```
 * 
 * VALIDATION:
 * All stores include automatic Zod validation:
 * - Validates on every state update
 * - Validates on localStorage rehydration
 * - Throws errors for invalid data
 * - Provides detailed error messages
 * 
 * PERSISTENCE:
 * - userStore: Persists user, token, isAuthenticated
 * - searchStore: Persists filters and recent searches
 * - bookingStore: Persists draft and history (not modal state)
 * - uiStore: Persists preferences only (not transient state)
 */
