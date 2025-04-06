import { motion } from "framer-motion";
import { FaHeart, FaEye, FaTimes } from "react-icons/fa";
import { useState } from "react";

interface Fan {
  id: string;
  username: string;
  joined: string;
}

interface BandNFTsProps {
  nfts: any[];
  onViewFullNFTs: () => void;
}

export const BandNFTs = ({ nfts, onViewFullNFTs }: BandNFTsProps) => {
  // Static fan count (placeholder)
  const fanCount = 42;
  // Sample list of recent fans (placeholder)
  const recentFans: Fan[] = [
    { id: "fan1", username: "DarkForger", joined: "Mar 05, 2025" },
    { id: "fan2", username: "CryptLord", joined: "Mar 06, 2025" },
    { id: "fan3", username: "ShadowRiser", joined: "Mar 07, 2025" },
  ];

  // Sample fan NFT (placeholder)
  const fanNFT = {
    name: "Fan Oath NFT",
    image: "/images/fan-nft-example.jpg", // Replace with actual image
    description: "A token of allegiance to the band's legion.",
  };

  // State for managing the mint modal
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12 container mx-auto px-6 max-w-[1536px]"
    >
      <h2
        className="text-3xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-6 text-center"
        style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
      >
        Fan Legion
      </h2>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Fan statistics */}
        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4 rounded-lg shadow-metal border border-[#3a1c1c] text-center">
          <p className="text-[#d0d0d0] font-unbounded text-lg">Number of Fans: {fanCount}</p>
        </div>

        {/* Become a Fan button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMintModalOpen(true)} // Opens the modal
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8a4a4a] to-[#5a2e2e] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#3a1c1c] transition-all duration-300 shadow-metal border border-[#3a1c1c] text-sm font-unbounded uppercase tracking-wide"
          >
            <FaHeart size={16} />
            Become a Fan
          </motion.button>
        </div>

        {/* Dark NFT card */}
        <div className="flex justify-center">
          <motion.div
            className="relative w-64 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-lg shadow-metal border border-[#3a1c1c] overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(138, 74, 74, 0.4)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <img
                src={fanNFT.image}
                alt={fanNFT.name}
                className="w-full h-48 object-cover grayscale hover:filter-none transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-80"></div>
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg font-unbounded text-[#d0d0d0] mb-2 tracking-wide">
                {fanNFT.name}
              </h3>
              <p className="text-[#8a8a8a] text-xs line-clamp-2 font-russo">
                {fanNFT.description}
              </p>
            </div>
            <div className="h-1 bg-gradient-to-r from-[#8a4a4a] to-[#3a1c1c]"></div>
          </motion.div>
        </div>

        {/* Fan Wall - Recent fans */}
        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4 rounded-lg shadow-metal border border-[#3a1c1c]">
          <h3 className="text-xl font-unbounded text-[#d0d0d0] mb-4 text-center tracking-wide">
            Fan Wall
          </h3>
          {recentFans.length > 0 ? (
            <div className="space-y-2">
              {recentFans.map((fan) => (
                <p key={fan.id} className="text-[#b0b0b0] font-russo text-sm text-center">
                  {fan.username} - Joined: {fan.joined}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-[#8a8a8a] italic text-center">No fans have joined yet.</p>
          )}
        </div>

        {/* Optional button to view all NFTs */}
        {nfts.length > 0 && (
          <div className="mt-6 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewFullNFTs}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8a4a4a] to-[#5a2e2e] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#3a1c1c] transition-all duration-300 shadow-metal border border-[#3a1c1c] text-sm font-unbounded uppercase tracking-wide"
            >
              <FaEye size={16} />
              View All NFTs
            </motion.button>
          </div>
        )}
      </div>

      {/* Mint NFT Modal */}
      {isMintModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMintModalOpen(false)} // Closes modal on background click
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-6 rounded-lg shadow-metal border border-[#3a1c1c] w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside modal
          >
            {/* Close button */}
            <button
              onClick={() => setIsMintModalOpen(false)}
              className="absolute top-4 right-4 text-[#d0d0d0] hover:text-[#8a4a4a] transition duration-300"
            >
              <FaTimes size={20} />
            </button>

            {/* Title */}
            <h3 className="text-2xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-4 text-center">
              {fanNFT.name}
            </h3>

            {/* Enlarged NFT */}
            <div className="relative mb-4">
              <img
                src={fanNFT.image}
                alt={fanNFT.name}
                className="w-full h-64 object-cover rounded-md shadow-metal border border-[#3a1c1c]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Description */}
            <p className="text-[#8a8a8a] text-sm font-russo mb-4 text-center">
              {fanNFT.description}
            </p>

            {/* Transaction details for Xion blockchain */}
            <div className="bg-[#1a1a1a] p-4 rounded-md border border-[#3a1c1c] mb-4">
              <h4 className="text-lg font-unbounded text-[#d0d0d0] mb-2">Transaction Details</h4>
              <p className="text-[#b0b0b0] text-sm font-russo">
                Mint this NFT on the <span className="text-[#8a4a4a]">Xion Blockchain</span>.
                <br />
                Cost: 0.05 XION (Estimated Gas Fee: 0.001 XION)
                <br />
                Network: Xion Mainnet
              </p>
            </div>

            {/* Mint button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-4 py-2 bg-gradient-to-r from-[#8a4a4a] to-[#5a2e2e] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#3a1c1c] transition-all duration-300 shadow-metal border border-[#3a1c1c] text-sm font-unbounded uppercase tracking-wide mb-4"
            >
              Mint
            </motion.button>

            {/* Confirm button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMintModalOpen(false)}
              className="w-full px-4 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] transition-all duration-300 shadow-metal border border-[#3a1c1c] text-sm font-unbounded uppercase tracking-wide"
            >
              Confirm & Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};