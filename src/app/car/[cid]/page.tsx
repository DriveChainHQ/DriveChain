/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  clusterApiUrl,
} from '@solana/web3.js'
import { uploadCarToPinata } from '@/lib/pinata'

interface CarData {
  brand: string
  model: string
  vin: string
  year: string
  mileage: string
  imageUrl: string
  sold?: boolean
  buyer?: string
}

interface CarPageProps {
  params: Promise<{ cid: string }>
}

export default function CarPage({ params }: CarPageProps) {
  const { cid } = use(params)
  const [car, setCar] = useState<CarData | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`)
        const data = await res.json()
        setCar(data)
      } catch (err) {
        setMessage(`❌ Failed to load car data: ${err}`)
      }
    }

    fetchData()
  }, [cid])

  const buyCar = async () => {
    try {
      setLoading(true)
      const provider = (window as any).solana
      if (!provider || !provider.isPhantom) {
        alert('Phantom wallet not found!')
        return
      }

      await provider.connect()
      const publicKey = provider.publicKey?.toBase58()
      if (!publicKey) {
        alert('Wallet not connected')
        return
      }

      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
      const fromPubkey = provider.publicKey
      const toPubkey = new PublicKey('969AsGFCHevB5EzYmuoDfwMPn6Xo4gnkDiFUPMZzv3qs')
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: 1000000, 
        })
      )

      transaction.feePayer = fromPubkey
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      const signed = await provider.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signed.serialize())
      await connection.confirmTransaction(signature, 'confirmed')

      console.log('Transaction confirmed:', signature)

      const updatedCar = {
        ...car,
        sold: true,
        buyer: publicKey,
      }

      const newUrl = await uploadCarToPinata(updatedCar)
      const newCid = newUrl.split('/').pop()

      const cidsRaw = localStorage.getItem('drivechain_cids')
      const currentCids = cidsRaw ? JSON.parse(cidsRaw) : []
      const updatedCids = currentCids.filter((id: string) => id !== cid)
      updatedCids.push(newCid)
      localStorage.setItem('drivechain_cids', JSON.stringify(updatedCids))

      const updatedRes = await fetch(`https://gateway.pinata.cloud/ipfs/${newCid}`)
      const updatedData = await updatedRes.json()

      setCar(updatedData)
      setMessage('✅ Car successfully purchased and marked as sold!')
    } catch (error) {
      console.error('Buy failed:', error)
      setMessage('❌ Purchase failed.')
    } finally {
      setLoading(false)
    }
  }

  if (!car) return <div className="text-center mt-20">🔄 Loading...</div>

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <img
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">
            {car.brand} {car.model}
          </h1>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Year:</span> {car.year}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">VIN:</span> {car.vin}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-medium">Mileage:</span> {car.mileage} km
          </p>

          {car.sold && (
            <div className="text-green-600 font-semibold mb-4">
              ✅ Sold to {car.buyer ? `@${car.buyer.slice(0, 4)}...${car.buyer.slice(-4)}` : 'someone'}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded mb-4">
            <h3 className="text-lg font-semibold mb-2">Maintenance History</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Battery check at 12,000 km</li>
              <li>Brake pad replacement at 25,000 km</li>
              <li>Software update at 30,000 km</li>
            </ul>
          </div>

          <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
            <Link
              href="/"
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Back
            </Link>

            <a
              href={`https://gateway.pinata.cloud/ipfs/${cid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View on IPFS
            </a>

            <button
              onClick={buyCar}
              disabled={loading || car.sold}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {car.sold ? 'Already Sold' : loading ? 'Processing...' : 'Buy for 0.001 SOL'}
            </button>
          </div>

          {message && (
            <div className="text-sm text-center mt-2 text-gray-700">{message}</div>
          )}
        </div>
      </div>
    </div>
  )
}