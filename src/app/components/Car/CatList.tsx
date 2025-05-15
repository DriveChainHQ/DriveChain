'use client';

import { useEffect, useState } from 'react';
import CarCard from './CarCard';

type Car = {
  brand: string;
  model: string;
  vin: string;
  year: string;
  mileage: string;
  imageUrl: string;
  cid: string;
};

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarsFromLocalStorage = async () => {
      const cids: string[] = JSON.parse(localStorage.getItem('drivechain_cids') || '[]')
      const results: Car[] = []

      for (const cid of cids) {
        try {
          const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`)
          const data = await res.json()
          results.push({ ...data, cid })
        } catch (err) {
          console.error('Failed to fetch:', cid)
        }
      }
      setCars(results)
      setLoading(false)
    }

    fetchCarsFromLocalStorage()
  }, [])

  if (loading) return <p className="text-center mt-8">Loading cars...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {cars.map((car, idx) => (
        <CarCard key={idx} car={car} />
      ))}
    </div>
  );
}