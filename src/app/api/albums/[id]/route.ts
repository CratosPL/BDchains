import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No Authorization header");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  console.log("DELETE - Token:", token, "Album ID:", id);

  try {
    const { data: album, error: fetchError } = await supabase
      .from("albums")
      .select("cover_url, added_by")
      .eq("id", id)
      .single();

    if (fetchError || !album) {
      console.error("DELETE - Album not found:", fetchError);
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }
    console.log("DELETE - Album:", album);

    if (album.added_by !== token) {
      console.log("DELETE - Forbidden: Not the author");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (album.cover_url) {
      const filePath = album.cover_url.split("/album-covers/")[1];
      console.log("DELETE - Removing cover:", filePath);
      const { error: deleteError } = await supabase.storage
        .from("album-covers")
        .remove([filePath]);
      if (deleteError) {
        console.error("DELETE - Cover removal failed:", deleteError);
        return NextResponse.json({ error: "Failed to delete cover" }, { status: 500 });
      }
    }

    const { error } = await supabase
      .from("albums")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("DELETE - Album deletion failed:", error);
      return NextResponse.json({ error: "Failed to delete album" }, { status: 500 });
    }

    console.log("DELETE - Success:", id);
    return NextResponse.json({ message: "Album deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE - Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No Authorization header");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  console.log("PUT - Token:", token, "Album ID:", id);

  try {
    const { data: album, error: fetchError } = await supabase
      .from("albums")
      .select("added_by")
      .eq("id", id)
      .single();

    if (fetchError || !album) {
      console.error("PUT - Album not found:", fetchError);
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }
    console.log("PUT - Album:", album);

    if (album.added_by !== token) {
      console.log("PUT - Forbidden: Not the author");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const release_date = formData.get("release_date") as string;
    const cover = formData.get("cover") as File | null;
    const type = formData.get("type") as string; // Nowe pole

    let updateData: any = { title, release_date: release_date || null };
    if (type) updateData.type = type; // Nowe pole
    if (cover) {
      const filePath = `${id}/${cover.name}`;
      console.log("PUT - Uploading cover:", filePath);
      const { error: uploadError } = await supabase.storage
        .from("album-covers")
        .upload(filePath, cover, { upsert: true });
      if (uploadError) {
        console.error("PUT - Cover upload failed:", uploadError);
        return NextResponse.json({ error: "Failed to upload cover" }, { status: 500 });
      }
      const { data: publicUrlData } = supabase.storage
        .from("album-covers")
        .getPublicUrl(filePath);
      updateData.cover_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("albums")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("PUT - Update failed:", error);
      return NextResponse.json({ error: "Failed to update album" }, { status: 500 });
    }

    console.log("PUT - Success:", id);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("PUT - Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}