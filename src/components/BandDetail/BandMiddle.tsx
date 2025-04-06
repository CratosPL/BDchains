import { motion } from "framer-motion";
import { FaSkull, FaShareAlt, FaEdit, FaFlag } from "react-icons/fa";
import { Band } from "../../types/bandTypes";
import { useState } from "react";

interface BandMiddleProps {
  band: Band;
  canEdit: boolean;
  addedByUsername: string | null;
  updatedByUsername: string | null;
  onEdit: () => void;
}

export const BandMiddle = ({ band, canEdit, addedByUsername, updatedByUsername, onEdit }: BandMiddleProps) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleReportSubmit = () => {
    // Tutaj można dodać logikę wysyłki zgłoszenia do API
    console.log("Reported:", reportText);
    setReportText("");
    setShowReportModal(false);
  };

  const bioPreview = band.bio && band.bio.length > 650 ? `${band.bio.slice(0, 650)}...` : band.bio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-2"
    >
      {band.image_url && (
        <div className="mb-8">
          <img
            src={band.image_url}
            alt={`Band Image ${band.name}`}
            className="w-full max-h-[500px] object-contain rounded-lg shadow-metal border border-[#3a1c1c]"
          />
        </div>
      )}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2
            className="text-3xl font-unbounded text-[#d0d0d0] uppercase tracking-wide"
            style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
          >
            About {band.name}
          </h2>
          {canEdit && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="mt-2 sm:mt-0 px-3 py-1 bg-gradient-to-r from-[#8a4a4a] to-[#5a2e2e] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#3a1c1c] transition-all duration-300 shadow-metal border border-[#3a1c1c] flex items-center gap-2 text-sm font-unbounded uppercase tracking-wide"
            >
              <FaEdit size={16} />
              Edit Page
            </motion.button>
          )}
        </div>
        <p className="text-[#8a8a8a]">
          {isBioExpanded || !band.bio || band.bio.length <= 650 ? band.bio || "No description added yet." : bioPreview}
          {band.bio && band.bio.length > 650 && (
            <button
              onClick={() => setIsBioExpanded(!isBioExpanded)}
              className="text-[#8a4a4a] hover:text-[#d0d0d0] ml-2 text-sm"
            >
              {isBioExpanded ? "Show Less" : "Read More"}
            </button>
          )}
        </p>
        {/* Sekcja z przyciskami Add to Favorites i Share */}
        <div className="mt-4 flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 bg-gradient-to-r from-[#8a4a4a] to-[#5a2e2e] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#3a1c1c] transition-all duration-300 shadow-metal border border-[#3a1c1c] flex items-center gap-2 text-sm font-unbounded uppercase tracking-wide opacity-90 hover:opacity-100"
          >
            <FaSkull size={16} />
            Add to Favorites
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] transition-all duration-300 shadow-metal border border-[#3a1c1c] flex items-center gap-2 text-sm font-unbounded uppercase tracking-wide opacity-90 hover:opacity-100"
          >
            <FaShareAlt size={16} />
            Share
          </motion.button>
        </div>
        <hr className="my-6 border-[#3a1c1c]" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[#8a8a8a] text-xs">
          <span>
            <strong>Added:</strong> {formatDate(band.created_at)} by {addedByUsername || "Unknown User"}
            {band.updated_at && (
              <> | <strong>Last Edited:</strong> {formatDate(band.updated_at)} by {updatedByUsername || "Unknown User"}</>
            )}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReportModal(true)}
            className="mt-2 sm:mt-0 px-2 py-1 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] transition-all duration-300 shadow-metal border border-[#3a1c1c] flex items-center gap-1 text-xs font-unbounded uppercase tracking-wide"
          >
            <FaFlag size={12} />
            Report / Change
          </motion.button>
        </div>
      </div>

      {/* Modal do zgłaszania */}
      {showReportModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        >
          <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-metal border border-[#3a1c1c] w-full max-w-md">
            <h3 className="text-xl font-unbounded text-[#d0d0d0] mb-4">Report a Change</h3>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="w-full p-2 bg-[#2a2a2a] text-[#d0d0d0] rounded-lg border border-[#3a1c1c] mb-4"
              rows={4}
              placeholder="Describe the issue or suggested change..."
            />
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReportSubmit}
                className="px-4 py-2 bg-gradient-to-r from-[#8a4a4a] to-[#5a2e2e] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#3a1c1c] transition-all duration-300 shadow-metal border border-[#3a1c1c] text-sm font-unbounded uppercase tracking-wide"
              >
                Submit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] transition-all duration-300 shadow-metal border border-[#3a1c1c] text-sm font-unbounded uppercase tracking-wide"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};