'use client';

import { useUserStore, useIsAuthenticated, useCurrentUser } from '@/app/store';
import { useUIStore } from '@/app/store';

export function AuthButton() {
  const { login, logout } = useUserStore();
  const { addToast } = useUIStore();
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();

  const handleLogin = () => {
    // Demo login with mock user
    const mockUser = {
      id: 'user-' + Date.now(),
      email: 'demo@carezone.uz',
      name: 'Demo Foydalanuvchi',
      role: 'USER' as const,
      isActive: true,
    };
    
    const mockToken = 'demo-token-' + Date.now();
    
    login(mockUser, mockToken);
    
    addToast({
      type: 'success',
      message: `Xush kelibsiz, ${mockUser.name}!`,
      duration: 3000,
    });
  };

  const handleLogout = () => {
    logout();
    
    addToast({
      type: 'info',
      message: 'Tizimdan chiqdingiz',
      duration: 2000,
    });
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-200">
            <span className="text-emerald-600 font-semibold text-sm">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Chiqish
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
    >
      Kirish
    </button>
  );
}
