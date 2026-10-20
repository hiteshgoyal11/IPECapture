import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check karega ki key empty to nahi hai
console.log("Supabase URL Connected:", supabaseUrl ? "YES" : "NO");
console.log("Anon Key Length:", supabaseAnonKey.length);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);