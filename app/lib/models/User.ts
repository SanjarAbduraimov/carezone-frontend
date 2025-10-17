import mongoose, { Schema, Model, Types } from 'mongoose';
import { UserRole } from '../types/enums';

export interface IUser {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      trim: true,
      index: true
    },
    emailVerified: { type: Date },
    image: { type: String },
    password: { type: String, select: false },
    role: { 
      type: String, 
      enum: Object.values(UserRole), 
      default: UserRole.USER,
      index: true
    },
    isActive: { type: Boolean, default: true, index: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        delete ret.password;
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes
UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ role: 1, isActive: 1 });

// Virtual for doctor profile
UserSchema.virtual('doctor', {
  ref: 'Doctor',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
});

// Virtual for clinic
UserSchema.virtual('clinic', {
  ref: 'Clinic',
  localField: '_id',
  foreignField: 'ownerId',
  justOne: true,
});

export const User: Model<IUser> = 
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
