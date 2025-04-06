"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import UserPanel from "./UserPanel";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../declarations/backend";

interface HeaderProps {
  activeLink?: string;
  contributions?: number;
  showWeb3Login?: boolean;
}

const CANISTER_ID = "bkyz2-fmaaa-aaaaa-qaaaq-cai";

export default function Header({
  activeLink = "",
  contributions = 0,
  showWeb3Login = true,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [actor, setActor] = useState<any>(null);

  // Inicjalizacja autoryzacji
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
      }
    };

    initAuth();

    audioRef.current = new Audio("/audio/heartbeat.mp3");
    audioRef.current.volume = 0.5;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Logowanie
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
      },
      onError: (error) => {
        console.error("Login failed:", error);
      },
    });
  };

  // Wylogowanie
  const handleLogout = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipal(null);
    setIsUserPanelOpen(false);
    console.log("Logged out");
  };

  // Obsługa kliknięcia poza panelem użytkownika
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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/encyclopedia", label: "Chains" },
    { href: "#", label: "Forge Band" },
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
                <Link
                  href={link.href}
                  className={`text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover ${
                    activeLink === link.label.toLowerCase() ? "text-[#8a4a4a] font-bold" : ""
                  }`}
                >
                  {link.label}
                </Link>
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
                  <Link
                    href={link.href}
                    className={`text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover ${
                      activeLink === link.label.toLowerCase() ? "text-[#8a4a4a] font-bold" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}

        {showWeb3Login && (
          <div className="web3-login relative">
            {isAuthenticated ? (
              <div
                ref={avatarRef}
                className="flex items-center justify-center cursor-pointer"
                onClick={handleAvatarClick}
              >
                <img
                  src="/images/default-avatar.png"
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full border-2 border-[#3a1c1c] shadow-metal transition duration-300 hover:shadow-[0_0_10px_rgba(138,74,74,0.3)]"
                />
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] hover:from-[#5a2e2e] hover:to-[#2a2a2a] text-[#d0d0d0] px-4 py-2 rounded-lg shadow-metal transition duration-300 font-unbounded uppercase tracking-wide"
              >
                FORGE IN
              </button>
            )}
            {isUserPanelOpen && isAuthenticated && (
              <div ref={panelRef} className="absolute top-14 right-0 z-50">
                <UserPanel
                  onViewAccount={handleLogout}
                  accountNumber={principal || null}
                  user={{ username: "User", avatarUrl: null, principal: principal || "", hasAccount: true, usernameChanges: 0, role: "USER" }}
                  contributions={contributions}
                  onClose={() => setIsUserPanelOpen(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}