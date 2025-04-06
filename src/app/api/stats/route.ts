import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Pobierz liczbę zespołów
    const { count: bandsCount, error: bandsError } = await supabase
      .from("bands")
      .select("*", { count: "exact", head: true });

    if (bandsError) throw bandsError;

    // Pobierz liczbę albumów
    const { count: albumsCount, error: albumsError } = await supabase
      .from("albums")
      .select("*", { count: "exact", head: true });

    if (albumsError) throw albumsError;

    // Pobierz liczbę fanów
    const { count: fansCount, error: fansError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (fansError) throw fansError;

    return NextResponse.json({
      bands: bandsCount || 0,
      albums: albumsCount || 0, // Zmiana z labels na albums
      fans: fansCount || 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}