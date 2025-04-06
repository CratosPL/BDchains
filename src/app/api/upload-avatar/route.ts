import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const address = formData.get("address") as string;
  const file = formData.get("file") as File;

  if (!address || !file) {
    return NextResponse.json({ error: "Address and file are required" }, { status: 400 });
  }

  const filePath = `${address}/${file.name}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error("Upload error:", JSON.stringify(error, null, 2));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return NextResponse.json({ url: data.publicUrl });
}