import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "12", 10); // Domyślnie 12, jeśli brak parametru

  const { data, error } = await supabase
    .from("bands")
    .select(`
      id,
      name,
      created_at,
      logo_url,
      added_by
    `)
    .order("created_at", { ascending: false })
    .limit(limit); // Używamy dynamicznego limitu

  if (error) {
    console.error("Supabase error fetching bands:", error);
    return NextResponse.json({ error: "Failed to fetch bands: " + error.message }, { status: 500 });
  }

  console.log("Raw bands data:", data);

  const transformedData = await Promise.all(
    data.map(async (band) => {
      let username = "Unknown User";
      if (band.added_by) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("username")
          .eq("address", band.added_by)
          .single();

        if (userError) {
          console.warn("User lookup error for address", band.added_by, ":", userError);
        } else if (userData && userData.username) {
          username = userData.username;
        }
      }

      return {
        id: band.id,
        name: band.name,
        created_at: band.created_at,
        logo_url: band.logo_url,
        addedBy: username,
      };
    })
  );

  console.log("Transformed bands data:", transformedData);
  return NextResponse.json(transformedData);
}