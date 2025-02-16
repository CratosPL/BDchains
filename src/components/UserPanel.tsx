import { useState } from "react";
import { FaCopy, FaTrash, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import supabase from "../utils/supabase";

// Helper function to copy text to clipboard
const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Copied to clipboard:", text);
  } catch (error) {
    console.error("Failed to copy:", error);
  }
};

interface UserPanelProps {
  onViewAccount: () => void;
  accountNumber: string | null;
  user: { username: string; avatarUrl: string };
  onUpdateUser: (updatedUser: { username: string; avatarUrl: string | null }) => void;
}

function UserPanel({ onViewAccount, accountNumber, user, onUpdateUser }: UserPanelProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Added state for editing

  const handleCopy = async () => {
    if (accountNumber) {
      await copyToClipboard(accountNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ avatarUrl: null })
        .eq('bech32address', accountNumber); // Ensure column name matches

      if (error) throw error;

      onUpdateUser({ ...user, avatarUrl: null });
    } catch (error) {
      console.error("Error deleting avatar:", error);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${accountNumber}.${fileExt}`; // Use accountNumber as the file name
      const filePath = `avatars/${fileName}`; // Store in the 'avatars' bucket

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600', // Optional: Set cache control
          upsert: true, // Overwrite if file already exists
        });

      if (uploadError) {
        console.error("Error uploading avatar:", uploadError.message);
        return;
      }

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the user's avatarUrl in the database
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatarUrl: publicUrl })
        .eq('bech32address', accountNumber);

      if (updateError) {
        console.error("Error updating avatar URL:", updateError.message);
      } else {
        onUpdateUser({ ...user, avatarUrl: publicUrl }); // Update local state
      }
    }
    setIsEditingAvatar(false);
  };

  const handleEditUsername = async () => {
    const newUsername = prompt("Enter a new username:", user.username);
    if (newUsername) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ username: newUsername })
          .eq('bech32address', accountNumber);

        if (error) throw error;

        onUpdateUser({ ...user, username: newUsername });
      } catch (error) {
        console.error("Error updating username:", error);
      }
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing); // Toggle the editing state
  };

  return (
    <div className="user-panel bg-gray-800 p-6 rounded-lg shadow-lg absolute top-16 right-4 w-72">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div
            className="h-16 w-16 rounded-full overflow-hidden bg-gray-700 cursor-pointer"
            onClick={toggleEdit} // Enable editing when clicked
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{user.username}</h3>
            <p className="text-sm text-gray-400">User</p>
          </div>
        </div>
        <button
          onClick={handleEditUsername}
          className="px-2 py-1 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600"
        >
          <FaEdit />
        </button>
      </div>

      {/* Edit section */}
      {isEditing ? (
        <div className="mb-4">
          <input
            type="text"
            value={user.username}
            onChange={(e) => onUpdateUser({ ...user, username: e.target.value })}
            className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400"
            placeholder="Edit Username"
          />
        </div>
      ) : null}

      {isEditingAvatar ? (
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full p-2 rounded-lg bg-gray-700 text-white text-sm"
          />
        </div>
      ) : (
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setIsEditingAvatar(true)}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            <FaEdit className="inline mr-2" /> Change Avatar
          </button>
          <button
            onClick={handleDeleteAvatar}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            <FaTrash className="inline mr-2" /> Delete Avatar
          </button>
        </div>
      )}

      {/* Show Account Number Section */}
      <div className="mb-4">
        <button
          onClick={() => setShowAccountNumber(!showAccountNumber)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
        >
          {showAccountNumber ? (
            <>
              <FaEyeSlash className="inline mr-2" /> Hide Xion Account Number
            </>
          ) : (
            <>
              <FaEye className="inline mr-2" /> Show Xion Account Number
            </>
          )}
        </button>
      </div>

      {showAccountNumber && accountNumber && (
        <div className="text-white mb-4 p-2 bg-gray-700 rounded-lg">
          <p className="text-xs font-medium mb-1">Account Number:</p>
          <div className="flex items-center">
            <span className="text-sm truncate flex-1">{accountNumber}</span>
            <button
              onClick={handleCopy}
              className={`ml-2 transition duration-300 ${
                isCopied ? "text-green-500" : "text-gray-400 hover:text-white"
              }`}
              title="Copy to clipboard"
            >
              <FaCopy />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onViewAccount}
        className="w-full px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
      >
        Logout from Xion
      </button>
    </div>
  );
}

export default UserPanel;