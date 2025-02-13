import { useState, useEffect } from "react";
import { FaCopy, FaTrash, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";

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
}

function UserPanel({ onViewAccount, accountNumber }: UserPanelProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false); // Track if the user is new
  const [showWelcomeModal, setShowWelcomeModal] = useState(false); // Control visibility of the welcome modal

  // Fetch user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.username) {
      setUsername(user.username);
      setAvatarUrl(user.avatarUrl || null);
      setIsNewUser(false); // User already has an account
    } else {
      setIsNewUser(true); // User is new and needs to create an account
      setShowWelcomeModal(true); // Show welcome modal for new users
    }
  }, []);

  // Handle copy-to-clipboard action
  const handleCopy = async () => {
    if (accountNumber) {
      await copyToClipboard(accountNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
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
          localStorage.setItem(
            "user",
            JSON.stringify({ username, avatarUrl: reader.result as string })
          );
        }
      };
      reader.readAsDataURL(file);
    }
    setIsEditingAvatar(false);
  };

  // Handle account creation for new users
  const handleCreateAccount = (username: string, avatarUrl: string | null) => {
    if (username) {
      localStorage.setItem("user", JSON.stringify({ username, avatarUrl }));
      setUsername(username);
      setAvatarUrl(avatarUrl);
      setIsNewUser(false); // Account created, user is no longer new
      setShowWelcomeModal(false); // Close the welcome modal
    } else {
      alert("Username is required to create an account.");
    }
  };

  // Handle skipping account creation
  const handleSkipAccountCreation = () => {
    setShowWelcomeModal(false); // Close the welcome modal without creating an account
  };

  return (
    <div className="user-panel bg-gray-800 p-6 rounded-lg shadow-lg absolute top-16 right-4 w-72">
      {/* Welcome Modal for New Users */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-white mb-4">WELCOME</h2>
            <p className="text-gray-400 mb-4">
            Add Your Name and Avatar
            </p>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white text-sm"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleCreateAccount(username, avatarUrl)}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                LET'S GO
              </button>
              <button
                onClick={handleSkipAccountCreation}
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                SKIP FOR NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Panel */}
      <div className="flex items-center space-x-4 mb-4">
        <div
          className="h-16 w-16 rounded-full overflow-hidden bg-gray-700 cursor-pointer"
          onClick={() => setShowWelcomeModal(true)} // Open welcome modal on avatar click
        >
          {avatarUrl ? (
            <img
              src={avatarUrl || "/placeholder.svg"}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{username}</h3>
          <p className="text-sm text-gray-400">User</p> {/* Changed from username to "User" */}
        </div>
      </div>

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