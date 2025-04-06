// src/app/api/bands/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicjalizacja klienta Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "Band name is required" }, { status: 400 });
  }

  // Sprawdzanie, czy zespół istnieje w tabeli bands
  const { data, error } = await supabase
    .from("bands")
    .select("id")
    .eq("name", name)
    .limit(1);

  if (error) {
    console.error("Error checking band existence:", error);
    return NextResponse.json({ error: "Failed to check band" }, { status: 500 });
  }

  // Zwracamy wynik w formacie { exists: boolean }
  return NextResponse.json({ exists: data.length > 0 }, { status: 200 });
}