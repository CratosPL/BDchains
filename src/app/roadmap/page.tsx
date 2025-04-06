"use client";
import { motion } from "framer-motion";

export default function Roadmap() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-[#b0b0b0] font-russo p-6"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-unbounded text-[#d0d0d0] text-center mb-4" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
          Black Death Chains Roadmap
        </h1>
        <p className="text-[#d0d0d0] text-center text-lg font-unbounded mb-8">Forging the Abyss of Metal on Xion Blockchain</p>

        <section className="space-y-6 mb-12">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0] border-b border-[#3a1c1c] pb-2">Phase 1: Genesis of the Crypt</h2>
          <p className="text-[#8a8a8a] italic">Q2 2025 – The Awakening</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Core Deployment:</strong> Launch platform with band encyclopedia and NFT minting.</li>
            <li><strong>Community Forge:</strong> Onboard 500+ fans, add 100 iconic bands.</li>
            <li><strong>NFT Relics:</strong> Release 1,000 Genesis NFTs.</li>
            <li><strong>Milestone:</strong> MVP with 50+ bands, 200+ NFTs.</li>
          </ul>
        </section>

        <section className="space-y-6 mb-12">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0] border-b border-[#3a1c1c] pb-2">Phase 2: Echoes of the Horde</h2>
          <p className="text-[#8a8a8a] italic">Q3 2025 – The Rising Flame</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Audio Relic NFTs:</strong> Fan-made audio NFTs with IPFS/Xion integration.</li>
            <li><strong>Decentralized Governance:</strong> Horde Council voting, SR token airdrop.</li>
            <li><strong>UI Enhancement:</strong> Metal-inspired animations.</li>
            <li><strong>Milestone:</strong> 500+ audio NFTs, 1,000+ users.</li>
          </ul>
        </section>

        {/* Dodaj resztę faz podobnie */}
        <section className="text-center mt-12">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0] mb-4">Our Oath</h2>
          <p className="text-[#b0b0b0] mb-6">
            This roadmap is a pact forged in the abyss, uniting the horde in a rebellion against the mundane. Join us, for the shadows await.
          </p>
          <p className="text-[#d0d0d0] font-unbounded uppercase tracking-wide">
            Black Death Chains – No Masters, Only Chaos.
          </p>
        </section>
      </div>
    </motion.div>
  );
}