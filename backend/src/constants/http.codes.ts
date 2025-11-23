// ────────────────────────────────────────────────
// HTTP STATUS CODES
// ────────────────────────────────────────────────
/**
 * HttpStatus
 *
 * - Centralized mapping of common HTTP status codes used across the API.
 * - Use these constants when building responses to keep status codes consistent and readable.
 *
 * Notes:
 * - 422 is commonly referred to as "Unprocessable Entity"; here it's named UNPROCESSABLE_CONTENT.
 * - Keep this list small — add codes as needed for clarity.
 */

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  UNPROCESSABLE_CONTENT: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];
