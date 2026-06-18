const VISITOR_PERMISSIONS = [
  'visitor:create',
  'visitor:read',
  'visitor:update',
  'visitor:delete',
  'visit_request:create',
  'visit_request:read',
  'visit_request:checkin',
  'visit_request:checkout',
] as const;

export function hasVisitorPortalAccess(permissions: string[]): boolean {
  return permissions.some(permission =>
    VISITOR_PERMISSIONS.includes(
      permission as (typeof VISITOR_PERMISSIONS)[number],
    ),
  );
}

export function canCreateVisitor(permissions: string[]): boolean {
  return permissions.includes('visitor:create');
}

export function canReadVisitors(permissions: string[]): boolean {
  return permissions.includes('visitor:read');
}

export function canViewVisitorList(permissions: string[]): boolean {
  return (
    permissions.includes('visitor:read') ||
    permissions.includes('visit_request:read') ||
    permissions.includes('visit_request:create')
  );
}

export function canCheckInVisitor(permissions: string[]): boolean {
  return permissions.includes('visit_request:checkin');
}

export function canCheckOutVisitor(permissions: string[]): boolean {
  return permissions.includes('visit_request:checkout');
}
