"use client";

import { useReducer } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaSpinner } from "react-icons/fa";
import { addLink, deleteLink } from "../../services/bandService";
import { Band, Link as BandLink } from "../../types/bandTypes";
import { InputField } from "./InputField";

interface LinksTabProps {
  band: Band;
  bech32Address: string | undefined;
  links: BandLink[];
  onAddLink: (newLink: BandLink) => void;
  onDeleteLink: (linkId: string) => void;
}

interface State {
  newLink: { type: string; url: string };
  processing: { isProcessing: boolean; deletingLinkId: string | null };
  errors: { links: { type?: string; url?: string } };
}

const initialState: State = {
  newLink: { type: "", url: "" },
  processing: { isProcessing: false, deletingLinkId: null },
  errors: { links: {} },
};

const reducer = (state: State, action: any): State => {
  switch (action.type) {
    case "SET_NEW_LINK":
      return { ...state, newLink: { ...state.newLink, ...action.payload } };
    case "SET_PROCESSING":
      return { ...state, processing: { ...state.processing, ...action.payload } };
    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, ...action.payload } };
    default:
      return state;
  }
};

export const LinksTab = ({
  band,
  bech32Address,
  links,
  onAddLink,
  onDeleteLink,
}: LinksTabProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const validateLinks = () => {
    const errors: { type?: string; url?: string } = {};
    if (!state.newLink.type) errors.type = "Link type is required";
    if (!state.newLink.url) errors.url = "URL is required";
    dispatch({ type: "SET_ERRORS", payload: { links: errors } });
    return Object.keys(errors).length === 0;
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bech32Address || !validateLinks()) return;
    dispatch({ type: "SET_PROCESSING", payload: { isProcessing: true } });
    try {
      const newLink = await addLink(band.id, state.newLink.type, state.newLink.url, bech32Address);
      onAddLink(newLink);
      dispatch({ type: "SET_NEW_LINK", payload: { type: "", url: "" } });
    } catch (error) {
      console.error("Error adding link:", error);
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: { isProcessing: false } });
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!bech32Address) return;
    dispatch({ type: "SET_PROCESSING", payload: { deletingLinkId: linkId } });
    try {
      await deleteLink(linkId, bech32Address);
      onDeleteLink(linkId);
    } catch (error) {
      console.error("Error deleting link:", error);
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: { deletingLinkId: null } });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <form onSubmit={handleAddLink} className="space-y-4">
        <InputField
          label="Link Type"
          value={state.newLink.type}
          onChange={(e) => dispatch({ type: "SET_NEW_LINK", payload: { type: e.target.value } })}
          error={state.errors.links.type}
          placeholder="e.g., Website"
        />
        <InputField
          label="URL"
          value={state.newLink.url}
          onChange={(e) => dispatch({ type: "SET_NEW_LINK", payload: { url: e.target.value } })}
          error={state.errors.links.url}
          placeholder="Enter URL"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:scale-105 transition-all duration-300 ease-in-out shadow-metal flex items-center gap-2"
          disabled={state.processing.isProcessing}
        >
          {state.processing.isProcessing ? <FaSpinner className="animate-spin" /> : "Add Link"}
        </button>
      </form>

      <div className="space-y-2">
        <h3 className="text-xl text-[#d0d0d0] mb-4">Existing Links</h3>
        {links.length > 0 ? (
          <ul className="text-[#8a8a8a] space-y-4">
            {links.map((link) => (
              <li key={link.id} className="flex items-center gap-2">
                <span>
                  {link.type}: {link.url}
                </span>
                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="text-[#8a4a4a] hover:text-[#d0d0d0] transition duration-300 flex items-center"
                  disabled={state.processing.deletingLinkId === link.id}
                >
                  {state.processing.deletingLinkId === link.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[#8a8a8a] italic">No links added yet.</p>
        )}
      </div>
    </motion.div>
  );
};