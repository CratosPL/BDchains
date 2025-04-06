"use client";

import { useReducer } from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import { addAlbum, updateAlbum, deleteAlbum } from "../../services/bandService";
import { Band, Album } from "../../types/bandTypes";
import { VinylCard } from "./VinylCard";
import { InputField } from "./InputField";

interface AlbumsTabProps {
  band: Band;
  bech32Address: string | undefined;
  albums: Album[];
  onAddAlbum: (newAlbum: Album) => void;
  onUpdateAlbum: (updatedAlbum: Album) => void;
  onDeleteAlbum: (albumId: string) => void;
}

interface State {
  newAlbum: { title: string; releaseDate: string; cover: File | null; type: string };
  editAlbum: { id: string | null; title: string; releaseDate: string; cover: File | null; type: string };
  processing: { isProcessing: boolean; deletingAlbumId: string | null };
  errors: { cover: string | null };
}

const initialState: State = {
  newAlbum: { title: "", releaseDate: "", cover: null, type: "Full Album" }, // Domyślny typ
  editAlbum: { id: null, title: "", releaseDate: "", cover: null, type: "Full Album" },
  processing: { isProcessing: false, deletingAlbumId: null },
  errors: { cover: null },
};

const reducer = (state: State, action: any): State => {
  switch (action.type) {
    case "SET_NEW_ALBUM":
      return { ...state, newAlbum: { ...state.newAlbum, ...action.payload } };
    case "SET_EDIT_ALBUM":
      return { ...state, editAlbum: { ...state.editAlbum, ...action.payload } };
    case "SET_PROCESSING":
      return { ...state, processing: { ...state.processing, ...action.payload } };
    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, ...action.payload } };
    default:
      return state;
  }
};

export const AlbumsTab = ({
  band,
  bech32Address,
  albums,
  onAddAlbum,
  onUpdateAlbum,
  onDeleteAlbum,
}: AlbumsTabProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const albumTypes = ["Full Album", "LP", "Single", "EP", "Demo", "Compilation", "Live", "Split"]; // Lista rodzajów

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024) {
        dispatch({ type: "SET_ERRORS", payload: { cover: "Cover must be less than 200 KB" } });
        dispatch({ type: "SET_NEW_ALBUM", payload: { cover: null } });
        dispatch({ type: "SET_EDIT_ALBUM", payload: { cover: null } });
      } else {
        dispatch({ type: "SET_ERRORS", payload: { cover: null } });
        if (state.editAlbum.id) {
          dispatch({ type: "SET_EDIT_ALBUM", payload: { cover: file } });
        } else {
          dispatch({ type: "SET_NEW_ALBUM", payload: { cover: file } });
        }
      }
    }
  };

  const handleAddAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.newAlbum.title || !state.newAlbum.cover || !bech32Address || !state.newAlbum.type || state.errors.cover) return;
    dispatch({ type: "SET_PROCESSING", payload: { isProcessing: true } });
    try {
      const newAlbum = await addAlbum(
        band.id,
        state.newAlbum.title,
        state.newAlbum.releaseDate,
        state.newAlbum.cover,
        bech32Address,
        state.newAlbum.type // Nowe pole
      );
      onAddAlbum(newAlbum);
      dispatch({ type: "SET_NEW_ALBUM", payload: { title: "", releaseDate: "", cover: null, type: "Full Album" } });
    } catch (error) {
      console.error("Error adding album:", error);
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: { isProcessing: false } });
    }
  };

  const handleEditAlbum = (album: Album) => {
    dispatch({
      type: "SET_EDIT_ALBUM",
      payload: { id: album.id, title: album.title, releaseDate: album.release_date || "", cover: null, type: album.type || "Full Album" },
    });
  };

  const handleUpdateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.editAlbum.id || !state.editAlbum.title || !bech32Address || !state.editAlbum.type) return;
    dispatch({ type: "SET_PROCESSING", payload: { isProcessing: true } });
    try {
      const updatedAlbum = await updateAlbum(
        state.editAlbum.id,
        state.editAlbum.title,
        state.editAlbum.releaseDate,
        state.editAlbum.cover,
        bech32Address,
        state.editAlbum.type // Nowe pole
      );
      onUpdateAlbum(updatedAlbum);
      dispatch({ type: "SET_EDIT_ALBUM", payload: { id: null, title: "", releaseDate: "", cover: null, type: "Full Album" } });
    } catch (error) {
      console.error("Error updating album:", error);
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: { isProcessing: false } });
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    if (!bech32Address) return;
    dispatch({ type: "SET_PROCESSING", payload: { deletingAlbumId: albumId } });
    try {
      await deleteAlbum(albumId, bech32Address);
      onDeleteAlbum(albumId);
    } catch (error) {
      console.error("Error deleting album:", error);
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: { deletingAlbumId: null } });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <form onSubmit={handleAddAlbum} className="space-y-4">
        <InputField
          label="Album Title"
          value={state.newAlbum.title}
          onChange={(e) => dispatch({ type: "SET_NEW_ALBUM", payload: { title: e.target.value } })}
          placeholder="Enter album title"
        />
        <InputField
          label="Release Date"
          value={state.newAlbum.releaseDate}
          onChange={(e) => dispatch({ type: "SET_NEW_ALBUM", payload: { releaseDate: e.target.value } })}
          type="date"
        />
        <div className="mb-4">
          <label htmlFor="albumType" className="block text-[#8a8a8a]">
            <strong>Album Type</strong>
          </label>
          <select
            id="albumType"
            value={state.newAlbum.type}
            onChange={(e) => dispatch({ type: "SET_NEW_ALBUM", payload: { type: e.target.value } })}
            className="w-full p-2 bg-[#2a2a2a] text-[#b0b0b0] border border-[#3a1c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a4a4a]"
          >
            {albumTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <label className="text-[#8a8a8a]">
            <strong>Cover:</strong>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="w-full p-2 bg-[#2a2a2a] text-[#b0b0b0] border border-[#3a1c1c] rounded-lg"
          />
          {state.errors.cover && <p className="text-[#8a4a4a] text-sm mt-1">{state.errors.cover}</p>}
          <p className="text-[#8a8a8a] text-sm mt-1">Max 200 KB</p>
        </motion.div>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:scale-105 transition-all duration-300 ease-in-out shadow-metal flex items-center gap-2"
          disabled={state.processing.isProcessing || !!state.errors.cover}
        >
          {state.processing.isProcessing ? <FaSpinner className="animate-spin" /> : "Add Album"}
        </button>
      </form>

      <div className="space-y-2">
        <h3 className="text-xl text-[#d0d0d0] mb-4">Existing Albums</h3>
        {albums.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {albums.map((album) => (
              <VinylCard
                key={album.id}
                album={album}
                onEdit={() => handleEditAlbum(album)}
                onDelete={() => handleDeleteAlbum(album.id)}
                canEdit={true}
                isDeleting={state.processing.deletingAlbumId === album.id}
                isEditing={state.editAlbum.id === album.id}
              />
            ))}
          </div>
        ) : (
          <p className="text-[#8a8a8a] italic">No albums added yet.</p>
        )}
      </div>

      {state.editAlbum.id && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60"
        >
          <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-metal border border-[#3a1c1c] w-full max-w-md">
            <h3 className="text-xl font-unbounded text-[#d0d0d0] mb-4 text-center">Edit Album</h3>
            <form onSubmit={handleUpdateAlbum} className="space-y-4">
              <InputField
                label="Title"
                value={state.editAlbum.title}
                onChange={(e) => dispatch({ type: "SET_EDIT_ALBUM", payload: { title: e.target.value } })}
                placeholder="Enter album title"
              />
              <InputField
                label="Release Date"
                value={state.editAlbum.releaseDate}
                onChange={(e) => dispatch({ type: "SET_EDIT_ALBUM", payload: { releaseDate: e.target.value } })}
                type="date"
              />
              <div className="mb-4">
                <label htmlFor="albumType" className="block text-[#8a8a8a]">
                  <strong>Album Type</strong>
                </label>
                <select
                  id="albumType"
                  value={state.editAlbum.type}
                  onChange={(e) => dispatch({ type: "SET_EDIT_ALBUM", payload: { type: e.target.value } })}
                  className="w-full p-2 bg-[#2a2a2a] text-[#b0b0b0] border border-[#3a1c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a4a4a]"
                >
                  {albumTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-[#8a8a8a] mb-1">
                  <strong>Cover:</strong>
                </label>
                {albums.find((a) => a.id === state.editAlbum.id)?.cover_url && (
                  <div className="flex justify-center mb-2">
                    <img
                      src={albums.find((a) => a.id === state.editAlbum.id)!.cover_url}
                      alt="Current album cover"
                      className="w-36 h-36 object-cover rounded-full shadow-metal border border-[#3a1c1c]"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="w-full p-2 bg-[#2a2a2a] text-[#b0b0b0] border border-[#3a1c1c] rounded-lg"
                />
                {state.errors.cover && (
                  <p className="text-[#8a4a4a] text-sm mt-1 text-center">{state.errors.cover}</p>
                )}
                <p className="text-[#8a8a8a] text-sm mt-1 text-center">Max 200 KB</p>
              </motion.div>
              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:scale-105 transition-all duration-300 ease-in-out shadow-metal flex items-center gap-2"
                  disabled={state.processing.isProcessing || !!state.errors.cover}
                >
                  {state.processing.isProcessing ? <FaSpinner className="animate-spin" /> : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_EDIT_ALBUM", payload: { id: null } })}
                  className="px-4 py-2 bg-[#3a1c1c] text-[#d0d0d0] rounded-lg hover:bg-[#4a2c2c] transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};