/**
 * File: src/middleware/auth.middleware.js
 * Updated: 2026-03-22
 *
 * Purpose:
 * - JWT verification middleware
 * - Attaches decoded user to req.user
 * - Protects all routes that require authentication
 *
 * Changes:
 * - Added verifyToken as an alias export for authenticate
 *   user.routes.js imports verifyToken — the old export name
 *   was only authenticate, causing a silent undefined import
 *   which would crash every protected user route
 *
 * Connected Modules:
 * - Used by auth.routes.js and user.routes.js
 *
 * Dependencies:
 * - jsonwebtoken: JWT verification and decoding
 * - env: JWT secret from validated environment config
 * - response: Standardized error response formatter
 * - logger: Winston structured logging
 */

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import { sendError } from '../utils/response.js';

/**
 * Verify JWT token and attach decoded user to req.user
 * Used on all protected routes
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(
        res,
        401,
        'Authentication required. Please provide a valid token.'
      );
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.JWT.SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expired. Please login again.');
    }

    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Invalid token. Please login again.');
    }

    logger.error('Auth middleware error:', error);
    return sendError(res, 500, 'Authentication failed');
  }
};

// verifyToken is the same function as authenticate.
// user.routes.js imports verifyToken by name.
// Both names point to the exact same middleware — zero behavior change.
export const verifyToken = authenticate;
