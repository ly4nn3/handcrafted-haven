import { LoginRequest, RegisterRequest } from "@backend/types/api.types";

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Validate email format
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Validate login request body
 */
export const validateLoginRequest = (body: any): LoginRequest => {
  if (!body.email || typeof body.email !== "string") {
    throw new ValidationError("Valid email is required", "email");
  }

  if (!body.password || typeof body.password !== "string") {
    throw new ValidationError("Password is required", "password");
  }

  if (!isValidEmail(body.email)) {
    throw new ValidationError("Invalid email format", "email");
  }

  return {
    email: body.email.trim().toLowerCase(),
    password: body.password,
  };
};

/**
 * Validate registration request body
 */
export const validateRegisterRequest = (body: any): RegisterRequest => {
  // Required fields
  if (!body.firstname || typeof body.firstname !== "string") {
    throw new ValidationError("First name is required", "firstname");
  }

  if (!body.lastname || typeof body.lastname !== "string") {
    throw new ValidationError("Last name is required", "lastname");
  }

  if (!body.email || typeof body.email !== "string") {
    throw new ValidationError("Email is required", "email");
  }

  if (!body.password || typeof body.password !== "string") {
    throw new ValidationError("Password is required", "password");
  }

  if (!body.role || !["user", "seller"].includes(body.role)) {
    throw new ValidationError(
      "Valid role is required (user or seller)",
      "role"
    );
  }

  // Email validation
  if (!isValidEmail(body.email)) {
    throw new ValidationError("Invalid email format", "email");
  }

  // Password validation
  if (!isValidPassword(body.password)) {
    throw new ValidationError(
      "Password must be at least 8 characters long",
      "password"
    );
  }

  // Seller-specific validation
  if (
    body.role === "seller" &&
    (!body.shopName || typeof body.shopName !== "string")
  ) {
    throw new ValidationError("Shop name is required for sellers", "shopName");
  }

  return {
    firstname: body.firstname.trim(),
    lastname: body.lastname.trim(),
    email: body.email.trim().toLowerCase(),
    password: body.password,
    role: body.role,
    shopName: body.shopName?.trim(),
    description: body.description?.trim() || "",
  };
};
