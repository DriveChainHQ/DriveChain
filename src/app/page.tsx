'use client'

import Link from "next/link";
import CarList from "./components/Car/CatList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">DriveChain</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            A platform for buying and selling used electric vehicles with complete transparency and storage of history in IPFS and Solana.
          </p>
          <div className="mt-6">
            <Link
              href="/sell"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              List the car to sale
            </Link>
          </div>
        </div>

        <CarList />
      </div>
    </div>
  );
}
