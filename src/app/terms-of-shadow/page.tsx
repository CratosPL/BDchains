"use client";
import { motion } from "framer-motion";

export default function TermsOfShadow() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-[#b0b0b0] font-russo p-6"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-unbounded text-[#d0d0d0] text-center mb-4" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
          Terms of Shadow
        </h1>
        <p className="text-[#d0d0d0] text-center text-lg font-unbounded mb-2">Forged in the Abyss of Black Death Chains</p>
        <p className="text-[#8a8a8a] text-center text-sm mb-8">Last Updated: March 09, 2025</p>
        <p className="text-[#b0b0b0] text-center mb-12">
          Welcome, legion of the horde, to Black Death Chains, a crypt carved from the shadows of the Xion blockchain and bound by the unrelenting spirit of black and death metal. By stepping into this abyss, you accept these Terms of Shadow, a pact that governs your descent into our decentralized dominion. Read well, for the chains are unyielding.
        </p>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">1. The Crypt Unveiled</h2>
          <p>
            Black Death Chains rises as a fan-forged shrine, a realm where the metal horde honors their legends, binds their legacies to the blockchain, and claims relics of the underground. This is no overlord’s lair – it is a non-commercial forge, fueled by the fire of the community, free from the chains of profit.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">2. The Pact of the Horde</h2>
          <p>By treading these shadowed halls, you swear:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>To wield your soul freely:</strong> Entry is granted to all who bear a Web3 wallet, binding your deeds to the eternal blockchain.
            </li>
            <li>
              <strong>To honor the code:</strong> You shall not summon malice, shatter mortal laws, or unleash chaos beyond the spirit of metal.
            </li>
            <li>
              <strong>To bear the gas:</strong> Forging legacies or claiming relics may demand tribute in blockchain gas – a toll paid to the abyss, not to us.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">3. Chains of Creation</h2>
          <p>The horde crafts this crypt with their own hands through these rites:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Forging Legacies:</strong> Summon new bands with their names, genres, lands, and years of origin, chaining them to the blockchain’s unyielding depths.
            </li>
            <li>
              <strong>Binding the Past:</strong> Refine the lore of the fallen – their details, members past and present, albums etched in time, images of their visage, and links to their echoes beyond.
            </li>
            <li>
              <strong>Summoning Relics:</strong>
              <ul className="list-disc list-inside space-y-2 pl-6">
                <li>
                  <strong>Sigils:</strong> Offer band sigils, swearing they are wielded for fan reverence alone, not for gold or glory. These marks are bound by a limit of 200 KB, in forms of JPG or PNG.
                </li>
                <li>
                  <strong>Visages:</strong> Share images of the bands, up to 500 KB, to honor their presence in the crypt.
                </li>
                <li>
                  <strong>Oath of Purity:</strong> By offering these relics, you vow they are yours to give, freely granted, or permitted for the horde’s use.
                </li>
              </ul>
            </li>
            <li>
              <strong>Your Burden:</strong> All you forge – names, tales, or relics – is your offering. Should it summon the wrath of rights-holders or break mortal laws, you alone face the abyss’s judgment.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">4. The Forge Masters’ Will</h2>
          <p>We, the shadow-smiths of Black Death Chains, hold these powers:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>To Seal the Crypt:</strong> We may banish any offering or soul that defiles the abyss – be it false lore, spam, or breaches of the mortal code.
            </li>
            <li>
              <strong>To Guard the Flame:</strong> We reserve the right to alter, suspend, or extinguish this crypt at our will, though the blockchain’s chains endure beyond our grasp.
            </li>
            <li>
              <strong>To Moderate the Horde:</strong> Creations deemed unfit may be cast out if they threaten the crypt or its legion with legal shadow or discord.
            </li>
            <li>
              <strong>No Masters, Only Stewards:</strong> We claim no dominion over your offerings, yet we may unchain them if the rights of others demand it.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">5. Relics of the Blockchain</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Tokens of the Horde:</strong> Relics claimed herein are fan-forged, bearing our mark, not the sacred sigils of the bands unless freely granted. They are free to seize, save for the gas toll of Xion.
            </li>
            <li>
              <strong>No False Dominion:</strong> These tokens proclaim fandom, not ownership of the bands’ legacy. They are forged in our shadow, not theirs.
            </li>
            <li>
              <strong>Immutable Chains:</strong> Once bound to the blockchain, your deeds may linger in its depths, beyond our power to erase.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">6. Shadows of Liability</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>No Blood on Our Hands:</strong> We offer this crypt as a gift to the horde, without promise. Should it falter, crumble, or summon errors, we bear no blame.
            </li>
            <li>
              <strong>Your Chains, Your Fate:</strong> We are not liable for the offerings you forge, nor for disputes born from their use. The shadow falls upon you.
            </li>
            <li>
              <strong>The Abyss is Wild:</strong> The blockchain is an untamed force – we cannot vow its eternal flame nor shield you from its chaos.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">7. Echoes of the Past</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Content Eternal:</strong> Legacies, relics, and visages chained to the blockchain may endure in its depths, even if cast from the crypt’s surface.
            </li>
            <li>
              <strong>Rights Reserved:</strong> We claim no ownership over your offerings, save the right to unveil them within this shrine.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">8. The Law of the Mortal Realm</h2>
          <p>
            These Terms of Shadow bow to the laws of Poland, forged in a land where metal’s spirit thrives. Disputes shall be settled in its courts, should the horde demand it.
          </p>
          <p>Should any clause of this pact crumble, the rest shall stand, unbowed.</p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">9. Whispers in the Void</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Summon Us:</strong> Cast your words to [email TBD] should you seek counsel or bear grievances.
            </li>
            <li>
              <strong>The Codex Evolves:</strong> These Terms may shift as the crypt grows. Return to this scroll to witness its rebirth.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-center">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">Rise, Legion of Shadows</h2>
          <p>
            By forging legacies, binding the past, and claiming relics, you join a rebellion unbound by overlords, united by metal and blockchain. Forge wisely, for the abyss watches.
          </p>
          <p className="text-[#d0d0d0] font-unbounded uppercase tracking-wide mt-4">
            Black Death Chains – No Masters, Only Chaos.
          </p>
        </section>
      </div>
    </motion.div>
  );
}