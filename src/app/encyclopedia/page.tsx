"use client";

import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import Link from "next/link";
import AddBandForm from "../../components/AddBandForm";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";
import { useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const RecentBandsSection = lazy(() => import("../../components/RecentBandsSection"));
const LatestNewsSection = lazy(() => import("../../components/LatestNewsSection"));

export default function Encyclopedia(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isAddBandOpen, setIsAddBandOpen] = useState(false);
  const [recentBands, setRecentBands] = useState<any[]>([]);
  const [stats, setStats] = useState({ bands: 0, albums: 0, fans: 0 });
  const [contributions, setContributions] = useState(0);
  const [news, setNews] = useState<any[]>([]);
  const [isBandAdding, setIsBandAdding] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/bands/recent?limit=8");
      if (response.ok) {
        const bandsData = await response.json();
        console.log("Początkowe zespoły:", bandsData);
        setRecentBands(bandsData);
      }

      const statsResponse = await fetch("/api/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      const newsData = [
        { id: 1, title: "New Slayer Album Announced", date: "2025-02-20", excerpt: "Slayer returns..." },
        { id: 2, title: "Metal Fest 2025 Lineup Revealed", date: "2025-02-18", excerpt: "Metallica, Pantera..." },
        { id: 3, title: "Underground Band Spotlight", date: "2025-02-15", excerpt: "Discover Necrofrost..." },
      ];
      setNews(newsData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Encyclopedia render:", { recentBands, contributions });
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [recentBands, contributions]);

  const debouncedSearch = debounce(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    const localResults = recentBands.filter((band) =>
      band.name.toLowerCase().includes(query.toLowerCase())
    );
    if (localResults.length > 0) {
      setSearchResults(localResults.slice(0, 5));
      return;
    }

    try {
      const response = await fetch(`/api/bands/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setSearchResults(data.slice(0, 5));
    } catch (error) {
      console.error("Error during live search:", error);
      setSearchResults([]);
    }
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    await router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSearchResults([]);
  };

  const handleShowMore = async () => {
    if (!searchQuery) return;
    await router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSearchResults([]);
  };

  const handleAddBandSubmit = async (bandData: { band: any; txHash: string | null }) => {
    try {
      setIsBandAdding(true);
      const txHash = bandData.txHash;

      const statsResponse = await fetch("/api/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (txHash) {
        setContributions((prev) => prev + 1);
      }

      queryClient.invalidateQueries(["user"]);
      toast.success("Band forged successfully!");
    } catch (error) {
      console.error("Błąd przy dodawaniu zespołu w Encyclopedia:", error);
      toast.error("Failed to forge band. Try again.");
    } finally {
      setIsBandAdding(false);
    }
  };

  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const featuredPicks = [
    {
      title: "Best Black Metal from Poland",
      description: "Unleash the raw fury of Polish darkness.",
      image: "/images/black_metal_poland.jpg",
    },
    {
      title: "Finnish Death Metal Scene",
      description: "Discover the frostbitten riffs of the north.",
      image: "/images/finnish_metal.jpg",
    },
    {
      title: "Top Black/Death Underground",
      description: "The most brutal and obscure from the crypt.",
      image: "/images/thrash_metal.jpg",
    },
  ];

  return (
    <main className="text-[#b0b0b0] font-russo bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] min-h-screen">
      <Header
        user={null} // Dane użytkownika zarządzane przez Header.tsx
        bech32Address={null}
        isUserLoading={false}
        onShowModal={() => {}} // Placeholder, obsługiwane w Header.tsx
        onUpdateUser={() => {}} // Placeholder
        onLogout={() => {}} // Placeholder
        activeLink="encyclopedia"
        contributions={contributions}
        showWeb3Login={true}
      />
      <div className="pt-24 pb-10">
        <section className="container mx-auto px-6 max-w-7xl">
          <div className="mb-12 text-center" ref={searchRef}>
            <h1
              className="text-4xl md:text-5xl font-bold mb-6 font-unbounded text-[#d0d0d0] uppercase tracking-wide"
              style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
            >
              Black Death Chains
            </h1>
            <p className="text-lg mb-6 text-[#b0b0b0]">
              Forged in Blockchain, Bound by Metal – the ultimate crypt of black and death metal fury.
            </p>
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-4 mb-6 relative">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search the chains: bands, albums..."
                  className="w-full p-4 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-[#b0b0b0] font-russo rounded-lg shadow-metal focus:outline-none focus:ring-2 focus:ring-[#3a1c1c] transition duration-300 border border-[#3a1c1c]"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8a4a4a]" />
              </div>
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mx-auto max-w-3xl bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-[#3a1c1c] rounded-lg shadow-metal z-50 mt-2 max-h-64 overflow-y-auto">
                  {searchResults.map((band) => (
                    <Link
                      key={band.id}
                      href={`/band/${band.id}`}
                      className="block px-4 py-2 text-[#d0d0d0] hover:bg-[#3a1c1c] transition duration-300 border-b border-[#3a1c1c] last:border-b-0"
                      onClick={() => setSearchResults([])}
                    >
                      {band.name}
                    </Link>
                  ))}
                  {searchResults.length >= 5 && (
                    <button
                      onClick={handleShowMore}
                      className="block w-full px-4 py-2 text-[#8a4a4a] hover:text-[#d0d0d0] hover:bg-[#3a1c1c] transition duration-300 font-unbounded uppercase tracking-wide text-sm text-center"
                    >
                      Show More
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="mb-12 border-t border-[#3a1c1c] pt-6">
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal border border-[#3a1c1c] text-center">
              <h2
                className="text-xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-2"
                style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
              >
                Forge the Chains
              </h2>
              <p className="text-[#8a8a8a] font-russo mb-4">
                Add your blackened and deathly bands to bind the ultimate crypt in blockchain’s fire.
              </p>
              <button
                onClick={() => setIsAddBandOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] hover:from-[#5a2e2e] hover:to-[#2a2a2a] text-[#d0d0d0] rounded-lg shadow-metal transition duration-300 font-unbounded uppercase tracking-wide"
              >
                <FaPlus className="inline mr-2" /> Forge Band
              </button>
            </div>
          </div>

          <div className={`mb-12 border-t border-[#3a1c1c] pt-6 ${searchResults.length > 0 ? "pointer-events-none" : ""}`}>
            <h2
              className="text-2xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-4"
              style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
            >
              Forge by Letter
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-12 gap-1 justify-center">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  className="px-2 py-1 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-[#d0d0d0] font-unbounded uppercase tracking-wide text-sm rounded-lg hover:bg-gradient-to-b hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:shadow-metal transition duration-300 border border-[#3a1c1c]"
                  onClick={async () => {
                    const response = await fetch(`/api/bands/search?query=${letter}`);
                    if (!response.ok) console.error(await response.text());
                    else console.log(`Bands starting with ${letter}:`, await response.json());
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>
            <p className="text-[#8a8a8a] font-russo text-sm mt-2 text-center">
              "The" is ignored (e.g., "The Chasm" under C). Search the chains with or without special characters (e.g., "Motorhead" finds "Mötörhead").
            </p>
          </div>

          <Suspense fallback={<div className="text-[#8a8a8a] text-center">Loading Recent Chains...</div>}>
            <RecentBandsSection recentBands={recentBands} isBandAdding={isBandAdding} />
          </Suspense>

          <div className="mb-12 border-t border-[#3a1c1c] pt-6">
            <h2
              className="text-2xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-4"
              style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
            >
              Flames of the Abyss
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPicks.map((pick, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-4 rounded-lg shadow-metal border border-[#3a1c1c]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="w-full h-[150px] mb-2 bg-[#2a2a2a] rounded-lg overflow-hidden">
                    <img src={pick.image} alt={pick.title} className="w-full h-full object-cover" />
                  </div>
                  <h3
                    className="text-md font-unbounded text-[#d0d0d0] mb-2"
                    style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
                  >
                    {pick.title}
                  </h3>
                  <p className="text-[#8a8a8a] font-russo text-sm mb-2">{pick.description}</p>
                  <Link
                    href="#"
                    className="text-[#8a4a4a] hover:text-[#d0d0d0] font-unbounded uppercase tracking-wide text-sm"
                  >
                    Unleash
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <Suspense fallback={<div className="text-[#8a8a8a] text-center">Loading News...</div>}>
            <LatestNewsSection news={news} />
          </Suspense>

          <div className="mb-12 border-t border-[#3a1c1c] pt-6">
            <h2
              className="text-2xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-6"
              style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
            >
              Chains of the Crypt
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal border border-[#3a1c1c]">
                <p
                  className="text-3xl font-unbounded text-[#d0d0d0] mb-2"
                  style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
                >
                  {stats.bands}
                </p>
                <p className="text-[#8a8a8a] font-russo">Forged Bands</p>
              </div>
              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal border border-[#3a1c1c]">
                <p
                  className="text-3xl font-unbounded text-[#d0d0d0] mb-2"
                  style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
                >
                  {stats.albums}
                </p>
                <p className="text-[#8a8a8a] font-russo">Chained Albums</p>
              </div>
              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal border border-[#3a1c1c]">
                <p
                  className="text-3xl font-unbounded text-[#d0d0d0] mb-2"
                  style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
                >
                  {stats.fans}
                </p>
                <p className="text-[#8a8a8a] font-russo">Horde Legion</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {isAddBandOpen && (
        <AddBandForm
          onClose={() => setIsAddBandOpen(false)}
          onSubmit={handleAddBandSubmit}
          bech32Address={null} // Principal będzie przekazywany z Header.tsx
        />
      )}

      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </main>
  );
}

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const featuredPicks = [
  {
    title: "Best Black Metal from Poland",
    description: "Unleash the raw fury of Polish darkness.",
    image: "/images/black_metal_poland.jpg",
  },
  {
    title: "Finnish Death Metal Scene",
    description: "Discover the frostbitten riffs of the north.",
    image: "/images/finnish_metal.jpg",
  },
  {
    title: "Top Black/Death Underground",
    description: "The most brutal and obscure from the crypt.",
    image: "/images/thrash_metal.jpg",
  },
];