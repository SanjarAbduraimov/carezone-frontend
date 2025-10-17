import { connectDB } from "@/app/lib/db/mongoose";
import { Doctor } from "@/app/lib/models";
import { default as Review } from "@/app/lib/models/Review";
import { default as Schedule } from "@/app/lib/models/Schedule";
import { default as Slot } from "@/app/lib/models/Slot";
import { BookingTable } from "@/app/components/BookingTable";
import { DoctorSEO } from "@/app/components/Seo";
import Link from "next/link";

export default async function DoctorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let doctor: any = null;
  let reviews: any[] = [];
  let schedules: any[] = [];
  
  try {
    await connectDB();
    
    doctor = await Doctor.findOne({ slug })
      .populate('clinicId', 'name slug address')
      .populate('specialtyIds', 'name')
      .lean();
    
    if (doctor) {
      // Fetch reviews separately
      reviews = await Review.find({ 
        doctorId: doctor._id, 
        status: 'APPROVED' 
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
      
      // Fetch schedules with slots
      schedules = await Schedule.find({ doctorId: doctor._id })
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
    console.error('Error fetching doctor:', error);
  }
  
  if (!doctor) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Shifokor topilmadi</h1>
        <p className="text-slate-600 mb-6">Kechirasiz, bu shifokor mavjud emas</p>
        <Link href="/doctors" className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
          Shifokorlarga qaytish
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
  
  // Convert clinic from populated object
  const clinic = doctor.clinicId as any;

  return (
    <div className="space-y-8">
      <DoctorSEO
        name={`Dr. ${doctor.firstName} ${doctor.lastName}`}
        description={doctor.bio}
        url={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/doctors/${doctor.slug}`}
        image={doctor.photoUrl}
      />

      {/* Header Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {doctor.photoUrl ? (
            <img 
              src={doctor.photoUrl} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-emerald-100" 
              alt={`${doctor.firstName} ${doctor.lastName}`} 
            />
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-emerald-200">
              <span className="text-emerald-600 font-bold text-3xl md:text-4xl">
                {doctor.firstName[0]}{doctor.lastName[0]}
              </span>
            </div>
          )}
          
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Dr. {doctor.firstName} {doctor.lastName}
              </h1>
              <div className="text-lg text-emerald-600 font-medium mt-1">
                {(doctor.specialtyIds as any[])?.map((s: any) => s.name).join(', ')}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              {doctor.yearsOfExp && (
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>{doctor.yearsOfExp} yil tajriba</span>
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

              {clinic && (
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <Link href={`/clinics/${clinic.slug}`} className="hover:text-emerald-600">
                    {clinic.name}
                  </Link>
                </div>
              )}
            </div>

            {doctor.bio && (
              <p className="text-slate-700 leading-relaxed pt-2">
                {doctor.bio}
              </p>
            )}

            {(doctor.priceMin || doctor.priceMax) && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm font-medium text-slate-700">Narx:</span>
                <span className="text-lg font-semibold text-emerald-600">
                  {doctor.priceMin && doctor.priceMax 
                    ? `${doctor.priceMin.toLocaleString()} - ${doctor.priceMax.toLocaleString()} so'm`
                    : doctor.priceMin 
                    ? `${doctor.priceMin.toLocaleString()} so'mdan`
                    : `${doctor.priceMax?.toLocaleString()} so'mgacha`
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

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
