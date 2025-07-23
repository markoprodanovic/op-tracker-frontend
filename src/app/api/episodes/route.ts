import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const episodeId = searchParams.get("episode_id");

    let query = supabase
      .from("episodes")
      .select("*")
      .order("id", { ascending: true });

    // Search by specific episode ID
    if (episodeId) {
      query = query.eq("id", parseInt(episodeId));
    }
    // Search by title/arc text
    else if (search) {
      query = query.or(`title.ilike.%${search}%,arc_title.ilike.%${search}%`);
    }

    // Add limit if provided (but not for ID search)
    if (limit && !episodeId) {
      query = query.limit(parseInt(limit));
    }

    const { data: episodes, error } = await query;

    if (error) {
      console.error("Error fetching episodes:", error);
      return NextResponse.json(
        { error: "Failed to fetch episodes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ episodes });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
