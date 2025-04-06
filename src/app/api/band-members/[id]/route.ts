import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { name, role } = await req.json();
    const { data, error } = await supabase
      .from("band_members")
      .update({ name, role })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating member:", error);
      return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/band-members/[id]:", error);
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
      console.error("Error deleting member:", error);
      return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
    }

    return NextResponse.json({ message: "Member deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/band-members/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}