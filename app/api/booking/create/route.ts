import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db/mongoose";
import { Booking } from "@/app/lib/models";
import { default as Slot } from "@/app/lib/models/Slot";
import { BookingStatus } from "@/app/lib/types/enums";
import { bookingCreateSchema } from "@/app/lib/validations/booking";
import { handleApiError, successResponse, ApiError } from "@/app/lib/middleware/errorHandler";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const json = await req.json();
    
    // Validate with Zod
    const validatedData = bookingCreateSchema.parse(json);
    
    const { slotId, patientName, patientPhone, patientEmail, notes } = validatedData;

    // Check slot availability
    const slot = await Slot.findById(slotId);
    if (!slot || slot.available < 1) {
      throw new ApiError(400, 'Vaqt band yoki mavjud emas');
    }

    // Create booking and update slot in a transaction-like manner
    const session = await mongoose.startSession();
    let booking;
    
    try {
      await session.withTransaction(async () => {
        // Create booking
        booking = await Booking.create([{
          slotId: slot._id,
          doctorId: slot.doctorId,
          clinicId: slot.clinicId,
          patientName,
          patientPhone,
          patientEmail,
          notes,
          status: BookingStatus.CONFIRMED,
          emailToken: patientEmail ? crypto.randomUUID() : undefined,
          icalUid: crypto.randomUUID(),
        }], { session });

        // Update slot availability
        await Slot.findByIdAndUpdate(
          slotId,
          { $inc: { available: -1 } },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    // TODO: Email notification will be added later
    // TODO: SMS notification will be added later

    return successResponse(
      {
        bookingId: booking?.[0]?._id.toString(),
        booking: booking?.[0],
      },
      'Bron muvaffaqiyatli yaratildi!',
      201
    );
    
  } catch (error) {
    return handleApiError(error);
  }
}
