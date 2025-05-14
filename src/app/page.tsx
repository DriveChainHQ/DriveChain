'use client'

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import CarList from "./components/Car/CatList";

export default function Home() {
  return (
    <div>
      <WalletMultiButton />
      <CarList />
    </div>
  );
}
