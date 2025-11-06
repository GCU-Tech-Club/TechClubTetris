import { serve } from "server";
import { createClient } from "supabase";
import { isValidHighScore } from "@shared/functions/validate-high-score.ts";
import { decode } from "djwt";

serve(async (req: Request) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Validate environment variables
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return new Response(
      JSON.stringify({
        error: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Handle GET request - retrieve top 10 high scores
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);

      if (error) {
        return new Response(
          JSON.stringify({
            error: "Failed to retrieve high scores",
            details: error.message,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          data: data || [],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      return new Response(
        JSON.stringify({
          error: "Failed to retrieve high scores",
          details,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // Handle POST request - save high score
  if (req.method === "POST") {
    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return new Response(
        JSON.stringify({ error: "Invalid JSON body", details: errorMessage }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate Authorization header and decode JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token not found in Authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    let sessionId: string;
    try {
      const decoded = decode(token);
      const claims = decoded[1] as Record<string, unknown>;

      if (!claims || !claims.sub) throw new Error("Invalid token claims");

      sessionId = claims.session_id as string;

      if (!sessionId) throw new Error("Session ID not found in token");

      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error || !data) throw new Error("Session not found");

      // continue processing with valid sessionId
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return new Response(
        JSON.stringify({ error: "Invalid token", details: errorMessage }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate high score (initials and score)
    if (!isValidHighScore(requestBody)) {
      return new Response(JSON.stringify({ error: "Invalid high score" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Type is narrowed by isValidHighScore guard
    // After validation, requestBody has initials and score properties
    const body = requestBody as unknown as { initials: string; score: number };

    // Create high score object
    // uid comes from JWT session_id, initials and score come from request body
    const highScore = {
      uid: sessionId, // Extract from JWT
      initials: body.initials,
      score: body.score,
      created_at: new Date(),
    };

    // Save high score to database
    const { data, error } = await supabase
      .from("scores")
      .insert(highScore)
      .select()
      .single();

    // Handle error if database operation fails
    if (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to save high score: " + error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        message: "High score saved",
        data: data,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Handle unsupported methods
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
});
