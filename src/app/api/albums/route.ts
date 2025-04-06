import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const band_id = formData.get("band_id") as string;
    const title = formData.get("title") as string;
    const release_date = formData.get("release_date") as string;
    const added_by = formData.get("added_by") as string;
    const cover = formData.get("cover") as File;
    const type = formData.get("type") as string; // Nowe pole

    if (!band_id || !title || !added_by || !cover || !type) {
      return NextResponse.json(
        { error: "Missing required fields: title, cover, and type are mandatory" },
        { status: 400 }
      );
    }

    if (cover.size > 200 * 1024) {
      return NextResponse.json({ error: "Cover image must be less than 200 KB" }, { status: 400 });
    }

    const fileName = `${band_id}/${Date.now()}-${cover.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("album-covers")
      .upload(fileName, cover);

    if (uploadError) {
      console.error("Error uploading cover:", uploadError);
      return NextResponse.json({ error: "Failed to upload cover" }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("album-covers")
      .getPublicUrl(fileName);

    const cover_url = publicUrlData.publicUrl;

    const { data, error } = await supabase
      .from("albums")
      .insert({
        band_id,
        title,
        release_date: release_date || null,
        cover_url,
        added_by,
        type, // Nowe pole
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding album:", error);
      return NextResponse.json({ error: "Failed to add album" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/albums:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}