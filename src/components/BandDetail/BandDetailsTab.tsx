"use client";

import { useReducer } from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import { updateBandDetails, updateBandBio } from "../../services/bandService";
import { Band } from "../../types/bandTypes";
import { InputField } from "./InputField";

interface BandDetailsTabProps {
  band: Band;
  bech32Address: string | undefined;
  onUpdateBand: (updatedBand: Band) => void;
}

interface State {
  bandDetails: { name: string; country: string; genre: string; yearFounded: string };
  bio: string;
  processing: { isProcessingDetails: boolean; isProcessingBio: boolean };
  errors: { details: { name?: string; country?: string; genre?: string; yearFounded?: string } };
}

const initialState: State = {
  bandDetails: { name: "", country: "", genre: "", yearFounded: "" },
  bio: "",
  processing: { isProcessingDetails: false, isProcessingBio: false },
  errors: { details: {} },
};

const reducer = (state: State, action: any): State => {
  switch (action.type) {
    case "SET_BAND_DETAILS":
      return { ...state, bandDetails: { ...state.bandDetails, ...action.payload } };
    case "SET_BIO":
      return { ...state, bio: action.payload };
    case "SET_PROCESSING":
      return { ...state, processing: { ...state.processing, ...action.payload } };
    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, ...action.payload } };
    case "RESET_FORM":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const BandDetailsTab = ({ band, bech32Address, onUpdateBand }: BandDetailsTabProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    bandDetails: { name: band.name, country: band.country, genre: band.genre, yearFounded: band.year_founded },
    bio: band.bio || "",
  });

  const validateDetails = () => {
    const errors: { name?: string; country?: string; genre?: string; yearFounded?: string } = {};
    if (!state.bandDetails.name) errors.name = "Name is required";
    if (!state.bandDetails.country) errors.country = "Country is required";
    if (!state.bandDetails.genre) errors.genre = "Genre is required";
    if (!state.bandDetails.yearFounded) errors.yearFounded = "Year founded is required";
    dispatch({ type: "SET_ERRORS", payload: { details: errors } });
    return Object.keys(errors).length === 0;
  };

  const handleUpdateBandDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bech32Address || !validateDetails()) return;
    dispatch({ type: "SET_PROCESSING", payload: { isProcessingDetails: true } });
    try {
      const updatedBand = await updateBandDetails(
        band.id,
        state.bandDetails.name,
        state.bandDetails.country,
        state.bandDetails.genre,
        state.bandDetails.yearFounded,
        bech32Address
      );
      onUpdateBand(updatedBand);
    } catch (error) {
      console.error("Error updating band details:", error);
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: { isProcessingDetails: false } });
    }
  };

  const handleUpdateBio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bech32Address) return;
    dispatch({ type: "SET_PROCESSING", payload: { isProcessingBio: true } });
    try {
      const updatedBand = await updateBandBio(band.id, state.bio, bech32Address);
      onUpdateBand(updatedBand);
    } catch (error) {
      console.error("Error updating bio:", error);
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: { isProcessingBio: false } });
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleUpdateBandDetails} className="space-y-4">
          <InputField
            label="Name"
            value={state.bandDetails.name}
            onChange={(e) => dispatch({ type: "SET_BAND_DETAILS", payload: { name: e.target.value } })}
            error={state.errors.details.name}
            placeholder="Enter name"
          />
          <InputField
            label="Country"
            value={state.bandDetails.country}
            onChange={(e) => dispatch({ type: "SET_BAND_DETAILS", payload: { country: e.target.value } })}
            error={state.errors.details.country}
            placeholder="Enter country"
          />
          <InputField
            label="Genre"
            value={state.bandDetails.genre}
            onChange={(e) => dispatch({ type: "SET_BAND_DETAILS", payload: { genre: e.target.value } })}
            error={state.errors.details.genre}
            placeholder="Enter genre"
          />
          <InputField
            label="Year Founded"
            value={state.bandDetails.yearFounded}
            onChange={(e) => dispatch({ type: "SET_BAND_DETAILS", payload: { yearFounded: e.target.value } })}
            error={state.errors.details.yearFounded}
            placeholder="Enter year founded"
            type="number"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:scale-105 transition-all duration-300 ease-in-out shadow-metal flex items-center gap-2"
            disabled={state.processing.isProcessingDetails}
          >
            {state.processing.isProcessingDetails ? <FaSpinner className="animate-spin" /> : "Save Details"}
          </button>
        </form>
        <form onSubmit={handleUpdateBio} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label className="text-[#8a8a8a]">
              <strong>Bio:</strong>
            </label>
            <textarea
              value={state.bio}
              onChange={(e) => dispatch({ type: "SET_BIO", payload: e.target.value })}
              className="w-full p-2 bg-[#2a2a2a] text-[#b0b0b0] border border-[#3a1c1c] rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-[#8a4a4a]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:scale-105 transition-all duration-300 ease-in-out shadow-metal flex items-center gap-2"
            disabled={state.processing.isProcessingBio}
          >
            {state.processing.isProcessingBio ? <FaSpinner className="animate-spin" /> : "Save Bio"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};