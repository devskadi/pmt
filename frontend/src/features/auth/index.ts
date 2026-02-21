/* Auth Feature Module
 * ====================
 * Self-contained: components, hooks, schemas.
 * Each feature folder follows the same convention:
 *   components/  — Feature-specific UI
 *   hooks/       — Feature-specific React hooks
 *   schemas/     — Zod validation schemas
 *   types/       — Feature-specific TypeScript types
 */
export { default as LoginForm } from "./components/login-form";
export { default as RegisterForm } from "./components/register-form";
export { useAuth } from "./hooks/use-auth";
export { loginSchema, registerSchema } from "./schemas/auth-schemas";
export type { LoginInput, RegisterInput } from "./schemas/auth-schemas";
