import { createClient } from "@supabase/supabase-js";
import { isValidHighScore } from "@shared/functions/validate-high-score.ts";
import { HighScore } from "@shared/types/highScore.ts";
import { create, getNumericDate, Header, Payload, decode } from "djwt";



Deno.serve(async (req) => {
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

  // Validate request method
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

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

  let token = req.headers.get("Authorization")?.split(" ")[1] || "";
  console.log("Token:", token);
    let userSessionId;
  try {
    userSessionId = decode(token);
   const claims =  userSessionId[1] as Record<string, unknown>;
   console.log("Claims:", claims);
    if (!claims || !claims.sub) {
      throw new Error("Invalid token claims");
  }
    const sessionId = claims.session_id;
    if (!sessionId) {
      throw new Error("Session ID not found in token");
    }
    console.log("Session ID:", sessionId);
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();
    if (error || !data) {
      throw new Error("Session not found");
    }
    console.log("Session Data:", data);
    // continue processing with valid sessionId
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Invalid token", details: errorMessage }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate high score
  if (!isValidHighScore(requestBody)) {
    return new Response(JSON.stringify({ error: "Invalid high score" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create high score object
  const highScore: HighScore = {
    user_id: requestBody.user_id,
    score: requestBody.score,
    created_at: new Date(),
  };

  // Save high score to database
  const { data, error } = await supabase
    .from("high_scores")
    .insert(highScore)
    .select()
    .single();

  // Handle error if database operation fails
  if (error) {
    return new Response(
      JSON.stringify({ error: "Failed to save high score" + error.message }),
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
});
