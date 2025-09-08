import { createClient } from "@supabase/supabase-js";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing or invalid Authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const token = authHeader.split(" ")[1];

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser (token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token or user not found" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const { error:  vrpcError } = await supabase.rpc("delete_user_data", { user_id: user.id });

    if (rpcError) {
      return new Response(
        JSON.stringify({ error: `Failed to delete user data: ${rpcError.message}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteUserError) {
  return new Response(
    JSON.stringify({ error: `Failed to delete user: ${deleteUserError.message}` }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}
return new Response(
  JSON.stringify({ message: "User account and data deleted successfully." }),
  { status: 200, headers: { "Content-Type": "application/json" } }
);
} catch (err) {
  return new Response(
    JSON.stringify({ error: `Internal Server Error: ${err instanceof Error ? err.message : String(err)}` }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
} 
});