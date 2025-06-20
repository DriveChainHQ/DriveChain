'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useWallet } from '@solana/wallet-adapter-react'

interface CarData {
  brand: string
  model: string
  vin: string
  year: string
  mileage: string
  image_url: string
  cid: string
  sold?: boolean
  buyer?: string
}

export default function MyCarsPage() {
  const { publicKey } = useWallet()
  const [cars, setCars] = useState<CarData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCars = async () => {
      if (!publicKey) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('owner', publicKey.toBase58())

      if (error) {
        console.error('Error loading cars:', error)
      } else {
        setCars(data)
      }

      setLoading(false)
    }

    loadCars()
  }, [publicKey])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">My Cars</h1>

      {loading && <p>🔄 Loading your cars...</p>}

      {!loading && cars.length === 0 && (
        <p className="text-gray-600">
          You haven’t purchased any cars with this wallet.
        </p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car, index) => (
          <Link href={`/car/${car.cid}`} key={index}>
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
              <img
                src={car.image_url}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">
                  {car.brand} {car.model}
                </h2>
                <p className="text-gray-600 text-sm">Year: {car.year}</p>
                <p className="text-gray-600 text-sm">Mileage: {car.mileage} km</p>
                <p className="text-green-600 text-sm font-medium mt-2">
                  ✅ You own this car
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ⬅ Back to Marketplace
        </Link>
      </div>
    </div>
  )
}
