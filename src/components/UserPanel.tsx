"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FaCopy,
  FaTrash,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaExclamation,
} from "react-icons/fa";
import { Button } from "@mantine/core";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../declarations/backend";

const CANISTER_ID = "bkyz2-fmaaa-aaaaa-qaaaq-cai"; // Poprawny ID

const handleAvatarChange = async (file: File) => {
  try {
    const agent = new HttpAgent({ host: "http://localhost:4943" });
    if (process.env.NODE_ENV !== "production") {
      await agent.fetchRootKey();
    }
    const actor = Actor.createActor(idlFactory, { agent, canisterId: CANISTER_ID });
    const result = await actor.updateUser(user.username, ["new-avatar-url"]); // Przykład
    console.log("Avatar update result:", result);
  } catch (error) {
    console.error("Error uploading avatar:", error);
  }
};

interface UserPanelProps {
  onViewAccount: () => void;
  accountNumber: string | null; // Principal
  user: { username: string; avatarUrl: string | null; hasAccount: boolean; usernameChanges: number; role: string };
  onUpdateUser: (updatedUser: { username: string; avatarUrl: string | null }) => void;
  onClose: () => void;
}

interface Notification {
  id: number;
  message: string;
  type: "success" | "error";
}

function UserPanel({ onViewAccount, accountNumber, user, onUpdateUser, onClose }: UserPanelProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username);
  const [info, setInfo] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bandCount, setBandCount] = useState<number | null>(null);
  const [contributionCount, setContributionCount] = useState<number | null>(null);
  const [loadingBandCount, setLoadingBandCount] = useState(false);
  const [loadingContributionCount, setLoadingContributionCount] = useState(false);
  const [actor, setActor] = useState<any>(null);

  useEffect(() => {
    const initActor = async () => {
      const agent = new HttpAgent({ host: "http://localhost:4943" });
      agent.fetchRootKey();
      const actor = Actor.createActor(idlFactory, { agent, canisterId: CANISTER_ID });
      setActor(actor);
    };
    initActor();
  }, []);

  const addNotification = (message: string, type: "success" | "error") => {
    const newNotification = { id: Date.now(), message, type };
    setNotifications((prev) => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
    }, 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const validateUsername = (username: string): string | null => {
    if (username.length < 3) return "Username must be at least 3 characters long.";
    if (username.length > 20) return "Username must be 20 characters or less.";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Only letters, numbers, and underscores are allowed.";
    return null;
  };

  const handleCopy = async () => {
    if (accountNumber) {
      await copyToClipboard(accountNumber);
      setIsCopied(true);
      addNotification("Account number copied!", "success");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDeleteAvatar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!accountNumber || !actor) {
      addNotification("Login required to delete avatar.", "error");
      return;
    }
    try {
      const success = await actor.updateUser(user.username, []);
      if (success) {
        onUpdateUser({ username: user.username, avatarUrl: null });
        addNotification("Avatar deleted successfully!", "success");
      }
    } catch (error) {
      console.error("Error deleting avatar:", error);
      addNotification("Failed to delete avatar.", "error");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!accountNumber || !actor) {
      addNotification("Login required to update avatar.", "error");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 2 * 1024 * 1024;
      if (user.role !== "ADMIN" && file.size > maxSize) {
        addNotification("Avatar file size exceeds 2 MB limit.", "error");
        return;
      }

      const formData = new FormData();
      formData.append("address", accountNumber);
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload-avatar", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (result.error) throw new Error(result.error);

        const newAvatarUrl = result.url;
        const success = await actor.updateUser(user.username, [newAvatarUrl]);
        if (success) {
          onUpdateUser({ username: user.username, avatarUrl: newAvatarUrl });
          addNotification("Avatar updated successfully!", "success");
        }
      } catch (error: any) {
        console.error("Error uploading avatar:", error);
        addNotification(`Failed to update avatar: ${error.message || "Unknown error"}`, "error");
      }
      setIsEditingAvatar(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setEditedUsername(newUsername);
    const validationError = validateUsername(newUsername);
    if (validationError) {
      addNotification(validationError, "error");
    }
  };

  const handleEditUsername = async () => {
    if (!accountNumber || !actor) {
      addNotification("Login required to update username.", "error");
      return;
    }
    if (user.role !== "ADMIN" && user.usernameChanges >= 2) {
      addNotification("Username change limit reached.", "error");
      return;
    }
    const validationError = validateUsername(editedUsername);
    if (validationError) {
      addNotification(validationError, "error");
      return;
    }
    if (editedUsername !== user.username) {
      try {
        const success = await actor.updateUser(editedUsername, user.avatarUrl ? [user.avatarUrl] : []);
        if (success) {
          onUpdateUser({ username: editedUsername, avatarUrl: user.avatarUrl });
          addNotification("Username updated successfully!", "success");
          if (user.role === "USER") {
            setInfo(
              user.usernameChanges === 0
                ? "Username set. You can change it once more."
                : "Username changed. No further changes allowed."
            );
          }
        }
      } catch (error) {
        console.error("Error updating username:", error);
        addNotification("Failed to update username.", "error");
      }
    }
    setIsEditingUsername(false);
  };

  const toggleEditUsername = () => {
    if (!accountNumber || !actor) {
      addNotification("Login required to edit username.", "error");
      return;
    }
    if (user.role !== "ADMIN" && user.usernameChanges >= 2) {
      addNotification("Username change limit reached.", "error");
      return;
    }
    setIsEditingUsername(!isEditingUsername);
    setEditedUsername(user.username);
    if (user.role === "USER" && !isEditingUsername) {
      setInfo(
        user.usernameChanges === 0
          ? "You can change your username once after setting it."
          : "This is your last chance to change your username."
      );
    }
  };

  // Reszta kodu (renderowanie) pozostaje taka sama
  return (
    <div className="user-panel bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-4 sm:p-6 rounded-lg shadow-metal fixed top-16 right-2 sm:right-4 w-full max-w-96 mx-2 sm:mx-0 z-50 border border-[#3a1c1c]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-[#2a2a2a] border-2 border-[#3a1c1c] shadow-metal">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <img src="/images/default-avatar.png" alt="Default Avatar" className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            {isEditingUsername ? (
              <input
                type="text"
                value={editedUsername}
                onChange={handleUsernameChange}
                onBlur={handleEditUsername}
                onKeyDown={(e) => e.key === "Enter" && handleEditUsername()}
                className="text-base sm:text-lg font-semibold text-[#d0d0d0] bg-transparent border-b border-[#5a2e2e] focus:outline-none focus:border-[#8a4a4a] transition-all duration-300 ease-in-out w-full"
                aria-label="Edit username"
              />
            ) : (
              <h3
                className="text-base sm:text-lg font-semibold text-[#d0d0d0] font-unbounded uppercase tracking-wide"
                style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
              >
                {user.username || "Set Username"}
              </h3>
            )}
            <p className="text-xs sm:text-sm text-[#8a8a8a] font-unbounded uppercase tracking-wide">{user.role}</p>
          </div>
        </div>
        {(user.role === "ADMIN" || (user.role === "USER" && user.usernameChanges < 2)) && (
          <button
            onClick={toggleEditUsername}
            className="px-2 py-1 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] text-xs sm:text-sm rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:scale-105 transition-all duration-300 ease-in-out font-unbounded uppercase tracking-wide shadow-metal"
            aria-label={isEditingUsername ? "Save username" : "Edit username"}
          >
            {isEditingUsername ? <FaCheck /> : <FaEdit />}
          </button>
        )}
      </div>

      {isEditingAvatar ? (
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full p-2 rounded-lg bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] text-xs sm:text-sm hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:scale-105 transition-all duration-300 ease-in-out font-unbounded uppercase tracking-wide file:mr-2 file:py-1 file:px-2 sm:file:mr-4 sm:file:py-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-[#5a2e2e] file:text-[#d0d0d0] hover:file:bg-[#8a4a4a] shadow-metal"
            aria-label="Upload new avatar"
          />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
          <Button
            onClick={() => setIsEditingAvatar(true)}
            className="w-full px-2 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg text-xs sm:text-sm hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:scale-105 transition-all duration-300 ease-in-out font-unbounded uppercase tracking-wide shadow-metal"
            aria-label="Change avatar"
          >
            <FaEdit className="inline mr-1 sm:mr-2" /> Change Avatar
          </Button>
          <Button
            onClick={handleDeleteAvatar}
            className="w-full px-2 py-2 bg-[#2a1a1a] text-[#d0d0d0] rounded-lg text-xs sm:text-sm hover:bg-[#5a2e2e] hover:scale-105 transition-all duration-300 ease-in-out font-unbounded uppercase tracking-wide shadow-metal"
            aria-label="Delete avatar"
          >
            <FaTrash className="inline mr-1 sm:mr-2" /> Delete Avatar
          </Button>
        </div>
      )}

      <div className="mb-4">
        <Button
          onClick={() => setShowAccountNumber(!showAccountNumber)}
          className="w-full px-2 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg text-xs sm:text-sm hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:scale-105 transition-all duration-300 ease-in-out font-unbounded uppercase tracking-wide shadow-metal"
          aria-label={showAccountNumber ? "Hide account number" : "Show account number"}
        >
          {showAccountNumber ? (
            <>
              <FaEyeSlash className="inline mr-1 sm:mr-2" /> Hide ICP Principal
            </>
          ) : (
            <>
              <FaEye className="inline mr-1 sm:mr-2" /> Show ICP Principal
            </>
          )}
        </Button>
      </div>

      {showAccountNumber && accountNumber && (
        <div className="text-[#d0d0d0] mb-4 p-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] rounded-lg shadow-metal fade-in">
          <p className="text-xs font-medium mb-1 font-unbounded uppercase tracking-wide">Principal:</p>
          <div className="flex items-center">
            <span className="text-xs sm:text-sm truncate flex-1 font-unbounded uppercase tracking-wide">
              {accountNumber}
            </span>
            <button
              onClick={handleCopy}
              className={`ml-2 transition-all duration-300 ease-in-out ${
                isCopied ? "text-[#8a8a4a] scale-110" : "text-[#8a8a8a] hover:text-[#d0d0d0] hover:scale-105"
              }`}
              title="Copy to clipboard"
              aria-label="Copy account number to clipboard"
            >
              {isCopied ? <FaCheck /> : <FaCopy />}
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <Button
          onClick={() => setIsPreviewOpen(true)}
          className="w-full px-2 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg text-xs sm:text-sm hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:scale-105 transition-all duration-300 ease-in-out font-unbounded uppercase tracking-wide shadow-metal"
          aria-label="Preview Profile"
        >
          <FaEye className="inline mr-1 sm:mr-2" /> Preview Profile
        </Button>
      </div>

      {notifications.length > 0 && (
        <div className="mb-4 space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex justify-between items-center p-2 rounded-lg shadow-metal fade-in ${
                notif.type === "success"
                  ? "bg-gradient-to-r from-[#2a2a1a] to-[#1a1a1a]"
                  : "bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a]"
              }`}
            >
              <div className="flex items-center">
                {notif.type === "error" && (
                  <FaExclamation className="inline mr-1 sm:mr-2 text-xs sm:text-sm text-[#8a4a4a]" />
                )}
                <p
                  className={`text-xs sm:text-sm font-unbounded uppercase tracking-wide ${
                    notif.type === "success" ? "text-[#8a8a4a]" : "text-[#8a4a4a]"
                  }`}
                >
                  {notif.message}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-[#8a8a8a] hover:text-[#d0d0d0] transition duration-200"
                aria-label="Close notification"
              >
                <FaTimes className="text-xs sm:text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}

      {info && user.role === "USER" && (
        <div
          className="text-[#8a8a4a] text-xs sm:text-sm mb-4 uppercase tracking-wide fade-in"
          style={{ textShadow: "0 0 5px rgba(138, 138, 74, 0.3)" }}
        >
          {info}
        </div>
      )}

      <Button
        onClick={onViewAccount}
        className="w-full px-2 py-2 bg-[#2a1a1a] text-[#d0d0d0] rounded-lg text-xs sm:text-sm hover:bg-[#5a2e2e] hover:scale-105 transition-all duration-300 ease-in-out font-unbounded uppercase tracking-wide shadow-metal"
        aria-label="Logout from ICP"
      >
        Logout from ICP
      </Button>

      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-4 sm:p-6 rounded-lg shadow-metal w-full max-w-md border border-[#3a1c1c]">
            <h3
              className="text-xl sm:text-2xl font-bold text-[#d0d0d0] font-unbounded uppercase tracking-wide mb-4"
              style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
            >
              {user.username || "Unnamed Metalhead"}
            </h3>
            <img
              src={user.avatarUrl || "/images/default-avatar.png"}
              alt="User Avatar"
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full mx-auto mb-4 border-2 border-[#3a1c1c] shadow-metal"
            />
            <p className="text-[#b0b0b0] font-unbounded uppercase tracking-wide mb-2 text-xs sm:text-sm">
              Role: {user.role}
            </p>
            <p className="text-[#b0b0b0] font-unbounded uppercase tracking-wide mb-2 text-xs sm:text-sm">
              Bands Added: {loadingBandCount ? "Loading..." : bandCount !== null ? bandCount : "N/A"}
            </p>
            <p className="text-[#b0b0b0] font-unbounded uppercase tracking-wide mb-4 text-xs sm:text-sm">
              Contributions:{" "}
              {loadingContributionCount ? "Loading..." : contributionCount !== null ? contributionCount : "N/A"}
            </p>
            <Button
              onClick={() => setIsPreviewOpen(false)}
              className="w-full px-2 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg text-xs sm:text-sm hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:scale-105 transition-all duration-300 ease-in-out font-unbounded uppercase tracking-wide shadow-metal"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
        .shadow-metal {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.8), inset 0 0 5px rgba(138, 74, 74, 0.2);
        }
      `}</style>
    </div>
  );
}

export default UserPanel;