import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  try {
    console.log("Searching bands with query:", query);
    const { data, error } = await supabase.rpc("search_bands_unaccent", {
      search_query: query.toLowerCase(),
    }).limit(5);

    if (error) {
      console.error("Supabase RPC error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return NextResponse.json({ 
        error: "Failed to search bands: " + error.message, 
        details: error.details 
      }, { status: 500 });
    }

    console.log("Search results:", data);
    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error("Unexpected error in /api/bands/search:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}