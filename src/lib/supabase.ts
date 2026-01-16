import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// New scraped episodes structure
export type ScrapedEpisode = {
  id: number;
  title: string;
  airdate: string | null;
  arc_id: number | null;
  created_at: string;
  updated_at: string;
};

// Arc information
export type Arc = {
  id: number;
  name: string;
  start_episode: number;
  end_episode: number;
  description: string | null;
  created_at: string;
  updated_at: string;
};

// Episodes with arcs view (recommended for queries)
export type EpisodeWithArc = {
  id: number;
  title: string;
  airdate: string | null;
  arc_id: number | null;
  arc_name: string | null;
  created_at: string;
  updated_at: string;
};

// Legacy episode type (for backwards compatibility during migration)
export type LegacyEpisode = {
  id: number;
  title: string;
  release_date: string | null;
  arc_title: string | null;
  saga_title: string | null;
  created_at: string;
  updated_at: string;
};

// Updated watch history to support both legacy and new structure
export type WatchHistory = {
  id: number;
  episode_id: number;
  watched_date: string;
  created_at: string;
  updated_at: string;
  episode?: EpisodeWithArc | LegacyEpisode;
};

// Convenience type alias - use EpisodeWithArc for new queries
export type Episode = EpisodeWithArc;
