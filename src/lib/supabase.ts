import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function isSupabaseServiceConfigured(): boolean {
  return Boolean(supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase 尚未設定，請參考 .env.local.example");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

/** 僅伺服器 API 使用；可讀寫 RLS 保護的資料（如 going_signups） */
export function createSupabaseServiceClient() {
  if (!isSupabaseServiceConfigured()) {
    throw new Error(
      "缺少 SUPABASE_SERVICE_ROLE_KEY，請在 .env.local 設定（勿加 NEXT_PUBLIC_）"
    );
  }
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const supabase = isSupabaseConfigured()
  ? createSupabaseClient()
  : null;
