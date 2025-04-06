"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa"; // Ikona krzyżyka
import { BandDetailsTab } from "./BandDetailsTab";
import { MembersTab } from "./MembersTab";
import { AlbumsTab } from "./AlbumsTab";
import { ImagesTab } from "./ImagesTab";
import { LinksTab } from "./LinksTab";
import { DeleteTab } from "./DeleteTab";
import { EditModalProps } from "../../types/bandTypes";

export const EditModal = ({
  band,
  bech32Address,
  isOpen,
  onClose,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onUpdateBand,
  onAddAlbum,
  onUpdateAlbum,
  onDeleteAlbum,
  onAddLink,
  onDeleteLink,
  onUpdateImage,
  onUpdateLogo,
  onDeleteBand,
  members,
  pastMembers,
  albums,
  links,
}: EditModalProps) => {
  const [activeTab, setActiveTab] = useState<"details" | "members" | "albums" | "images" | "links" | "delete">("details");

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    >
      <div className="bg-[#1a1a1a] p-4 rounded-lg shadow-metal border border-[#3a1c1c] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative sm:p-6">
        {/* Przycisk zamykania w prawym górnym rogu */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[#d0d0d0] hover:text-[#8a4a4a] transition duration-300 sm:top-4 sm:right-4"
          aria-label="Close modal"
        >
          <FaTimes size={18} className="sm:size-[20px]" />
        </button>
        <h2 className="text-xl font-unbounded text-[#d0d0d0] mb-3 text-center sm:text-2xl sm:mb-4">
          Edit {band.name}
        </h2>
        <div className="flex overflow-x-auto border-b border-[#3a1c1c] mb-3 sm:mb-4">
          {["details", "members", "albums", "images", "links", "delete"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-2 py-1 text-xs uppercase whitespace-nowrap ${
                activeTab === tab
                  ? "text-[#8a4a4a] border-b-2 border-[#8a4a4a]"
                  : "text-[#8a8a8a] hover:text-[#d0d0d0]"
              } sm:px-4 sm:py-2 sm:text-sm`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "details" && (
          <BandDetailsTab band={band} bech32Address={bech32Address} onUpdateBand={onUpdateBand} />
        )}
        {activeTab === "members" && (
          <MembersTab
            band={band}
            bech32Address={bech32Address}
            members={members}
            pastMembers={pastMembers}
            onAddMember={onAddMember}
            onUpdateMember={onUpdateMember}
            onDeleteMember={onDeleteMember}
          />
        )}
        {activeTab === "albums" && (
          <AlbumsTab
            band={band}
            bech32Address={bech32Address}
            albums={albums}
            onAddAlbum={onAddAlbum}
            onUpdateAlbum={onUpdateAlbum}
            onDeleteAlbum={onDeleteAlbum}
          />
        )}
        {activeTab === "images" && (
          <ImagesTab
            band={band}
            bech32Address={bech32Address}
            onUpdateImage={onUpdateImage}
            onUpdateLogo={onUpdateLogo}
          />
        )}
        {activeTab === "links" && (
          <LinksTab
            band={band}
            bech32Address={bech32Address}
            links={links}
            onAddLink={onAddLink}
            onDeleteLink={onDeleteLink}
          />
        )}
        {activeTab === "delete" && (
          <DeleteTab
            band={band}
            bech32Address={bech32Address}
            onDeleteBand={onDeleteBand}
            onClose={onClose}
          />
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-[#3a1c1c] text-[#d0d0d0] rounded-lg hover:bg-[#4a2c2c] transition duration-300 sm:mt-6"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};