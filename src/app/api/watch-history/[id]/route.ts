import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { watched_date } = body;
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (!watched_date) {
      return NextResponse.json(
        { error: "watched_date is required" },
        { status: 400 }
      );
    }

    const { data: watchEntry, error } = await supabase
      .from("watch_history")
      .update({ watched_date })
      .eq("id", id)
      .select(
        `
        *,
        episode:episodes(*)
      `
      )
      .single();

    if (error) {
      console.error("Error updating watch entry:", error);
      return NextResponse.json(
        { error: "Failed to update watch entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({ watchEntry });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const { error } = await supabase
      .from("watch_history")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting watch entry:", error);
      return NextResponse.json(
        { error: "Failed to delete watch entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Watch entry deleted successfully" });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
