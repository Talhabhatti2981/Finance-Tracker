import { createClient } from "npm:@supabase/supabase-js@2";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function withCors(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    `${}`
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return withCors(JSON.stringify({ error: "Unauthorized: Missing token" }), 401);
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return withCors(JSON.stringify({ error: "Invalid token or user not found" }), 401);
    }

    console.log("Deleting user data for:", user.id);
    const { error: rpcError } = await supabase.rpc("deletes_user_data", { user_uuid: user.id });
    if (rpcError) {
      return withCors(JSON.stringify({ error: `Failed to delete transactions: ${rpcError.message}` }), 400);
    }
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteUserError) {
      return withCors(JSON.stringify({ error: `Failed to delete user: ${deleteUserError.message}` }), 400);
    }

    return withCors(JSON.stringify({ message: "User and their transactions deleted successfully." }), 200);

  } catch (err) {
    return withCors(JSON.stringify({ error: `Internal Server Error: ${err instanceof Error ? err.message : String(err)}` }), 500);
  }
});
