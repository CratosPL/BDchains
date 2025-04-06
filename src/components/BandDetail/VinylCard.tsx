import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Album } from "../../types/bandTypes";

interface VinylCardProps {
  album: Album;
  onEdit: () => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
}

export const VinylCard = ({ album, onEdit, onDelete, canEdit }: VinylCardProps) => (
  <div className="flex flex-col items-center gap-2">
    <motion.div
      className="relative w-36 h-36 group cursor-pointer"
      whileHover={{ rotateY: 180 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 backface-hidden">
        {album.cover_url && (
          <img
            src={album.cover_url}
            alt={`${album.title} cover`}
            className="w-full h-full object-cover rounded-full shadow-metal border border-[#3a1c1c] grayscale group-hover:filter-none transition-all duration-300"
          />
        )}
      </div>
      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#1a1a1a] flex flex-col items-center justify-center rounded-full border border-[#3a1c1c] shadow-metal">
        <span className="text-[#8a8a8a] text-xs">
          {album.release_date ? new Date(album.release_date).getFullYear() : "N/A"}
        </span>
      </div>
    </motion.div>
    <span className="text-[#d0d0d0] font-unbounded text-center text-xs group-hover:text-[#8a4a4a] transition-colors duration-300">
      {album.title}
    </span>
    <span className="text-[#8a8a8a] text-xs text-center">{album.type || "N/A"}</span>
    {canEdit && (
      <div className="flex gap-2 mt-2">
        <button
          onClick={onEdit}
          className="text-[#8a4a4a] hover:text-[#d0d0d0] transition duration-300"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(album.id)}
          className="text-[#8a4a4a] hover:text-[#d0d0d0] transition duration-300"
        >
          <FaTrash />
        </button>
      </div>
    )}
  </div>
);