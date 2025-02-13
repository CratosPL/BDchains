// UserPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { FaCopy, FaTrash, FaEdit } from "react-icons/fa";

// Funkcja pomocnicza do kopiowania tekstu do schowka
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
  accountNumber: string | null; // Przechowuje numer konta użytkownika
}

function UserPanel({ onViewAccount, accountNumber }: UserPanelProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  // Fetch user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.username && user.avatarUrl) {
      setUsername(user.username);
      setAvatarUrl(user.avatarUrl);
    }
  }, []);

  // Handle copy-to-clipboard action
  const handleCopy = async () => {
    if (accountNumber) {
      await copyToClipboard(accountNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset "copied" status after 2 seconds
    }
  };

  // Handle avatar deletion
  const handleDeleteAvatar = () => {
    setAvatarUrl(null);
    localStorage.setItem("user", JSON.stringify({ username, avatarUrl: null }));
  };

  // Handle avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatarUrl(reader.result as string);
          localStorage.setItem("user", JSON.stringify({ username, avatarUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
    setIsEditingAvatar(false);
  };

  return (
    <div className="user-panel bg-gray-800 p-6 rounded-lg shadow-metal absolute top-16 right-4">
      {username && (
        <div className="text-white mb-4">
          <span className="font-bold">Welcome, {username}</span>
        </div>
      )}

      {avatarUrl && (
        <div className="relative mb-4">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="h-20 w-20 rounded-full border-2 border-red-500 object-cover"
          />
          <button
            onClick={handleDeleteAvatar}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition duration-300"
            title="Delete Avatar"
          >
            <FaTrash size={12} />
          </button>
          <button
            onClick={() => setIsEditingAvatar(true)}
            className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition duration-300"
            title="Change Avatar"
          >
            <FaEdit size={12} />
          </button>
        </div>
      )}

      {isEditingAvatar && (
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
          />
        </div>
      )}

      {accountNumber && (
        <div className="text-white mb-4 flex items-center">
          <span className="font-bold">Account Number:</span>
          <span className="ml-2">{accountNumber}</span>
          <button
            onClick={handleCopy}
            className={`ml-2 transition duration-300 ${
              isCopied ? "text-red-500" : "text-gray-400 hover:text-red-500"
            }`}
            title="Copy to clipboard"
          >
            <FaCopy />
          </button>
        </div>
      )}

      <button
        onClick={onViewAccount}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
      >
        Logout from Xion
      </button>
    </div>
  );
}

export default UserPanel;