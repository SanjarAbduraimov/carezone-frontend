import { NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/db/mongoose';
import { Doctor } from '@/app/lib/models';
import { handleApiError, successResponse, ApiError } from '@/app/lib/middleware/errorHandler';
import { withAuth } from '@/app/lib/middleware/auth';
import { Permission } from '@/app/lib/types/enums';

/**
 * GET /api/doctors/[slug] - Get doctor by slug
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const doctor = await Doctor.findOne({ slug, isActive: true })
      .populate('specialtyIds', 'name slug')
      .populate('clinicId', 'name slug address phone')
      .populate('userId', 'name email')
      .lean();

    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }

    return successResponse(doctor);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/doctors/[slug] - Update doctor
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await withAuth(req, {
      required: true,
      permissions: [Permission.DOCTOR_WRITE, Permission.DOCTOR_MANAGE_OWN],
    });

    if (!auth.authorized) {
      throw new ApiError(401, auth.error || 'Unauthorized');
    }

    await connectDB();

    const body = await req.json();
    const { slug } = await params;

    const doctor = await Doctor.findOne({ slug });

    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }

    // Check ownership for non-admin users
    if (auth.user.role !== 'ADMIN' && doctor.userId?.toString() !== auth.user.id) {
      throw new ApiError(403, 'You can only update your own profile');
    }

    Object.assign(doctor, body);
    await doctor.save();

    await doctor.populate('specialtyIds clinicId userId');

    return successResponse(doctor, 'Doctor updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/doctors/[slug] - Delete doctor (soft delete)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await withAuth(req, {
      required: true,
      permissions: [Permission.DOCTOR_DELETE],
    });

    if (!auth.authorized) {
      throw new ApiError(401, auth.error || 'Unauthorized');
    }

    await connectDB();
    const { slug } = await params;

    const doctor = await Doctor.findOne({ slug });

    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }

    doctor.isActive = false;
    await doctor.save();

    return successResponse(null, 'Doctor deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
