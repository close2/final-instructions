import {
    encryptMessage,
    decryptMessage,
    hexToBytes,
    bytesToBase64,
    base64ToBytes,
    generateIV,
    combineIVAndCiphertext,
    separateIVAndCiphertext,
    importKey
} from './crypto.js';

import { SECRET_SIZE_BITS } from './config.js';


QUnit.module('Crypto Utils', () => {
    QUnit.test('hexToBytes converts correctly', assert => {
        const hex = "1a2b3c";
        const bytes = hexToBytes(hex);
        assert.equal(bytes.length, 3);
        assert.equal(bytes[0], 0x1a);
        assert.equal(bytes[1], 0x2b);
        assert.equal(bytes[2], 0x3c);
    });

    QUnit.test('base64 conversion roundtrip', assert => {
        const original = new Uint8Array([1, 2, 3, 4, 5]);
        const base64 = bytesToBase64(original);
        const result = base64ToBytes(base64);
        assert.deepEqual(result, original);
    });

    QUnit.test('IV generation produces correct length', assert => {
        const iv = generateIV();
        assert.equal(iv.length, 12);
    });

    QUnit.test('IV combination and separation roundtrip', assert => {
        const iv = generateIV();
        const ciphertext = new Uint8Array([6, 7, 8, 9, 10]);
        const combined = combineIVAndCiphertext(iv, ciphertext);
        const separated = separateIVAndCiphertext(combined);
        assert.deepEqual(separated.iv, iv);
        assert.deepEqual(separated.ciphertext, ciphertext);
    });
});

QUnit.module('Key Import', () => {
    QUnit.test('imports key for encryption', async assert => {
        const keyBytes = new Uint8Array(32);
        crypto.getRandomValues(keyBytes);
        const key = await importKey(keyBytes, 'encrypt');
        assert.true(key instanceof CryptoKey);
    });
});

QUnit.module('Encryption/Decryption', () => {
    QUnit.test('encrypts and decrypts message correctly', async assert => {
        const testMessage = 'Hello, World!';
        const testKey = secrets.random(SECRET_SIZE_BITS);
        const encrypted = await encryptMessage(testMessage, testKey);
        const decrypted = await decryptMessage(encrypted, testKey);
        assert.equal(decrypted, testMessage);
    });

    QUnit.test('different encryptions of same message are different', async assert => {
        const testMessage = 'Hello, World!';
        const testKey = secrets.random(SECRET_SIZE_BITS);
        const encrypted1 = await encryptMessage(testMessage, testKey);
        const encrypted2 = await encryptMessage(testMessage, testKey);
        assert.notEqual(encrypted1, encrypted2);
    });

    QUnit.test('handles special characters', async assert => {
        const testMessage = '!@#$%^&*()_+{}[]|":;<>?';
        const testKey = secrets.random(SECRET_SIZE_BITS);
        const encrypted = await encryptMessage(testMessage, testKey);
        const decrypted = await decryptMessage(encrypted, testKey);
        assert.equal(decrypted, testMessage);
    });

    QUnit.test('handles unicode characters', async assert => {
        const testMessage = '你好世界🌍';
        const testKey = secrets.random(SECRET_SIZE_BITS);
        const encrypted = await encryptMessage(testMessage, testKey);
        const decrypted = await decryptMessage(encrypted, testKey);
        assert.equal(decrypted, testMessage);
    });

    QUnit.test('handles empty messages', async assert => {
        const testKey = secrets.random(SECRET_SIZE_BITS);
        const encrypted = await encryptMessage('', testKey);
        const decrypted = await decryptMessage(encrypted, testKey);
        assert.equal(decrypted, '');
    });

    QUnit.test('handles long messages', async assert => {
        const longMessage = 'x'.repeat(10000);
        const testKey = secrets.random(SECRET_SIZE_BITS);
        const encrypted = await encryptMessage(longMessage, testKey);
        const decrypted = await decryptMessage(encrypted, testKey);
        assert.equal(decrypted, longMessage);
    });
});
