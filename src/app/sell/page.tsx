'use client'

import React, { useState } from 'react'
import { uploadFileToPinata, uploadCarToPinata } from '@/lib/pinata'
import { supabase } from '@/lib/supabase'
import { useWallet } from '@solana/wallet-adapter-react'

export default function UploadCarForm() {
  const { publicKey } = useWallet()

  const [carData, setCarData] = useState({
    brand: '',
    model: '',
    vin: '',
    year: '',
    mileage: '',
  })

  const [file, setFile] = useState<File | null>(null)
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarData({ ...carData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return alert('Please upload an image of the car.')
    if (!publicKey) return alert('Please connect your wallet.')

    try {
      setLoading(true)

      const imageUrl = await uploadFileToPinata(file)
      const fullData = { ...carData, imageUrl }
      const jsonUrl = await uploadCarToPinata(fullData)
      const cid = jsonUrl.replace('https://gateway.pinata.cloud/ipfs/', '')

      setIpfsUrl(jsonUrl)

      const { error } = await supabase.from('cars').insert([
        {
          brand: carData.brand,
          model: carData.model,
          vin: carData.vin,
          year: carData.year,
          mileage: carData.mileage,
          image_url: imageUrl,
          ipfs_url: jsonUrl,
          cid,
          owner: publicKey.toBase58(),
        },
      ])

      if (error) {
        console.error('Supabase insert error:', error)
        alert('Ошибка при сохранении в базу данных.')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Что-то пошло не так при загрузке.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 px-6 py-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">List Your Car for Sale</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {['brand', 'model', 'vin', 'year', 'mileage'].map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
              {key}
            </label>
            <input
              type="text"
              name={key}
              value={(carData as any)[key]}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Car Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none file:cursor-pointer"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-lg bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Submit Car Listing'}
        </button>
      </form>

      {ipfsUrl && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
          <p className="mb-1 font-medium">✅ Uploaded successfully to IPFS:</p>
          <a
            href={ipfsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {ipfsUrl}
          </a>
        </div>
      )}
    </div>
  )
}
