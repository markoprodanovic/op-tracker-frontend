import { supabase } from "./supabase";

export async function testConnection() {
  try {
    const { data: episodes, error } = await supabase
      .from("episodes")
      .select("id, title, arc_title")
      .limit(5);

    if (error) {
      console.error("Database connection error:", error);
      return false;
    }

    console.log("Database connected successfully. Sample episodes:", episodes);
    return true;
  } catch (error) {
    console.error("Connection test failed:", error);
    return false;
  }
}
