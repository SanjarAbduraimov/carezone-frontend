import { NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/db/mongoose';
import { Clinic } from '@/app/lib/models';
import { handleApiError, successResponse, ApiError } from '@/app/lib/middleware/errorHandler';
import { withAuth } from '@/app/lib/middleware/auth';
import { Permission } from '@/app/lib/types/enums';
import { clinicQuerySchema, clinicCreateSchema } from '@/app/lib/validations/clinic';

/**
 * GET /api/clinics - Get paginated list of clinics with filtering
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
    const validatedParams = clinicQuerySchema.parse(queryParams);

    const { search, city, page, limit, sortBy, sortOrder } = validatedParams;

    // Build MongoDB query
    const query: any = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    // Execute queries in parallel for performance
    const [clinics, total] = await Promise.all([
      Clinic.find(query)
        .populate('ownerId', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Clinic.countDocuments(query),
    ]);

    return successResponse({
      data: clinics,
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
 * POST /api/clinics - Create a new clinic with Zod validation
 * Requires CLINIC_WRITE permission
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await withAuth(req, {
      required: true,
      permissions: [Permission.CLINIC_WRITE],
    });

    if (!auth.authorized) {
      throw new ApiError(401, auth.error || 'Unauthorized');
    }

    await connectDB();

    const body = await req.json();
    
    // Validate request body with Zod
    const validatedData = clinicCreateSchema.parse(body);

    // Auto-assign owner if CLINIC_ADMIN role
    const clinicData: any = { ...validatedData };
    if (auth.user.role === 'CLINIC_ADMIN' && !clinicData.ownerId) {
      clinicData.ownerId = auth.user.id;
    }

    const clinic = await Clinic.create(clinicData);
    await clinic.populate('ownerId');

    return successResponse(clinic, 'Clinic created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
