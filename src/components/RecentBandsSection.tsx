import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { motion } from "framer-motion";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
};

interface RecentBandsSectionProps {
  recentBands: any[];
  isBandAdding: boolean;
}

export default function RecentBandsSection({ recentBands, isBandAdding }: RecentBandsSectionProps) {
  return (
    <div className="mb-12 border-t border-[#3a1c1c] pt-6">
      <h2
        className="text-2xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-6 text-center"
        style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
      >
        Recently Added Bands
      </h2>
      <div className="max-w-7xl mx-auto px-6 overflow-hidden">
        {isBandAdding ? (
          <p className="text-[#8a4a4a] font-russo text-center">Adding new band, please wait...</p>
        ) : (
          <Slider {...sliderSettings} infinite={recentBands.length > 1}>
            {recentBands.map((band, index) => (
              <div key={band.id || index} className="px-2">
                <motion.div
                  className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-4 rounded-lg shadow-metal text-center border border-[#3a1c1c] transform hover:-translate-y-2 transition-all duration-300 max-w-[280px] mx-auto"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/band/${band.id}`} className="block mb-3">
                    <div
                      className="w-full h-[180px] bg-[#2a2a2a] rounded-lg overflow-hidden relative flex items-center justify-center"
                      style={{
                        backgroundImage: "url('/images/metal-pattern.jpg')", // Optional: Add a subtle background pattern
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <img
                        src={band.logo_url || "/images/default-band.jpg"}
                        alt={band.name}
                        className="max-w-full max-h-full object-contain transition-all duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                  <Link href={`/band/${band.id}`}>
                    <h3
                      className="text-lg font-unbounded text-[#d0d0d0] hover:text-[#8a4a4a] transition-colors duration-300 line-clamp-1"
                      style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
                    >
                      {band.name}
                    </h3>
                  </Link>
                  <p className="text-[#8a8a8a] font-russo text-sm mt-1">
                    Added: {new Date(band.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-[#8a8a8a] font-russo text-xs italic line-clamp-1">
                    By: {band.addedBy || "Unknown User"}
                  </p>
                </motion.div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
}