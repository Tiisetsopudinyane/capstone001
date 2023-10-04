/*import CryptoJS from 'crypto-js';


// Define a secret key
const secretKey = 'MySecretKey';

// Convert the secret key to a WordArray
const key = CryptoJS.enc.Utf8.parse(secretKey);

// Now, you can use the key to encrypt and decrypt
const encryptedMessage = encrypt('Message', key);
const decryptedMessage = decrypt(encryptedMessage, key);

console.log('Encrypted:', encryptedMessage);
console.log('Decrypted:', decryptedMessage);

export function encrypt(message, key) {
  const encrypted = CryptoJS.AES.encrypt(message, key);
  return encrypted.toString();
}

export function decrypt(encryptedMessage, key) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, key);
  const plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
}

*/
   const cipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

    return text => text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
}
    
const decipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
    return encoded => encoded.match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');
}

// To create a cipher
 export const myCipher = cipher('mySecretSalt')

//Then cipher any text:
//console.log(myCipher('the secret string'))

//To decipher, you need to create a decipher and use it:
export const myDecipher = decipher('mySecretSalt')
//console.log(myDecipher("7c606d287b6d6b7a6d7c287b7c7a61666f"))
 