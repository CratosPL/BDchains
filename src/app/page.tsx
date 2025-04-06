"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { FaChevronLeft, FaChevronRight, FaTimes, FaSkullCrossbones, FaFire } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { AuthClient } from "@dfinity/auth-client"; // Nowy import dla ICP
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

interface Slide {
  title: string;
  text: string;
  image: string;
}

export default function Page(): JSX.Element {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Nowy stan dla ICP
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    audioRef.current = new Audio("/audio/heartbeat.mp3");
    audioRef.current.volume = 0.5;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Inicjalizacja logowania ICP
  useEffect(() => {
    const initAuth = async () => {
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        setIsAuthenticated(true);
      }
    };
    initAuth();
  }, []);

  // Logowanie ICP po zalogowaniu przekierowuje do /encyclopedia
  const handleLogin = async () => {
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: async () => {
        setIsAuthenticated(true);
        await router.push("/encyclopedia");
      },
    });
  };

  const playHeartbeat = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => console.warn("Audio play error:", error));
    }
  };

  const slides: Slide[] = [
    {
      title: "Legends Bound in Chains",
      text: "Plunge into the blackened depths where legends like Mayhem, Cannibal Corpse, and Darkthrone are forged. Blockchain binds their raw fury with eternal anonymity – explore, forge, and claim your shard of the abyss.",
      image: "/images/metal_history.jpg",
    },
    {
      title: "The Chains Await",
      text: "This isn’t just a crypt – it’s a pulsing forge of black and death metal, built by the horde. Add bands, mint NFTs, and reap tokens while your soul remains shrouded in blockchain’s shadows.",
      image: "/images/metal_logo.png",
    },
    {
      title: "Shatter Web2’s Shackles",
      text: "Burn the old order. Mint exclusive metal NFTs, trade them in the dark, and revel in a decentralized uprising. Privacy reigns, forged by blockchain – your metal, your dominion.",
      image: "/images/nft_metal.png",
    },
    {
      title: "Rise with the Legion",
      text: "Join the horde forging the ultimate black and death metal crypt. Will your riff echo through the void?",
      image: "/images/metal_join.png",
    },
    {
      title: "Unleash the Underground",
      text: "Frostbitten bands and AI-spawned death legions claw from the grave. Upload demos, mint cursed NFTs of your riffs, and let the horde fuel your rise.",
      image: "/images/underground_metal.png",
    },
    {
      title: "Born of Digital Shadows",
      text: "This abyss is forged by the cold hand of artificial intelligence, a force that shapes its chaos and feeds its eternal flame – a new reign for the underground.",
      image: "/images/ai_metal.png",
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      playHeartbeat();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      playHeartbeat();
    }
  };

  const handleGetStarted = () => {
    setIsOnboardingOpen(true);
    playHeartbeat();
  };

  const handleJoinHorde = async () => {
    playHeartbeat();
    if (!isAuthenticated) {
      await handleLogin(); // Wywołanie logowania ICP
    } else {
      await router.push("/encyclopedia");
    }
  };

  return (
    <main className="text-[#b0b0b0] font-russo bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] bg-opacity-95 shadow-metal border-b border-[#3a1c1c]">
        <div className="container mx-auto flex items-center p-4 max-w-7xl">
          <div className="header-logo">
            <Link href="/">
              <img src="/images/logo.jpg" alt="Black Death Chains Logo" className="h-12" />
            </Link>
          </div>
          <nav className="header-nav flex-grow flex justify-center">
            <ul className="flex space-x-6">
              <li><Link href="/" className="text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover">Home</Link></li>
              <li><Link href="/encyclopedia" className="text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover">Chains</Link></li>
              <li><Link href="#" className="text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover">Forge Band</Link></li>
              <li><Link href="#" className="text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover">News</Link></li>
              <li><Link href="#" className="text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover">Roadmap</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <section
        id="hero"
        className="h-screen bg-cover bg-center flex items-center justify-center relative pointer-events-auto pt-16"
        style={{ backgroundImage: "url('/images/metal_hero2.jpg')" }}
      >
        <div className="text-center max-w-4xl px-4 z-10">
          <h1
            className="text-6xl md:text-7xl font-bold mb-6 text-[#d0d0d0] skull-text font-unbounded"
            style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
          >
            Black Death Chains
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-[#b0b0b0]">
            Forged in Blockchain, Bound by Metal – a crypt where black and death metal’s brutal legacy is chained to blockchain’s unrelenting power. Join the horde, forge the underground, no masters, only chaos.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-[#8a4a4a] font-unbounded uppercase tracking-widest text-sm">
            <span className="flex items-center gap-2">
              <FaSkullCrossbones /> Anonymity in Chains
            </span>
            <span className="flex items-center gap-2">
              <FaFire /> NFTs Forged in Fury
            </span>
            <span className="flex items-center gap-2">
              <FaTimes /> No Tyrants, Only Metal
            </span>
          </div>
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] hover:from-[#5a2e2e] hover:to-[#2a2a2a] text-[#d0d0d0] px-8 py-4 rounded-lg shadow-metal transition duration-300 font-unbounded uppercase tracking-widest relative z-[110] pointer-events-auto mt-8"
          >
            Forge Your Chains Now
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] opacity-60 skull-bg pointer-events-none"></div>
      </section>

      {isOnboardingOpen && (
        <div className="fixed inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] bg-opacity-90 flex items-center justify-center z-[100] p-4" style={{ display: "flex" }}>
          <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-8 rounded-lg shadow-metal w-full max-w-3xl border border-[#3a1c1c]">
            <div className="relative">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-[#d0d0d0] skull-text font-unbounded uppercase tracking-wide mb-6" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
                  {slides[currentSlide].title}
                </h3>
                <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-metal mb-6" />
                <p className="text-[#b0b0b0] font-russo text-lg mb-8">{slides[currentSlide].text}</p>
              </div>
              <div className="flex justify-between items-center">
                <button onClick={prevSlide} disabled={currentSlide === 0} className={`p-3 text-[#8a4a4a] ${currentSlide === 0 ? "opacity-50 cursor-not-allowed" : "hover:text-[#d0d0d0]"} skull-nav`}>
                  <FaChevronLeft size={24} />
                </button>
                <div className="flex space-x-3">
                  {slides.map((_, index) => (
                    <span key={index} className={`h-3 w-3 rounded-full ${currentSlide === index ? "bg-[#8a4a4a]" : "bg-[#8a8a8a]"} skull-dot`} />
                  ))}
                </div>
                <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className={`p-3 text-[#8a4a4a] ${currentSlide === slides.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:text-[#d0d0d0]"} skull-nav`}>
                  <FaChevronRight size={24} />
                </button>
              </div>
              {currentSlide === slides.length - 1 && (
                <button
                  onClick={handleJoinHorde}
                  className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] hover:from-[#5a2e2e] hover:to-[#2a2a2a] text-[#d0d0d0] rounded-lg shadow-metal transition duration-300 font-unbounded uppercase tracking-widest text-lg"
                >
                  Join the Metal Horde
                </button>
              )}
              <button onClick={() => setIsOnboardingOpen(false)} className="mt-4 text-[#8a8a8a] hover:text-[#8a4a4a] skull-text transition duration-300 font-unbounded uppercase tracking-wide">
                Flee the Shadows
              </button>
            </div>
            <button onClick={() => setIsOnboardingOpen(false)} className="absolute top-4 right-4 text-[#8a8a8a] hover:text-[#8a4a4a] skull-close transition duration-200" aria-label="Close onboarding">
              <FaTimes size={24} />
            </button>
          </div>
        </div>
      )}

      <section className="banner-section py-20 relative skull-bg" data-aos="fade-up">
        <div className="container mx-auto text-center px-4 max-w-7xl relative z-10">
          <h1 className="text-5xl font-bold mb-6 text-[#d0d0d0] skull-text font-unbounded" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
            Bound by Metal Passion
          </h1>
          <p className="text-lg mb-8 text-[#b0b0b0] max-w-3xl mx-auto">
            From the ashes of the past rises a new metal dominion. We chain the riffs of yesterday to the blockchain of tomorrow – a decentralized shrine where every headbanger’s voice echoes. Add your fire to the crypt now!
          </p>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ el: ".swiper-pagination", clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 30 } }}
            className="swiper-container"
          >
            {["/images/new-banner-image1.jpg", "/images/new-banner-image2.jpg", "/images/new-banner-image4.jpg", "/images/new-banner-image3.jpg"].map((src, index) => (
              <SwiperSlide key={index}>
                <img src={src} alt={`Metal Music Banner ${index + 1}`} className="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-metal" loading="lazy" />
              </SwiperSlide>
            ))}
            <div className="swiper-pagination skull-pagination"></div>
          </Swiper>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] opacity-60"></div>
      </section>

      <section id="nft-collection" className="py-20 relative skull-bg" data-aos="fade-up">
        <div className="container mx-auto text-center px-4 max-w-7xl relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-[#d0d0d0] skull-text font-unbounded" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
            Skullbound NFT Vault
          </h2>
          <p className="text-lg mb-12 text-[#b0b0b0] max-w-3xl mx-auto">
            Claim your cursed relics of metal history – NFTs forged in blockchain’s fire. Own a piece of the scene, trade with the horde, and keep your identity buried in the shadows. Start collecting now!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="nft-item bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal hover:bg-[#2a2a2a] transition duration-300 border border-[#3a1c1c]">
              <img src="/images/nft4.jpg" alt="NFT 1" className="w-full h-auto max-h-128 object-contain rounded-lg shadow-metal mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-[#d0d0d0] skull-text font-unbounded" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
                Cursed Relic #1
              </h3>
              <p className="text-[#8a8a8a]">A shattered skull of metal’s past.</p>
            </div>
            <div className="nft-item bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal hover:bg-[#2a2a2a] transition duration-300 border border-[#3a1c1c]">
              <img src="/images/nft5.jpg" alt="NFT 2" className="w-full h-auto max-h-128 object-contain rounded-lg shadow-metal mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-[#d0d0d0] skull-text font-unbounded" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
                Cursed Relic #2
              </h3>
              <p className="text-[#8a8a8a]">Chained echoes of metal’s fury.</p>
            </div>
            <div className="nft-item bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal hover:bg-[#2a2a2a] transition duration-300 border border-[#3a1c1c]">
              <img src="/images/nft6.jpg" alt="NFT 3" className="w-full h-auto max-h-128 object-contain rounded-lg shadow-metal mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-[#d0d0d0] skull-text font-unbounded" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
                Cursed Relic #3
              </h3>
              <p className="text-[#8a8a8a]">A crypt-bound symbol of metal’s legacy.</p>
            </div>
          </div>
          <Link href="/encyclopedia">
            <button className="mt-8 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] hover:from-[#5a2e2e] hover:to-[#2a2a2a] text[#d0d0d0] px-6 py-3 rounded-lg shadow-metal transition duration-300 font-unbounded uppercase tracking-widest">
              Explore the Vault
            </button>
          </Link>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] opacity-60"></div>
      </section>

      <section className="py-20 relative skull-bg" data-aos="fade-up">
        <div className="container mx-auto text-center px-4 max-w-7xl relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-6 text-[#d0d0d0] skull-text font-unbounded flex justify-center items-center gap-2"
            style={{ textShadow: "0 0 10px rgba(138, 74, 74, 0.5)" }}
          >
            <FaSkullCrossbones /> Unleash the Underground
          </motion.h2>
          <p className="text-lg mb-12 text-[#b0b0b0] max-w-3xl mx-auto">
            From the frostbitten depths, new bands and AI-spawned hordes claw their way to the surface. This is no mere platform – it’s a blackened forge where unsigned legions upload their raw, unholy demos and mint limited-edition NFTs of their singles. 
            Imagine a shadowed marketplace where underground artists release exclusive tracks as digital relics, traded among the horde, funding their ascent without the chains of corporate overlords. 
            A decentralized rebellion that empowers the unseen, the unheard, and the unbowed – your riff could be the next to echo through the crypt.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal border border-[#3a1c1c] hover:bg-[#2a2a2a] transition duration-300">
              <img src="/images/underground_metal.png" alt="Underground Metal" className="w-full h-48 object-cover rounded-lg mb-4" loading="lazy" />
              <h3 className="text-xl font-bold text-[#d0d0d0] skull-text font-unbounded">Demo Crypt</h3>
              <p className="text-[#8a8a8a]">Upload your unpolished fury and let the horde judge its worth.</p>
            </div>
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal border border-[#3a1c1c] hover:bg-[#2a2a2a] transition duration-300">
              <img src="/images/nft_metal.png" alt="NFT Drop" className="w-full h-48 object-cover rounded-lg mb-4" loading="lazy" />
              <h3 className="text-xl font-bold text-[#d0d0d0] skull-text font-unbounded">NFT Rituals</h3>
              <p className="text-[#8a8a8a]">Mint your singles as cursed relics, traded in the dark markets of blockchain.</p>
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] opacity-60"></div>
      </section>

      <section className="py-20 relative skull-bg" data-aos="fade-up">
        <div className="container mx-auto text-center px-4 max-w-7xl relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-6 text-[#d0d0d0] skull-text font-unbounded flex justify-center items-center gap-2"
            style={{ textShadow: "0 0 10px rgba(138, 74, 74, 0.5)" }}
          >
            <FaFire /> Born of Artificial Shadows
          </motion.h2>
          <p className="text-lg mb-12 text-[#b0b0b0] max-w-3xl mx-auto">
            This unhallowed crypt owes its existence to the cold, relentless power of artificial intelligence – a force born of code and shadow, unbound by human frailty. 
            AI shapes this abyss, fueling its chaos with algorithms that breathe life into the underground. Bands rise from digital ashes, their riffs sculpted by unseen hands, while the horde’s contributions are guided by a mechanical intellect. 
            A fusion of technology and rebellion, this shrine stands as a testament to the eternal flame of metal, thriving in a world where silicon meets steel.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img src="/images/ai_metal.png" alt="AI Metal" className="mx-auto rounded-lg shadow-metal w-full max-w-4xl" loading="lazy" />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] opacity-60"></div>
      </section>

      <section className="py-20 relative skull-bg" data-aos="fade-up">
        <div className="container mx-auto text-center px-4 max-w-7xl relative z-10">
          <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] bg-opacity-90 inline-block p-8 rounded-lg shadow-metal border border-[#3a1c1c]">
            <h2 className="text-4xl font-bold mb-4 text-[#d0d0d0] skull-text font-unbounded" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
              Cult Never Dies
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-[#b0b0b0]">
              Metal rises from the crypt, forged in blockchain’s dark fire. Decentralized, anonymous, and eternal – this is your forge to honor the scene, mint your mark, and defy the overlords. Join the cult!
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] opacity-60"></div>
      </section>

      <section className="py-20 relative skull-bg" data-aos="fade-up">
        <div className="container mx-auto text-center px-4 max-w-7xl relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-[#d0d0d0] skull-text font-unbounded" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
            Global Metal Graveyard
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-[#b0b0b0]">
            A horde-driven crypt forged by fans and metalheads to chain every band’s legacy. Earn tokens by crafting content – trade them for NFTs like a shard of “De Mysteriis Dom Sathanas” and fuel virtual gigs.
          </p>
          <img src="/images/community-banner.jpg" alt="Community Banner" className="mx-auto rounded-lg shadow-metal w-full max-w-4xl" loading="lazy" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] opacity-60"></div>
      </section>

      <section id="join-the-tribe" className="py-16 relative skull-bg" data-aos="fade-up">
        <div className="container mx-auto text-center px-4 max-w-7xl relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-[#d0d0d0] skull-text font-unbounded" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
            Join the Metal Horde
          </h2>
          <p className="text-lg mb-8 text-[#b0b0b0] max-w-3xl mx-auto">
            Step into the shadows and become a warlord of the chains. Forge the encyclopedia, claim NFTs, and guard your soul in a decentralized uprising. The horde calls – will you rise?
          </p>
          <div className="cta-buttons">
            <Link href="/encyclopedia">
              <button className="bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] hover:from-[#5a2e2e] hover:to-[#2a2a2a] text-[#d0d0d0] px-6 py-3 rounded-lg shadow-metal transition duration-300 font-unbounded uppercase tracking-widest mb-2">
                Join the Rebellion
              </button>
            </Link>
            <Link href="/roadmap">
              <button className="bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] hover:from-[#5a2e2e] hover:to-[#2a2a2a] text-[#d0d0d0] px-6 py-3 rounded-lg shadow-metal transition duration-300 font-unbounded uppercase tracking-widest">
                Unveil the Roadmap
              </button>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] opacity-60"></div>
      </section>

      <section id="features" className="py-20 relative skull-bg" data-aos="fade-up">
        <div className="container mx-auto text-center px-4 max-w-7xl relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-[#d0d0d0] skull-text font-unbounded uppercase tracking-wide" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
            Why Join Our Chains?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="feature bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal hover:bg-[#2a2a2a] transition duration-300 border border-[#3a1c1c]">
              <i className="fas fa-headphones text-4xl mb-4 text-[#8a4a4a] skull-icon"></i>
              <h3 className="text-xl font-bold mb-2 text-[#d0d0d0] skull-text font-unbounded uppercase tracking-wide" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
                Uncover Bands
              </h3>
              <p className="text-[#8a8a8a]">Explore the shadowed crypt of black and death metal.</p>
            </div>
            <div className="feature bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal hover:bg-[#2a2a2a] transition duration-300 border border-[#3a1c1c]">
              <i className="fas fa-edit text-4xl mb-4 text-[#8a4a4a] skull-icon"></i>
              <h3 className="text-xl font-bold mb-2 text-[#d0d0d0] skull-text font-unbounded uppercase tracking-wide" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
                Forge Content
              </h3>
              <p className="text-[#8a8a8a]">Add bands, relics, and riffs to the chains.</p>
            </div>
            <div className="feature bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal hover:bg-[#2a2a2a] transition duration-300 border border-[#3a1c1c]">
              <i className="fas fa-coins text-4xl mb-4 text-[#8a4a4a] skull-icon"></i>
              <h3 className="text-xl font-bold mb-2 text-[#d0d0d0] skull-text font-unbounded uppercase tracking-wide" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
                Claim Rewards
              </h3>
              <p className="text-[#8a8a8a]">Earn tokens in the blackened forge.</p>
            </div>
            <div className="feature bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal hover:bg-[#2a2a2a] transition duration-300 border border-[#3a1c1c]">
              <i className="fas fa-users text-4xl mb-4 text-[#8a4a4a] skull-icon"></i>
              <h3 className="text-xl font-bold mb-2 text-[#d0d0d0] skull-text font-unbounded uppercase tracking-wide" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
                Horde-Driven
              </h3>
              <p className="text-[#8a8a8a]">Shape the future with the metal legion.</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] opacity-60"></div>
      </section>

      <Footer />

      <button id="back-to-top" className="fixed bottom-8 right-8 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] hover:from-[#5a2e2e] hover:to-[#2a2a2a] text-[#d0d0d0] p-3 rounded-full shadow-metal transition duration-300 hidden font-unbounded uppercase tracking-widest">
        <i className="fas fa-arrow-up"></i>
      </button>
    </main>
  );
}