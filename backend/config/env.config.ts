/**
 * Centralized environment configuration
 * Validates required env vars at startup
 */

interface EnvConfig {
  JWT_SECRET: string;
  JWT_EXPIRY: string | number;
  MONGO_URI: string;
  NODE_ENV: string;
  COOKIE_MAX_AGE: number;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const config: EnvConfig = {
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  JWT_EXPIRY: getEnvVar("JWT_EXPIRY", "7d") as string | number,
  MONGO_URI: getEnvVar("MONGO_URI"),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  COOKIE_MAX_AGE: parseInt(
    getEnvVar("COOKIE_MAX_AGE", String(60 * 60 * 24 * 7))
  ), // 7 days
};

// Validate config on load
Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
});
