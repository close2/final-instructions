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
    
    document.getElementById('generatedContent').style.display = 'block';
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

function validatePassword(password) {
    const passwordRegex = /^8[0-9a-fA-F]{98}$/;
    return passwordRegex.test(password);
}

function handlePasswordSubmit(passwordManager) {
    const password = document.getElementById('passwordInput').value;
    if (!password) return;

    if (!validatePassword(password)) {
        showError('Invalid password format');
        return;
    }

    if (passwordManager.submittedPasswords.includes(password)) {
        showError('This password has already been used');
        return;
    }

    passwordManager.submittedPasswords.push(password);
    updatePasswordDisplay(passwordManager);
    document.getElementById('passwordInput').value = '';

    if (passwordManager.submittedPasswords.length >= passwordManager.requiredShares) {
        const decryptionKey = secrets.combine(passwordManager.submittedPasswords);
        fetchAndDecryptInstructions(decryptionKey)
          .then(displayDecryptedContent);
    }
}

function updatePasswordDisplay(passwordManager) {
    const progressContainer = document.getElementById('passwordProgress');
    progressContainer.innerHTML = '';
    
    for (let i = 0; i < passwordManager.requiredShares; i++) {
        const slot = document.createElement('div');
        slot.className = `password-slot ${i < passwordManager.submittedPasswords.length ? 'filled' : ''}`;
        progressContainer.appendChild(slot);
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.opacity = 1;
    setTimeout(() => {
        errorDiv.style.opacity = 0;
    }, 3000);
}

function convertImageToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

function handleSimpleMDEImagePaste(editor) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertImageToBase64(file);
        const imageMarkdown = `![image](${base64})`;
        editor.codemirror.replaceSelection(imageMarkdown);
    };
    
    input.click();
}

function initializeSimpleMDE(simpleMdeId) {
    const simplemde = new SimpleMDE({ 
        element: document.getElementById(simpleMdeId),
        spellChecker: false,
        toolbar: [
            "bold", "italic", "heading", "|",
            "quote", "unordered-list", "ordered-list", "|",
            "link", 
            {
                name: "image",
                action: handleSimpleMDEImagePaste,
                className: "fa fa-picture-o",
                title: "Insert Image (Ctrl+V)",
            },
            "|",
            "preview", "side-by-side", "fullscreen"
        ]
    });
    

    // Handle paste events
    simplemde.codemirror.on("paste", async (cm, e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        
        for (const item of items) {
            if (item.type.indexOf("image") === 0) {
                e.preventDefault();
                const blob = item.getAsFile();
                const base64 = await convertImageToBase64(blob);
                const cursor = cm.getCursor();
                cm.replaceRange(`![image](${base64})`, cursor);
            }
        }
    });

    return simplemde;
}

function initializeApp() {
    if (window.location.hash === '#admin') {
        document.getElementById('adminSection').style.display = 'block';

        const simplemde = initializeSimpleMDE("markdownEditor");

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
}


export { initializeApp, generateKeys, validatePassword }
