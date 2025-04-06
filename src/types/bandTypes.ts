// types/bandTypes.ts
export interface Band {
  id: string;
  name: string;
  country: string;
  genre: string;
  year_founded: string;
  bio: string | null;
  image_url: string | null;
  logo_url: string | null;
  added_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Member {
  id: string;
  band_id: string;
  name: string;
  role: string;
  is_current: boolean;
  added_by: string;
}

export interface Album {
  id: string;
  band_id: string;
  title: string;
  release_date: string | null;
  cover_url: string;
  added_by: string;
}

export interface Link {
  id: string;
  band_id: string;
  type: string;
  url: string;
  added_by: string;
}

export interface User {
  username: string; // Simplifikujemy z opt text na string
  avatarUrl: string | null; // opt text
  principal: string; // principal jako string w TS
  hasAccount: boolean;
  usernameChanges: number; // nat
  role: string;
}

export interface BandDetailsResponse {
  band: Band;
  members: Member[];
  pastMembers: Member[];
  albums: Album[];
  links: Link[];
}

export interface EditModalProps {
  band: Band;
  bech32Address: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (newMember: Member, isCurrent: boolean) => void;
  onUpdateMember: (updatedMember: Member) => void;
  onDeleteMember: (memberId: string) => void;
  onUpdateBand: (updatedBand: Band) => void;
  onAddAlbum: (newAlbum: Album) => void;
  onUpdateAlbum: (updatedAlbum: Album) => void;
  onDeleteAlbum: (albumId: string) => void;
  onAddLink: (newLink: Link) => void;
  onDeleteLink: (linkId: string) => void;
  onUpdateImage: (imageUrl: string) => void;
  onUpdateLogo: (logoUrl: string) => void;
  onDeleteBand: () => void;
  members: Member[];
  pastMembers: Member[];
  albums: Album[];
  links: Link[];
}