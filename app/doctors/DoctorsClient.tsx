'use client';

import Link from "next/link";
import { useDoctors } from "@/app/hooks/useDoctors";
import { useEffect } from "react";
import { IDoctor } from "@/app/lib/models";
import { PaginatedResponse } from "@/app/services/apiClient";
import { useSearchStore, useDoctorFilters } from "@/app/store";

interface DoctorsClientProps {
  initialSearch?: string;
}

export function DoctorsClient({ initialSearch = '' }: DoctorsClientProps) {
  // Use Zustand store for filters
  const { setDoctorQuery, clearDoctorFilters, addRecentSearch } = useSearchStore();
  const filters = useDoctorFilters();
  
  // Initialize with URL search param on mount
  useEffect(() => {
    if (initialSearch && initialSearch !== filters.query) {
      setDoctorQuery(initialSearch);
    }
  }, [initialSearch, setDoctorQuery, filters.query]);
  
  // Use TanStack Query hook with store filters
  const { data, isLoading, isError, error } = useDoctors({
    search: filters.query,
    page: filters.page,
    limit: filters.limit,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = (e.target as any).search.value;
    setDoctorQuery(query);
    
    // Add to recent searches
    if (query.trim()) {
      addRecentSearch({
        query: query.trim(),
        type: 'doctor',
      });
    }
  };

  // Type-safe data extraction
  const doctors: IDoctor[] = data?.data || [];
  const total: number = data?.pagination?.total || 0;

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-xl p-8 md:p-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <span className="text-2xl">👨‍⚕️</span>
            <span className="text-sm font-semibold text-white">Shifokorlar katalogi</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Eng yaxshi shifokorlar
          </h1>
          <p className="text-xl text-emerald-50 max-w-2xl">
            O&apos;zbekistonda eng malakali shifokorlarni toping va onlayn bron qiling
          </p>
          {total > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg">
              <span className="text-2xl font-bold text-emerald-600">{total}</span>
              <span className="text-slate-600 font-medium">ta shifokor topildi</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Form - Modern Design */}
      <form onSubmit={handleSearch} className="relative">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-100 p-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[280px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg 
                  className="w-5 h-5 text-emerald-500" 
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
                placeholder="Shifokor ismi yoki mutaxassislik..." 
                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium transition-all" 
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                {isLoading ? '⏳' : '🔍'}
                <span>{isLoading ? 'Qidirilmoqda...' : 'Qidirish'}</span>
              </span>
            </button>
            {filters.query && (
              <button 
                type="button"
                onClick={clearDoctorFilters}
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
          {doctors.length > 0 ? (
            <>
              <div className="text-sm text-slate-600">
                {total} ta shifokor topildi
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {doctors.map((d) => (
                  <Link 
                    key={d._id || d.id} 
                    href={`/doctors/${d.slug}`} 
                    className="group relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/30 border-2 border-slate-100 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300"></div>
                    
                    <div className="relative flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        {d.photoUrl ? (
                          <img 
                            src={d.photoUrl} 
                            alt={`Dr. ${d.firstName} ${d.lastName}`}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-200 shadow-md"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-xl">
                              {d.firstName[0]}{d.lastName[0]}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                            Dr. {d.firstName} {d.lastName}
                          </h3>
                          {d.specialtyIds && d.specialtyIds.length > 0 && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold mt-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Mutaxassislik
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {d.clinicId && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <span className="font-medium">Klinika</span>
                          </div>
                        )}
                        {d.yearsOfExp && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                            </div>
                            <span className="font-medium">{d.yearsOfExp} yil tajriba</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm group-hover:text-emerald-700">
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
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl border-2 border-dashed border-slate-200 p-12">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full translate-y-16 -translate-x-16"></div>
              <div className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Shifokor topilmadi</h3>
                <p className="text-slate-600">Boshqa kalit so&apos;zlar bilan qidirib ko&apos;ring yoki filtrlarni o&apos;zgartiring</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
