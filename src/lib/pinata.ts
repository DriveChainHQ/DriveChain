import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

export const uploadFileToPinata = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': 'multipart/form-data',
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET,
    },
  });

  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
};

export const uploadCarToPinata = async (carData: any) => {
  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    carData,
    {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET,
      },
    }
  );

  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
};