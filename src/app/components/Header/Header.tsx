'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import React from 'react'

export default function Header() {
  return (
    <div className='bg-gray-50 max-w-7xl mx-auto flex justify-end py-2'>
      <WalletMultiButton />
    </div>
  )
}
