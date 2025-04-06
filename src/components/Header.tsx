"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import UserPanel from "./UserPanel";
import AddBandForm from "./AddBandForm";
import { User } from "../types/bandTypes";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../declarations/backend";
import { Modal } from "@mantine/core";

interface HeaderProps {
  user?: User | null;
  bech32Address?: string;
  isUserLoading?: boolean;
  onShowModal?: () => void;
  onUpdateUser?: (updatedUser: { username: string; avatarUrl: string | null }) => void;
  onLogout?: () => void;
  activeLink?: string;
  contributions?: number;
  showWeb3Login?: boolean;
}

const CANISTER_ID = "bkyz2-fmaaa-aaaaa-qaaaq-cai";

export default function Header({
  user: propUser,
  bech32Address,
  isUserLoading = false,
  onShowModal,
  onUpdateUser,
  onLogout,
  activeLink = "",
  contributions = 0,
  showWeb3Login = true,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [isAddBandOpen, setIsAddBandOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [actor, setActor] = useState<any>(null); // TODO: Zamień `any` na konkretny typ po wygenerowaniu IDL
  const [localUser, setLocalUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      console.log("Starting initAuth...");
      const authClient = await AuthClient.create();
      console.log("AuthClient created:", authClient);

      const agent = new HttpAgent({ host: "http://localhost:4943" });
      if (process.env.NODE_ENV !== "production") {
        await agent.fetchRootKey();
        console.log("Root key fetched for local dev");
      }

      const actorInstance = Actor.createActor(idlFactory, { agent, canisterId: CANISTER_ID });
      setActor(actorInstance);
      console.log("Actor created:", actorInstance);

      const isAuth = await authClient.isAuthenticated();
      console.log("Is authenticated:", isAuth);
      if (isAuth) {
        const identity = authClient.getIdentity();
        setIsAuthenticated(true);
        const principalStr = identity.getPrincipal().toString();
        setPrincipal(principalStr);
        console.log("Principal set:", principalStr);

        try {
          const userData = await actorInstance.getUser();
          console.log("User data from canister:", userData);
          if (userData && Object.keys(userData).length > 0 && !Array.isArray(userData)) {
            const user: User = {
              username: userData.username && userData.username.length > 0 ? userData.username[0] : "",
              avatarUrl: userData.avatarUrl && userData.avatarUrl.length > 0 ? userData.avatarUrl[0] : null,
              principal: principalStr,
              hasAccount: userData.hasAccount || false,
              usernameChanges: userData.usernameChanges ? Number(userData.usernameChanges) : 0,
              role: userData.role || "USER",
            };
            setLocalUser(user);
            console.log("Local user set:", user);
          } else {
            console.log("No user data (null or empty array), opening register modal");
            setIsRegisterModalOpen(true);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("Not authenticated yet");
      }
    };

    if (!isAuthenticated) {
      console.log("Running initAuth due to not authenticated");
      initAuth();
    }

    audioRef.current = new Audio("/audio/heartbeat.mp3");
    audioRef.current.volume = 0.5;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isAuthenticated]);

  const handleLogin = async () => {
    console.log("Starting handleLogin...");
    const authClient = await AuthClient.create();
    console.log("AuthClient created for login:", authClient);
    await authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: async () => {
        console.log("Login successful");
        const identity = authClient.getIdentity();
        setIsAuthenticated(true);
        const principalStr = identity.getPrincipal().toString();
        setPrincipal(principalStr);
        console.log("Logged in, principal:", principalStr);

        if (actor) {
          try {
            const userData = await actor.getUser();
            console.log("User data after login:", userData);
            if (userData && Object.keys(userData).length > 0 && !Array.isArray(userData)) {
              const user: User = {
                username: userData.username && userData.username.length > 0 ? userData.username[0] : "",
                avatarUrl: userData.avatarUrl && userData.avatarUrl.length > 0 ? userData.avatarUrl[0] : null,
                principal: principalStr,
                hasAccount: userData.hasAccount || false,
                usernameChanges: userData.usernameChanges ? Number(userData.usernameChanges) : 0,
                role: userData.role || "USER",
              };
              setLocalUser(user);
              console.log("Local user set after login:", user);
            } else {
              console.log("No user data after login (null or empty array), opening register modal");
              setIsRegisterModalOpen(true);
            }
          } catch (error) {
            console.error("Error fetching user data after login:", error);
          }
        } else {
          console.error("Actor not set during login");
        }
      },
      onError: (error) => {
        console.error("Login failed:", error);
      },
    });
  };

  const handleLogout = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipal(null);
    setLocalUser(null);
    setIsUserPanelOpen(false);
    console.log("Logged out");
    if (onLogout) onLogout();
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const avatarUrl = formData.get("avatarUrl") as string | null;

    console.log("Attempting to register:", { username, avatarUrl });

    if (!username || username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      console.error("Invalid username");
      alert("Username must be 3-20 characters and contain only letters, numbers, or underscores.");
      return;
    }

    if (!actor || !principal) {
      console.error("Actor or principal not set");
      alert("Authentication error. Please try logging in again.");
      return;
    }

    try {
      const result = await actor.register(username, avatarUrl ? [avatarUrl] : []);
      console.log("Registration result:", result);

      if (result) {
        const updatedUser: User = {
          username,
          avatarUrl,
          principal,
          hasAccount: true,
          usernameChanges: 0,
          role: "USER",
        };
        setLocalUser(updatedUser);
        setIsRegisterModalOpen(false);
        console.log("User registered:", updatedUser);
        if (onUpdateUser) onUpdateUser({ username, avatarUrl });
      } else {
        console.error("Registration failed: returned false");
        alert("Registration failed. Username may already be taken or server error.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed due to an error.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showWeb3Login) return;
      const avatarNode = avatarRef.current;
      const panelNode = panelRef.current;
      const clickedAvatar = avatarNode?.contains(event.target as Node);
      const clickedPanel = panelNode?.contains(event.target as Node);
      if (!clickedAvatar && !clickedPanel) setIsUserPanelOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showWeb3Login]);

  const handleAvatarClick = () => {
    if (!showWeb3Login) return;
    setIsUserPanelOpen((prev) => !prev);
    if (!isUserPanelOpen && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.error("Audio error:", err));
    }
  };

  const handleAddBandClick = () => {
    if (!isAuthenticated || !principal) {
      if (onShowModal) onShowModal();
      else handleLogin();
      return;
    }
    if (!localUser?.username) {
      setIsRegisterModalOpen(true);
      return;
    }
    setIsAddBandOpen(true);
    setIsMenuOpen(false);
  };

  const handleAddBandSubmit = async (bandData: any) => {
    console.log("Band forged from header:", bandData);
    setIsAddBandOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/encyclopedia", label: "Chains" },
    { href: "#", label: "Forge Band", onClick: handleAddBandClick },
    { href: "#", label: "News" },
    { href: "#", label: "Roadmap" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] bg-opacity-95 shadow-metal border-b border-[#3a1c1c]">
      <div className="container mx-auto flex justify-between items-center p-4 max-w-7xl">
        <div className="header-logo">
          <Link href="/">
            <img
              src="/images/logo.jpg"
              alt="Black Death Chains Logo"
              className="h-12 w-12 rounded-full transition duration-300 hover:brightness-125 hover:shadow-[0_0_10px_rgba(138,74,74,0.5)]"
            />
          </Link>
        </div>

        <nav className="hidden md:flex flex-grow justify-center">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.onClick ? (
                  <button
                    onClick={link.onClick}
                    className={`text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover ${
                      activeLink === link.label.toLowerCase() ? "text-[#8a4a4a] font-bold" : ""
                    }`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={`text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover ${
                      activeLink === link.label.toLowerCase() ? "text-[#8a4a4a] font-bold" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="md:hidden text-[#d0d0d0] focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-[#1a1a1a] p-4 md:hidden"
          >
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  {link.onClick ? (
                    <button
                      onClick={link.onClick}
                      className={`text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover ${
                        activeLink === link.label.toLowerCase() ? "text-[#8a4a4a] font-bold" : ""
                      }`}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover ${
                        activeLink === link.label.toLowerCase() ? "text-[#8a4a4a] font-bold" : ""
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>
        )}

        {showWeb3Login && (
          <div className="web3-login relative">
            {localUser ? (
              <div
                ref={avatarRef}
                className="flex items-center justify-center cursor-pointer"
                onClick={handleAvatarClick}
              >
                <img
                  src={localUser.avatarUrl || "/images/default-avatar.png"}
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full border-2 border-[#3a1c1c] shadow-metal transition duration-300 hover:shadow-[0_0_10px_rgba(138,74,74,0.3)]"
                />
              </div>
            ) : isUserLoading ? (
              <div className="h-10 w-10 rounded-full border-2 border-[#3a1c1c] flex items-center justify-center skull-loading">
                <span className="animate-spin text-[#8a4a4a]">⟳</span>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] hover:from-[#5a2e2e] hover:to-[#2a2a2a] text-[#d0d0d0] px-4 py-2 rounded-lg shadow-metal transition duration-300 font-unbounded uppercase tracking-wide"
              >
                FORGE IN
              </button>
            )}
            {isUserPanelOpen && localUser && (
              <div ref={panelRef} className="absolute top-14 right-0 z-50">
                <UserPanel
                  onViewAccount={handleLogout}
                  accountNumber={principal || null}
                  user={localUser}
                  contributions={contributions}
                  onUpdateUser={onUpdateUser}
                  onClose={() => setIsUserPanelOpen(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {isAddBandOpen && isAuthenticated && principal && (
        <AddBandForm
          onClose={() => setIsAddBandOpen(false)}
          onSubmit={handleAddBandSubmit}
          bech32Address={principal}
        />
      )}

      {isRegisterModalOpen && principal && (
        <Modal
          opened={isRegisterModalOpen}
          onClose={() => {
            console.log("Modal closed manually");
            setIsRegisterModalOpen(false);
          }}
          title={<span className="text-[#d0d0d0] font-unbounded uppercase tracking-wide">Forge Your Identity</span>}
          centered
          closeOnClickOutside={false}
          closeOnEscape={false}
          withCloseButton={false}
          styles={{
            content: { background: "linear-gradient(to bottom, #1a1a1a, #0d0d0d)", border: "1px solid #3a1c1c" },
            header: { background: "transparent", color: "#d0d0d0" },
            title: { color: "#d0d0d0", textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" },
          }}
        >
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="username" className="text-[#b0b0b0] font-unbounded uppercase tracking-wide text-sm">
                Username (required)
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                className="w-full p-2 mt-1 bg-[#2a2a2a] text-[#d0d0d0] rounded-lg border border-[#3a1c1c] focus:outline-none focus:ring-2 focus:ring-[#8a4a4a] transition duration-300"
                required
                onChange={(e) => console.log("Username input:", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="avatarUrl" className="text-[#b0b0b0] font-unbounded uppercase tracking-wide text-sm">
                Avatar URL (optional)
              </label>
              <input
                id="avatarUrl"
                name="avatarUrl"
                type="text"
                placeholder="Enter avatar URL"
                className="w-full p-2 mt-1 bg-[#2a2a2a] text-[#d0d0d0] rounded-lg border border-[#3a1c1c] focus:outline-none focus:ring-2 focus:ring-[#8a4a4a] transition duration-300"
                onChange={(e) => console.log("Avatar URL input:", e.target.value)}
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] hover:from-[#5a2e2e] hover:to-[#2a2a2a] text-[#d0d0d0] rounded-lg shadow-metal transition duration-300 font-unbounded uppercase tracking-wide"
              >
                Forge Account
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log("Cancel clicked");
                  setIsRegisterModalOpen(false);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1a1a1a] to-[#3a1c1c] hover:from-[#2a2a2a] hover:to-[#5a2e2e] text-[#d0d0d0] rounded-lg shadow-metal transition duration-300 font-unbounded uppercase tracking-wide"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </header>
  );
}