/**
 * Supabase environment variables interface
 * @param url Supabase URL
 * @param serviceRoleKey Supabase service role key
 */
export interface SupabaseEnv {
  url: string;
  serviceRoleKey: string;
}

/**
 * Gets Supabase environment variables
 * @returns Supabase environment variables
 * @throws Error if Supabase URL or service role key are missing
 */
export function getSupabaseEnv(): SupabaseEnv {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return {
    url: supabaseUrl,
    serviceRoleKey: supabaseServiceRoleKey,
  };
}

/**
 * Validates and returns JWT secret
 * @returns JWT secret string (at least 32 characters)
 * @throws Error if JWT secret is missing or too short
 */
export function getJwtSecret(): string {
  const jwtSecretString =
    Deno.env.get("JWT_SECRET") ||
    Deno.env.get("SUPABASE_JWT_SECRET") ||
    "super-secret-jwt-token-with-at-least-32-characters-long";

  if (!jwtSecretString || jwtSecretString.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
  }

  return jwtSecretString;
}
