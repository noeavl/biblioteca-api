export interface JWTPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
