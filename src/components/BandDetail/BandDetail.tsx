"use client";

// React and Next.js
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Third-party libraries
import { motion } from "framer-motion";
import { FaHeart, FaShareAlt, FaEdit, FaTrash, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { AuthClient } from "@dfinity/auth-client"; // Nowy import dla ICP
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Custom hooks and services
import { useBandData } from "../../hooks/useBandData";
import { fetchUser, updateUser } from "../../services/api";
import { deleteBand } from "../../services/bandService";

// Types
import { Band, Member, Album, BandLink } from "../../types/bandTypes";

// Components
import { BandInfo } from "./BandInfo";
import { BandMiddle } from "./BandMiddle";
import { BandAlbums } from "./BandAlbums";
import { BandNFTs } from "./BandNFTs";
import { EditModal } from "./EditModal";
import { VinylCard } from "./VinylCard";
import Footer from "../../components/Footer";
import LoadingScreen from "../LoadingScreen";
import Header from "../../components/Header";

export default function BandDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Stan autoryzacji ICP
  const [principal, setPrincipal] = useState<string | null>(null); // Principal zamiast bech32Address

  const {
    band,
    setBand,
    members,
    setMembers,
    pastMembers,
    setPastMembers,
    albums,
    setAlbums,
    links,
    setLinks,
    addedByUsername,
    updatedByUsername,
    isLoading,
    error,
    fetchBandDetails,
  } = useBandData(id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDiscographyModal, setShowDiscographyModal] = useState(false);
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAllChronicles, setShowAllChronicles] = useState(false);

  // Inicjalizacja AuthClient dla ICP
  useEffect(() => {
    const initAuth = async () => {
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        setIsAuthenticated(true);
        setPrincipal(identity.getPrincipal().toString());
      }
    };
    initAuth();
    window.scrollTo(0, 0);
  }, [id]);

  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", principal],
    queryFn: () => fetchUser(principal!),
    enabled: !!principal,
    staleTime: 5 * 60 * 1000,
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ username, avatarUrl }: { username: string; avatarUrl: string | null }) =>
      updateUser(principal!, username, avatarUrl),
    onSuccess: (result) => {
      queryClient.setQueryData(["user", principal], result.data[0]);
      console.log("BandDetail: User updated successfully:", result.data[0]);
    },
    onError: (error) => {
      console.error("BandDetail: Error updating user:", error);
    },
  });

  const handleUpdateUser = (updatedUser: { username: string; avatarUrl: string | null }) => {
    updateUserMutation.mutate(updatedUser);
  };

  const handleLogin = async () => {
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: () => {
        const identity = authClient.getIdentity();
        setIsAuthenticated(true);
        setPrincipal(identity.getPrincipal().toString());
      },
    });
  };

  const handleLogout = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipal(null);
  };

  const handleAddMember = (newMember: Member) => {
    setMembers([...members, newMember]);
    fetchBandDetails();
    setNotification("Member added successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(members.map((m) => (m.id === updatedMember.id ? updatedMember : m)));
    setPastMembers(pastMembers.map((m) => (m.id === updatedMember.id ? updatedMember : m)));
    fetchBandDetails();
    setNotification("Member updated successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId));
    setPastMembers(pastMembers.filter((m) => m.id !== memberId));
    fetchBandDetails();
    setNotification("Member deleted successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateBand = (updatedBand: Band) => {
    setBand(updatedBand);
    fetchBandDetails();
    setNotification("Band updated successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddAlbum = (newAlbum: Album) => {
    setAlbums([...albums, newAlbum]);
    fetchBandDetails();
    setNotification("Album added successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateAlbum = (updatedAlbum: Album) => {
    setAlbums(albums.map((a) => (a.id === updatedAlbum.id ? updatedAlbum : a)));
    fetchBandDetails();
    setNotification("Album updated successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteAlbum = (albumId: string) => {
    setAlbums(albums.filter((a) => a.id !== albumId));
    fetchBandDetails();
    setNotification("Album deleted successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddLink = (newLink: BandLink) => {
    setLinks([...links, newLink]);
    fetchBandDetails();
    setNotification("Link added successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteLink = (linkId: string) => {
    setLinks(links.filter((l) => l.id !== linkId));
    fetchBandDetails();
    setNotification("Link deleted successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateImage = (imageUrl: string) => {
    setBand({ ...band!, image_url: imageUrl });
    fetchBandDetails();
    setNotification("Image updated successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateLogo = (logoUrl: string) => {
    setBand({ ...band!, logo_url: logoUrl });
    fetchBandDetails();
    setNotification("Logo updated successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteBand = async () => {
    if (!principal) return;
    try {
      await deleteBand(id, principal);
      await router.push("/encyclopedia");
      setNotification("Band deleted successfully!");
      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      console.error("Error deleting band:", error);
      if (error.message?.includes("404")) {
        await router.push("/encyclopedia");
        setNotification("Band already deleted!");
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification("Failed to delete band");
        setTimeout(() => setNotification(null), 3000);
      }
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (error || !band) return <div className="text-[#8a4a4a]">{error || "Band not found in the chains"}</div>;

  const isAuthor = isAuthenticated && principal === band.added_by;
  const isAdmin = isAuthenticated && user?.role === "ADMIN";
  const canEdit = isAuthor || isAdmin;

  const currentYear = new Date().getFullYear();
  const yearsActive = band.year_founded ? currentYear - band.year_founded : "N/A";

  const sortedAlbums = [...albums].sort((a, b) => {
    const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
    const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const bandNFTs = [
    {
      id: "nft1",
      name: `${band.name} – Eternal Chains`,
      image: "/images/nft-example1.jpg",
      description: "A cursed relic forged in the blockchain abyss.",
      tokenId: "0x123",
    },
    {
      id: "nft2",
      name: `${band.name} – Skullbound Legacy`,
      image: "/images/nft-example2.jpg",
      description: "A shard of the band's dark history, minted for the horde.",
      tokenId: "0x456",
    },
    {
      id: "nft3",
      name: `${band.name} – Cryptic Sigil`,
      image: "/images/nft-example3.jpg",
      description: "A mystical token binding the band's legacy to the void.",
      tokenId: "0x789",
    },
  ];

  const comments = [
    {
      id: "comment1",
      username: "DarkForger",
      date: "Mar 05, 2025",
      text: "Metallica's early albums are pure fire! 'Kill 'Em All' changed my life.",
    },
    {
      id: "comment2",
      username: "CryptLord",
      date: "Mar 06, 2025",
      text: "I love their live performances. Saw them in '92 – unforgettable!",
    },
  ];

  const generateChronicles = () => {
    const chronicles = [];
    if (band.year_founded) {
      chronicles.push(`${band.year_founded}: Founding of ${band.name}.`);
    }
    if (albums.length > 0) {
      albums.forEach((album) => {
        if (album.release_date) {
          const date = new Date(album.release_date).getFullYear();
          chronicles.push(`${date}: Release of the album "${album.title}".`);
        }
      });
    }
    if (members.length > 0) {
      chronicles.push(`${currentYear}: Current lineup consists of ${members.length} member${members.length === 1 ? "" : "s"}.`);
    }
    chronicles.sort((a, b) => {
      const yearA = parseInt(a.split(":")[0]);
      const yearB = parseInt(b.split(":")[0]);
      return yearA - yearB;
    });
    return chronicles.length > 0 ? chronicles : [`No chronicles available for ${band.name}. Add history via edit!`];
  };

  const chronicles = generateChronicles();
  const displayChronicles = showAllChronicles ? chronicles : chronicles.slice(0, 5);

  return (
    <main className="text-[#b0b0b0] font-russo bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] min-h-screen">
      <Header
        user={user}
        bech32Address={principal} // Zamieniamy na principal
        isUserLoading={isUserLoading}
        onShowModal={handleLogin} // Zamieniamy na handleLogin
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
        activeLink="chains"
        contributions={0}
        showWeb3Login={true}
      />
      <div className="pt-32 pb-16">
        {band.image_url && (
          <section
            className="bg-cover bg-center relative py-12 lg:py-16 min-h-[300px] bg-fixed"
            style={{ backgroundImage: `url(${band.image_url})` }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${band.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(4px)",
                zIndex: -1,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] opacity-70"></div>
            <div className="container mx-auto px-6 max-w-[1536px] text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row items-center justify-center gap-8 mx-auto max-w-4xl"
              >
                {band.logo_url && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    src={band.logo_url}
                    alt={`Sigil of ${band.name}`}
                    className="max-w-[200px] rounded-lg"
                  />
                )}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl lg:text-7xl font-unbounded text-[#d0d0d0] uppercase tracking-wide"
                  style={{
                    textShadow: "0 0 15px rgba(138, 74, 74, 0.7), 0 0 5px rgba(138, 74, 74, 0.5)",
                    WebkitTextStroke: "1.5px rgba(138, 74, 74, 0.3)",
                  }}
                >
                  {band.name}
                </motion.h1>
              </motion.div>
            </div>
          </section>
        )}

        <section className="container mx-auto px-6 max-w-[1536px] grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <BandInfo band={band} members={members} pastMembers={pastMembers} links={links} />

            <motion.div
              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4 rounded-lg shadow-metal border border-[#3a1c1c]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2
                className="text-xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-4 text-center"
                style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
              >
                Chronicles of the Horde
              </h2>
              <div className="space-y-2">
                {displayChronicles.map((chronicle, index) => (
                  <p key={index} className="text-[#b0b0b0] font-russo text-sm">
                    {chronicle}
                  </p>
                ))}
                {chronicles.length > 5 && !showAllChronicles && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAllChronicles(true)}
                    className="mt-2 px-4 py-1 bg-gradient-to-r from-[#8a4a4a] to-[#5a2e2e] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#3a1c1c] transition-all duration-300 shadow-md border border-[#3a1c1c] text-sm font-unbounded uppercase tracking-wide w-full"
                  >
                    Read More
                  </motion.button>
                )}
                {showAllChronicles && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAllChronicles(false)}
                    className="mt-2 px-4 py-1 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] transition-all duration-300 shadow-md border border-[#3a1c1c] text-sm font-unbounded uppercase tracking-wide w-full"
                  >
                    Show Less
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>

          <BandMiddle
            band={band}
            canEdit={canEdit}
            addedByUsername={addedByUsername}
            updatedByUsername={updatedByUsername}
            onEdit={() => setIsEditModalOpen(true)}
          />

          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="w-full max-w-md">
              <h2
                className="text-xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-4 text-center"
                style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
              >
                Chains of the Legion
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#1a1a1a] p-3 rounded-lg shadow-metal border border-[#3a1c1c] text-center">
                  <p className="text-[#d0d0d0] font-unbounded">{albums.length}</p>
                  <p className="text-[#8a8a8a] text-sm">Forged Albums</p>
                </div>
                <div className="bg-[#1a1a1a] p-3 rounded-lg shadow-metal border border-[#3a1c1c] text-center">
                  <p className="text-[#d0d0d0] font-unbounded">{yearsActive}</p>
                  <p className="text-[#8a8a8a] text-sm">Years Bound</p>
                </div>
                <div className="bg-[#1a1a1a] p-3 rounded-lg shadow-metal border border-[#3a1c1c] text-center">
                  <p className="text-[#d0d0d0] font-unbounded">{members.length}</p>
                  <p className="text-[#8a8a8a] text-sm">Current Horde</p>
                </div>
              </div>
              <BandAlbums
                albums={albums}
                canEdit={canEdit}
                onViewFullDiscography={() => setShowDiscographyModal(true)}
              />
            </div>
          </div>
        </section>

        <BandNFTs nfts={bandNFTs} onViewFullNFTs={() => setShowNFTModal(true)} />

        <section className="container mx-auto px-6 max-w-[1536px] mt-12">
          <h2
            className="text-3xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-6 text-center"
            style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
          >
            Horde's Echoes
          </h2>
          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-6 rounded-lg shadow-metal border border-[#3a1c1c] max-w-3xl mx-auto">
            <div className="mb-6">
              <textarea
                className="w-full p-3 bg-[#1a1a1a] text-[#d0d0d0] rounded-lg border border-[#3a1c1c] focus:outline-none focus:ring-2 focus:ring-[#8a4a4a]"
                rows={4}
                placeholder="Share your thoughts with the horde..."
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-[#8a4a4a] to-[#5a2e2e] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#3a1c1c] transition-all duration-300 shadow-metal border border-[#3a1c1c] text-sm font-unbounded uppercase tracking-wide"
              >
                Submit (Coming Soon)
              </motion.button>
            </div>
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-[#1a1a1a] p-4 rounded-lg border border-[#3a1c1c] shadow-metal"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[#d0d0d0] font-unbounded">{comment.username}</p>
                      <p className="text-[#8a8a8a] text-sm">{comment.date}</p>
                    </div>
                    <p className="text-[#b0b0b0]">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#8a8a8a] italic text-center">
                No echoes from the horde yet.
              </p>
            )}
          </div>
        </section>

        <EditModal
          band={band}
          bech32Address={principal} // Zamieniamy na principal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onAddMember={handleAddMember}
          onUpdateMember={handleUpdateMember}
          onDeleteMember={handleDeleteMember}
          onUpdateBand={handleUpdateBand}
          onAddAlbum={handleAddAlbum}
          onUpdateAlbum={handleUpdateAlbum}
          onDeleteAlbum={handleDeleteAlbum}
          onAddLink={handleAddLink}
          onDeleteLink={handleDeleteLink}
          onUpdateImage={handleUpdateImage}
          onUpdateLogo={handleUpdateLogo}
          onDeleteBand={handleDeleteBand}
          members={members}
          pastMembers={pastMembers}
          albums={albums}
          links={links}
        />

        {showDiscographyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          >
            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-metal border border-[#3a1c1c] w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-unbounded text-[#d0d0d0]">Crypt of Discography</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="bg-[#3a1c1c] text-[#d0d0d0] px-2 py-1 rounded-lg text-sm flex items-center gap-1 shadow-metal border border-[#3a1c1c]"
                >
                  Sort {sortOrder === "desc" ? "↑" : "↓"}
                </motion.button>
              </div>
              {sortedAlbums.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {sortedAlbums.map((album) => (
                    <VinylCard
                      key={album.id}
                      album={album}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      canEdit={false}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[#8a8a8a] italic">No albums added yet.</p>
              )}
              <button
                onClick={() => setShowDiscographyModal(false)}
                className="mt-6 px-4 py-2 bg-[#3a1c1c] text-[#d0d0d0] rounded-lg hover:bg-[#4a2c2c] transition duration-300"
              >
                Seal the Crypt
              </button>
            </div>
          </motion.div>
        )}

        {showNFTModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          >
            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-metal border border-[#3a1c1c] w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-unbounded text-[#d0d0d0]">Vault of NFTs</h2>
              </div>
              {bandNFTs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {bandNFTs.map((nft) => (
                    <div
                      key={nft.id}
                      className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4 rounded-lg shadow-metal border border-[#3a1c1c]"
                    >
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-lg font-unbounded text-[#d0d0d0] mb-2">{nft.name}</h3>
                      <p className="text-[#8a8a8a] text-sm mb-4">{nft.description}</p>
                      <p className="text-[#b0b0b0] text-sm">
                        <strong>Token ID:</strong> {nft.tokenId}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-[#8a4a4a] to-[#5a2e2e] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#3a1c1c] transition-all duration-300 shadow-metal border border-[#3a1c1c] text-sm font-unbounded uppercase tracking-wide"
                      >
                        Claim NFT (Coming Soon)
                      </motion.button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#8a8a8a] italic">No NFTs forged yet.</p>
              )}
              <button
                onClick={() => setShowNFTModal(false)}
                className="mt-6 px-4 py-2 bg-[#3a1c1c] text-[#d0d0d0] rounded-lg hover:bg-[#4a2c2c] transition duration-300"
              >
                Seal the Vault
              </button>
            </div>
          </motion.div>
        )}

        <div className="text-center mt-6">
          <Link
            href="/encyclopedia"
            className="text-[#8a4a4a] hover:text-[#d0d0d0] font-unbounded uppercase tracking-wide text-sm"
          >
            Back to the Chains
          </Link>
        </div>

        <Footer />
      </div>
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#8a4a4a] text-[#d0d0d0] px-4 py-2 rounded-lg shadow-metal z-50">
          {notification}
        </div>
      )}
    </main>
  );
}