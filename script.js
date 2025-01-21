import { encryptMessage, decryptMessage } from './crypto.js';
import { REQUIRED_SHARES, SECRET_SIZE_BITS } from './config.js';


function generateKeys(numShares, threshold) {
    const key = secrets.random(SECRET_SIZE_BITS);
    const shares = secrets.share(key, numShares, threshold);
    const masterKey = shares.slice(0, threshold).join('-');
    
    return { shares, masterKey };
}

function handleSaveInstructions() {
    const masterPassword = document.getElementById('editMasterPassword').value;
    const markdownText = document.getElementById('markdownInput').value;
    
    // Split master password into shares and combine them
    const shares = masterPassword.split('-');
    const encryptionKey = secrets.combine(shares);
    
    encryptMessage(markdownText, encryptionKey)
        .then(encrypted => {
            const blob = new Blob([encrypted], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'instructions.encrypted.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
}

async function fetchAndDecryptInstructions(decryptionKey) {
    const response = await fetch('instructions.encrypted.txt');
    const encrypted = await response.text();
    const decrypted = await decryptMessage(encrypted, decryptionKey);
    return decrypted;
}

async function handleImportInstructions() {
    const masterPassword = document.getElementById('editMasterPassword').value;
    const shares = masterPassword.split('-');
    const decryptionKey = secrets.combine(shares);

    document.getElementById('markdownInput').value = await fetchAndDecryptInstructions(decryptionKey);
}

function initializeApp() {
    if (window.location.hash === '#admin') {
        document.getElementById('adminSection').style.display = 'block';
    }
    
    document.getElementById('generateButton').addEventListener('click', handleGenerateClick);
    //document.getElementById('submitButton').addEventListener('click', handlePasswordSubmit);
    document.getElementById('saveButton').addEventListener('click', handleSaveInstructions);
    document.getElementById('importButton').addEventListener('click', handleImportInstructions);

    document.getElementById('requiredShares').textContent = REQUIRED_SHARES;
}

function handleGenerateClick() {
    const numShares = parseInt(document.getElementById('numShares').value);
    const threshold = parseInt(document.getElementById('threshold').value);
    
    const { shares, masterKey } = generateKeys(numShares, threshold);
    
    document.getElementById('sharesList').textContent = shares.join('\n');
    document.getElementById('masterKey').textContent = masterKey;
}


export { initializeApp }