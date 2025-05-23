'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CarData {
  brand: string
  model: string
  vin: string
  year: string
  mileage: string
  imageUrl: string
  sold?: boolean
  buyer?: string,
  cid: string,
}

export default function MyCarsPage() {
  const [cars, setCars] = useState<CarData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const connectWalletAndLoadCars = async () => {
      try {
        const provider = (window as any).solana

        if (!provider || !provider.isPhantom) {
          alert("Phantom wallet not found!")
          setLoading(false)
          return
        }

        await provider.connect()
        const key = provider.publicKey?.toBase58()
        if (!key) {
          alert("Wallet connection failed.")
          setLoading(false)
          return
        }


        const cidsRaw = localStorage.getItem('drivechain_cids')
        const cids = cidsRaw ? JSON.parse(cidsRaw) : []

        const carPromises = cids.map(async (cid: string) => {
          try {
            const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`)
            const data = await res.json();
            return {...data, cid}
          } catch (err) {
            console.error('Failed to load car:', cid)
            return null
          }
        })

        const allCars = await Promise.all(carPromises)
        const myCars = allCars.filter(
          (car) => car && car.sold === true && car.buyer === key
        )

        setCars(myCars)
        setLoading(false)
      } catch (err) {
        console.error("Wallet or data error", err)
        setLoading(false)
      }
    }

    connectWalletAndLoadCars()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">My Cars</h1>

      {loading && <p>🔄 Loading your cars...</p>}

      {!loading && cars.length === 0 && (
        <p className="text-gray-600">
          You haven not purchased any cars with this wallet.
        </p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car, index) => (
          <Link href={`/car/${car.cid}`}key={index}>
            <div
              className="bg-white shadow-md rounded-xl overflow-hidden"
            >
              <img
                src={car.imageUrl}
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
        <Link
          href="/"
          className="text-blue-600 hover:underline text-sm"
        >
          ⬅ Back to Marketplace
        </Link>
      </div>
    </div>
  )
}