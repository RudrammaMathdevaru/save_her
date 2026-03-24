/**
 * File: src/services/auth.service.js
 * Updated: 2026-03-18
 *
 * Purpose:
 * - All authentication business logic
 * - Password hashing and comparison
 * - JWT token generation
 * - NO HTTP responses - only data and errors
 *
 * Connected Modules:
 * - Used by auth.controller.js
 * - Depends on user.model.js for database operations
 *
 * Dependencies:
 * - bcryptjs: Password hashing
 * - jsonwebtoken: JWT creation
 * - AppError: Custom error class
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import * as UserModel from '../models/user.model.js';
import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';

const SALT_ROUNDS = 12;

/**
 * Register a new user
 * @param {Object} userData - { fullName, email, phoneNumber, password }
 * @returns {Object} { user, token }
 * @throws {AppError} If email or phone already exists
 */
export const registerUser = async (userData) => {
  const { fullName, email, phoneNumber, password } = userData;

  // Check if email already exists
  const emailAlreadyExists = await UserModel.emailExists(email);
  if (emailAlreadyExists) {
    throw new AppError('Email already registered', 409);
  }

  // Check if phone number already exists
  const phoneAlreadyExists = await UserModel.phoneExists(phoneNumber);
  if (phoneAlreadyExists) {
    throw new AppError('Phone number already registered', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user in database
  const user = await UserModel.createUser({
    full_name: fullName,
    email,
    phone_number: phoneNumber,
    password: hashedPassword
  });

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      fullName: user.full_name 
    },
    env.JWT.SECRET,
    { expiresIn: env.JWT.EXPIRES_IN }
  );

  logger.info(`User registered: ${email} (ID: ${user.id})`);

  return { user, token };
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Object} { user, token }
 * @throws {AppError} If credentials invalid
 */
export const loginUser = async (email, password) => {
  // Find user by email
  const user = await UserModel.findUserByEmail(email);
  
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      fullName: user.full_name 
    },
    env.JWT.SECRET,
    { expiresIn: env.JWT.EXPIRES_IN }
  );

  // Remove password from user object
  const { password: _, ...userWithoutPassword } = user;

  logger.info(`User logged in: ${email} (ID: ${user.id})`);

  return { user: userWithoutPassword, token };
};

/**
 * Get user profile by ID
 * @param {number} userId - User ID
 * @returns {Object} User object (without password)
 * @throws {AppError} If user not found
 */
export const getUserProfile = async (userId) => {
  const user = await UserModel.findUserById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};