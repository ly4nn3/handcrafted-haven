import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "@backend/config/env.config";
import { JWTPayload, DecodedToken } from "@backend/types/auth.types";

/**
 * Custom JWT Error types for better error handling
 */
export class JWTError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "JWTError";
  }
}

/**
 * Sign a JWT token
 */
export const signJWT = (
  payload: JWTPayload,
  expiresIn: string | number = config.JWT_EXPIRY
): string => {
  try {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn,
    } as SignOptions);
  } catch (error) {
    throw new JWTError("Failed to sign JWT", "SIGN_ERROR");
  }
};

/**
 * Verify and decode a JWT token
 */
export const verifyJWT = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as DecodedToken;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new JWTError("Token has expired", "TOKEN_EXPIRED");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new JWTError("Invalid token", "INVALID_TOKEN");
    }
    throw new JWTError("Token verification failed", "VERIFICATION_ERROR");
  }
};

/**
 * Decode JWT without verification (for debugging)
 */
export const decodeJWT = (token: string): DecodedToken | null => {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch {
    return null;
  }
};
