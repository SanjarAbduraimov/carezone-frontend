import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IClinic {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  locationLat?: number;
  locationLng?: number;
  logoUrl?: string;
  coverUrl?: string;
  ownerId?: Types.ObjectId;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClinicSchema = new Schema<IClinic>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    phone: { type: String },
    email: { type: String, lowercase: true },
    website: { type: String },
    address: { type: String },
    city: { type: String, index: true },
    locationLat: { type: Number },
    locationLng: { type: Number },
    logoUrl: { type: String },
    coverUrl: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
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

ClinicSchema.index({ name: 'text', description: 'text', address: 'text' });
ClinicSchema.index({ city: 1, isActive: 1 });

ClinicSchema.virtual('doctors', {
  ref: 'Doctor',
  localField: '_id',
  foreignField: 'clinicId',
});

export const Clinic: Model<IClinic> = 
  mongoose.models.Clinic || mongoose.model<IClinic>('Clinic', ClinicSchema);
