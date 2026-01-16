import { supabase } from "./supabase";

export async function testConnection() {
  try {
    // First, let's check what tables exist
    console.log("Testing database connection...");

    // Test old episodes table
    const { data: oldEpisodes, error: oldError } = await supabase
      .from("episodes")
      .select("id, title, arc_title")
      .limit(2);

    console.log(
      "Old episodes table:",
      oldError ? "FAILED - " + oldError.message : "EXISTS",
      oldEpisodes
    );

    // Test new scraped_episodes table
    const { data: scrapedEpisodes, error: scrapedError } = await supabase
      .from("scraped_episodes")
      .select("id, title, arc_id")
      .limit(2);

    console.log(
      "scraped_episodes table:",
      scrapedError ? "FAILED - " + scrapedError.message : "EXISTS",
      scrapedEpisodes
    );

    // Test episodes_with_arcs view
    const { data: episodesWithArcs, error: viewError } = await supabase
      .from("episodes_with_arcs")
      .select("id, title, arc_name")
      .limit(2);

    console.log(
      "episodes_with_arcs view:",
      viewError ? "FAILED - " + viewError.message : "EXISTS",
      episodesWithArcs
    );

    // Test arcs table
    const { data: arcs, error: arcsError } = await supabase
      .from("arcs")
      .select("id, name")
      .limit(2);

    console.log(
      "arcs table:",
      arcsError ? "FAILED - " + arcsError.message : "EXISTS",
      arcs
    );

    return !oldError; // Return true if at least the old table works
  } catch (error) {
    console.error("Connection test failed:", error);
    return false;
  }
}
