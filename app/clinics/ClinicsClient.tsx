'use client';

import Link from "next/link";
import { useClinics } from "@/app/hooks/useClinics";
import { useEffect } from "react";
import { IClinic } from "@/app/lib/models";
import { PaginatedResponse } from "@/app/services/apiClient";
import { useSearchStore, useClinicFilters } from "@/app/store";

interface ClinicsClientProps {
  initialSearch?: string;
  initialCity?: string;
}

export function ClinicsClient({ initialSearch = '', initialCity = '' }: ClinicsClientProps) {
  // Use Zustand store for filters
  const { setClinicFilters, clearClinicFilters, addRecentSearch } = useSearchStore();
  const filters = useClinicFilters();
  
  // Initialize with URL params on mount
  useEffect(() => {
    if (initialSearch && initialSearch !== filters.query) {
      setClinicFilters({ query: initialSearch });
    }
    if (initialCity && initialCity !== filters.city) {
      setClinicFilters({ city: initialCity });
    }
  }, [initialSearch, initialCity, setClinicFilters, filters.query, filters.city]);
  
  // Use TanStack Query hook with store filters
  const { data, isLoading, isError, error } = useClinics({
    search: filters.query,
    city: filters.city,
    page: filters.page,
    limit: filters.limit,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('search') as string;
    const city = formData.get('city') as string;
    
    setClinicFilters({ 
      query: query || '', 
      city: city || '',
      page: 1 
    });
    
    // Add to recent searches
    if (query?.trim()) {
      addRecentSearch({
        query: query.trim(),
        type: 'clinic',
      });
    }
  };

  // Type-safe data extraction
  const clinics: IClinic[] = data?.data || [];
  const total: number = data?.pagination?.total || 0;

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl p-8 md:p-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <span className="text-2xl">🏥</span>
            <span className="text-sm font-semibold text-white">Tibbiy markazlar katalogi</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Eng yaxshi klinikalar
          </h1>
          <p className="text-xl text-blue-50 max-w-2xl">
            O&apos;zbekistonda zamonaviy tibbiy markazlar va klinikalarni toping
          </p>
          {total > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg">
              <span className="text-2xl font-bold text-blue-600">{total}</span>
              <span className="text-slate-600 font-medium">ta klinika topildi</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Form - Modern Design */}
      <form onSubmit={handleSearch} className="relative">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-100 p-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg 
                  className="w-5 h-5 text-blue-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                name="search"
                defaultValue={filters.query}
                placeholder="Klinika nomi yoki manzil..." 
                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all" 
              />
            </div>
            <div className="relative min-w-[180px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input 
                name="city"
                defaultValue={filters.city}
                placeholder="Shahar" 
                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all" 
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                {isLoading ? '⏳' : '🔍'}
                <span>{isLoading ? 'Qidirilmoqda...' : 'Qidirish'}</span>
              </span>
            </button>
            {(filters.query || filters.city) && (
              <button 
                type="button"
                onClick={clearClinicFilters}
                className="px-6 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-all"
              >
                <span className="flex items-center gap-2">
                  <span>🗑️</span>
                  <span>Tozalash</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 mt-4">Yuklanmoqda...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Xatolik yuz berdi: {error instanceof Error ? error.message : 'Noma\'lum xatolik'}
          </p>
        </div>
      )}

      {/* Results */}
      {!isLoading && !isError && (
        <>
          {clinics.length > 0 ? (
            <>
              <div className="text-sm text-slate-600">
                {total} ta tibbiy markaz topildi
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {clinics.map((c) => (
                  <Link 
                    key={c._id || c.id} 
                    href={`/clinics/${c.slug}`} 
                    className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 border-2 border-slate-100 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300"></div>
                    
                    <div className="relative flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        {c.logoUrl ? (
                          <img 
                            src={c.logoUrl} 
                            alt={c.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-200 shadow-md"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
                            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {c.name}
                          </h3>
                          {c.city && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold mt-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {c.city}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {c.address && (
                          <div className="flex items-start gap-2 text-sm text-slate-600">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span className="line-clamp-2 font-medium pt-1">{c.address}</span>
                          </div>
                        )}
                        {c.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <span className="font-medium">{c.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:text-blue-700">
                          <span>Batafsil ko&apos;rish</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-slate-200 p-12">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full translate-y-16 -translate-x-16"></div>
              <div className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Tibbiy markaz topilmadi</h3>
                <p className="text-slate-600">Boshqa kalit so&apos;zlar bilan qidirib ko&apos;ring yoki filtrlarni o&apos;zgartiring</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
