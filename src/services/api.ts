// src/services/api.ts
export async function fetchUser(bech32Address: string) {
  if (!bech32Address || bech32Address.trim() === "") {
    throw new Error("No valid bech32Address provided");
  }

  const response = await fetch(`/api/users/${encodeURIComponent(bech32Address)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Error fetching user:", text);
    throw new Error(`Failed to fetch user: ${response.status} - ${text}`);
  }

  const userData = await response.json();
  console.log("fetchUser response:", userData);
  return {
    username: userData.username || "",
    avatarUrl: userData.avatar_url || null,
    hasAccount: userData.has_account || false,
    usernameChanges: userData.username_changes || 0,
    role: userData.role || "USER",
    bandsAdded: userData.bands_added || 0,
  };
}

export async function addBand(
  bandData: {
    name: string;
    genre: string;
    country: string;
    year_founded: number;
    logo_url?: string;
    logo_file?: File;
  },
  bech32Address: string
) {
  if (!bech32Address || bech32Address.trim() === "") {
    throw new Error("No valid bech32Address provided");
  }

  console.log("Adding band with bech32Address:", { bandData, bech32Address });

  const formData = new FormData();
  formData.append("name", bandData.name);
  formData.append("genre", bandData.genre);
  formData.append("country", bandData.country);
  formData.append("year_founded", bandData.year_founded.toString());
  if (bandData.logo_url) formData.append("logo_url", bandData.logo_url);
  if (bandData.logo_file) formData.append("logo_file", bandData.logo_file);
  formData.append("bech32Address", bech32Address);

  const response = await fetch("/api/bands/add", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Error response from /api/bands/add:", text);
    throw new Error(`Failed to add band: ${response.status} - ${text}`);
  }

  const result = await response.json();
  console.log("Band added successfully:", result);
  return result; // Upewnij się, że API zwraca pełne dane zespołu (np. id, name, logo_url)
}

export async function updateUser(bech32Address: string, username: string, avatarUrl: string | null) {
  const payload = { username, avatar_url: avatarUrl };
  console.log("Sending updateUser payload:", payload);

  const response = await fetch(`/api/users/${encodeURIComponent(bech32Address)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${bech32Address}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to update user, response:", text);
    throw new Error(`Failed to update user: ${response.status} - ${text}`);
  }

  const result = await response.json();
  console.log("Raw API response from updateUser:", result);
  return {
    success: true,
    data: [{
      username: result.username,
      avatarUrl: result.avatar_url,
      hasAccount: result.has_account,
      usernameChanges: result.username_changes,
      role: result.role,
    }],
  };
}

export async function checkBandExists(bandName: string) {
  if (!bandName || bandName.trim() === "") {
    throw new Error("Band name is required");
  }

  const response = await fetch(`/api/bands/check?name=${encodeURIComponent(bandName)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Error checking band existence:", text);
    throw new Error(`Failed to check band: ${response.status} - ${text}`);
  }

  const result = await response.json();
  return result.exists;
}