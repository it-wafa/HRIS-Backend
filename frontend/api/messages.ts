// ============================================
// CENTRALIZED MESSAGE MAPPING
// ============================================
// Maps raw backend error/success messages to
// user-friendly English wording.
// ============================================

/** Friendly error messages keyed by exact backend message */
const ERROR_MAP: Record<string, string> = {
  // ── Token ──
  "Invalid token": "Your session is invalid. Please sign in again.",
  "Expired token": "Your session has expired. Please sign in again.",

  // ── User ──
  "User not found": "No account found with this email address.",

  // ── Login ──
  "Invalid password": "Incorrect password. Please try again.",
};

/** Friendly success messages keyed by context */
export const SUCCESS_MESSAGES = {
  loginSuccess: "Welcome back!",
  logoutSuccess: "You have been signed out.",
} as const;

/**
 * Resolve a backend error message to a user-friendly string.
 * Returns the mapped message if found, otherwise the original.
 */
export function resolveErrorMessage(
  backendMessage: string | undefined,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!backendMessage) return fallback;
  return ERROR_MAP[backendMessage] ?? backendMessage;
}
