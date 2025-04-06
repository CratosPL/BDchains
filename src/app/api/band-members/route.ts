import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { band_id, name, role, added_by, is_current } = await req.json();

    // Walidacja wymaganych pól
    if (!band_id || !name || !role || !added_by) {
      return NextResponse.json({ error: "Missing required fields: band_id, name, role, and added_by are required" }, { status: 400 });
    }

    // Ustawienie domyślnej wartości dla is_current, jeśli nie podano
    const isCurrent = is_current !== undefined ? is_current : true;

    // Zapisz nowego członka do Supabase
    const { data, error } = await supabase
      .from("band_members")
      .insert({
        band_id,
        name,
        role,
        added_by,
        is_current: isCurrent, // Dodajemy pole is_current
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding band member:", error);
      return NextResponse.json({ error: "Failed to add band member" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error in /api/band-members POST:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { name, role, is_current } = await req.json();

    // Walidacja wymaganych pól
    if (!name || !role) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
    }

    // Przygotowanie danych do aktualizacji
    const updateData: any = { name, role };
    if (is_current !== undefined) updateData.is_current = is_current;

    const { data, error } = await supabase
      .from("band_members")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating band member:", error);
      return NextResponse.json({ error: "Failed to update band member" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in /api/band-members/[id] PUT:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { error } = await supabase
      .from("band_members")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting band member:", error);
      return NextResponse.json({ error: "Failed to delete band member" }, { status: 500 });
    }

    return NextResponse.json({ message: `Band member with ID ${id} deleted` }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in /api/band-members/[id] DELETE:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}