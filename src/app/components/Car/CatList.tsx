'use client'

import { useEffect, useState } from 'react'
import CarCard from './CarCard'
import { supabase } from '@/lib/supabase'

type Car = {
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

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCarsFromSupabase = async () => {
      const { data, error } = await supabase.from('cars').select('*')

      if (error) {
        console.error('Error fetching cars:', error)
        return
      }

      if (data) {
        setCars(data)
      }

      setLoading(false)
    }

    fetchCarsFromSupabase()
  }, [])

  if (loading) return <p className="text-center mt-8">Loading cars...</p>

  if (cars.length === 0) {
    return <p className="text-center mt-8 text-gray-600">No cars found.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {cars.map((car, idx) => (
        <CarCard
          key={idx}
          car={{
            brand: car.brand,
            model: car.model,
            vin: car.vin,
            year: car.year,
            mileage: car.mileage,
            cid: car.cid,
            imageUrl: car.image_url,
            sold: car.sold,
            buyer: car.buyer,
          }}
        />
      ))}
    </div>
  )
}
