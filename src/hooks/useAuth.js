/**
 * File: src/hooks/useAuth.jsx
 * Updated: 2026-03-22
 *
 * Purpose:
 * - Convenience hook for accessing authentication context
 * - Re-exports useAuth from AuthContext for cleaner imports
 * - Provides a single source of truth for auth state
 *
 * Changes:
 * - Fixed placeholder code to proper re-export
 * - Maintains consistency with useToast pattern
 *
 * Connected Modules:
 * - Depends on ../context/AuthContext.jsx for the actual hook implementation
 *
 * Dependencies:
 * - react: useContext (via AuthContext)
 */

// Re-export the useAuth hook from AuthContext
// This provides a clean import path: import { useAuth } from '../hooks/useAuth.jsx'
// Instead of the longer: import { useAuth } from '../context/AuthContext.jsx'
export { useAuth } from '../context/AuthContext.jsx';