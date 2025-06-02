# 🚗 DriveChain

DriveChain is a decentralized marketplace for buying and selling used electric vehicles. Each vehicle is listed with an on-chain NFT passport and its metadata (including photo, VIN, mileage, etc.) stored on IPFS.

## ✨ Features

- Upload car listings with images, VIN, mileage, and more
- Metadata stored on IPFS via Pinata
- CID saved to localStorage for now (will sync to blockchain later)
- Clean, responsive UI built with Tailwind CSS
- Individual car pages available via CID routing
- Placeholder "Buy" button for upcoming smart contract integration

## 🧱 Tech Stack

- **Frontend:** Next.js 15 App Router
- **Styling:** Tailwind CSS
- **Storage:** IPFS via [Pinata]
- **Blockchain (planned):** Solana smart contracts
- **Wallet:** Phantom

## 🚀 Getting Started

```bash
git https://github.com/DriveChainHQ/DriveChain.git
cd DriveChain
npm install
```

### Setup .env.local
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret

### Run locally
```bash
npm run dev
```
