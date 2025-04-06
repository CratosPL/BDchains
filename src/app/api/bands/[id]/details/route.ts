import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Pobierz dane podstawowe zespołu, w tym nowe pola updated_at i updated_by
    const { data: band, error: bandError } = await supabase
      .from("bands")
      .select("*, created_at, added_by, updated_at, updated_by")
      .eq("id", id)
      .single();

    if (bandError || !band) {
      return NextResponse.json({ error: "Band not found" }, { status: 404 });
    }

    // Pobierz obecnych członków (is_current = true)
    const { data: members, error: membersError } = await supabase
      .from("band_members")
      .select("*")
      .eq("band_id", id)
      .eq("is_current", true)
      .order("id", { ascending: true });

    if (membersError) {
      console.error("Error fetching current members:", membersError);
      return NextResponse.json({ error: "Failed to fetch current members" }, { status: 500 });
    }

    // Pobierz byłych członków (is_current = false)
    const { data: pastMembers, error: pastMembersError } = await supabase
      .from("band_members")
      .select("*")
      .eq("band_id", id)
      .eq("is_current", false)
      .order("id", { ascending: true });

    if (pastMembersError) {
      console.error("Error fetching past members:", pastMembersError);
      return NextResponse.json({ error: "Failed to fetch past members" }, { status: 500 });
    }

    // Pobierz albumy
    const { data: albums, error: albumsError } = await supabase
      .from("albums")
      .select("*")
      .eq("band_id", id);

    if (albumsError) {
      console.error("Error fetching albums:", albumsError);
      return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 });
    }

    // Pobierz linki
    const { data: links, error: linksError } = await supabase
      .from("band_links")
      .select("*")
      .eq("band_id", id);

    if (linksError) {
      console.error("Error fetching links:", linksError);
      return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
    }

    // Pobierz nazwy użytkowników (opcjonalne, jeśli chcesz je zachować)
    let addedByUsername = band.added_by;
    let updatedByUsername = band.updated_by || null;

    if (band.added_by) {
      const { data: addedByUser, error: addedByError } = await supabase
        .from("users")
        .select("username")
        .eq("address", band.added_by)
        .single();
      if (!addedByError && addedByUser) {
        addedByUsername = addedByUser.username;
      }
    }

    if (band.updated_by) {
      const { data: updatedByUser, error: updatedByError } = await supabase
        .from("users")
        .select("username")
        .eq("address", band.updated_by)
        .single();
      if (!updatedByError && updatedByUser) {
        updatedByUsername = updatedByUser.username;
      }
    }

    return NextResponse.json({
      band,
      members: members || [],
      pastMembers: pastMembers || [],
      albums: albums || [],
      links: links || [],
      addedByUsername,
      updatedByUsername,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching band details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}