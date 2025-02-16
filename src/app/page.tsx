"use client";

import {
  Abstraxion,
  useAbstraxionAccount,
  useModal
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import { useEffect, useState } from "react";
import Swiper from 'swiper';
import 'swiper/css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaCopy } from "react-icons/fa";
import UserPanel from "../components/UserPanel";
import supabase from "../utils/supabase";

export default function Page(): JSX.Element {
  const { data, isConnected } = useAbstraxionAccount();
  const { bech32Address } = data || {};
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [, setShow] = useModal();
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);

  // Dodane stany
  const [user, setUser] = useState({ username: "", avatarUrl: "", hasAccount: false });

  // Funkcja do pobierania danych użytkownika
  const fetchUser = async (bech32Address: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('bech32address', bech32Address) // Zmiana z bech32Address na bech32address
        .single();

      if (data) {
        setUser(data);
      } else if (error) {
        console.error("Error fetching user data:", error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Funkcja do aktualizacji danych użytkownika
  const handleUpdateUser = async (updatedUser: { username: string; avatarUrl: string | null }) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ ...updatedUser }) // Use update instead of upsert
        .eq('bech32address', bech32Address) // Ensure this matches your table column name
        .single();
  
      if (data) {
        setUser(data);
      } else if (error) {
        console.error("Error updating user data:", error.message);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Efekt do pobierania danych użytkownika po zmianie adresu portfela
  useEffect(() => {
    if (bech32Address) {
      fetchUser(bech32Address);
    }
  }, [bech32Address]);

  // Efekt do ustawienia numeru konta
  useEffect(() => {
    setAccountNumber(bech32Address || null);
  }, [bech32Address]);

  const toggleUserPanel = () => {
    setIsUserPanelOpen(!isUserPanelOpen);
  };

  return (
    <main className="text-white font-russo bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 shadow-lg gradient-bg">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="header-logo">
            <img src="/images/logo.jpg" alt="Metal Music Logo" className="h-10" />
          </div>
          <nav className="header-nav">
            <ul className="flex space-x-6">
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition duration-300">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition duration-300">Encyclopedia</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition duration-300">Add Band</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition duration-300">News</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-500 transition duration-300">Roadmap</a></li>
            </ul>
          </nav>
          <div className="web3-login relative">
            {bech32Address ? (
              <div className="flex items-center justify-center cursor-pointer" onClick={toggleUserPanel}>
                <img
                  src={user.avatarUrl || "/images/default-avatar.png"}
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full border-2 border-red-500"
                />
              </div>
            ) : (
              <Button
                fullWidth
                onClick={() => setShow(true)}
                structure="base"
              >
                CONNECT
              </Button>
            )}
            {isUserPanelOpen && (
              <UserPanel 
                onViewAccount={() => { setShow(true); setIsUserPanelOpen(false); }} 
                accountNumber={accountNumber} 
                user={user} // Przekazanie stanu użytkownika
                onUpdateUser={handleUpdateUser} // Przekazanie funkcji aktualizacji
              />
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/metal_hero2.jpg')" }} data-aos="fade-up">
        <div className="text-center max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow-lg font-unbounded">Welcome to Metal Encyclopedia Web3</h1>
          <p className="text-lg md:text-xl mb-8 text-shadow">The ultimate platform where Metal Music meets Blockchain.</p>
          <button
            className="btn-gradient text-white px-8 py-3 rounded-lg hover:bg-red-500 transition duration-300">Get Started</button>
        </div>
      </section>

{/* React Slick Carousel Section */}
<section className="banner-section py-20" data-aos="fade-up">
  <div className="container mx-auto text-center px-4">
    <h1 className="text-4xl md:text-5xl font-bold mb-6 font-unbounded">Passionate about Metal Music</h1>
    <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">We honor the past while looking to the future.</p>
    
    {/* React Slick Slider */}
    <Slider
      dots={true} // Pokazuje paginację (kropki)
      infinite={true} // Nieskończona pętla
      speed={500} // Prędkość przejścia
      slidesToShow={3} // Liczba widocznych slajdów
      slidesToScroll={1} // Liczba slajdów do przewijania
      autoplay={true} // Autoplay
      autoplaySpeed={3000} // Czas autoplay
      responsive={[
        {
          breakpoint: 1024, // Dla ekranów >= 1024px
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768, // Dla ekranów >= 768px
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 640, // Dla ekranów < 640px
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ]}
    >
      {["/images/new-banner-image1.jpg", "/images/new-banner-image2.jpg", "/images/new-banner-image4.jpg", "/images/new-banner-image3.jpg"].map((src, index) => (
        <div key={index} className="px-2"> {/* Dodaj odstęp między slajdami */}
          <img
            src={src}
            alt={`Metal Music Banner ${index + 1}`}
            className="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-metal"
            loading="lazy"
          />
        </div>
      ))}
    </Slider>
  </div>
</section>

      {/* NFT Collection Section */}
      <section id="nft-collection" className="py-20" data-aos="fade-up">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6 text-red-600 font-unbounded">NFT Collection</h2>
          <p className="text-lg mb-12 text-gray-300">Browse our exclusive collection of metal NFTs. Each NFT is a unique piece of metal history.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="nft-item bg-gray-900 p-6 rounded-lg shadow-metal hover:shadow-xl transition duration-300 hover:bg-gray-800">
              <img src="/images/nft4.jpg" alt="NFT 1" className="w-full h-auto max-h-128 object-contain rounded-lg mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-gray-300">NFT 1</h3>
              <p className="text-gray-400">Opis NFT 1</p>
            </div>
            <div className="nft-item bg-gray-900 p-6 rounded-lg shadow-metal hover:shadow-xl transition duration-300 hover:bg-gray-800">
              <img src="/images/nft5.jpg" alt="NFT 2" className="w-full h-auto max-h-128 object-contain rounded-lg mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-gray-300">NFT 2</h3>
              <p className="text-gray-400">Opis NFT 2</p>
            </div>
            <div className="nft-item bg-gray-900 p-6 rounded-lg shadow-metal hover:shadow-xl transition duration-300 hover:bg-gray-800">
              <img src="/images/nft6.jpg" alt="NFT 3" className="w-full h-auto max-h-128 object-contain rounded-lg mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-gray-300">NFT 3</h3>
              <p className="text-gray-400">Opis NFT 3</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cult Never Die Banner Section */}
      <section className="bg-cover bg-center py-20" style={{ backgroundImage: "url('/images/cult-never-die-bg.jpg')" }} data-aos="fade-up">
        <div className="container mx-auto text-center px-4">
          <div className="bg-black bg-opacity-80 inline-block p-8 rounded-lg">
            <h2 className="text-4xl font-bold mb-4 font-unbounded">Cult Never Die</h2>
            <p className="text-lg max-w-2xl mx-auto">The Metal Scene enters the Web3 era, preserving its cult spirit and
              offering fans and artists a secure, decentralized ecosystem.</p>
          </div>
        </div>
      </section>

      {/* Community Banner Section */}
      <section className="py-20" data-aos="fade-up">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6 font-unbounded">Global Metal Bands Database</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">A community-driven project built by fans, record labels, independent
            publishers, zines, creators, and more.</p>
          <img src="/images/community-banner.jpg" alt="Community Banner" className="mx-auto rounded-lg shadow-metal" loading="lazy" />
        </div>
      </section>

      <section id="join-the-tribe" className="py-10" data-aos="fade-up">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4 text-red-600 font-unbounded">Join the Metal Tribe</h2>
          <p className="text-lg mb-8 text-gray-300">Become part of a vibrant community where your passion for metal music fuels your journey in the Web3 world. Engage, collaborate, and celebrate the metal spirit in a decentralized space!</p>
          <div className="cta-buttons">
            <button className="bg-gray-800 btn-gradient text-white px-6 py-2 rounded-lg hover:bg-red-500 transition duration-300 mb-2">Join Now</button>
            <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-300">Learn More</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20" data-aos="fade-up">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-12 text-gray-300 font-unbounded">Why Join Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="feature bg-gray-900 p-6 rounded-lg shadow-metal hover:shadow-xl transition duration-300">
              <i className="fas fa-headphones text-4xl mb-4 text-red-400"></i>
              <h3 className="text-xl font-bold mb-2 text-gray-300">Discover Bands</h3>
              <p className="text-gray-400">Explore the most comprehensive collection of metal bands worldwide.</p>
            </div>
            <div className="feature bg-gray-900 p-6 rounded-lg shadow-metal hover:shadow-xl transition duration-300">
              <i className="fas fa-edit text-4xl mb-4 text-red-400"></i>
              <h3 className="text-xl font-bold mb-2 text-gray-300">Contribute Content</h3>
              <p className="text-gray-400">Add your favorite bands, labels, albums, and more.</p>
            </div>
            <div className="feature bg-gray-900 p-6 rounded-lg shadow-metal hover:shadow-xl transition duration-300">
              <i className="fas fa-coins text-4xl mb-4 text-red-400"></i>
              <h3 className="text-xl font-bold mb-2 text-gray-300">Earn Rewards</h3>
              <p className="text-gray-400">Earn blockchain-based rewards for your contributions.</p>
            </div>
            <div className="feature bg-gray-900 p-6 rounded-lg shadow-metal hover:shadow-xl transition duration-300">
              <i className="fas fa-users text-4xl mb-4 text-red-400"></i>
              <h3 className="text-xl font-bold mb-2 text-gray-300">Community Driven</h3>
              <p className="text-gray-400">Shape the future of metal music with other passionate metalheads.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="footer" className="py-10 bg-black gradient-bg">
        <div className="container mx-auto text-center px-4">
          <p className="text-gray-500">© 2025 Metal Encyclopedia Web3. All rights reserved.</p>
          <div className="footer-links mt-4">
            <a href="#" className="text-red-600 hover:text-red-500 transition duration-300 mx-2">Privacy Policy</a>
            <a href="#" className="text-red-600 hover:text-red-500 transition duration-300 mx-2">Terms of Service</a>
          </div>
          <div className="social-icons mt-6">
            <a href="https://twitter.com" target="_blank" className="text-red-600 hover:text-red-500 transition duration-300 mx-2"><i className="fab fa-twitter"></i></a>
            <a href="https://warpcast.com" target="_blank" className="text-red-600 hover:text-red-500 transition duration-300 mx-2"><i className="fas fa-broadcast-tower"></i></a>
            <a href="https://medium.com" target="_blank" className="text-red-600 hover:text-red-500 transition duration-300 mx-2"><i className="fab fa-medium"></i></a>
          </div>
          <p className="text-gray-500 mt-6">Made with passion.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button id="back-to-top"
        className="fixed bottom-8 right-8 btn-gradient text-white p-3 rounded-full shadow-metal hover:bg-red-500 transition duration-300 hidden">
        <i className="fas fa-arrow-up"></i>
      </button>

      <Abstraxion onClose={() => setShow(false)} />
    </main>
  );
}