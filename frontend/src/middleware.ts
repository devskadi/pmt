/* Next.js Middleware
 * ------------------
 * Runs on the Edge Runtime before every request.
 *
 * Responsibilities:
 * - Auth guard: redirect unauthenticated users to /login
 * - Role-based route protection (e.g., /admin → ADMIN only)
 * - Redirect authenticated users away from /login, /register
 *
 * Config: matcher array limits execution to relevant paths.
 *
 * Placeholder — implementation pending.
 */
