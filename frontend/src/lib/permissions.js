// Mirrors backend/src/middleware/workspaceMiddleware.js's ROLE_RANK exactly.
// IMPORTANT: this is a UX convenience for hiding/disabling buttons a user
// can't use — it is NEVER a security boundary. The backend re-checks every
// permission on every request regardless of what the frontend shows.
const ROLE_RANK = { viewer: 0, member: 1, admin: 2, owner: 3 };

export function hasRole(currentRole, minRole) {
  if (!currentRole) return false;
  return ROLE_RANK[currentRole] >= ROLE_RANK[minRole];
}

export { ROLE_RANK };
