import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        errors: error.issues.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  // Custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        errors: error.errors,
      },
      { status: error.statusCode }
    );
  }

  // Mongoose validation errors
  if ((error as any).name === 'ValidationError') {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        errors: Object.values((error as any).errors).map((e: any) => ({
          field: e.path,
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  // Mongoose duplicate key error
  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyPattern)[0];
    return NextResponse.json(
      {
        success: false,
        error: `${field} already exists`,
      },
      { status: 409 }
    );
  }

  // Default error
  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    },
    { status: 500 }
  );
}

export function successResponse<T>(data: T, message?: string, statusCode: number = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: statusCode }
  );
}
