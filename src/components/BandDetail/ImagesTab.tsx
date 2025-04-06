"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSpinner, FaImage, FaUpload, FaTrash } from "react-icons/fa";
import { updateBandImage, updateBandLogo } from "../../services/bandService";
import { Band } from "../../types/bandTypes";

interface ImagesTabProps {
  band: Band;
  bech32Address: string | undefined;
  onUpdateImage: (imageUrl: string) => void;
  onUpdateLogo: (imageUrl: string) => void;
}

export const ImagesTab = ({ band, bech32Address, onUpdateImage, onUpdateLogo }: ImagesTabProps) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bandImageFile, setBandImageFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(band.logo_url || null);
  const [bandImagePreview, setBandImagePreview] = useState<string | null>(band.image_url || null);
  const [isUpdatingLogo, setIsUpdatingLogo] = useState(false); // Stan dla aktualizacji logo
  const [isRemovingLogo, setIsRemovingLogo] = useState(false); // Stan dla usuwania logo
  const [isUpdatingImage, setIsUpdatingImage] = useState(false); // Stan dla aktualizacji obrazu
  const [isRemovingImage, setIsRemovingImage] = useState(false); // Stan dla usuwania obrazu
  const [errors, setErrors] = useState<{ image: string | null; logo: string | null; nonCommercial?: string | null }>({
    image: null,
    logo: null,
  });
  const [nonCommercialConfirmed, setNonCommercialConfirmed] = useState(false);

  const allowedTypes = ["image/jpeg", "image/png"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "image") => {
    const file = e.target.files?.[0];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, [type]: "Only JPG/PNG files are allowed" }));
        type === "logo" ? setLogoFile(null) : setBandImageFile(null);
        type === "logo" ? setLogoPreview(null) : setBandImagePreview(null);
      } else if (file.size > (type === "logo" ? 200 * 1024 : 500 * 1024)) {
        setErrors((prev) => ({
          ...prev,
          [type]: `${type === "logo" ? "Logo" : "Band image"} must be less than ${type === "logo" ? 200 : 500} KB`,
        }));
        type === "logo" ? setLogoFile(null) : setBandImageFile(null);
        type === "logo" ? setLogoPreview(null) : setBandImagePreview(null);
      } else {
        setErrors((prev) => ({ ...prev, [type]: null }));
        const preview = URL.createObjectURL(file);
        type === "logo"
          ? (setLogoFile(file), setLogoPreview(preview))
          : (setBandImageFile(file), setBandImagePreview(preview));
      }
    }
  };

  const handleNonCommercialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNonCommercialConfirmed(e.target.checked);
    setErrors((prev) => ({ ...prev, nonCommercial: null }));
  };

  const handleUpdateLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoFile || !bech32Address || errors.logo) return;
    if (!nonCommercialConfirmed) {
      setErrors((prev) => ({ ...prev, nonCommercial: "Please confirm non-commercial use of the logo" }));
      return;
    }

    setIsUpdatingLogo(true);
    try {
      const result = await updateBandLogo(band.id, logoFile);
      onUpdateLogo(result.logo_url);
      setLogoFile(null);
      setLogoPreview(null);
      setNonCommercialConfirmed(false);
    } catch (error) {
      console.error("Error updating logo:", error);
      setErrors((prev) => ({ ...prev, logo: "Failed to update logo" }));
    } finally {
      setIsUpdatingLogo(false);
    }
  };

  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bandImageFile || !bech32Address || errors.image) return;

    setIsUpdatingImage(true); // Tylko dla aktualizacji obrazu
    try {
      const result = await updateBandImage(band.id, bandImageFile);
      onUpdateImage(result.image_url);
      setBandImageFile(null);
      setBandImagePreview(null);
    } catch (error) {
      console.error("Error updating image:", error);
      setErrors((prev) => ({ ...prev, image: "Failed to update image" }));
    } finally {
      setIsUpdatingImage(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!bech32Address || !band.logo_url) return;
    setIsRemovingLogo(true);
    console.log("Attempting to remove logo for band:", band.id);
    try {
      const response = await fetch(`/api/bands/${band.id}/logo`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${bech32Address}` },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove logo: ${response.status} - ${errorText}`);
      }
      onUpdateLogo("");
      setLogoPreview(null);
      console.log("Logo removed successfully");
    } catch (error) {
      console.error("Error removing logo:", error);
      setErrors((prev) => ({ ...prev, logo: `Failed to remove logo: ${error.message}` }));
    } finally {
      setIsRemovingLogo(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!bech32Address || !band.image_url) return;
    setIsRemovingImage(true); // Tylko dla usuwania obrazu
    console.log("Attempting to remove band image for band:", band.id);
    try {
      const response = await fetch(`/api/bands/${band.id}/image`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${bech32Address}` },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove image: ${response.status} - ${errorText}`);
      }
      onUpdateImage("");
      setBandImagePreview(null);
      console.log("Band image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      setErrors((prev) => ({ ...prev, image: `Failed to remove image: ${error.message}` }));
    } finally {
      setIsRemovingImage(false);
    }
  };

  // Cleanup URL.createObjectURL
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview !== band.logo_url) URL.revokeObjectURL(logoPreview);
      if (bandImagePreview && bandImagePreview !== band.image_url) URL.revokeObjectURL(bandImagePreview);
    };
  }, [logoPreview, bandImagePreview, band.logo_url, band.image_url]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-3xl mx-auto space-y-8"
    >
      {/* Header */}
      <h2 className="text-2xl font-unbounded text-[#d0d0d0] text-center mb-6">Edit Images for {band.name}</h2>

      {/* Logo Section */}
      <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-metal border border-[#3a1c1c]">
        <h3 className="text-lg font-unbounded text-[#d0d0d0] text-center mb-4">Logo</h3>
        <div className="flex flex-col items-center space-y-4">
          {logoPreview || band.logo_url ? (
            <img
              src={logoPreview || band.logo_url!}
              alt="Logo preview"
              className="w-48 h-48 object-contain rounded-md border border-[#3a1c1c] shadow-md"
            />
          ) : (
            <div className="w-48 h-48 bg-[#1a1a1a] rounded-md border border-[#3a1c1c] flex items-center justify-center">
              <FaImage className="text-[#8a8a8a] text-3xl" />
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => handleFileChange(e, "logo")}
            className="w-full max-w-sm p-2 bg-[#1a1a1a] text-[#b0b0b0] border border-[#3a1c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a4a4a]"
          />
          <div className="text-center space-y-1">
            {errors.logo && <p className="text-[#8a4a4a] text-sm">{errors.logo}</p>}
            {errors.nonCommercial && <p className="text-[#8a4a4a] text-sm">{errors.nonCommercial}</p>}
            <p className="text-[#8a8a8a] text-sm">
              Max 200 KB (JPG/PNG) {logoFile && `| Size: ${(logoFile.size / 1024).toFixed(1)} KB`}
            </p>
          </div>
          {logoFile && (
            <label className="flex items-center text-[#b0b0b0] font-russo text-sm mt-2">
              <input
                type="checkbox"
                checked={nonCommercialConfirmed}
                onChange={handleNonCommercialChange}
                className="mr-2 accent-[#8a4a4a]"
                disabled={isUpdatingLogo || isRemovingLogo}
              />
              I confirm that the logo is used for non-commercial and fan purposes only.
            </label>
          )}
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={handleUpdateLogo}
              className="px-4 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              disabled={isUpdatingLogo || isRemovingLogo || !!errors.logo || !logoFile || (logoFile && !nonCommercialConfirmed)}
            >
              {isUpdatingLogo ? <FaSpinner className="animate-spin" /> : <FaUpload />} Update Logo
            </button>
            {band.logo_url && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="px-4 py-2 bg-[#3a1c1c] text-[#d0d0d0] rounded-lg hover:bg-[#4a2c2c] hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                disabled={isUpdatingLogo || isRemovingLogo}
              >
                <FaTrash /> Remove Logo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Separator */}
      <hr className="border-t border-[#3a1c1c] my-6" />

      {/* Band Image Section */}
      <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-metal border border-[#3a1c1c]">
        <h3 className="text-lg font-unbounded text-[#d0d0d0] text-center mb-4">Band Image</h3>
        <div className="flex flex-col items-center space-y-4">
          {bandImagePreview || band.image_url ? (
            <img
              src={bandImagePreview || band.image_url!}
              alt="Band image preview"
              className="w-80 h-48 object-cover rounded-md border border-[#3a1c1c] shadow-md"
            />
          ) : (
            <div className="w-80 h-48 bg-[#1a1a1a] rounded-md border border-[#3a1c1c] flex items-center justify-center">
              <FaImage className="text-[#8a8a8a] text-3xl" />
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => handleFileChange(e, "image")}
            className="w-full max-w-sm p-2 bg-[#1a1a1a] text-[#b0b0b0] border border-[#3a1c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a4a4a]"
          />
          <div className="text-center space-y-1">
            {errors.image && <p className="text-[#8a4a4a] text-sm">{errors.image}</p>}
            <p className="text-[#8a8a8a] text-sm">
              Max 500 KB (JPG/PNG) {bandImageFile && `| Size: ${(bandImageFile.size / 1024).toFixed(1)} KB`}
            </p>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={handleUpdateImage}
              className="px-4 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              disabled={isUpdatingImage || isRemovingImage || !!errors.image || !bandImageFile}
            >
              {isUpdatingImage ? <FaSpinner className="animate-spin" /> : <FaUpload />} Update Image
            </button>
            {band.image_url && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-[#3a1c1c] text-[#d0d0d0] rounded-lg hover:bg-[#4a2c2c] hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                disabled={isUpdatingImage || isRemovingImage}
              >
                <FaTrash /> Remove Image
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};