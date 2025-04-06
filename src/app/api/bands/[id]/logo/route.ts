import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bandId = params.id;

    // Sprawdzenie, czy zespół istnieje
    const { data: band, error: bandError } = await supabase
      .from("bands")
      .select("*")
      .eq("id", bandId)
      .single();

    if (bandError || !band) {
      return NextResponse.json({ error: "Zespół nie znaleziony" }, { status: 404 });
    }

    // Pobranie danych z FormData
    const formData = await req.formData();
    const logoFile = formData.get("logo") as File;

    if (!logoFile) {
      return NextResponse.json({ error: "Brak pliku logo" }, { status: 400 });
    }

    if (logoFile.size > 200 * 1024) { // 200 KB limit
      return NextResponse.json({ error: "Logo must be less than 200 KB" }, { status: 400 });
    }

    // Konwersja logo na czarno-biały
    const buffer = Buffer.from(await logoFile.arrayBuffer());
    const blackAndWhiteBuffer = await sharp(buffer)
      .grayscale() // Konwersja na czarno-biały
      .toBuffer();

    // Generowanie unikalnej nazwy pliku
    const fileName = `${bandId}-${Date.now()}-logo-bw.jpg`;
    const filePath = `${fileName}`;

    // Upload pliku do Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("band-logos")
      .upload(filePath, blackAndWhiteBuffer, {
        contentType: "image/jpeg",
        upsert: true, // Nadpisz, jeśli plik już istnieje
      });

    if (uploadError) {
      console.error("Błąd podczas uploadu logo:", uploadError);
      return NextResponse.json({ error: "Nie udało się przesłać logo" }, { status: 500 });
    }

    // Pobranie publicznego URL
    const { data: publicUrlData } = supabase.storage
      .from("band-logos")
      .getPublicUrl(filePath);

    const logoUrl = publicUrlData.publicUrl;

    // Aktualizacja URL logo w bazie danych
    const { error: updateError } = await supabase
      .from("bands")
      .update({ logo_url: logoUrl })
      .eq("id", bandId);

    if (updateError) {
      console.error("Błąd podczas aktualizacji logo w bazie:", updateError);
      return NextResponse.json({ error: "Nie udało się zaktualizować logo" }, { status: 500 });
    }

    return NextResponse.json({ logo_url: logoUrl }, { status: 200 });
  } catch (error) {
    console.error("Błąd podczas aktualizacji logo:", error);
    return NextResponse.json({ error: "Nie udało się zaktualizować logo" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bandId = params.id;

    // Sprawdzenie, czy zespół istnieje i pobranie obecnego logo_url
    const { data: band, error: bandError } = await supabase
      .from("bands")
      .select("logo_url")
      .eq("id", bandId)
      .single();

    if (bandError || !band) {
      return NextResponse.json({ error: "Zespół nie znaleziony" }, { status: 404 });
    }

    // Jeśli istnieje logo, usuń plik z Supabase Storage
    if (band.logo_url) {
      const fileName = band.logo_url.split("/").pop(); // Wyodrębnij nazwę pliku z URL
      const { error: deleteError } = await supabase.storage
        .from("band-logos")
        .remove([fileName!]);

      if (deleteError) {
        console.warn("Nie udało się usunąć pliku z Storage:", deleteError);
        // Kontynuuj mimo błędu usuwania pliku
      }
    }

    // Aktualizacja bazy danych - ustawienie logo_url na null
    const { error: updateError } = await supabase
      .from("bands")
      .update({ logo_url: null })
      .eq("id", bandId);

    if (updateError) {
      console.error("Błąd podczas aktualizacji bazy danych:", updateError);
      return NextResponse.json({ error: "Nie udało się usunąć logo" }, { status: 500 });
    }

    return NextResponse.json({ message: "Logo usunięte" }, { status: 200 });
  } catch (error) {
    console.error("Błąd podczas usuwania logo:", error);
    return NextResponse.json({ error: "Nie udało się usunąć logo" }, { status: 500 });
  }
}