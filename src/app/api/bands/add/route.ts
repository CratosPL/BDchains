// src/app/api/bands/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Używamy service role key dla uprawnień administracyjnych
);

export async function POST(request: NextRequest) {
  try {
    console.log("Received POST request to /api/bands/add");

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const genre = formData.get("genre") as string;
    const country = formData.get("country") as string;
    const year_founded = parseInt(formData.get("year_founded") as string, 10);
    const logo_url = formData.get("logo_url") as string | undefined;
    const logo_file = formData.get("logo_file") as File | null;
    const bech32Address = formData.get("bech32Address") as string;

    console.log("Parsed formData:", {
      name,
      genre,
      country,
      year_founded,
      logo_url,
      logo_file: logo_file ? logo_file.name : null,
      bech32Address,
    });

    if (!name || !genre || !country || isNaN(year_founded) || !bech32Address) {
      console.error("Validation failed: Missing or invalid required fields");
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    let finalLogoUrl = logo_url;

    if (logo_file) {
      const cleanFileName = logo_file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "_");

      const fileName = `${Date.now()}-${cleanFileName}`;
      const filePath = `${bech32Address}/${fileName}`;
      console.log("Attempting to upload logo to:", filePath);

      const { error: uploadError } = await supabase.storage
        .from("band-logos")
        .upload(filePath, logo_file);

      if (uploadError) {
        console.error("Error uploading logo:", uploadError);
        return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage
        .from("band-logos")
        .getPublicUrl(filePath);
      finalLogoUrl = publicUrlData.publicUrl;
      console.log("Logo uploaded successfully, public URL:", finalLogoUrl);
    }

    console.log("Inserting band into Supabase with data:", {
      name,
      genre,
      country,
      year_founded,
      logo_url: finalLogoUrl,
      added_by: bech32Address,
    });

    const { data: bandData, error: bandError } = await supabase
      .from("bands")
      .insert({
        name,
        genre,
        country,
        year_founded,
        logo_url: finalLogoUrl,
        added_by: bech32Address,
      })
      .select()
      .single();

    if (bandError) {
      console.error("Error inserting band into Supabase:", bandError);
      return NextResponse.json({ error: "Failed to add band" }, { status: 500 });
    }

    // Zwiększ bands_added w tabeli users
    const { data: userData, error: fetchUserError } = await supabase
      .from("users")
      .select("bands_added")
      .eq("address", bech32Address)
      .single();

    if (fetchUserError) {
      console.error("Error fetching user data:", fetchUserError);
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }

    const currentBandsAdded = userData?.bands_added || 0;
    const { error: updateUserError } = await supabase
      .from("users")
      .update({ bands_added: currentBandsAdded + 1 })
      .eq("address", bech32Address);

    if (updateUserError) {
      console.error("Error updating bands_added:", updateUserError);
      return NextResponse.json({ error: "Failed to update user bands_added" }, { status: 500 });
    }

    console.log("Band added successfully and bands_added updated:", bandData);
    return NextResponse.json(bandData, { status: 201 });
  } catch (error) {
    console.error("Unexpected error in /api/bands/add:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}