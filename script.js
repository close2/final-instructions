import { encryptMessage, decryptMessage } from './crypto.js';
import { REQUIRED_SHARES, SECRET_SIZE_BITS } from './config.js';


function generateKeys(numShares, threshold) {
    const key = secrets.random(SECRET_SIZE_BITS);
    const shares = secrets.share(key, numShares, threshold);
    const masterKey = shares.slice(0, threshold).join('-');
    
    return { shares, masterKey };
}

function handleSaveInstructions(simplemde) {
    const masterPassword = document.getElementById('editMasterPassword').value;
    const markdownText = simplemde.value();
    
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

async function handleImportInstructions(simplemde) {
    const masterPassword = document.getElementById('editMasterPassword').value;
    const shares = masterPassword.split('-');
    const decryptionKey = secrets.combine(shares);

    const decrypted = await fetchAndDecryptInstructions(decryptionKey);
    
    simplemde.value(decrypted);
}

function handleGenerateClick() {
    const numShares = parseInt(document.getElementById('numShares').value);
    const threshold = parseInt(document.getElementById('threshold').value);
    
    const { shares, masterKey } = generateKeys(numShares, threshold);
    
    document.getElementById('sharesList').textContent = shares.join('\n');
    document.getElementById('masterKey').textContent = masterKey;
}


function displayDecryptedContent(decryptedText) {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(decryptedText);
    
    document.getElementById('passwordForm').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    document.getElementById('content').innerHTML = html;
}

async function handlePasswordSubmit(passwordManager) {
    const password = document.getElementById('passwordInput').value;
    if (!password) return;

    passwordManager.submittedPasswords.push(password);
    document.getElementById('passwordCount').textContent = passwordManager.submittedPasswords.length;
    document.getElementById('passwordInput').value = '';

    if (passwordManager.submittedPasswords.length >= passwordManager.requiredShares) {
        const decryptionKey = secrets.combine(passwordManager.submittedPasswords);
        const decrypted = await fetchAndDecryptInstructions(decryptionKey);
        displayDecryptedContent(decrypted);
    }
}


function initializeApp() {
    if (window.location.hash === '#admin') {
        document.getElementById('adminSection').style.display = 'block';

        const simplemde = new SimpleMDE({
            element: document.getElementById("markdownEditor"),
            spellChecker: false,
            autosave: {
                enabled: true,
                uniqueId: "instructions"
            }
        });

        document.getElementById('saveButton').addEventListener('click',
            () => handleSaveInstructions(simplemde));
        document.getElementById('importButton').addEventListener('click',
            () => handleImportInstructions(simplemde));
        document.getElementById('generateButton').addEventListener('click', handleGenerateClick);

        document.getElementById('threshold').value = REQUIRED_SHARES;
    }

    const passwordManager = {
        shares: [],
        requiredShares: REQUIRED_SHARES,
        submittedPasswords: []
    };

    document.getElementById('submitButton').addEventListener('click', () => handlePasswordSubmit(passwordManager));

    document.getElementById('requiredShares').textContent = REQUIRED_SHARES;
}


export { initializeApp }
