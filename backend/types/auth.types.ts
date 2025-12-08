export interface JWTPayload {
  userId: string;
  role: "user" | "seller";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface DecodedToken extends JWTPayload {
  iat: number;
  exp: number;
}
