'use client';

import { useState } from 'react';
import {
  useUserStore,
  useSearchStore,
  useBookingStore,
  useUIStore,
  useCurrentUser,
  useIsAuthenticated,
  useDoctorFilters,
  useClinicFilters,
  useRecentSearches,
  useBookingDraft,
  useTheme,
  useToasts,
} from '@/app/store';

export function DemoClient() {
  const [activeTab, setActiveTab] = useState<'user' | 'search' | 'booking' | 'ui'>('user');

  // Store actions
  const userStore = useUserStore();
  const searchStore = useSearchStore();
  const bookingStore = useBookingStore();
  const uiStore = useUIStore();

  // Store state
  const currentUser = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const doctorFilters = useDoctorFilters();
  const clinicFilters = useClinicFilters();
  const recentSearches = useRecentSearches();
  const bookingDraft = useBookingDraft();
  const theme = useTheme();
  const toasts = useToasts();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          🎯 Zustand Store Demo
        </h1>
        <p className="text-emerald-50 text-lg">
          Bu sahifada barcha Zustand store'larni sinab ko'rishingiz mumkin. 
          Har bir tab state management'ning kuchli imkoniyatlarini ko'rsatadi.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex gap-1 p-2">
          {[
            { id: 'user' as const, label: 'User Store', icon: '👤', desc: 'Authentication' },
            { id: 'search' as const, label: 'Search Store', icon: '🔍', desc: 'Filters' },
            { id: 'booking' as const, label: 'Booking Store', icon: '📅', desc: 'Drafts' },
            { id: 'ui' as const, label: 'UI Store', icon: '🎨', desc: 'Theme' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">{tab.icon}</span>
                <div className="hidden md:block text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User Store Tab */}
      {activeTab === 'user' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <span className="text-xl">🔐</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Authentication</h3>
                <p className="text-sm text-slate-500">Login/logout va RBAC</p>
              </div>
            </div>
            <div className="space-y-3">
              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    userStore.login(
                      {
                        id: 'user-' + Date.now(),
                        email: 'admin@carezone.uz',
                        name: 'Admin User',
                        role: 'ADMIN',
                        isActive: true,
                      },
                      'demo-token-' + Date.now()
                    );
                    uiStore.addToast({
                      type: 'success',
                      message: 'Successfully logged in!',
                    });
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 shadow-sm hover:shadow transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🔓</span>
                    <span>Admin sifatida kirish</span>
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    userStore.logout();
                    uiStore.addToast({
                      type: 'info',
                      message: 'Tizimdan muvaffaqiyatli chiqdingiz',
                    });
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-600 shadow-sm hover:shadow transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🚪</span>
                    <span>Chiqish</span>
                  </span>
                </button>
              )}

              {isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      userStore.updateUser({ name: 'Yangilangan Ism' });
                      uiStore.addToast({
                        type: 'success',
                        message: 'Profil yangilandi!',
                      });
                    }}
                    className="w-full px-4 py-3 border-2 border-emerald-200 text-emerald-700 font-medium rounded-lg hover:bg-emerald-50 transition-all"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>✏️</span>
                      <span>Profilni yangilash</span>
                    </span>
                  </button>

                  <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <p className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <span>🛡️</span>
                      <span>RBAC Ruxsatlari</span>
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm p-2 bg-white rounded-lg">
                        <span className="text-slate-700">Shifokor yaratish</span>
                        <span className={`font-semibold ${userStore.hasPermission('doctor.create') ? 'text-emerald-600' : 'text-red-600'}`}>
                          {userStore.hasPermission('doctor.create') ? '✅ Ha' : '❌ Yo\'q'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-white rounded-lg">
                        <span className="text-slate-700">Foydalanuvchilarni boshqarish</span>
                        <span className={`font-semibold ${userStore.hasPermission('user.manage.all') ? 'text-emerald-600' : 'text-red-600'}`}>
                          {userStore.hasPermission('user.manage.all') ? '✅ Ha' : '❌ Yo\'q'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-white rounded-lg">
                        <span className="text-slate-700">Admin huquqi</span>
                        <span className={`font-semibold ${userStore.hasRole(['ADMIN', 'SUPER_ADMIN']) ? 'text-emerald-600' : 'text-red-600'}`}>
                          {userStore.hasRole(['ADMIN', 'SUPER_ADMIN']) ? '✅ Ha' : '❌ Yo\'q'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* State */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Hozirgi Holat</h3>
                <p className="text-sm text-slate-500">Real-time state data</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-xl border border-slate-200">
              <pre className="text-xs text-slate-700 overflow-auto max-h-96 font-mono leading-relaxed">
{JSON.stringify(
  {
    isAuthenticated,
    user: currentUser,
    token: userStore.token?.substring(0, 20) + '...',
  },
  null,
  2
)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Search Store Tab */}
      {activeTab === 'search' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-xl">🔍</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Qidiruv</h3>
                <p className="text-sm text-slate-500">Filter va qidiruv tarixi</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  👨‍⚕️ Shifokorlar qidiruvi
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Kardiolog, Terapevt..."
                  onChange={(e) => searchStore.setDoctorQuery(e.target.value)}
                  defaultValue={doctorFilters.query}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  🏥 Klinikalar qidiruvi
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Toshkent, Samarqand..."
                  onChange={(e) => searchStore.setClinicFilters({ query: e.target.value })}
                  defaultValue={clinicFilters.query}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>

              <button
                onClick={() => {
                  searchStore.addRecentSearch({
                    query: 'Kardiolog',
                    type: 'doctor',
                  });
                  uiStore.addToast({
                    type: 'success',
                    message: 'Qidiruv tarixiga qo\'shildi',
                  });
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>⭐</span>
                  <span>So'nggi qidiruvga qo'shish</span>
                </span>
              </button>

              <button
                onClick={() => {
                  searchStore.clearDoctorFilters();
                  searchStore.clearClinicFilters();
                  uiStore.addToast({ type: 'info', message: 'Barcha filterlar tozalandi' });
                }}
                className="w-full px-4 py-3 border-2 border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🗑️</span>
                  <span>Barcha filterlarni tozalash</span>
                </span>
              </button>
            </div>
          </div>

          {/* State */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Qidiruv Holati</h3>
                <p className="text-sm text-slate-500">Filter va tarix</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                  <span>👨‍⚕️</span>
                  <span>Shifokor Filterlari</span>
                </h4>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
                  <pre className="text-xs text-purple-900 overflow-auto font-mono leading-relaxed">
{JSON.stringify(doctorFilters, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                  <span>⏰</span>
                  <span>So'nggi Qidiruvlar ({recentSearches.length} ta)</span>
                </h4>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 max-h-64 overflow-auto">
                  {recentSearches.length > 0 ? (
                    <pre className="text-xs text-amber-900 font-mono leading-relaxed">
{JSON.stringify(recentSearches, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-amber-700 text-center py-4">
                      Hozircha qidiruvlar yo'q
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Store Tab */}
      {activeTab === 'booking' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Bron Qilish</h3>
                <p className="text-sm text-slate-500">Draft va validatsiya</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  👤 Bemor ismi
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Alisher Navoiy"
                  onChange={(e) => bookingStore.setDraft({ patientName: e.target.value })}
                  defaultValue={bookingDraft.patientName}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  📞 Telefon raqami
                </label>
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  onChange={(e) => bookingStore.setDraft({ patientPhone: e.target.value })}
                  defaultValue={bookingDraft.patientPhone}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  📝 Qo'shimcha izohlar
                </label>
                <textarea
                  placeholder="Kasallik tarixi, shikoyatlar va boshqa ma'lumotlar..."
                  onChange={(e) => bookingStore.setDraft({ notes: e.target.value })}
                  defaultValue={bookingDraft.notes}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors resize-none"
                  rows={4}
                />
              </div>

              <button
                onClick={() => {
                  const { valid, errors } = bookingStore.validateDraft();
                  if (valid) {
                    uiStore.addToast({
                      type: 'success',
                      message: 'Bron ma\'lumotlari to\'g\'ri!',
                    });
                  } else {
                    uiStore.addToast({
                      type: 'error',
                      message: 'Ma\'lumotlarda xatolik bor',
                    });
                  }
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-red-700 shadow-sm hover:shadow transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>✅</span>
                  <span>Tekshirish (Validate)</span>
                </span>
              </button>

              <button
                onClick={() => {
                  bookingStore.clearDraft();
                  uiStore.addToast({ type: 'info', message: 'Draft tozalandi' });
                }}
                className="w-full px-4 py-3 border-2 border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🗑️</span>
                  <span>Draft'ni tozalash</span>
                </span>
              </button>
            </div>
          </div>

          {/* State */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Bron Holati</h3>
                <p className="text-sm text-slate-500">Draft ma'lumotlari</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-xl border border-orange-200">
              <pre className="text-xs text-orange-900 overflow-auto max-h-96 font-mono leading-relaxed">
{JSON.stringify(bookingDraft, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* UI Store Tab */}
      {activeTab === 'ui' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                <span className="text-xl">🎨</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">UI Sozlamalari</h3>
                <p className="text-sm text-slate-500">Mavzu va bildirishnomalar</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  🌓 Mavzu (Theme)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: '☀️ Yorug\'', color: 'from-amber-400 to-orange-400' },
                    { value: 'dark', label: '🌙 Qorong\'i', color: 'from-slate-700 to-slate-900' },
                    { value: 'system', label: '💻 Tizim', color: 'from-blue-400 to-indigo-500' },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => uiStore.setTheme(t.value as any)}
                      className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                        theme === t.value
                          ? `bg-gradient-to-br ${t.color} text-white border-transparent shadow-lg`
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  🌍 Til (Locale)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'uz', label: '🇺🇿 O\'zbek' },
                    { value: 'ru', label: '🇷🇺 Русский' },
                    { value: 'en', label: '🇬🇧 English' },
                  ].map((l) => (
                    <button
                      key={l.value}
                      onClick={() => uiStore.setLocale(l.value as any)}
                      className="px-4 py-3 rounded-xl border-2 border-slate-200 font-medium hover:border-pink-300 hover:bg-pink-50 transition-all"
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t-2">
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  🔔 Toast Bildirishnomalar
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'success', label: '✅ Muvaffaqiyat', color: 'from-emerald-500 to-teal-500' },
                    { type: 'error', label: '❌ Xato', color: 'from-red-500 to-pink-500' },
                    { type: 'warning', label: '⚠️ Ogohlantirish', color: 'from-amber-500 to-orange-500' },
                    { type: 'info', label: 'ℹ️ Ma\'lumot', color: 'from-blue-500 to-indigo-500' },
                  ].map((toast) => (
                    <button
                      key={toast.type}
                      onClick={() =>
                        uiStore.addToast({
                          type: toast.type as any,
                          message: `Bu ${toast.label} xabaridir`,
                          duration: 3000,
                        })
                      }
                      className={`px-4 py-3 bg-gradient-to-r ${toast.color} text-white font-medium rounded-xl hover:shadow-lg transition-all`}
                    >
                      {toast.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => uiStore.toggleSidebar()}
                className="w-full px-4 py-3 border-2 border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>📱</span>
                  <span>Sidebar: {uiStore.preferences.sidebarOpen ? '✅ Ochiq' : '❌ Yopiq'}</span>
                </span>
              </button>
            </div>
          </div>

          {/* State */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">UI Holati</h3>
                <p className="text-sm text-slate-500">Sozlamalar va preferences</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-xl border border-pink-200">
              <pre className="text-xs text-pink-900 overflow-auto max-h-96 font-mono leading-relaxed">
{JSON.stringify(
  {
    theme,
    preferences: uiStore.preferences,
    activeToasts: toasts.length,
  },
  null,
  2
)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl shadow-lg p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">✨</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl text-emerald-900 mb-4">Store Imkoniyatlari</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✅</span>
                <span className="text-sm text-emerald-800 font-medium">
                  Har bir state yangilanishda to'liq Zod validatsiyasi
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✅</span>
                <span className="text-sm text-emerald-800 font-medium">
                  LocalStorage persistence (sahifani yangilang!)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✅</span>
                <span className="text-sm text-emerald-800 font-medium">
                  TypeScript bilan to'liq type-safety
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✅</span>
                <span className="text-sm text-emerald-800 font-medium">
                  Immer bilan immutable yangilanishlar
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✅</span>
                <span className="text-sm text-emerald-800 font-medium">
                  6 ta rol va 20+ ruxsat bilan RBAC
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✅</span>
                <span className="text-sm text-emerald-800 font-medium">
                  Rehydration paytida avtomatik validatsiya
                </span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-xl border border-emerald-200">
              <p className="text-sm text-emerald-900">
                <span className="font-bold">💡 Maslahat:</span> Har bir tab'da state o'zgarishlarini kuzating va 
                sahifani yangilang - ma'lumotlar saqlanib qoladi!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
