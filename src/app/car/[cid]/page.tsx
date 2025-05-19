import Link from 'next/link'
import React from 'react'

interface CarData {
  brand: string
  model: string
  vin: string
  year: string
  mileage: string
  imageUrl: string
}

interface CarPageProps {
  params: { cid: string }
}

export default async function CarPage({ params }: CarPageProps) {
  const { cid } = params

  let car: CarData | null = null

  try {
    const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`, {
      next: { revalidate: 60 },
    })
    car = await res.json()
  } catch (err) {
    console.error('Failed to fetch car data from IPFS:', err)
  }

  if (!car) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center text-gray-600">
        🚫 Failed to load car information for CID: {cid}
      </div>
    )
  }

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

          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Back to Home
            </Link>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              disabled
            >
              Buy (coming soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}