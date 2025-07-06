'use client';

import Link from "next/link";

type Car = {
  brand: string;
  model: string;
  vin: string;
  year: string;
  mileage: string;
  imageUrl: string;
  cid: string;
  sold?: boolean;
  buyer?: string;
};

export default function CarCard({ car }: { car: Car }) {

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition flex flex-col">
      <Link href={`/car/${car.cid}`} className="flex-grow">
        <img
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 object-cover rounded-md"
        />
        <div className="mt-4 space-y-1">
          <h3 className="text-lg font-semibold">{car.brand} {car.model}</h3>
          <p className="text-sm text-gray-500">Year: {car.year} • Mileage: {car.mileage} km</p>
          <p className="text-sm text-gray-400">VIN: {car.vin}</p>
        </div>
      </Link>

      <Link
        href={`/car/${car.cid}`}
        className={`mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-fit`}
      >
        {car.sold ? 'Already Sold' : 'Buy'}
      </Link>
    </div>
  );
}