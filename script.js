// Configuration
const requiredShares = 3;
let shares = [];
let encryptedContent = null;

// Initialize
document.getElementById('requiredShares').textContent = requiredShares;
const submittedPasswords = [];

// Show admin panel with special URL parameter
if (window.location.hash === '#admin') {
    document.getElementById('adminSection').style.display = 'block';
}

// Fetch encrypted content on load
fetch('content.blob')
    .then(response => response.text())
    .then(content => {
        encryptedContent = content;
    })
    .catch(error => console.error('Error loading content:', error));

function generateKeys() {
    const numShares = parseInt(document.getElementById('numShares').value);
    const threshold = parseInt(document.getElementById('threshold').value);
    
    const key = secrets.random(128);
    shares = secrets.share(key, numShares, threshold);
    const masterKey = shares.slice(0, threshold).join('-');
    
    document.getElementById('sharesList').textContent = shares.join('\n');
    document.getElementById('masterKey').textContent = masterKey;
}

function generateAndEncrypt() {
    const markdown = document.getElementById('markdownEditor').value;
    
    // Generate keys
    generateKeys();
    
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
    const password = document.getElementById('passwordInput').value;
    if (!password) return;

    if (shares.includes(password)) {
        submittedPasswords.push(password);
        document.getElementById('passwordCount').textContent = submittedPasswords.length;
        document.getElementById('passwordInput').value = '';

        if (submittedPasswords.length >= requiredShares) {
            decryptAndShow();
        }
    } else {
        alert('Invalid password');
    }
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

function decryptMessage(encrypted, key) {
    return atob(encrypted);
}
