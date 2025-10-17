import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db/mongoose";
import { Booking, Doctor, Clinic } from "@/app/lib/models";
import { default as Slot } from "@/app/lib/models/Slot";
import { default as Service } from "@/app/lib/models/Service";
import ical from "ical-generator";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    
    const booking = await Booking.findById(id)
      .populate('slotId')
      .populate('doctorId')
      .populate('clinicId')
      .populate('serviceId')
      .lean();
      
    if (!booking) return NextResponse.json({ error: 'not found' }, { status: 404 });

    const slot = booking.slotId as any;
    const service = booking.serviceId as any;
    const clinic = booking.clinicId as any;

    const cal = ical({ name: 'carezone.uz booking' });
    cal.createEvent({
      id: booking.icalUid || booking._id.toString(),
      start: slot?.start || new Date(),
      end: slot?.end || new Date(),
      summary: service?.name ?? 'Uchrashuv',
      description: `Bemor: ${booking.patientName}. Izoh: ${booking.notes ?? ''}`,
      url: `${process.env.NEXTAUTH_URL}/booking/${booking._id}`,
      location: clinic?.address ?? ''
    });

    return new NextResponse(cal.toString(), {
      headers: { 'Content-Type': 'text/calendar; charset=utf-8' }
    });
  } catch (error) {
    console.error('iCal generation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
