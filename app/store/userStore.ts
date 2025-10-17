/**
 * User Authentication Store with Zod Validation
 * 
 * Features:
 * - Authentication state management
 * - Token management with localStorage persistence
 * - Role-based access control (RBAC)
 * - Zod validation on every state update
 * - Auto-save to localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { z } from 'zod';

// ==================== ZOD SCHEMAS ====================

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email format'),
  name: z.string().optional(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  role: z.enum(['USER', 'DOCTOR', 'CLINIC_ADMIN', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const authStateSchema = z.object({
  user: userSchema.nullable(),
  token: z.string().nullable(),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
});

// ==================== TYPES ====================

export type User = z.infer<typeof userSchema>;
export type AuthState = z.infer<typeof authStateSchema>;

export interface UserStore extends AuthState {
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  hasRole: (roles: User['role'][]) => boolean;
  hasPermission: (permission: string) => boolean;
}

// ==================== RBAC CONFIGURATION ====================

const rolePermissions: Record<User['role'], string[]> = {
  USER: ['booking.create', 'booking.view.own', 'booking.update.own', 'booking.cancel.own'],
  DOCTOR: [
    'booking.view.own',
    'booking.update.own',
    'doctor.view.own',
    'doctor.update.own',
    'schedule.manage.own',
  ],
  CLINIC_ADMIN: [
    'clinic.view.own',
    'clinic.update.own',
    'doctor.view.clinic',
    'doctor.create',
    'doctor.update.clinic',
    'booking.view.clinic',
    'booking.update.clinic',
  ],
  EDITOR: [
    'doctor.view.all',
    'doctor.update.all',
    'clinic.view.all',
    'clinic.update.all',
    'specialty.create',
    'specialty.update',
  ],
  ADMIN: [
    'user.view.all',
    'user.update.all',
    'user.delete',
    'doctor.manage.all',
    'clinic.manage.all',
    'booking.manage.all',
    'specialty.manage',
    'role.assign',
  ],
  SUPER_ADMIN: [
    'system.full.access',
    'user.manage.all',
    'role.manage',
    'permission.manage',
    'audit.view',
    'system.settings',
  ],
};

// ==================== STORE ====================

export const useUserStore = create<UserStore>()(
  persist(
    immer((set, get) => ({
      // Initial State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) => {
        try {
          // Validate user data with Zod
          const validatedUser = user ? userSchema.parse(user) : null;
          
          set((state) => {
            state.user = validatedUser;
            state.isAuthenticated = !!validatedUser;
          });
        } catch (error) {
          console.error('User validation failed:', error);
          throw new Error('Invalid user data');
        }
      },

      setToken: (token) => {
        set((state) => {
          state.token = token;
        });
      },

      login: (user, token) => {
        try {
          // Validate user data
          const validatedUser = userSchema.parse(user);
          
          set((state) => {
            state.user = validatedUser;
            state.token = token;
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
          console.error('Login validation failed:', error);
          throw new Error('Invalid login credentials');
        }
      },

      logout: () => {
        set((state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.isLoading = false;
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (!currentUser) {
          throw new Error('No user logged in');
        }

        try {
          // Merge and validate updated user data
          const updatedUser = userSchema.parse({
            ...currentUser,
            ...updates,
            updatedAt: new Date().toISOString(),
          });

          set((state) => {
            state.user = updatedUser;
          });
        } catch (error) {
          console.error('User update validation failed:', error);
          throw new Error('Invalid user update data');
        }
      },

      setLoading: (loading) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      hasRole: (roles) => {
        const user = get().user;
        if (!user) return false;
        return roles.includes(user.role);
      },

      hasPermission: (permission) => {
        const user = get().user;
        if (!user) return false;

        const userPermissions = rolePermissions[user.role] || [];
        
        // Super admin has all permissions
        if (user.role === 'SUPER_ADMIN') return true;
        
        // Check if user has the specific permission
        return userPermissions.includes(permission) || userPermissions.includes('system.full.access');
      },
    })),
    {
      name: 'user-storage',
      // Validate data when rehydrating from localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          try {
            // Validate rehydrated user data
            userSchema.parse(state.user);
          } catch (error) {
            console.error('Rehydration validation failed:', error);
            // Reset invalid data
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
          }
        }
      },
    }
  )
);

// ==================== HOOKS ====================

// Check if user is authenticated
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);

// Get current user
export const useCurrentUser = () => useUserStore((state) => state.user);

// Get user token
export const useUserToken = () => useUserStore((state) => state.token);

// Check if user has specific role(s)
export const useHasRole = (roles: User['role'][]) => {
  return useUserStore((state) => state.hasRole(roles));
};

// Check if user has specific permission
export const useHasPermission = (permission: string) => {
  return useUserStore((state) => state.hasPermission(permission));
};
