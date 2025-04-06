// services/bandService.ts
export const fetchBandDetails = async (id: string) => {
  const response = await fetch(`/api/bands/${id}/details`);
  if (!response.ok) {
    throw new Error(`Failed to fetch band details: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const fetchUserUsername = async (userId: string): Promise<string | null> => {
  const response = await fetch(`/api/users/${userId}`);
  if (response.ok) {
    const userData = await response.json();
    return userData.username || userId;
  }
  return userId;
};

export const addBandMember = async (
  bandId: string,
  name: string,
  role: string,
  addedBy: string,
  isCurrent: boolean
) => {
  const response = await fetch("/api/band-members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      band_id: bandId,
      name,
      role,
      added_by: addedBy,
      is_current: isCurrent,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add member: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const updateBandMember = async (
  memberId: string,
  name: string,
  role: string,
  isCurrent: boolean
) => {
  const response = await fetch(`/api/band-members/${memberId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      role,
      is_current: isCurrent,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update member: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const deleteBandMember = async (memberId: string) => {
  const response = await fetch(`/api/band-members/${memberId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete member: ${response.status} - ${errorText}`);
  }
  return true;
};

export const updateBandDetails = async (
  bandId: string,
  name: string,
  country: string,
  genre: string,
  yearFounded: string,
  token: string
) => {
  const response = await fetch(`/api/bands/${bandId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      country,
      genre,
      year_founded: yearFounded,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update band details: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const updateBandBio = async (bandId: string, bio: string, token: string) => {
  const response = await fetch(`/api/bands/${bandId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ bio }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update bio: ${response.status} - ${errorText}`);
  }
  return response.json();
};

// src/services/bandService.ts
export const addAlbum = async (
  bandId: string,
  title: string,
  releaseDate: string,
  cover: File,
  addedBy: string,
  type: string // Nowe pole
) => {
  const formData = new FormData();
  formData.append("band_id", bandId);
  formData.append("title", title);
  formData.append("release_date", releaseDate || "");
  formData.append("added_by", addedBy);
  formData.append("cover", cover);
  formData.append("type", type); // Nowe pole

  const response = await fetch("/api/albums", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add album: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const updateAlbum = async (
  albumId: string,
  title: string,
  releaseDate: string,
  cover: File | null,
  token: string,
  type: string // Nowe pole
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("release_date", releaseDate || "");
  formData.append("type", type); // Nowe pole
  if (cover) formData.append("cover", cover);

  const response = await fetch(`/api/albums/${albumId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update album: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const deleteAlbum = async (albumId: string, token: string) => {
  const response = await fetch(`/api/albums/${albumId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete album: ${response.status} - ${errorText}`);
  }
  return true;
};

export const addLink = async (bandId: string, type: string, url: string, addedBy: string) => {
  const response = await fetch("/api/band-links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      band_id: bandId,
      type,
      url,
      added_by: addedBy,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add link: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const deleteLink = async (linkId: string, token: string) => {
  const response = await fetch(`/api/band-links/${linkId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete link: ${response.status} - ${errorText}`);
  }
  return true;
};

export const updateBandImage = async (bandId: string, image: File) => {
  const formData = new FormData();
  formData.append("band_id", bandId);
  formData.append("image", image);

  const response = await fetch(`/api/bands/${bandId}/image`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update band image: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const updateBandLogo = async (bandId: string, logo: File) => {
  const formData = new FormData();
  formData.append("band_id", bandId);
  formData.append("logo", logo);

  const response = await fetch(`/api/bands/${bandId}/logo`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update logo: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const deleteBand = async (bandId: string, token: string) => {
  const response = await fetch(`/api/bands/${bandId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete band: ${response.status} - ${errorText}`);
  }
  return true;
};