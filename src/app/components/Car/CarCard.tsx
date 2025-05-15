import Link from "next/link";

type Car = {
  brand: string;
  model: string;
  vin: string;
  year: string;
  mileage: string;
  imageUrl: string;
  cid: string;
};

export default function CarCard({ car }: { car: Car }) {
  return (
    <Link href={`/car/${car.cid}`}>
      <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
        <img
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 object-cover rounded-md"
        />
        <div className="mt-4 space-y-1">
          <h3 className="text-lg font-semibold">{car.brand} {car.model}</h3>
          <p className="text-sm text-gray-500">Year: {car.year} • Mileage: {car.mileage} км</p>
          <p className="text-sm text-gray-400">VIN: {car.vin}</p>
        </div>
      </div>
    </Link>
  );
}