export enum UserRole {
  USER = 'USER',
  DOCTOR = 'DOCTOR',
  CLINIC_ADMIN = 'CLINIC_ADMIN',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum Permission {
  // User permissions
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  USER_DELETE = 'user:delete',
  
  // Doctor permissions
  DOCTOR_READ = 'doctor:read',
  DOCTOR_WRITE = 'doctor:write',
  DOCTOR_DELETE = 'doctor:delete',
  DOCTOR_MANAGE_OWN = 'doctor:manage_own',
  
  // Clinic permissions
  CLINIC_READ = 'clinic:read',
  CLINIC_WRITE = 'clinic:write',
  CLINIC_DELETE = 'clinic:delete',
  CLINIC_MANAGE_OWN = 'clinic:manage_own',
  
  // Booking permissions
  BOOKING_READ = 'booking:read',
  BOOKING_WRITE = 'booking:write',
  BOOKING_DELETE = 'booking:delete',
  BOOKING_MANAGE_OWN = 'booking:manage_own',
  
  // Review permissions
  REVIEW_READ = 'review:read',
  REVIEW_WRITE = 'review:write',
  REVIEW_DELETE = 'review:delete',
  REVIEW_APPROVE = 'review:approve',
  
  // Blog permissions
  BLOG_READ = 'blog:read',
  BLOG_WRITE = 'blog:write',
  BLOG_DELETE = 'blog:delete',
  BLOG_PUBLISH = 'blog:publish',
  
  // Admin permissions
  ADMIN_ACCESS = 'admin:access',
  ADMIN_FULL = 'admin:full',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Role to permissions mapping
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.USER_READ,
    Permission.DOCTOR_READ,
    Permission.CLINIC_READ,
    Permission.BOOKING_READ,
    Permission.BOOKING_WRITE,
    Permission.BOOKING_MANAGE_OWN,
    Permission.REVIEW_READ,
    Permission.REVIEW_WRITE,
    Permission.BLOG_READ,
  ],
  [UserRole.DOCTOR]: [
    Permission.USER_READ,
    Permission.DOCTOR_READ,
    Permission.DOCTOR_MANAGE_OWN,
    Permission.CLINIC_READ,
    Permission.BOOKING_READ,
    Permission.BOOKING_MANAGE_OWN,
    Permission.REVIEW_READ,
    Permission.BLOG_READ,
  ],
  [UserRole.CLINIC_ADMIN]: [
    Permission.USER_READ,
    Permission.DOCTOR_READ,
    Permission.DOCTOR_WRITE,
    Permission.CLINIC_READ,
    Permission.CLINIC_MANAGE_OWN,
    Permission.BOOKING_READ,
    Permission.BOOKING_WRITE,
    Permission.BOOKING_MANAGE_OWN,
    Permission.REVIEW_READ,
    Permission.REVIEW_APPROVE,
    Permission.BLOG_READ,
  ],
  [UserRole.EDITOR]: [
    Permission.USER_READ,
    Permission.DOCTOR_READ,
    Permission.DOCTOR_WRITE,
    Permission.CLINIC_READ,
    Permission.CLINIC_WRITE,
    Permission.BOOKING_READ,
    Permission.REVIEW_READ,
    Permission.REVIEW_APPROVE,
    Permission.BLOG_READ,
    Permission.BLOG_WRITE,
    Permission.BLOG_PUBLISH,
  ],
  [UserRole.ADMIN]: [
    ...Object.values(Permission).filter(p => !p.includes('admin:full')),
    Permission.ADMIN_ACCESS,
  ],
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
};

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return RolePermissions[userRole]?.includes(permission) || false;
}

export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(userRole, p));
}

export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(userRole, p));
}
