"use client";

import React, { useState } from "react";
import { Button } from "@burnt-labs/ui";

interface CreateAccountModalProps {
  onClose: () => void;
  onCreateAccount: (data: { username: string, avatar: string }) => void;
}

function CreateAccountModal({ onClose, onCreateAccount }: CreateAccountModalProps) {
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleCreateAccount = () => {
    if (!username || !avatarFile) {
      alert("Please provide both a username and an avatar.");
      return;
    }
  
    setLoading(true);
  
    // Tworzymy URL avatara
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        onCreateAccount({ username, avatar: reader.result as string });
      }
    };
    reader.readAsDataURL(avatarFile); // Odczytujemy plik jako URL
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-metal max-w-md w-full">
        <h2 className="text-white text-2xl font-bold mb-4">WELCOME</h2>
        <p className="text-gray-300 mb-4">Create your first account to continue</p>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400"
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} structure="base" className="bg-gray-600 hover:bg-gray-700">
            SKIP FOR NOW
          </Button>
          <Button
            onClick={handleCreateAccount}
            structure="base"
            className="bg-red-500 hover:bg-red-600"
            disabled={loading}
          >
            {loading ? "CREATING..." : "LET'S GO"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountModal;