import CryptoJS from 'crypto-js'
const key = import.meta.env.VITE_SALT

export const encryptData = (data: string) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()

export const decryptData = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

export const generateSalt = () => CryptoJS.lib.WordArray.random(16).toString()
