const axios = require('axios')
const PINATA_JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyZjhjN2U1My03ODYwLTRmY2UtYWRiMC0yNDZkNWJiYzM0NmYiLCJlbWFpbCI6InN0ZWZhYW5AcG9ubmV0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmOGZmYmEwNzBiZmU5ZGVhOWQzYyIsInNjb3BlZEtleVNlY3JldCI6IjBiZDNiM2ZjZjc2Yzg3MmM1ZGI1Y2Y0ODcxODNlNGJhNDBlYTFhMjJlNDcxMTM3MzViODFjYWVjZWQwODI0NjYiLCJpYXQiOjE2ODMyOTk1NDl9.4_3PETxUCUsz66JP6unC3qemRsOwjahJt0Z0Iygb4EE'
const PIN_QUERY = 'https://api.pinata.cloud/data/pinList?status=pinned&includesCount=false&pageLimit=1000'

let pinHashes = []

const deletePinFromIPFS = async (hashToUnpin) => {
  try {
    const res = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${hashToUnpin}`, {
      headers: {
        Authorization: PINATA_JWT
      }
    })
    console.log(res.status)
  } catch (error) {
    console.log(error)
  }
}
const wait = async (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time)
  });
}

const fetchPins = async () => {
  try {
    const res = await axios.get(PIN_QUERY, {
      headers: {
        Authorization: PINATA_JWT
      }
    })
    const responseData = res.data.rows
    responseData.forEach(row => {
      pinHashes.push(row.ipfs_pin_hash)
    })
    console.log(pinHashes)
  } catch (error) {
    console.log(error)
  }
}

const bulkUnpin = async () => {
  try {
    for(const hash of pinHashes){
      await deletePinFromIPFS(hash)
      await wait(20)
    }
    pinHashes = []
   } catch (error){
    console.log(error)
  }
}

const main = async () => {
  await fetchPins()
  while(pinHashes){
    await bulkUnpin()
    await fetchPins()
  }
}

main()

