'use client';

import { useEffect, useState } from 'react';
import CarCard from './CarCard';
import { mockCIDs } from '@/lib/carMockList';

type Car = {
  brand: string;
  model: string;
  vin: string;
  year: string;
  mileage: string;
  imageUrl: string;
};

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carData = await Promise.all(
          mockCIDs.map(async (cid) => {
            const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
            return await res.json();
          })
        );
        setCars(carData);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading cars...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {cars.map((car, idx) => (
        <CarCard key={idx} car={car} />
      ))}
    </div>
  );
}