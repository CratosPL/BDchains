import Link from "next/link";
import { FaTwitter, FaBroadcastTower, FaMedium } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-10 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] skull-bg border-t border-[#3a1c1c]">
      <div className="container mx-auto text-center px-4 max-w-7xl">
        <p className="text-[#8a8a8a] font-unbounded uppercase tracking-wide text-sm">
          © 2025 Black Death Chains. All rights reserved.
        </p>
        <div className="footer-links mt-4 flex justify-center space-x-6">
          <Link
            href="/privacy-crypt"
            className="text-[#8a4a4a] hover:text-[#d0d0d0] skull-link transition duration-300 font-unbounded uppercase tracking-wide text-sm"
          >
            Privacy Crypt
          </Link>
          <Link
            href="/terms-of-shadow"
            className="text-[#8a4a4a] hover:text-[#d0d0d0] skull-link transition duration-300 font-unbounded uppercase tracking-wide text-sm"
          >
            Terms of Shadow
          </Link>
        </div>
        <div className="social-icons mt-6 flex justify-center space-x-6">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8a4a4a] hover:text-[#d0d0d0] skull-link transition duration-300"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://warpcast.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8a4a4a] hover:text-[#d0d0d0] skull-link transition duration-300"
          >
            <FaBroadcastTower size={24} />
          </a>
          <a
            href="https://medium.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8a4a4a] hover:text-[#d0d0d0] skull-link transition duration-300"
          >
            <FaMedium size={24} />
          </a>
        </div>
        <div className="mt-6 border-t border-[#3a1c1c] pt-4">
          <p className="text-[#8a8a8a] font-unbounded uppercase tracking-wide text-sm">
            Forged with Metal Fury.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;