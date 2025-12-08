export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }

  return { isValid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  return { isValid: true };
};

/**
 * Get password strength level
 */
export const getPasswordStrength = (
  password: string
): "weak" | "medium" | "strong" => {
  if (password.length < 8) return "weak";

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strength = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  if (strength >= 3 && password.length >= 12) return "strong";
  if (strength >= 2 && password.length >= 8) return "medium";
  return "weak";
};

/**
 * Validate name
 */
export const validateName = (
  name: string,
  fieldName: string
): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters`,
    };
  }

  return { isValid: true };
};
