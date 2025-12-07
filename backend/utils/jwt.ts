import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined in .env");

interface Payload {
  userId: string;
  role: "user" | "seller";
}

export const signJWT = (payload: Payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyJWT = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as Payload;
};
