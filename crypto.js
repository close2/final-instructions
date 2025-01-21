import { SECRET_SIZE_BITS } from './config.js';

// Key preparation functions
function hexToBytes(hexString) {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

function base64ToBytes(base64String) {
    return new Uint8Array(atob(base64String).split('').map(c => c.charCodeAt(0)));
}

function bytesToBase64(bytes) {
    return btoa(String.fromCharCode(...bytes));
}

// Crypto key functions
async function importKey(keyBytes, usage) {
    return crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM', length: SECRET_SIZE_BITS },
        false,
        [usage]
    );
}

// IV handling
function generateIV() {
    return crypto.getRandomValues(new Uint8Array(12));
}

function combineIVAndCiphertext(iv, ciphertext) {
    const result = new Uint8Array(iv.length + ciphertext.byteLength);
    result.set(iv);
    result.set(new Uint8Array(ciphertext), iv.length);
    return result;
}

function separateIVAndCiphertext(data) {
    return {
        iv: data.slice(0, 12),
        ciphertext: data.slice(12)
    };
}

// Main encryption/decryption functions
async function encryptMessage(message, key) {
    const keyBytes = hexToBytes(key);
    const iv = generateIV();
    const cryptoKey = await importKey(keyBytes, 'encrypt');
    
    const encodedMessage = new TextEncoder().encode(message);
    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encodedMessage
    );
    
    const combined = combineIVAndCiphertext(iv, ciphertext);
    return bytesToBase64(combined);
}

async function decryptMessage(encrypted, key) {
    const keyBytes = hexToBytes(key);
    const encryptedData = base64ToBytes(encrypted);
    const { iv, ciphertext } = separateIVAndCiphertext(encryptedData);
    
    const cryptoKey = await importKey(keyBytes, 'decrypt');
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        ciphertext
    );
    
    return new TextDecoder().decode(decrypted);
}

export {
    encryptMessage,
    decryptMessage,
    hexToBytes,
    bytesToBase64,
    base64ToBytes,
    generateIV,
    combineIVAndCiphertext,
    separateIVAndCiphertext,
    importKey
};
