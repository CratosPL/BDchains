import { motion } from "framer-motion";
import { VinylCard } from "./VinylCard";
import { Album } from "../../types/bandTypes";
import { FaEye } from "react-icons/fa";

interface BandAlbumsProps {
  albums: Album[];
  canEdit: boolean;
  onViewFullDiscography: () => void;
}

export const BandAlbums = ({ albums, canEdit, onViewFullDiscography }: BandAlbumsProps) => {
  // Ograniczamy wyświetlane albumy do maksymalnie 4
  const displayedAlbums = albums.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-1"
    >
      <div className="mb-8">
        <h2
          className="text-xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-4"
          style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
        >
          Forged Relics
        </h2>
        {displayedAlbums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayedAlbums.map((album) => (
              <VinylCard
                key={album.id}
                album={album}
                onEdit={() => {}}
                onDelete={() => {}}
                canEdit={false}
              />
            ))}
          </div>
        ) : (
          <p className="text-[#8a8a8a] italic">No relics forged yet.</p>
        )}
        {/* Przycisk pojawia się, gdy albumów jest więcej niż 4 */}
        {albums.length > 4 && (
          <div className="mt-4 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewFullDiscography}
              className="px-3 py-1 bg-gradient-to-r from-[#8a4a4a] to-[#5a2e2e] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#3a1c1c] transition-all duration-300 shadow-metal border border-[#3a1c1c] flex items-center justify-center gap-2 text-sm font-unbounded uppercase tracking-wide mx-auto"
            >
              <FaEye size={16} />
              Unveil All Relics
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};