# 🚗 DriveChain

DriveChain is a decentralized marketplace for buying and selling used electric vehicles. Each vehicle is listed with an on-chain NFT passport and its metadata (including photo, VIN, mileage, etc.) stored on IPFS.



## ✨ Features

- Upload car listings with images, VIN, mileage, and more
- Metadata stored on IPFS via Pinata
- CID saved to localStorage for now (will sync to blockchain later)
- Clean, responsive UI built with Tailwind CSS
- Individual car pages available via CID routing
- Placeholder "Buy" button for upcoming smart contract integration

##  Live Demo

Check out the live demo of **DriveChain** here:  
👉 [https://drivechain-solana.onrender.com/](https://drivechain-solana.onrender.com/)

### 🧪 What you can try in the demo:

- ✅ **List your own car** for sale
- ✅ **Buy a car** that someone else has listed (if it's still available)
- ✅ **View purchased cars** in the "My Cars" section
- ⚠️ **Note:** All data is currently stored in your **localStorage** (temporary & browser-based only)

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
