'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <header className="max-w-7xl mx-auto flex justify-between items-center py-2 px-4 md:px-0">
      <nav className="flex space-x-6">
        <Link
          href="/"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Main
        </Link>
        <Link
          href="/sell"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Sell
        </Link>
        <Link
          href="/my-cars"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          My cars
        </Link>
      </nav>

      <WalletMultiButton />
    </header>
  )
}
