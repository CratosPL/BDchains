import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Pobierz dane z żądania
    const { band_id, type, url, added_by } = await req.json();

    // Sprawdź, czy wszystkie wymagane pola są podane
    if (!band_id || !type || !url || !added_by) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Wstaw nowy link do tabeli band_links w Supabase
    const { data, error } = await supabase
      .from("band_links")
      .insert({ band_id, type, url, added_by })
      .select()
      .single();

    // Obsługa błędu z Supabase
    if (error) {
      console.error("Error adding link:", error.message);
      return NextResponse.json({ error: "Failed to add link" }, { status: 500 });
    }

    // Zwróć nowo utworzony link
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/band-links:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Dodaję endpoint DELETE dla usuwania linków, zgodnie z Twoimi potrzebami
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bech32Address = authHeader.split(" ")[1];

    // Sprawdź, czy link istnieje i czy użytkownik ma uprawnienia
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

    // Sprawdź, czy użytkownik jest autorem linku lub ma rolę admina
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

    // Usuń link z bazy danych
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
    console.error("Error in DELETE /api/band-links:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}