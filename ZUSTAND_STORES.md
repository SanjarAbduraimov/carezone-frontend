# Zustand State Management Implementation

## 📦 Overview

This document describes the Zustand state management implementation with full Zod validation for the CareZone.uz application.

## 🎯 Goals Achieved

✅ **Complete State Management Solution** with 4 specialized stores
✅ **Full Zod Validation** on every state update and localStorage rehydration
✅ **Type Safety** with TypeScript and Zod inference
✅ **LocalStorage Persistence** for user preferences and drafts
✅ **Senior-Level Code Quality** with comprehensive documentation
✅ **RBAC Implementation** with 6 roles and 20+ permissions
✅ **Immutable Updates** using Immer middleware

## 📁 Store Files Created

### 1. **userStore.ts** - Authentication & RBAC
- **Purpose**: User authentication, authorization, and role-based access control
- **Features**:
  - User login/logout with token management
  - 6 roles: USER, DOCTOR, CLINIC_ADMIN, EDITOR, ADMIN, SUPER_ADMIN
  - 20+ permissions with hierarchical access control
  - Auto-validation of user data on every update
  - LocalStorage persistence with validation on rehydration
- **Key Actions**:
  - `login(user, token)` - Authenticate user and store token
  - `logout()` - Clear user session
  - `updateUser(updates)` - Update user profile with validation
  - `hasRole(roles)` - Check if user has specific role(s)
  - `hasPermission(permission)` - Check if user has specific permission
- **Hooks**:
  - `useIsAuthenticated()` - Check authentication status
  - `useCurrentUser()` - Get current user object
  - `useUserToken()` - Get authentication token
  - `useHasRole(roles)` - Check role access
  - `useHasPermission(permission)` - Check permission access

### 2. **searchStore.ts** - Search Filters & History
- **Purpose**: Manage search filters for doctors/clinics and recent searches
- **Features**:
  - Separate filters for doctor and clinic searches
  - Recent search history with auto-deduplication
  - Price range validation (min <= max)
  - Pagination support
  - LocalStorage persistence
- **Key Actions**:
  - `setDoctorFilters(filters)` - Update doctor search filters
  - `setClinicFilters(filters)` - Update clinic search filters
  - `addRecentSearch(search)` - Add to search history (max 10)
  - `clearDoctorFilters()` / `clearClinicFilters()` - Reset filters
- **Hooks**:
  - `useDoctorFilters()` - Get doctor search filters
  - `useClinicFilters()` - Get clinic search filters
  - `useRecentSearches()` - Get all recent searches
  - `useRecentSearchesByType(type)` - Get searches by type

### 3. **bookingStore.ts** - Booking Draft & History
- **Purpose**: Booking form draft persistence and booking history cache
- **Features**:
  - Auto-save booking form draft to localStorage
  - Validation before submission (required fields check)
  - Booking history cache (max 50 items)
  - Modal state management
  - Patient info persistence
- **Key Actions**:
  - `setDraft(draft)` - Update booking draft
  - `validateDraft()` - Validate draft for submission
  - `isDraftValid()` - Check if draft is valid
  - `addToHistory(item)` - Add completed booking to history
  - `openBookingModal(slotData)` / `closeBookingModal()` - Modal control
- **Hooks**:
  - `useBookingDraft()` - Get current draft
  - `useIsDraftValid()` - Check draft validity
  - `useBookingHistory()` - Get booking history
  - `useIsBookingModalOpen()` - Modal state

### 4. **uiStore.ts** - UI Preferences & Theme
- **Purpose**: UI preferences, theme management, and toast notifications
- **Features**:
  - Theme management (light/dark/system) with auto-apply
  - Locale support (en/uz/ru)
  - Sidebar state and layout preferences
  - Toast notification system with auto-dismiss
  - Mobile menu state
  - LocalStorage persistence for preferences only
- **Key Actions**:
  - `setTheme(theme)` - Set theme with DOM update
  - `setLocale(locale)` - Set locale with HTML lang update
  - `toggleSidebar()` - Toggle sidebar visibility
  - `addToast(toast)` - Show notification (auto-dismiss after duration)
  - `updatePreferences(prefs)` - Update multiple preferences
- **Hooks**:
  - `useTheme()` - Get current theme
  - `useIsDarkMode()` - Check if dark mode is active
  - `useLocale()` - Get current locale
  - `useToasts()` - Get active toasts

### 5. **index.ts** - Unified Exports
- Central export point for all stores
- Type-safe exports with full TypeScript support
- Comprehensive usage examples and documentation

## 🔧 Technical Implementation

### Zod Validation Schema Examples

#### User Schema
```typescript
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email format'),
  name: z.string().optional(),
  role: z.enum(['USER', 'DOCTOR', 'CLINIC_ADMIN', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  isActive: z.boolean().default(true),
});
```

#### Search Filters Schema with Refinement
```typescript
export const searchFiltersSchema = z.object({
  query: z.string().default(''),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
}).refine(
  (data) => {
    if (data.priceMin && data.priceMax) {
      return data.priceMax >= data.priceMin;
    }
    return true;
  },
  { message: 'Max price must be >= min price' }
);
```

### Store Structure Pattern

```typescript
export const useStoreName = create<StoreInterface>()(
  persist(
    immer((set, get) => ({
      // Initial State
      field: defaultValue,

      // Actions with Validation
      setField: (value) => {
        try {
          const validated = schema.parse(value);
          set((state) => {
            state.field = validated;
          });
        } catch (error) {
          console.error('Validation failed:', error);
          throw new Error('Invalid data');
        }
      },
    })),
    {
      name: 'storage-key',
      onRehydrateStorage: () => (state) => {
        // Validate on rehydration
        if (state?.field) {
          try {
            schema.parse(state.field);
          } catch (error) {
            state.field = defaultValue; // Reset on invalid data
          }
        }
      },
    }
  )
);
```

## 📚 Usage Examples

### 1. Authentication Example
```tsx
'use client';

import { useUserStore, useIsAuthenticated, useCurrentUser } from '@/app/store';

export default function ProfilePage() {
  const { login, logout } = useUserStore();
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();

  const handleLogin = async () => {
    try {
      const userData = await api.login(credentials);
      login(userData.user, userData.token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1>Welcome, {user?.name}!</h1>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 2. Search Filters Example
```tsx
'use client';

import { useSearchStore, useDoctorFilters } from '@/app/store';

export default function DoctorSearch() {
  const { setDoctorFilters, clearDoctorFilters } = useSearchStore();
  const filters = useDoctorFilters();

  const handleSearch = (query: string) => {
    setDoctorFilters({ query, page: 1 });
  };

  const handlePriceFilter = (min: number, max: number) => {
    setDoctorFilters({ priceMin: min, priceMax: max });
  };

  return (
    <div>
      <input
        value={filters.query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search doctors..."
      />
      <button onClick={clearDoctorFilters}>Clear Filters</button>
    </div>
  );
}
```

### 3. Booking Draft Example
```tsx
'use client';

import { useBookingStore, useBookingDraft, useIsDraftValid } from '@/app/store';

export default function BookingForm() {
  const { setDraft, validateDraft, clearDraft } = useBookingStore();
  const draft = useBookingDraft();
  const isValid = useIsDraftValid();

  const handleSubmit = async () => {
    const { valid, errors } = validateDraft();
    
    if (!valid) {
      console.error('Validation errors:', errors);
      return;
    }

    try {
      await api.createBooking(draft);
      clearDraft();
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <form>
      <input
        value={draft.patientName || ''}
        onChange={(e) => setDraft({ patientName: e.target.value })}
        placeholder="Your name"
      />
      <button onClick={handleSubmit} disabled={!isValid}>
        Book Appointment
      </button>
    </form>
  );
}
```

### 4. Theme Toggle Example
```tsx
'use client';

import { useUIStore, useTheme, useIsDarkMode } from '@/app/store';

export default function ThemeToggle() {
  const { setTheme, addToast } = useUIStore();
  const theme = useTheme();
  const isDark = useIsDarkMode();

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    
    addToast({
      type: 'success',
      message: `Theme changed to ${newTheme} mode`,
      duration: 2000,
    });
  };

  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
```

## 🔐 RBAC Permission System

### Role Hierarchy
1. **SUPER_ADMIN** - Full system access
2. **ADMIN** - User and content management
3. **EDITOR** - Content editing and moderation
4. **CLINIC_ADMIN** - Clinic and doctor management
5. **DOCTOR** - Own profile and schedule management
6. **USER** - Basic booking and profile access

### Permission Examples
```typescript
// Check permission
const canManageDoctors = useHasPermission('doctor.manage.all');

// Check role
const isAdmin = useHasRole(['ADMIN', 'SUPER_ADMIN']);

// Conditional rendering
{canManageDoctors && <AdminPanel />}
```

## 📦 Packages Added

- **zustand@5.0.8** - Lightweight state management (13.5 kB)
- **immer@10.1.3** - Immutable state updates with mutable-like syntax

## ✅ Benefits

1. **Type Safety**: Full TypeScript + Zod validation
2. **Developer Experience**: Clean API, easy to use, well-documented
3. **Performance**: Minimal re-renders, efficient updates
4. **Persistence**: Auto-save to localStorage with validation
5. **Error Prevention**: Invalid data cannot enter the store
6. **Maintainability**: Clean separation of concerns
7. **Scalability**: Easy to add new stores and actions
8. **Security**: RBAC with granular permissions

## 🚀 Next Steps

1. ✅ Stores created and committed to GitHub
2. ⏳ Integrate stores into existing components
3. ⏳ Replace direct API calls with store actions
4. ⏳ Add loading states and error handling
5. ⏳ Create demo components showcasing store usage
6. ⏳ Add unit tests for stores

## 📖 Documentation

All stores include:
- Comprehensive JSDoc comments
- Type definitions with Zod inference
- Usage examples in comments
- Error handling guidance
- Validation schema documentation

## 🔗 GitHub

**Commit**: `feat: Add Zustand state management with Zod validation`
**Branch**: `genspark_ai_developer`
**Pull Request**: https://github.com/SanjarAbduraimov/carezone-frontend/pull/1

---

**Author**: GenSpark AI Developer  
**Date**: October 17, 2025  
**Status**: ✅ Implemented and Committed
