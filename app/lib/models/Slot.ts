import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISlot extends Document {
  start: Date;
  end: Date;
  available: number;
  total: number;
  scheduleId?: mongoose.Types.ObjectId;
  doctorId?: mongoose.Types.ObjectId;
  clinicId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema = new Schema<ISlot>(
  {
    start: {
      type: Date,
      required: true,
      index: true,
    },
    end: {
      type: Date,
      required: true,
      index: true,
    },
    available: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: 'Schedule',
      index: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      index: true,
    },
    clinicId: {
      type: Schema.Types.ObjectId,
      ref: 'Clinic',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
SlotSchema.index({ doctorId: 1, start: 1 });
SlotSchema.index({ clinicId: 1, start: 1 });
SlotSchema.index({ available: 1, start: 1 });

const Slot: Model<ISlot> = mongoose.models.Slot || mongoose.model<ISlot>('Slot', SlotSchema);

export default Slot;
