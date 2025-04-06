"use client";
import { motion } from "framer-motion";

export default function PrivacyCrypt() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-[#b0b0b0] font-russo p-6"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-unbounded text-[#d0d0d0] text-center mb-4" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
          Privacy Crypt
        </h1>
        <p className="text-[#d0d0d0] text-center text-lg font-unbounded mb-2">Guarded in the Shadows of Black Death Chains</p>
        <p className="text-[#8a8a8a] text-center text-sm mb-8">Last Updated: March 09, 2025</p>
        <p className="text-[#b0b0b0] text-center mb-12">
          Welcome, legion of the horde, to the Privacy Crypt of Black Death Chains, a shadowed vault where your essence is shielded amidst the unrelenting fury of metal and the Xion blockchain. Herein lies the pact of how we guard your whispers in this decentralized abyss. Peer into the darkness, for your secrets are ours to protect.
        </p>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">1. The Veil of Shadows</h2>
          <p>
            This Privacy Crypt unveils how we, the shadow-smiths of Black Death Chains, summon, wield, and shield the echoes of your soul. Forged as a non-commercial shrine, we gather only what you offer to fuel the crypt’s flame, honoring the metal horde’s spirit.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">2. Whispers We Summon</h2>
          <p>As you tread these shadowed halls, we may gather these faint echoes:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Web3 Soulmarks:</strong> Your blockchain address, bound through your Web3 wallet, marks your presence when you forge legacies or claim relics. It is etched into Xion’s unyielding chains.
            </li>
            <li>
              <strong>Offerings of the Horde:</strong> Names, genres, lands, years, sigils (up to 200 KB), and visages (up to 500 KB) you bestow upon the crypt to honor the metal. These are your gifts, preserved in our care.
            </li>
            <li>
              <strong>Echoes of the Void:</strong> Shadows of your passage – IP runes, device sigils, and timestamps – may linger, summoned solely to guard the crypt’s sanctity and ensure its flame burns true.
            </li>
          </ul>
          <p>We seek no more than what you freely give, nor do we delve into the depths of your mortal soul beyond these walls.</p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">3. The Forge of Purpose</h2>
          <p>Your whispers are wielded thus:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>To Bind the Horde:</strong> Your soulmarks and offerings are chained to Xion, crafting an eternal testament to metal’s glory, unveiled within the crypt for all to witness.
            </li>
            <li>
              <strong>To Shield the Abyss:</strong> Technical echoes (IP, device data) are summoned to thwart chaos, secure the crypt, and honor the code of the horde.
            </li>
            <li>
              <strong>To Fuel the Flame:</strong> We use these shadows to maintain the crypt’s purpose, ensuring it serves the legion without bending to overlords or profit’s chains.
            </li>
          </ul>
          <p>We vow: no whisper shall be bartered, sold, or cast beyond these shadowed halls for greed or gain.</p>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">4. The Chains of Xion</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Immutable Shadows:</strong> Your blockchain address and offerings, once forged, are bound to Xion’s depths. This realm lies beyond our grasp, its chains unyielding and eternal.
            </li>
            <li>
              <strong>Eyes of the Abyss:</strong> What you etch into Xion – soulmarks and relics – may be seen by all who roam its halls, a mark of its decentralized nature. Guard your offerings with care, for the blockchain spares no secrets.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">5. Guardians of the Void</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>No Merchants, No Kings:</strong> We share no whispers with outsiders – no traders, spies, or overlords – save where the mortal law commands us.
            </li>
            <li>
              <strong>Law’s Demand:</strong> Should the courts of the land summon us, we unveil only what is decreed, shielding the horde’s sanctity with all our might.
            </li>
            <li>
              <strong>Allies of the Forge:</strong> Technical guardians (e.g., blockchain nodes, hosting spirits) may bear witness to your echoes as they uphold the crypt, but they are bound by their own pacts.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">6. Your Rights in the Shadows</h2>
          <p>You wield these powers over your whispers:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>To Unveil:</strong> Your blockchain address and offerings are yours to see, bound within Xion’s public ledger.
            </li>
            <li>
              <strong>To Refine:</strong> Alter or unchain your relics within the crypt where possible, though Xion’s immutable chains may hold them fast.
            </li>
            <li>
              <strong>To Summon Us:</strong> Cast your words to [email TBD] to seek knowledge of your echoes, demand their removal (where mortal hands can reach), or invoke your rights under the laws of the land (e.g., GDPR).
            </li>
            <li>
              <strong>To Fade:</strong> Cease forging, and we summon no new whispers – yet what lies in Xion endures beyond our will.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">7. The Flame’s Protection</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Runes of Defense:</strong> We wield technical wards to shield your echoes from chaos – thieves, breaches, or the unbidden. Yet the blockchain’s wild nature bows to no mortal shield.
            </li>
            <li>
              <strong>No False Promises:</strong> We guard with fury, but the abyss is untamed – we cannot vow absolute sanctuary against its storms.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">8. Whispers in the Void</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Summon Us:</strong> Cast your cries to [email TBD] should you seek counsel, bear grievances, or demand your shadows’ fate.
            </li>
            <li>
              <strong>The Codex Shifts:</strong> This Privacy Crypt may evolve as the abyss grows. Return to these scrolls to witness its rebirth.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-center">
          <h2 className="text-2xl font-unbounded text-[#d0d0d0]">Stand, Legion of Shadows</h2>
          <p>
            Your whispers fuel this crypt, a rebellion unbound by overlords, forged in metal and blockchain. We guard them with the fury of the horde, for in the shadows, your legacy endures.
          </p>
          <p className="text-[#d0d0d0] font-unbounded uppercase tracking-wide mt-4">
            Black Death Chains – No Masters, Only Chaos.
          </p>
        </section>
      </div>
    </motion.div>
  );
}