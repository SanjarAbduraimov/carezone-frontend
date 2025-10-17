import { connectDB } from "@/app/lib/db/mongoose";
import { Clinic, Doctor } from "@/app/lib/models";
import { default as Review } from "@/app/lib/models/Review";
import { default as Schedule } from "@/app/lib/models/Schedule";
import { default as Slot } from "@/app/lib/models/Slot";
import { BookingTable } from "@/app/components/BookingTable";
import { ClinicSEO } from "@/app/components/Seo";
import Link from "next/link";

export default async function ClinicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let clinic: any = null;
  let doctors: any[] = [];
  let reviews: any[] = [];
  let schedules: any[] = [];
  
  try {
    await connectDB();
    
    clinic = await Clinic.findOne({ slug })
      .lean();
    
    if (clinic) {
      // Fetch doctors
      doctors = await Doctor.find({ clinicId: clinic._id })
        .populate('specialtyIds', 'name')
        .lean();
      
      // Fetch reviews
      reviews = await Review.find({ 
        clinicId: clinic._id, 
        status: 'APPROVED' 
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
      
      // Fetch schedules with slots
      schedules = await Schedule.find({ clinicId: clinic._id })
        .lean();
      
      // Fetch slots for these schedules
      const scheduleIds = schedules.map(s => s._id);
      const slots = await Slot.find({ scheduleId: { $in: scheduleIds } })
        .lean();
      
      // Attach slots to schedules
      schedules = schedules.map(schedule => ({
        ...schedule,
        slots: slots.filter(slot => slot.scheduleId?.toString() === schedule._id.toString())
      }));
    }
  } catch (error) {
    console.error('Error fetching clinic:', error);
  }
  
  if (!clinic) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Klinika topilmadi</h1>
        <p className="text-slate-600 mb-6">Kechirasiz, bu klinika mavjud emas</p>
        <Link href="/clinics" className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
          Klinikalarga qaytish
        </Link>
      </div>
    );
  }

  const slots = schedules
    .flatMap((s: any) => s.slots || [])
    .filter((s: any) => s.available > 0 && new Date(s.start) > new Date())
    .map((s: any) => ({ 
      id: s._id.toString(), 
      start: new Date(s.start).toISOString(), 
      end: new Date(s.end).toISOString(), 
      available: s.available 
    }));

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-8">
      <ClinicSEO
        name={clinic.name}
        description={clinic.description}
        url={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/clinics/${clinic.slug}`}
        logo={clinic.logoUrl}
        telephone={clinic.phone}
        address={clinic.address}
      />

      {/* Header Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {clinic.logoUrl ? (
            <img 
              src={clinic.logoUrl} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover border-4 border-emerald-100" 
              alt={clinic.name} 
            />
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-emerald-100 flex items-center justify-center border-4 border-emerald-200">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
          
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {clinic.name}
              </h1>
              {clinic.city && (
                <div className="text-lg text-emerald-600 font-medium mt-1">
                  {clinic.city}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              {doctors.length > 0 && (
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{doctors.length} ta shifokor</span>
                </div>
              )}

              {avgRating && (
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>{avgRating} ({reviews.length} sharh)</span>
                </div>
              )}
            </div>

            {clinic.description && (
              <p className="text-slate-700 leading-relaxed pt-2">
                {clinic.description}
              </p>
            )}

            <div className="grid gap-3 pt-2">
              {clinic.address && (
                <div className="flex items-start gap-2 text-slate-700">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{clinic.address}</span>
                </div>
              )}

              {clinic.phone && (
                <div className="flex items-center gap-2 text-slate-700">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${clinic.phone}`} className="hover:text-emerald-600">
                    {clinic.phone}
                  </a>
                </div>
              )}

              {clinic.website && (
                <div className="flex items-center gap-2 text-slate-700">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600">
                    {clinic.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Section */}
      {doctors.length > 0 && (
        <section className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Shifokorlar</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {doctors.map((d: any) => (
              <Link 
                key={d._id.toString()} 
                href={`/doctors/${d.slug}`}
                className="border border-slate-200 rounded-lg p-4 hover:border-emerald-500 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  {d.photoUrl ? (
                    <img 
                      src={d.photoUrl} 
                      alt={`Dr. ${d.firstName} ${d.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold">
                        {d.firstName[0]}{d.lastName[0]}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      Dr. {d.firstName} {d.lastName}
                    </h3>
                    <p className="text-sm text-emerald-600">
                      {(d.specialtyIds as any[])?.map((s: any) => s.name).join(', ')}
                    </p>
                    {d.yearsOfExp && (
                      <p className="text-sm text-slate-500 mt-1">
                        {d.yearsOfExp} yil tajriba
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Booking Section */}
      <section className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Mavjud vaqtlar</h2>
        {slots.length > 0 ? (
          <BookingTable slots={slots} />
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg">
            <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-600">Hozirda mavjud vaqtlar yo&apos;q</p>
          </div>
        )}
      </section>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Bemorlar sharhlari
            {avgRating && (
              <span className="text-lg font-normal text-slate-600 ml-2">
                ({avgRating} ⭐)
              </span>
            )}
          </h2>
          <div className="space-y-4">
            {reviews.map((r: any) => (
              <div key={r._id.toString()} className="border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < r.rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`} 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-semibold text-slate-900">{r.rating}/5</span>
                </div>
                {r.comment && (
                  <p className="text-slate-700">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
