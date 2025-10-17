import mongoose, { Schema, Model, Types } from 'mongoose';
import { BookingStatus } from '../types/enums';

export interface IBooking {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  doctorId?: Types.ObjectId;
  clinicId?: Types.ObjectId;
  slotId: Types.ObjectId;
  serviceId?: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  notes?: string;
  emailConfirmed: boolean;
  smsConfirmed: boolean;
  emailToken?: string;
  icalUid?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    patientName: { type: String, required: true, trim: true },
    patientPhone: { type: String, required: true, trim: true },
    patientEmail: { type: String, lowercase: true, trim: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', index: true },
    clinicId: { type: Schema.Types.ObjectId, ref: 'Clinic', index: true },
    slotId: { type: Schema.Types.ObjectId, required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true, index: true },
    status: { 
      type: String, 
      enum: Object.values(BookingStatus), 
      default: BookingStatus.PENDING,
      index: true 
    },
    notes: { type: String },
    emailConfirmed: { type: Boolean, default: false },
    smsConfirmed: { type: Boolean, default: false },
    emailToken: { type: String },
    icalUid: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

BookingSchema.index({ startTime: 1, status: 1 });
BookingSchema.index({ doctorId: 1, startTime: 1 });
BookingSchema.index({ clinicId: 1, startTime: 1 });

export const Booking: Model<IBooking> = 
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
