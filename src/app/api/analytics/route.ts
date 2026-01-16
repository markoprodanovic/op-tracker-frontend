import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  format,
  parseISO,
  eachDayOfInterval,
  addDays,
  startOfWeek,
  endOfWeek,
} from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    // Build query for watch history with episode details using new episodes_with_arcs view
    let query = supabase
      .from("watch_history")
      .select(
        `
        watched_date,
        episode:episodes_with_arcs(arc_name)
      `
      )
      .order("watched_date", { ascending: true });

    // Add date filters if provided
    if (startDate) {
      query = query.gte("watched_date", startDate);
    }
    if (endDate) {
      query = query.lte("watched_date", endDate);
    }

    const { data: watchHistory, error } = await query;

    if (error) {
      console.error("Error fetching analytics data:", error);
      return NextResponse.json(
        { error: "Failed to fetch analytics data" },
        { status: 500 }
      );
    }

    // Calculate episodes watched this week (Monday to Sunday)
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    const episodesThisWeek =
      watchHistory?.filter((entry) => {
        const watchDate = parseISO(entry.watched_date);
        return watchDate >= weekStart && watchDate <= weekEnd;
      }).length || 0;

    // Process data for chart with gaps
    const chartData = processWatchHistoryWithGaps(
      watchHistory || [],
      startDate,
      endDate
    );

    return NextResponse.json({
      chartData,
      totalEpisodes: watchHistory?.length || 0,
      episodesThisWeek,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Updated helper function to include gaps
function processWatchHistoryWithGaps(
  watchHistory,
  startDate?: string | null,
  endDate?: string | null
) {
  if (!watchHistory || watchHistory.length === 0) return [];

  // Determine date range
  let rangeStart: Date;
  let rangeEnd: Date;

  if (startDate && endDate) {
    rangeStart = parseISO(startDate);
    rangeEnd = parseISO(endDate);
  } else {
    // If no date range specified, use the span of actual data
    const dates = watchHistory.map((entry) => parseISO(entry.watched_date));
    rangeStart = new Date(Math.min(...dates.map((d) => d.getTime())));
    rangeEnd = new Date(Math.max(...dates.map((d) => d.getTime())));
  }

  // Group actual watch data by date
  const watchedByDate = watchHistory.reduce((acc, entry) => {
    const date = entry.watched_date;
    const arc = entry.episode?.arc_name || "Unknown Arc";

    if (!acc[date]) {
      acc[date] = {};
    }

    if (!acc[date][arc]) {
      acc[date][arc] = 0;
    }

    acc[date][arc] += 1;

    return acc;
  }, {});

  // Generate all days in the range
  const allDays = eachDayOfInterval({ start: rangeStart, end: rangeEnd });

  // Create chart data with gaps
  return allDays.map((date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const watchedData = watchedByDate[dateString] || {};

    return {
      date: format(date, "MMM dd"),
      fullDate: dateString,
      ...watchedData,
    };
  });
}
