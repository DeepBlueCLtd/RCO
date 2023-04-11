import CryptoJS from 'crypto-js'
const key: string =
  process.env.VITE_KEY ?? '68adsqf-poac-154s-adqkc-05s8q2c5a65s'

export const encryptData = (data: string) =>
  CryptoJS.AES.encrypt(data, key).toString()

export const decryptData = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const decryptPassword = (
  hashedPassword: string,
  salt: string
): string => {
  const password: string = hashedPassword
  const decryptedData = decryptData(`${password}`)
  const decryptedPassword = decryptedData.substring(
    0,
    decryptedData.length - salt.length
  )
  return decryptedPassword
}

export const generateSalt = () => CryptoJS.lib.WordArray.random(16).toString()
