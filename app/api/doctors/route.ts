import { NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/db/mongoose';
import { Doctor } from '@/app/lib/models';
import { handleApiError, successResponse, ApiError } from '@/app/lib/middleware/errorHandler';
import { withAuth } from '@/app/lib/middleware/auth';
import { Permission } from '@/app/lib/types/enums';
import { doctorQuerySchema, doctorCreateSchema } from '@/app/lib/validations/doctor';

/**
 * GET /api/doctors - Get paginated list of doctors with filtering
 * Query params validated with Zod
 */
export async function GET(req: NextRequest) {
  try {
    // Try to connect to MongoDB
    try {
      await connectDB();
    } catch (dbError) {
      console.error('MongoDB connection failed:', dbError);
      // Return empty result if DB is not available
      return successResponse({
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      });
    }

    // Parse and validate query params with Zod
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validatedParams = doctorQuerySchema.parse(queryParams);

    const { search, clinicId, specialtyId, page, limit, sortBy, sortOrder } = validatedParams;

    // Build MongoDB query
    const query: any = { isActive: true };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    if (clinicId) {
      query.clinicId = clinicId;
    }

    if (specialtyId) {
      query.specialtyIds = specialtyId;
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    // Execute queries in parallel for performance
    const [doctors, total] = await Promise.all([
      Doctor.find(query)
        .populate('specialtyIds', 'name slug')
        .populate('clinicId', 'name slug address phone')
        .populate('userId', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Doctor.countDocuments(query),
    ]);

    return successResponse({
      data: doctors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/doctors - Create a new doctor with Zod validation
 * Requires DOCTOR_WRITE permission
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await withAuth(req, {
      required: true,
      permissions: [Permission.DOCTOR_WRITE],
    });

    if (!auth.authorized) {
      throw new ApiError(401, auth.error || 'Unauthorized');
    }

    await connectDB();

    const body = await req.json();
    
    // Validate request body with Zod
    const validatedData = doctorCreateSchema.parse(body);

    // Auto-assign user if DOCTOR role
    const doctorData: any = { ...validatedData };
    if (auth.user.role === 'DOCTOR' && !doctorData.userId) {
      doctorData.userId = auth.user.id;
    }

    const doctor = await Doctor.create(doctorData);
    await doctor.populate('specialtyIds clinicId userId');

    return successResponse(doctor, 'Doctor created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
