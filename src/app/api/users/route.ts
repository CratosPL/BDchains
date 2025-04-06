import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("username, avatar_url, has_account, username_changes, role")
    .eq("address", address)
    .single();

  if (error || !data) {
    return NextResponse.json(
      {
        username: "",
        avatarUrl: null,
        hasAccount: false,
        usernameChanges: 0,
        role: "USER",
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      username: data.username,
      avatarUrl: data.avatar_url,
      hasAccount: data.has_account,
      usernameChanges: data.username_changes,
      role: data.role,
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { bech32Address, username, avatarUrl } = body;

  if (!bech32Address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  // Pobieramy istniejącego użytkownika, aby zachować obecną rolę i username_changes
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("username_changes, role")
    .eq("address", bech32Address)
    .single();

  const usernameChanges = fetchError || !existingUser ? 0 : existingUser.username_changes;
  const existingRole = fetchError || !existingUser ? "USER" : existingUser.role;

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        address: bech32Address,
        username: username || "",
        avatar_url: avatarUrl || null,
        has_account: true,
        username_changes: username ? usernameChanges + 1 : usernameChanges,
        role: existingRole, // Zachowujemy istniejącą rolę zamiast hardcoded "USER"
      },
      { onConflict: "address" }
    )
    .select()
    .single();

  if (error || !data) {
    console.error("Error updating user in Supabase:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }

  return NextResponse.json(
    {
      success: true,
      data: [
        {
          username: data.username,
          avatarUrl: data.avatar_url,
          hasAccount: data.has_account,
          usernameChanges: data.username_changes,
          role: data.role,
        },
      ],
    },
    { status: 200 }
  );
}