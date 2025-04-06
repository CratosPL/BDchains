// src/app/api/band-links/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bech32Address = authHeader.split(" ")[1];

    const { data: link, error: linkError } = await supabase
      .from("band_links")
      .select("added_by")
      .eq("id", id)
      .single();

    if (linkError) {
      console.error("Error fetching link:", linkError.message);
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("address", bech32Address)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError.message);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user || (link.added_by !== bech32Address && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from("band_links")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting link:", deleteError.message);
      return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
    }

    return NextResponse.json({ message: "Link deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/band-links/[id]:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}