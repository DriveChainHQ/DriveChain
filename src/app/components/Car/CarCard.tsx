'use client';

import Link from "next/link";
import { useState } from "react";
import { PublicKey, SystemProgram, Transaction, Connection, clusterApiUrl } from '@solana/web3.js';

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sendTestTransaction = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const provider = (window as any).solana;
      if (!provider || !provider.isPhantom) {
        setMessage('Phantom wallet is not installed!');
        setLoading(false);
        return;
      }

      if (!provider.isConnected) {
        await provider.connect();
      }

      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const fromPubkey = provider.publicKey;

      if (!fromPubkey) {
        setMessage('Wallet not connected!');
        setLoading(false);
        return;
      }

      const toPubkey = new PublicKey('6Qzy4uYpeFMjxpUKAhYwPv6FQVPzyf8CJ8MLqbiTgpRh');

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: 1000000, 
        }),
      );

      transaction.feePayer = fromPubkey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signed = await provider.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());

      await connection.confirmTransaction(signature, 'confirmed');

      setMessage(`Transaction successful! Signature: ${signature}`);
    } catch (err) {
      console.error(err);
      setMessage('Transaction failed or rejected.');
    } finally {
      setLoading(false);
    }
  };

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

      <button
        onClick={sendTestTransaction}
        disabled={loading}
        className={`mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Processing...' : 'Buy'}
      </button>

      {message && (
        <p className="mt-2 text-sm text-center text-gray-700 break-words">{message}</p>
      )}
    </div>
  );
}