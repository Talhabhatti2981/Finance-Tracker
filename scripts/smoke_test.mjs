import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function parseEnv(path) {
  const raw = readFileSync(path, "utf8");
  const lines = raw.split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const val = trimmed.slice(eq + 1);
    env[key] = val;
  }
  return env;
}

async function main() {
  const { join } = await import('path');
  const envPath = join(process.cwd(), '.env');
  const env = parseEnv(envPath);
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
    process.exit(1);
  }

  console.log("Creating Supabase client with URL:", url);
  const supabase = createClient(url, key);

  const email = `smoke+${Date.now()}@example.com`;
  const password = "Testpass123!";

  console.log("Attempting signUp for:", email);
  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    console.log("signUpError:", signUpError);
    console.log("signUpData:", signUpData);
  } catch (err) {
    console.error("signUp exception:", err);
  }

  console.log("Attempting signInWithPassword for:", email);
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    console.log("signInError:", signInError);
    console.log("signInData:", signInData);
  } catch (err) {
    console.error("signIn exception:", err);
  }

  console.log("Querying public.transactions (unauthenticated client)");
  try {
    const { data, error } = await supabase.from("transactions").select('*');
    console.log("transactions error:", error);
    console.log("transactions data:", data);
  } catch (err) {
    console.error("transactions exception:", err);
  }

  console.log("Querying public.profiles (unauthenticated client)");
  try {
    const { data, error } = await supabase.from("profiles").select('*');
    console.log("profiles error:", error);
    console.log("profiles data:", data);
  } catch (err) {
    console.error("profiles exception:", err);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
