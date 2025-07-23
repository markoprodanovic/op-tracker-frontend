import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Episode = {
  id: number;
  title: string;
  release_date: string | null;
  arc_title: string | null;
  saga_title: string | null;
  created_at: string;
  updated_at: string;
};

export type WatchHistory = {
  id: number;
  episode_id: number;
  watched_date: string;
  created_at: string;
  updated_at: string;
  episode?: Episode;
};
