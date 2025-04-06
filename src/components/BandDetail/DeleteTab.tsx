"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaSpinner, FaTimes } from "react-icons/fa";
import { deleteBand } from "../../services/bandService";
import { Band } from "../../types/bandTypes";
import { useRouter } from "next/navigation"; // Zmieniono na next/navigation

interface DeleteTabProps {
  band: Band;
  bech32Address: string | undefined;
}

export const DeleteTab = ({ band, bech32Address }: DeleteTabProps) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false); // Nowy stan
  const router = useRouter(); // Używa next/navigation

  const handleDeleteBand = async () => {
    if (confirmationText !== "delete" || !bech32Address) return;
    setIsProcessing(true);
    try {
      await deleteBand(band.id, bech32Address);
      console.log("Band deleted successfully");
      router.push("/encyclopedia"); // Przekierowanie z next/navigation
    } catch (error) {
      console.error("Error deleting band:", error);
      setError("Failed to delete band. Please try again.");
    } finally {
      setIsProcessing(false);
      setIsConfirmationVisible(false); // Ukryj potwierdzenie po zakończeniu
    }
  };

  const handleCancel = () => {
    setIsConfirmationVisible(false); // Ukryj potwierdzenie
    setConfirmationText(""); // Wyczyść pole tekstowe
    setError(null); // Wyczyść błąd
  };

  const isDeleteEnabled = confirmationText === "delete";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-unbounded text-[#d0d0d0] text-center mb-6">Delete {band.name}</h2>
      {!isConfirmationVisible ? (
        <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-metal border border-[#3a1c1c] text-center">
          <p className="text-[#d0d0d0] mb-6">
            Are you sure you want to delete the band <strong>{band.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsConfirmationVisible(true)}
              className="px-6 py-2 bg-[#3a1c1c] text-[#d0d0d0] rounded-lg hover:bg-[#4a2c2c] hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FaTrash /> Delete
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:bg-[#3a3a3a] hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-metal border border-[#3a1c1c]">
          <div className="flex flex-col items-center space-y-6">
            <p className="text-[#d0d0d0] text-center">
              Are you sure you want to delete the band <strong>{band.name}</strong>? This action cannot be undone.
            </p>
            <p className="text-[#8a8a8a] text-center">
              To confirm deletion, please type <strong>"delete"</strong> in the field below.
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type 'delete' to confirm"
              className="w-full max-w-sm p-2 bg-[#1a1a1a] text-[#b0b0b0] border border-[#3a1c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a4a4a]"
            />
            {error && <p className="text-[#8a4a4a] text-sm">{error}</p>}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleDeleteBand}
                className="px-6 py-2 bg-[#3a1c1c] text-[#d0d0d0] rounded-lg hover:bg-[#4a2c2c] hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                disabled={!isDeleteEnabled || isProcessing}
              >
                {isProcessing ? <FaSpinner className="animate-spin" /> : <FaTrash />} Delete Band
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:bg-[#3a3a3a] hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};