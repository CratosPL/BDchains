import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Funkcja weryfikacji autoryzacji - zmieniona, by nie zwracać 404, gdy zespół nie istnieje
async function verifyAuthorization(req: NextRequest, bandId: string): Promise<{ userAddress: string; canEdit: boolean } | NextResponse> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Nieautoryzowany: Brak lub nieprawidłowy nagłówek Authorization" }, { status: 401 });
  }

  const userAddress = authHeader.split(" ")[1];
  if (!userAddress) {
    return NextResponse.json({ error: "Nieautoryzowany: Brak adresu użytkownika" }, { status: 401 });
  }

  // Pobierz rolę użytkownika
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("address", userAddress)
    .single();

  const userRole = userError || !user ? "USER" : user.role;
  const isAdmin = userRole === "ADMIN";

  // Spróbuj pobrać zespół, ale nie przerywaj, jeśli go nie ma
  const { data: band, error: bandError } = await supabase
    .from("bands")
    .select("added_by")
    .eq("id", bandId)
    .single();

  const isAuthor = band && userAddress === band.added_by; // Jeśli zespół istnieje, sprawdź, czy użytkownik jest autorem
  const canEdit = isAuthor || isAdmin; // Może edytować, jeśli jest autorem lub adminem

  // Zwróć 403 tylko wtedy, gdy zespół istnieje i użytkownik nie ma uprawnień
  if (!canEdit && band) {
    return NextResponse.json({ error: "Zabronione: Nie masz uprawnień do modyfikacji tego zespołu" }, { status: 403 });
  }

  return { userAddress, canEdit };
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Pobierz dane zespołu
    const { data: band, error: bandError } = await supabase
      .from("bands")
      .select("*")
      .eq("id", id)
      .single();

    if (bandError || !band) {
      return NextResponse.json({ error: "Zespół nie znaleziony" }, { status: 404 });
    }

    // Pobierz obecnych członków
    const { data: members, error: membersError } = await supabase
      .from("band_members")
      .select("*")
      .eq("band_id", id)
      .eq("is_current", true)
      .order("id", { ascending: true });

    if (membersError) {
      console.error("Błąd podczas pobierania obecnych członków:", membersError);
      return NextResponse.json({ error: "Nie udało się pobrać członków" }, { status: 500 });
    }

    // Pobierz byłych członków
    const { data: pastMembers, error: pastMembersError } = await supabase
      .from("band_members")
      .select("*")
      .eq("band_id", id)
      .eq("is_current", false)
      .order("id", { ascending: true });

    if (pastMembersError) {
      console.error("Błąd podczas pobierania byłych członków:", pastMembersError);
      return NextResponse.json({ error: "Nie udało się pobrać byłych członków" }, { status: 500 });
    }

    // Pobierz albumy
    const { data: albums, error: albumsError } = await supabase
      .from("albums")
      .select("*")
      .eq("band_id", id);

    if (albumsError) {
      console.error("Błąd podczas pobierania albumów:", albumsError);
      return NextResponse.json({ error: "Nie udało się pobrać albumów" }, { status: 500 });
    }

    // Pobierz linki
    const { data: links, error: linksError } = await supabase
      .from("band_links")
      .select("*")
      .eq("band_id", id);

    if (linksError) {
      console.error("Błąd podczas pobierania linków:", linksError);
      return NextResponse.json({ error: "Nie udało się pobrać linków" }, { status: 500 });
    }

    // Pobierz nazwy użytkowników (dodającego i edytującego)
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
    console.error("Błąd podczas pobierania szczegółów zespołu:", error);
    return NextResponse.json({ error: "Wewnętrzny błąd serwera" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // Weryfikacja autoryzacji
  const authResult = await verifyAuthorization(req, id);
  if (authResult instanceof NextResponse) return authResult;
  const { userAddress } = authResult;

  try {
    const { name, country, genre, year_founded, bio } = await req.json();

    // Walidacja unikalności nazwy (tylko jeśli name jest podane)
    if (name) {
      const { data: existingBand, error: nameCheckError } = await supabase
        .from("bands")
        .select("id")
        .eq("name", name)
        .neq("id", id)
        .single();

      if (nameCheckError && nameCheckError.code !== "PGRST116") {
        console.error("Błąd podczas sprawdzania unikalności nazwy:", nameCheckError);
        return NextResponse.json({ error: "Błąd podczas sprawdzania unikalności nazwy" }, { status: 500 });
      }
      if (existingBand) {
        return NextResponse.json({ error: "Nazwa zespołu już istnieje" }, { status: 400 });
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (country) updateData.country = country;
    if (genre) updateData.genre = genre;
    if (year_founded) updateData.year_founded = year_founded;
    if (bio !== undefined) updateData.bio = bio;
    // Aktualizacja pól updated_at i updated_by
    updateData.updated_at = new Date().toISOString();
    updateData.updated_by = userAddress;

    const { data, error } = await supabase
      .from("bands")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Błąd podczas aktualizacji zespołu:", error);
      return NextResponse.json({ error: "Nie udało się zaktualizować zespołu" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Błąd w PUT /api/bands/[id]:", error);
    return NextResponse.json({ error: "Wewnętrzny błąd serwera" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const authResult = await verifyAuthorization(req, id);
  if (authResult instanceof NextResponse) return authResult;
  const { userAddress, canEdit } = authResult;

  try {
    // Usuń powiązane rekordy
    await supabase.from("albums").delete().eq("band_id", id);
    await supabase.from("band_members").delete().eq("band_id", id);
    await supabase.from("band_links").delete().eq("band_id", id);

    // Usuń zespół, ograniczając przez added_by, chyba że użytkownik jest adminem
    let deleteQuery = supabase.from("bands").delete().eq("id", id);
    if (!canEdit) {
      deleteQuery = deleteQuery.eq("added_by", userAddress); // Zwykły użytkownik musi być autorem
    }
    const { error } = await deleteQuery;

    if (error) {
      console.error("Błąd podczas usuwania zespołu:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Zespół o ID ${id} został usunięty` }, { status: 200 });
  } catch (error) {
    console.error("Błąd w DELETE /api/bands/[id]:", error);
    return NextResponse.json({ error: "Wewnętrzny błąd serwera" }, { status: 500 });
  }
}