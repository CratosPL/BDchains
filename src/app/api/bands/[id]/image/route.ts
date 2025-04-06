import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const formData = await req.formData();
    const band_id = id as string;
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    if (image.size > 500 * 1024) { // 500 KB limit
      return NextResponse.json({ error: "Band image must be less than 500 KB" }, { status: 400 });
    }

    // Konwersja obrazu na czarno-biały
    const buffer = Buffer.from(await image.arrayBuffer());
    const blackAndWhiteBuffer = await sharp(buffer)
      .grayscale() // Konwersja na czarno-biały
      .toBuffer();

    // Generowanie nazwy pliku
    const fileName = `${band_id}/${Date.now()}-band-image-bw.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("band-images")
      .upload(fileName, blackAndWhiteBuffer, {
        contentType: "image/jpeg",
      });

    if (uploadError) {
      console.error("Error uploading band image:", uploadError);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("band-images")
      .getPublicUrl(fileName);

    const image_url = publicUrlData.publicUrl;

    const { data, error } = await supabase
      .from("bands")
      .update({ image_url })
      .eq("id", band_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating band image URL:", error);
      return NextResponse.json({ error: "Failed to update band image" }, { status: 500 });
    }

    return NextResponse.json({ image_url: data.image_url }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/bands/[id]/image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { data: band, error: fetchError } = await supabase
      .from("bands")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchError || !band) {
      return NextResponse.json({ error: "Band not found" }, { status: 404 });
    }

    if (band.image_url) {
      const filePath = band.image_url.split("/band-images/")[1];
      const { error: deleteError } = await supabase.storage
        .from("band-images")
        .remove([filePath]);

      if (deleteError) {
        console.error("Error deleting band image:", deleteError);
      }
    }

    const { error } = await supabase
      .from("bands")
      .update({ image_url: null })
      .eq("id", id);

    if (error) {
      console.error("Error removing band image URL:", error);
      return NextResponse.json({ error: "Failed to delete band image" }, { status: 500 });
    }

    return NextResponse.json({ message: "Band image deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/bands/[id]/image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}