import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IDoctor {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  firstName: string;
  lastName: string;
  slug: string;
  bio?: string;
  yearsOfExp?: number;
  photoUrl?: string;
  clinicId?: Types.ObjectId;
  specialtyIds: Types.ObjectId[];
  priceMin?: number;
  priceMax?: number;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      index: true 
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    bio: { type: String },
    yearsOfExp: { type: Number, min: 0 },
    photoUrl: { type: String },
    clinicId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Clinic',
      index: true 
    },
    specialtyIds: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Specialty',
      index: true 
    }],
    priceMin: { type: Number, min: 0 },
    priceMax: { type: Number, min: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true, index: true },
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

// Indexes for search and filtering
DoctorSchema.index({ slug: 1 });
DoctorSchema.index({ clinicId: 1, isActive: 1 });
DoctorSchema.index({ specialtyIds: 1, isActive: 1 });
DoctorSchema.index({ firstName: 'text', lastName: 'text', bio: 'text' });

// Virtual for full name
DoctorSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for clinic
DoctorSchema.virtual('clinic', {
  ref: 'Clinic',
  localField: 'clinicId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for specialties
DoctorSchema.virtual('specialties', {
  ref: 'Specialty',
  localField: 'specialtyIds',
  foreignField: '_id',
});

// Virtual for reviews
DoctorSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'doctorId',
});

export const Doctor: Model<IDoctor> = 
  mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
