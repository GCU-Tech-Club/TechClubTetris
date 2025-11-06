import { createClient, SupabaseClient } from "supabase";
import { getSupabaseEnv } from "./env.ts";

/**
 * Supabase client factory
 * Creates a Supabase client with service role key for database operations
 */

/**
 * Supabase client
 * @type {SupabaseClient | null}
 */
let supabaseClient: SupabaseClient | null = null;

/**
 * Creates and returns a Supabase client instance
 * Uses service role key for full database access (bypasses RLS)
 * @returns Authenticated Supabase client
 */
export function createSupabaseClient(): SupabaseClient {
  // Return cached client if available
  if (supabaseClient) return supabaseClient;

  const env = getSupabaseEnv();
  supabaseClient = createClient(env.url, env.serviceRoleKey);
  return supabaseClient;
}

/**
 * Resets the cached Supabase client (useful for testing)
 */
export const resetSupabaseClient = (): void => {
  supabaseClient = null;
};
