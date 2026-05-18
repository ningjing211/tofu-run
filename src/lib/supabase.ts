import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function createSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase 尚未設定，請參考 .env.local.example");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = isSupabaseConfigured()
  ? createSupabaseClient()
  : null;
