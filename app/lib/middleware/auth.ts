import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { UserRole, Permission, hasPermission, hasAnyPermission } from '../types/enums';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
  };
}

export interface AuthOptions {
  required?: boolean;
  roles?: UserRole[];
  permissions?: Permission[];
  requireAll?: boolean; // For permissions: true = AND, false = OR
}

/**
 * Authentication middleware helper
 */
export async function withAuth(
  req: NextRequest,
  options: AuthOptions = { required: true }
): Promise<{ authorized: boolean; user?: any; error?: string }> {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      if (options.required) {
        return { authorized: false, error: 'Authentication required' };
      }
      return { authorized: true };
    }

    const user = session.user as any;

    // Check roles
    if (options.roles && options.roles.length > 0) {
      if (!options.roles.includes(user.role)) {
        return { authorized: false, error: 'Insufficient permissions' };
      }
    }

    // Check permissions
    if (options.permissions && options.permissions.length > 0) {
      const hasRequiredPermissions = options.requireAll
        ? options.permissions.every(p => hasPermission(user.role, p))
        : hasAnyPermission(user.role, options.permissions);

      if (!hasRequiredPermissions) {
        return { authorized: false, error: 'Insufficient permissions' };
      }
    }

    return { authorized: true, user };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return { authorized: false, error: 'Authentication failed' };
  }
}

/**
 * Check if user has specific permission
 */
export function checkPermission(userRole: UserRole, permission: Permission): boolean {
  return hasPermission(userRole, permission);
}

/**
 * Check if user has any of the permissions
 */
export function checkAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return hasAnyPermission(userRole, permissions);
}

/**
 * Authorization error response
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  );
}

/**
 * Forbidden error response
 */
export function forbiddenResponse(message: string = 'Forbidden') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 }
  );
}
