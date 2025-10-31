import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db/mongoose";
import { Booking } from "@/app/lib/models";
import { BookingStatus } from "@/app/lib/types/enums";

// Simple email confirmation endpoint
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const token = new URL(req.url).searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Token topilmadi' }, { status: 400 });
    }
    
    const booking = await Booking.findOne({ emailToken: token });
    
    if (!booking) {
      return NextResponse.json({ error: 'Bron topilmadi' }, { status: 404 });
    }
    
    // Update booking confirmation status
    booking.emailConfirmed = true;
    booking.status = BookingStatus.CONFIRMED;
    await booking.save();
    
    return NextResponse.json({ 
      success: true,
      message: "Email tasdiqlandi!" 
    });
    
  } catch (error) {
    console.error("Email tasdiqlash xatolik:", error);
    return NextResponse.json({ error: "Server xatolik" }, { status: 500 });
  }
}
