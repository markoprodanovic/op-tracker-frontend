import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get the latest released episode (release_date <= today)
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    const { data: latestEpisode, error: latestError } = await supabase
      .from("episodes")
      .select("id")
      .not("release_date", "is", null) // Has a release date
      .lte("release_date", today) // Released on or before today
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (latestError) {
      console.error("Error fetching latest episode:", latestError);
      return NextResponse.json(
        { error: "Failed to fetch latest episode" },
        { status: 500 }
      );
    }

    // Get the highest episode number the user has watched
    const { data: highestWatched, error: watchedError } = await supabase
      .from("watch_history")
      .select(
        `
        episode_id,
        episode:episodes(id)
      `
      )
      .order("episode_id", { ascending: false })
      .limit(1)
      .single();

    if (watchedError && watchedError.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Error fetching highest watched episode:", watchedError);
      return NextResponse.json(
        { error: "Failed to fetch watch history" },
        { status: 500 }
      );
    }

    // Calculate progress
    const latestAvailable = latestEpisode?.id || 0;
    const highestWatchedNumber = highestWatched?.episode_id || 0;
    const progressPercentage =
      latestAvailable > 0
        ? Math.round((highestWatchedNumber / latestAvailable) * 100)
        : 0;

    // Get total episodes watched for additional stats
    const { count: totalWatched } = await supabase
      .from("watch_history")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      latestAvailable,
      highestWatched: highestWatchedNumber,
      progressPercentage,
      totalWatched: totalWatched || 0,
      isCaughtUp: highestWatchedNumber >= latestAvailable,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
