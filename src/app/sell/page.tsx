'use client';

import React, { useState } from 'react';
import { uploadFileToPinata, uploadCarToPinata } from '@/lib/pinata';

export default function UploadCarForm() {
  const [carData, setCarData] = useState({
    brand: '',
    model: '',
    vin: '',
    year: '',
    mileage: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Upload an image of the car');

    try {
      setLoading(true);

      const imageUrl = await uploadFileToPinata(file);

      const fullData = { ...carData, imageUrl };

      const jsonUrl = await uploadCarToPinata(fullData);

      setIpfsUrl(jsonUrl);
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong while uploading to IPFS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">List the car for sale</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['brand', 'model', 'vin', 'year', 'mileage'].map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            value={(carData as any)[key]}
            onChange={handleChange}
            placeholder={key}
            className="w-full p-2 border rounded"
            required
          />
        ))}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Loading' : 'List'}
        </button>
      </form>

      {ipfsUrl && (
        <div className="mt-6">
          <p className="text-green-600">Successfully uploaded to IPFS:</p>
          <a href={ipfsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {ipfsUrl}
          </a>
        </div>
      )}
    </div>
  );
}