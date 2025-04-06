"use client";

import { motion } from "framer-motion";
import {
  FaGlobe,
  FaMusic,
  FaCalendarAlt,
  FaGuitar,
  FaMicrophone,
  FaDrum,
  FaList,
  FaUser,
  FaKeyboard,
  FaFacebook,
  FaSpotify,
  FaTwitter,
  FaGlobe as FaGlobeLink,
  FaInstagram,
  FaYoutube,
  FaBandcamp,
  FaSoundcloud,
  FaTiktok,
  FaDiscord,
  FaLink,
  FaApple,
  FaTwitch,
  FaHeadphones,
  FaWater,
  FaPatreon,
  FaMixcloud,
} from "react-icons/fa";
import { SiFarcaster, SiReverbnation } from "react-icons/si";
import { GiViolin } from "react-icons/gi";
import { Band, Member, Link as BandLink } from "../../types/bandTypes";

interface BandInfoProps {
  band: Band;
  members: Member[];
  pastMembers: Member[];
  links: BandLink[];
}

export const BandInfo = ({ band, members, pastMembers, links }: BandInfoProps) => {
  const getRoleIcons = (role: string) => {
    const roleLower = role.toLowerCase();
    const icons = [];

    if (roleLower.includes("guitar")) icons.push(<FaGuitar key="guitar" size={14} className="text-[#8a8a8a]" />);
    if (roleLower.includes("vocal") || roleLower.includes("singer")) icons.push(<FaMicrophone key="vocal" size={14} className="text-[#8a8a8a]" />);
    if (roleLower.includes("drum")) icons.push(<FaDrum key="drum" size={14} className="text-[#8a8a8a]" />);
    if (roleLower.includes("keyboards") || roleLower.includes("keys") || roleLower.includes("pads")) icons.push(<FaKeyboard key="keyboards" size={14} className="text-[#8a8a8a]" />);
    if (roleLower.includes("bass")) icons.push(<FaGuitar key="bass" size={14} className="text-[#6a6a6a]" />);
    if (roleLower.includes("violin")) icons.push(<GiViolin key="violin" size={14} className="text-[#8a8a8a]" />);
    if (roleLower.includes("all instruments")) icons.push(<FaMusic key="all-instruments" size={14} className="text-[#8a8a8a]" />);

    // Jeśli nie znaleziono pasującej ikony, używamy FaMusic jako uniwersalnego znaczka
    return icons.length > 0 ? icons : [<FaMusic key="default" size={14} className="text-[#8a8a8a]" />];
  };

  const getLinkIcon = (type: string, url: string) => {
    const iconMap = {
      Facebook: { icon: <FaFacebook />, color: "#3b5998" },
      Spotify: { icon: <FaSpotify />, color: "#1db954" },
      Twitter: { icon: <FaTwitter />, color: "#1da1f2" },
      Instagram: { icon: <FaInstagram />, color: "#e1306c" },
      Youtube: { icon: <FaYoutube />, color: "#ff0000" },
      Bandcamp: { icon: <FaBandcamp />, color: "#629aa9" },
      Soundcloud: { icon: <FaSoundcloud />, color: "#ff5500" },
      Tiktok: { icon: <FaTiktok />, color: "#000000" },
      Discord: { icon: <FaDiscord />, color: "#7289da" },
      Website: { icon: <FaGlobeLink />, color: "#8a8a8a" },
      Farcaster: { icon: <SiFarcaster />, color: "#8a63d2" },
      "Apple Music": { icon: <FaApple />, color: "#000000" },
      Twitch: { icon: <FaTwitch />, color: "#9146ff" },
      Deezer: { icon: <FaHeadphones />, color: "#ff0090" },
      Tidal: { icon: <FaWater />, color: "#000000" },
      Patreon: { icon: <FaPatreon />, color: "#f96854" },
      Mixcloud: { icon: <FaMixcloud />, color: "#5000ff" },
      ReverbNation: { icon: <SiReverbnation />, color: "#e43526" },
      default: { icon: <FaGlobe />, color: "#8a4a4a" },
    };

    let { icon, color } = iconMap[type] || iconMap.default;
    if (!iconMap[type] && url) {
      const urlLower = url.toLowerCase();
      if (urlLower.includes("facebook.com")) return iconMap.Facebook;
      if (urlLower.includes("spotify.com")) return iconMap.Spotify;
      if (urlLower.includes("twitter.com")) return iconMap.Twitter;
      if (urlLower.includes("instagram.com")) return iconMap.Instagram;
      if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) return iconMap.Youtube;
      if (urlLower.includes("bandcamp.com")) return iconMap.Bandcamp;
      if (urlLower.includes("soundcloud.com")) return iconMap.Soundcloud;
      if (urlLower.includes("tiktok.com")) return iconMap.Tiktok;
      if (urlLower.includes("discord.gg") || urlLower.includes("discord.com")) return iconMap.Discord;
      if (urlLower.includes("farcaster.com")) return iconMap.Farcaster;
      if (urlLower.includes("apple.com") || urlLower.includes("music.apple")) return iconMap["Apple Music"];
      if (urlLower.includes("twitch.tv")) return iconMap.Twitch;
      if (urlLower.includes("deezer.com")) return iconMap.Deezer;
      if (urlLower.includes("tidal.com")) return iconMap.Tidal;
      if (urlLower.includes("patreon.com")) return iconMap.Patreon;
      if (urlLower.includes("mixcloud.com")) return iconMap.Mixcloud;
      if (urlLower.includes("reverbnation.com")) return iconMap.ReverbNation;
    }
    return { icon, color };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-1 space-y-6"
    >
      {/* Sekcja Band Information */}
      <motion.div
        className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4 rounded-lg shadow-metal border border-[#3a1c1c]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className="text-xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-4"
          style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
        >
          Chains of Origin
        </h2>
        <div className="space-y-2">
          <p className="text-[#b0b0b0] font-russo flex items-center gap-2">
            <FaGlobe size={16} className="text-[#8a8a8a]" />
            <strong className="text-[#8a8a8a]">Realm:</strong> {band.country || "N/A"}
          </p>
          <p className="text-[#b0b0b0] font-russo flex items-center gap-2">
            <FaMusic size={16} className="text-[#8a8a8a]" />
            <strong className="text-[#8a8a8a]">Fury:</strong> {band.genre || "N/A"}
          </p>
          <p className="text-[#b0b0b0] font-russo flex items-center gap-2">
            <FaCalendarAlt size={16} className="text-[#8a8a8a]" />
            <strong className="text-[#8a8a8a]">Forged:</strong> {band.year_founded || "N/A"}
          </p>
        </div>
      </motion.div>

      {/* Sekcja Band Members */}
      <motion.div
        className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4 rounded-lg shadow-metal border border-[#3a1c1c]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className="text-xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-4"
          style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
        >
          The Horde
        </h2>
        <div className="space-y-6">
          {/* Current Members */}
          <div>
            <h3
              className="text-lg font-unbounded text-[#d0d0d0] mb-3"
              style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
            >
              Current Legion
            </h3>
            {members.length > 0 ? (
              <div className="space-y-3">
                {members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-[#1a1a1a] to-[#252525] p-2 rounded-lg border border-[#3a1c1c] shadow-sm hover:bg-[#2a2a2a] hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#3a1c1c] flex items-center justify-center">
                        <FaUser size={16} className="text-[#d0d0d0]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[#d0d0d0] font-unbounded break-words text-sm leading-tight">
                          {member.name}
                        </p>
                        <p className="text-[#8a8a8a] text-xs flex items-center gap-1 leading-tight">
                          {getRoleIcons(member.role)}
                          {member.role || "N/A"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-[#8a8a8a] italic flex items-center gap-2">
                <FaList size={16} />
                No warriors forged yet.
              </p>
            )}
          </div>

          {/* Past Members */}
          <div>
            <h3
              className="text-lg font-unbounded text-[#8a8a8a] mb-3"
              style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
            >
              Fallen Warriors
            </h3>
            {pastMembers.length > 0 ? (
              <div className="space-y-3">
                {pastMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-[#1a1a1a] to-[#252525] p-2 rounded-lg border border-[#3a1c1c] shadow-sm hover:bg-[#2a2a2a] hover:shadow-md transition-all duration-300 opacity-80"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#3a1c1c] flex items-center justify-center">
                        <FaUser size={16} className="text-[#d0d0d0]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[#d0d0d0] font-unbounded break-words text-sm leading-tight">
                          {member.name}
                        </p>
                        <p className="text-[#8a8a8a] text-xs flex items-center gap-1 leading-tight">
                          {getRoleIcons(member.role)}
                          {member.role || "N/A"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-[#8a8a8a] italic flex items-center gap-2">
                <FaList size={16} />
                No fallen chained yet.
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Sekcja Official Links */}
      <motion.div
        className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4 rounded-lg shadow-metal border border-[#3a1c1c]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className="text-xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-4"
          style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
        >
          Echoes of the Void
        </h2>
        {links.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {links.map((link) => {
              const { icon, color } = getLinkIcon(link.type, link.url || "");

              return (
                <motion.div
                  key={link.id}
                  className="bg-[#1a1a1a] p-3 rounded-lg border border-[#3a1c1c] shadow-metal hover:bg-[#2a2a2a] transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <span style={{ color }}>{icon}</span>
                  <a
                    href={link.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#a0a0a0] hover:text-[#d0d0d0] font-unbounded uppercase tracking-wide"
                  >
                    {link.type}
                  </a>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-[#8a8a8a] italic">No echoes chained yet.</p>
        )}
      </motion.div>
    </motion.div>
  );
};