import {
  create,
  decode,
  getNumericDate,
  type Header,
  type Payload,
} from "djwt";
import { getJwtSecret } from "./env.ts";

/**
 * Cache for JWT secret key to avoid repeated imports
 * @type {CryptoKey | null}
 */
let jwtSecretKey: CryptoKey | null = null;

/**
 * Gets and imports JWT secret as CryptoKey
 * Caches the key for performance
 * @returns JWT secret key
 * @throws Error if JWT secret key is not found
 */
async function getJwtSecretKey(): Promise<CryptoKey> {
  if (jwtSecretKey) return jwtSecretKey;

  const jwtSecretString = getJwtSecret();

  // Convert secret string to CryptoKey for HS256 algorithm
  const encoder = new TextEncoder();
  const keyData = encoder.encode(jwtSecretString);
  jwtSecretKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  return jwtSecretKey;
}

/**
 * Validates JWT claims structure
 * @param claims JWT claims object
 * @returns sessionId if valid
 * @throws Error if claims are invalid
 */
export function extractSessionIdFromClaims(
  claims: Record<string, unknown>
): string {
  if (!claims || !claims.sub) throw new Error("Invalid token claims");

  const sessionId = claims.session_id as string;
  if (!sessionId) throw new Error("Session ID not found in token");

  return sessionId;
}

/**
 * Decodes and validates a JWT token
 * @param token JWT token string
 * @returns Decoded claims object
 * @throws Error if token is invalid
 */
export function decodeJwtToken(token: string): Record<string, unknown> {
  try {
    const decoded = decode(token);
    const claims = decoded[1] as Record<string, unknown>;
    return claims;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Invalid token: ${errorMessage}`);
  }
}

/**
 * Creates a JWT token for a session
 * @param sessionId Session ID to encode in token
 * @param expiresInSeconds Token expiration time in seconds (default: 24 hours)
 * @returns Signed JWT token string
 */
export async function createJwtToken(
  sessionId: string,
  expiresInSeconds: number = 60 * 60 * 24 // 24 hours
): Promise<string> {
  const jwtSecret = await getJwtSecretKey();

  /**
   * JWT header
   * @type {Header}
   */
  const header: Header = {
    alg: "HS256",
    typ: "JWT",
  };

  /**
   * JWT payload
   * @type {Payload}
   */
  const payload: Payload = {
    iss: "supabase", // issuer
    sub: sessionId, // subject (session ID as uid)
    aud: "authenticated", // audience
    exp: getNumericDate(expiresInSeconds), // expires in specified seconds
    iat: getNumericDate(new Date()), // issued at
    role: "authenticated", // role
    session_id: sessionId, // custom claim for easy session lookup
  };

  /**
   * Creates and signs JWT token
   * @param header JWT header
   * @param payload JWT payload
   * @param jwtSecret JWT secret key
   * @returns Signed JWT token string
   */
  const jwt = await create(header, payload, jwtSecret);
  return jwt;
}
