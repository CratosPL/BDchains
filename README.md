# Black Death Chains
### Forged in Blockchain, Bound by Metal

Black Death Chains is a decentralized platform celebrating the raw fury of black and death metal, built on the Internet Computer Protocol (ICP) blockchain. Powered by AI, it enables fans to forge an eternal crypt of band legacies, mint exclusive NFTs, and fuel the underground scene without corporate shackles. Join the horde, add bands, trade relics, and revel in a privacy-first rebellion.

---

## Demo Video

[Insert Demo Video Link Here](<https://www.youtube.com/watch?v=3mfd3qKXdtM&t=1883s>)

## Screenshots

![Home Page](<screenshots/0e703e40-08c2-11f0-9792-d9509a56e4cfZrzut ekranu 2025-03-24 o 16.07.36.png>)
![Add Band Modal](<screenshots/061c9720-08c2-11f0-9792-d9509a56e4cfZrzut ekranu 2025-03-24 o 16.06.15.png>)
![Hero Banner](<screenshots/e62db1b0-08c1-11f0-9792-d9509a56e4cfZrzut ekranu 2025-03-24 o 16.00.29.png>)
![AI Section](<screenshots/ef5809c0-08c1-11f0-9792-d9509a56e4cfZrzut ekranu 2025-03-24 o 16.00.50.png>)
![Band Detail Top](<screenshots/f6d6d4b0-08c1-11f0-bdb6-e3b5e66eb766Zrzut ekranu 2025-03-24 o 16.04.12.png>)
![Discography Modal](<screenshots/fb343b60-08c1-11f0-bdb6-e3b5e66eb766Zrzut ekranu 2025-03-24 o 16.04.29.png>)
![Fan Legion](<screenshots/ff248860-08c1-11f0-bdb6-e3b5e66eb766Zrzut ekranu 2025-03-24 o 16.05.11.png>)

> **Uwaga:** Nie zmieniaj nazw plików; po prostu umieść je w folderze `screenshots/`.

---

## Overview

Black Death Chains is a community-driven encyclopedia and marketplace for black and death metal enthusiasts. Users can:

- **Add and edit band details, albums, members, and links**, all stored immutably on ICP.
- **Mint and trade NFTs** representing band relics, demos, or exclusive tracks.
- **Explore a decentralized crypt of metal history**, with AI-enhanced content generation and curation.
- **Earn tokens for contributions**, fostering a horde-driven ecosystem.

The platform leverages ICP’s scalability and AI to create a dynamic, anonymous space where metalheads shape the scene’s future.

## Key Features

- **Decentralized Encyclopedia**: Add/edit bands, albums, and members, secured on ICP.
- **NFT Forge**: Mint and trade unique metal NFTs (e.g., album art, demo tracks).
- **AI Integration**: AI curates content, generates band summaries, and enhances search.
- **Privacy & Anonymity**: Blockchain ensures user anonymity, no Web2 overlords.
- **Community-Driven**: Earn tokens for contributions, trade for NFTs or virtual gig access.
- **Responsive UI**: Dark, metal-themed interface with Swiper carousels and Framer Motion animations.

## Tech Stack

**Frontend**:
- Next.js (React) for server-side rendering and routing.
- TypeScript for type-safe development.
- Framer Motion for animations.
- Swiper for carousel components.
- React Query for data fetching and caching.
- Tailwind CSS for styling.

**Backend**:
- ICP Blockchain for decentralized storage and smart contracts (canisters).
- Motoko for canister logic (`bandCanister/main.mo`).
- Node.js/Express for API routes.

**AI**:
- Integrated AI for content summarization and search optimization (`services/ai`).

**Tools**:
- GitHub for version control.
- React Toastify for notifications.
- Lodash for utilities.

## Project Structure

```
src/
├── app/
│   ├── api/
│   ├── band/[id]/
│   ├── encyclopedia/
│   ├── page.tsx
│   └── ...
├── components/
│   ├── AddBandForm.tsx
│   ├── BandDetail/
│   └── ...
├── services/
│   ├── bandCanister/
│   └── bandService.ts
├── types/
├── hooks/
├── lib/
└── declarations/
```

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <your-repo-url>
   cd black-death-chains
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_ICP_CANISTER_ID=<your-canister-id>
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
   Ensure the ICP DFX CLI is installed: [DFX Installation Guide](https://internetcomputer.org/docs/current/developer-docs/quickstart/).

4. **Deploy Canisters**:
   ```bash
   dfx start --background
   dfx deploy
   ```
5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

6. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

## Usage

- **Explore the Crypt**: Visit the Encyclopedia to search for bands or browse by letter.
- **Forge Content**: Click "Forge Band" to add a new band. Edit existing bands if you’re the author or an admin.
- **Mint NFTs**: Access the NFT Vault to mint or trade band relics (feature in development).
- **Join the Horde**: Contribute content to earn tokens and shape the platform.

## Privacy & Security

- **Anonymity**: User identities are protected via ICP’s cryptographic keys.
- **Immutable Data**: Band details and NFTs are stored on-chain, ensuring permanence.
- **No Web2 Dependency**: Fully decentralized, no reliance on centralized servers.

## Future Roadmap

- Full NFT marketplace integration.
- AI-driven band recommendations and riff analysis.
- Virtual gig streaming with token-based access.
- Expanded community governance features.

## Contributing

Join the metal horde! Fork the repo, create a branch, and submit a pull request. Report issues or suggest features via GitHub Issues.

## License

MIT License. See `LICENSE` for details.

## Acknowledgments

Built for the AI & Blockchain Workshop Contest (deadline: April 21, 2025). Inspired by the raw energy of Mayhem, Cannibal Corpse, and Darkthrone. Powered by the Internet Computer Protocol and xAI’s AI innovation.

---

*This README is forged in the abyss, for the horde, by the horde.*
