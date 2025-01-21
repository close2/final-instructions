import { encryptMessage, decryptMessage } from './crypto.js';
import { REQUIRED_SHARES, SECRET_SIZE_BITS } from './config.js';



let shares = [];
let encryptedContent = null;
const submittedPasswords = [];


function generateKeys(numShares, threshold) {
    const key = secrets.random(SECRET_SIZE_BITS);
    const shares = secrets.share(key, numShares, threshold);
    const masterKey = shares.slice(0, threshold).join('-');
    
    return { shares, masterKey };
}

function initializeApp() {
    if (window.location.hash === '#admin') {
        document.getElementById('adminSection').style.display = 'block';
    }
    
    // Add event listeners
    document.getElementById('generateButton').addEventListener('click', handleGenerateClick);
    document.getElementById('submitButton').addEventListener('click', handlePasswordSubmit);

    document.getElementById('requiredShares').textContent = REQUIRED_SHARES;
}


function handleGenerateClick() {
    const numShares = parseInt(document.getElementById('numShares').value);
    const threshold = parseInt(document.getElementById('threshold').value);
    
    const { shares, masterKey } = generateKeys(numShares, threshold);
    
    document.getElementById('sharesList').textContent = shares.join('\n');
    document.getElementById('masterKey').textContent = masterKey;
}

function generateAndEncrypt() {
    const markdown = document.getElementById('markdownEditor').value;
    
    // Generate keys
    handleGenerateClick();
    
    // Encrypt content
    const encrypted = btoa(markdown); // Replace with proper encryption
    
    // Create blob and download button
    const blob = new Blob([encrypted], {type: 'text/plain'});
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.style.display = 'block';
    downloadBtn.onclick = () => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'content.blob';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
}

function submitPassword() {
    if (handlePasswordSubmit(shares, requiredShares, submittedPasswords)) {
        decryptAndShow();
    }
}

function handlePasswordSubmit(shares, requiredShares, submittedPasswords) {
    const password = document.getElementById('passwordInput').value;
    if (!password) return;

    if (shares.includes(password)) {
        submittedPasswords.push(password);
        document.getElementById('passwordCount').textContent = submittedPasswords.length;
        document.getElementById('passwordInput').value = '';

        if (submittedPasswords.length >= requiredShares) {
            return true;
        }
    } else {
        alert('Invalid password');
    }
    return false;
}

function decryptAndShow() {
    const combinedSecret = secrets.combine(submittedPasswords);
    const decryptedContent = decryptMessage(encryptedContent, combinedSecret);
    
    const converter = new showdown.Converter();
    const html = converter.makeHtml(decryptedContent);
    
    document.getElementById('passwordForm').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    document.getElementById('content').innerHTML = html;
}

export { generateKeys, initializeApp, handleGenerateClick, handlePasswordSubmit }