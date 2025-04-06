import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
  const { address } = params;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("address, username, avatar_url, has_account, username_changes, role, bands_added")
      .eq("address", address)
      .single();

    if (error || !data) {
      console.log(`User with address ${address} not found, creating new user`);
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          address,
          username: "", // Zamiast null
          avatar_url: "", // Zamiast null
          has_account: false,
          username_changes: 0,
          role: "USER",
          bands_added: 0,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating new user:", insertError.message, insertError.details);
        return NextResponse.json({ error: "Failed to create user", details: insertError.message }, { status: 500 });
      }
      console.log("New user created:", newUser);
      return NextResponse.json(newUser, { status: 201 });
    }

    console.log("GET /api/users/[address] - Fetched user data:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in GET /api/users/[address]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { address: string } }) {
  const { address } = params;
  const authHeader = req.headers.get("authorization");
  const userAddress = authHeader?.split(" ")[1];

  if (!userAddress || userAddress !== address) {
    console.log("PUT /api/users/[address] - Unauthorized access attempt:", { userAddress, address });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates = await req.json();
    console.log("PUT /api/users/[address] - Received updates:", updates);
    const allowedFields = ["username", "avatar_url", "has_account"];
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: updates[key] }), {});

    if (Object.keys(filteredUpdates).length === 0) {
      console.log("PUT /api/users/[address] - No valid fields to update");
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // Jeśli aktualizujemy username lub avatar_url, ustawiamy has_account na true
    if (filteredUpdates.username || filteredUpdates.avatar_url) {
      filteredUpdates.has_account = true;
    }

    console.log("PUT /api/users/[address] - Updating user with payload:", filteredUpdates);

    const { data, error } = await supabase
      .from("users")
      .upsert({ ...filteredUpdates, address }, { onConflict: "address" })
      .select("address, username, avatar_url, has_account, username_changes, role, bands_added")
      .single();

    if (error) {
      console.error("Supabase error upserting user:", error.message);
      return NextResponse.json({ error: "Failed to update user", details: error.message }, { status: 500 });
    }

    if (!data) {
      console.error("No data returned after upsert for address:", address);
      return NextResponse.json({ error: "User not found or not updated" }, { status: 404 });
    }

    console.log("PUT /api/users/[address] - Updated user data from Supabase:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in PUT /api/users/[address]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { address: string } }) {
  const { address } = params;
  const authHeader = req.headers.get("authorization");
  const userAddress = authHeader?.split(" ")[1];

  if (!userAddress || userAddress !== address) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("address", address);

    if (error) {
      console.error("Error deleting user:", error.message);
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }

    console.log("DELETE /api/users/[address] - User deleted successfully:", address);
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in DELETE /api/users/[address]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}