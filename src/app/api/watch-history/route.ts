import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET Fetch watch history with episode details
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");

    let query = supabase
      .from("watch_history")
      .select(
        `
                *,
                episode: episodes_with_arcs(*)
        `
      )
      .order("watched_date", { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: watchHistory, error } = await query;

    if (error) {
      console.error("Error fetching watch history:", error);
      return NextResponse.json(
        { error: "Failed to fetch watch history" },
        { status: 500 }
      );
    }

    return NextResponse.json({ watchHistory });
  } catch (error) {
    console.error("Api error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { episode_id, watched_date } = body;

    if (!episode_id || !watched_date) {
      return NextResponse.json(
        { error: "episode_id and watched_date are required" },
        { status: 400 }
      );
    }

    const { data: watchEntry, error } = await supabase
      .from("watch_history")
      .insert([{ episode_id, watched_date }])
      .select(
        `
        *,
        episode:episodes_with_arcs(*)
      `
      )
      .single();

    if (error) {
      // Handle unique constraint violation (episode already watched)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Episode already watched. Use PUT to update." },
          { status: 409 }
        );
      }
      console.error("Error creating watch entry:", error);
      return NextResponse.json(
        { error: "Failed to create watch entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({ watchEntry }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
