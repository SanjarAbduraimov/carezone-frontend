/**
 * UI Preferences Store with Zod Validation
 * 
 * Features:
 * - Theme and display preferences
 * - Sidebar and navigation state
 * - Toast/notification management
 * - Locale/language preferences
 * - Zod validation on all updates
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { z } from 'zod';

// ==================== ZOD SCHEMAS ====================

export const themeSchema = z.enum(['light', 'dark', 'system']);

export const localeSchema = z.enum(['en', 'uz', 'ru']);

export const toastSchema = z.object({
  id: z.string(),
  type: z.enum(['success', 'error', 'warning', 'info']),
  message: z.string().min(1).max(500),
  duration: z.number().min(1000).max(10000).default(3000),
  timestamp: z.number(),
});

export const uiPreferencesSchema = z.object({
  theme: themeSchema.default('system'),
  locale: localeSchema.default('uz'),
  sidebarOpen: z.boolean().default(true),
  sidebarCollapsed: z.boolean().default(false),
  compactMode: z.boolean().default(false),
  showNotifications: z.boolean().default(true),
  animationsEnabled: z.boolean().default(true),
});

export const uiStateSchema = z.object({
  preferences: uiPreferencesSchema,
  toasts: z.array(toastSchema).max(5),
  isLoading: z.boolean(),
  isMobileMenuOpen: z.boolean(),
  isSearchModalOpen: z.boolean(),
});

// ==================== TYPES ====================

export type Theme = z.infer<typeof themeSchema>;
export type Locale = z.infer<typeof localeSchema>;
export type Toast = z.infer<typeof toastSchema>;
export type UIPreferences = z.infer<typeof uiPreferencesSchema>;
export type UIState = z.infer<typeof uiStateSchema>;

export interface UIStore extends UIState {
  // Theme Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Locale Actions
  setLocale: (locale: Locale) => void;

  // Sidebar Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapse: () => void;

  // Preferences Actions
  updatePreferences: (preferences: Partial<UIPreferences>) => void;
  resetPreferences: () => void;

  // Toast Actions
  addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Loading State
  setLoading: (loading: boolean) => void;

  // Modal Actions
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setSearchModalOpen: (open: boolean) => void;
  toggleSearchModal: () => void;
}

// ==================== DEFAULT VALUES ====================

const defaultPreferences: UIPreferences = {
  theme: 'system',
  locale: 'uz',
  sidebarOpen: true,
  sidebarCollapsed: false,
  compactMode: false,
  showNotifications: true,
  animationsEnabled: true,
};

// ==================== STORE ====================

export const useUIStore = create<UIStore>()(
  persist(
    immer((set, get) => ({
      // Initial State
      preferences: defaultPreferences,
      toasts: [],
      isLoading: false,
      isMobileMenuOpen: false,
      isSearchModalOpen: false,

      // Theme Actions
      setTheme: (theme) => {
        try {
          const validatedTheme = themeSchema.parse(theme);
          
          set((state) => {
            state.preferences.theme = validatedTheme;
          });

          // Apply theme to document
          if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            if (validatedTheme === 'dark') {
              root.classList.add('dark');
            } else if (validatedTheme === 'light') {
              root.classList.remove('dark');
            } else {
              // System preference
              const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (isDark) {
                root.classList.add('dark');
              } else {
                root.classList.remove('dark');
              }
            }
          }
        } catch (error) {
          console.error('Theme validation failed:', error);
        }
      },

      toggleTheme: () => {
        const currentTheme = get().preferences.theme;
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(nextTheme);
      },

      // Locale Actions
      setLocale: (locale) => {
        try {
          const validatedLocale = localeSchema.parse(locale);
          
          set((state) => {
            state.preferences.locale = validatedLocale;
          });

          // Update HTML lang attribute
          if (typeof window !== 'undefined') {
            document.documentElement.lang = validatedLocale;
          }
        } catch (error) {
          console.error('Locale validation failed:', error);
        }
      },

      // Sidebar Actions
      setSidebarOpen: (open) => {
        set((state) => {
          state.preferences.sidebarOpen = open;
        });
      },

      toggleSidebar: () => {
        set((state) => {
          state.preferences.sidebarOpen = !state.preferences.sidebarOpen;
        });
      },

      setSidebarCollapsed: (collapsed) => {
        set((state) => {
          state.preferences.sidebarCollapsed = collapsed;
        });
      },

      toggleSidebarCollapse: () => {
        set((state) => {
          state.preferences.sidebarCollapsed = !state.preferences.sidebarCollapsed;
        });
      },

      // Preferences Actions
      updatePreferences: (preferences) => {
        try {
          const currentPreferences = get().preferences;
          const updatedPreferences = uiPreferencesSchema.parse({
            ...currentPreferences,
            ...preferences,
          });

          set((state) => {
            state.preferences = updatedPreferences;
          });
        } catch (error) {
          console.error('Preferences validation failed:', error);
          throw new Error('Invalid UI preferences');
        }
      },

      resetPreferences: () => {
        set((state) => {
          state.preferences = defaultPreferences;
        });
      },

      // Toast Actions
      addToast: (toast) => {
        try {
          const newToast: Toast = toastSchema.parse({
            ...toast,
            id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
          });

          set((state) => {
            state.toasts.push(newToast);

            // Keep only last 5 toasts
            if (state.toasts.length > 5) {
              state.toasts = state.toasts.slice(-5);
            }
          });

          // Auto-remove toast after duration
          setTimeout(() => {
            get().removeToast(newToast.id);
          }, toast.duration || 3000);
        } catch (error) {
          console.error('Toast validation failed:', error);
        }
      },

      removeToast: (id) => {
        set((state) => {
          state.toasts = state.toasts.filter((toast) => toast.id !== id);
        });
      },

      clearToasts: () => {
        set((state) => {
          state.toasts = [];
        });
      },

      // Loading State
      setLoading: (loading) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      // Modal Actions
      setMobileMenuOpen: (open) => {
        set((state) => {
          state.isMobileMenuOpen = open;
        });
      },

      toggleMobileMenu: () => {
        set((state) => {
          state.isMobileMenuOpen = !state.isMobileMenuOpen;
        });
      },

      setSearchModalOpen: (open) => {
        set((state) => {
          state.isSearchModalOpen = open;
        });
      },

      toggleSearchModal: () => {
        set((state) => {
          state.isSearchModalOpen = !state.isSearchModalOpen;
        });
      },
    })),
    {
      name: 'ui-storage',
      // Only persist preferences, not transient state
      partialize: (state) => ({
        preferences: state.preferences,
      }),
      // Validate data when rehydrating from localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            // Validate preferences
            if (state.preferences) {
              state.preferences = uiPreferencesSchema.parse(state.preferences);
            }

            // Reset transient state
            state.toasts = [];
            state.isLoading = false;
            state.isMobileMenuOpen = false;
            state.isSearchModalOpen = false;

            // Apply theme on rehydration
            if (typeof window !== 'undefined' && state.preferences) {
              const theme = state.preferences.theme;
              const root = window.document.documentElement;
              
              if (theme === 'dark') {
                root.classList.add('dark');
              } else if (theme === 'light') {
                root.classList.remove('dark');
              } else {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (isDark) {
                  root.classList.add('dark');
                } else {
                  root.classList.remove('dark');
                }
              }

              // Apply locale
              if (state.preferences.locale) {
                document.documentElement.lang = state.preferences.locale;
              }
            }
          } catch (error) {
            console.error('UI store rehydration validation failed:', error);
            // Reset to defaults if validation fails
            state.preferences = defaultPreferences;
            state.toasts = [];
            state.isLoading = false;
            state.isMobileMenuOpen = false;
            state.isSearchModalOpen = false;
          }
        }
      },
    }
  )
);

// ==================== HOOKS ====================

// Theme
export const useTheme = () => useUIStore((state) => state.preferences.theme);
export const useIsDarkMode = () => {
  const theme = useTheme();
  if (theme === 'system') {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }
  return theme === 'dark';
};

// Locale
export const useLocale = () => useUIStore((state) => state.preferences.locale);

// Sidebar
export const useSidebarOpen = () => useUIStore((state) => state.preferences.sidebarOpen);
export const useSidebarCollapsed = () => useUIStore((state) => state.preferences.sidebarCollapsed);

// Preferences
export const useUIPreferences = () => useUIStore((state) => state.preferences);

// Toasts
export const useToasts = () => useUIStore((state) => state.toasts);

// Loading
export const useIsLoading = () => useUIStore((state) => state.isLoading);

// Modals
export const useIsMobileMenuOpen = () => useUIStore((state) => state.isMobileMenuOpen);
export const useIsSearchModalOpen = () => useUIStore((state) => state.isSearchModalOpen);
