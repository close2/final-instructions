const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Secure Instructions E2E', () => {
    const downloadedFilePath = path.join(__dirname, '../downloaded-instructions.html');

    test.beforeEach(async () => {
        // Cleanup download
        if (fs.existsSync(downloadedFilePath)) {
            fs.unlinkSync(downloadedFilePath);
        }
    });

    test('Full E2E flow: Create, Download, and Decrypt', async ({ page }) => {
        // 1. Admin Flow
        await page.goto('/secure-instructions.html#admin');

        // Fill basic info
        await page.click('text=Create Content');
        await page.fill('#edit-name', 'E2E Test Content');
        await page.fill('#edit-description', 'This is a test description.');
        await page.fill('#edit-total-shares', '5');
        await page.fill('#edit-required-shares', '3');





        // Generate Shares
        await page.click('text=Generate Shares');

        // Capture Shares
        const shares = [];
        for (let i = 0; i < 5; i++) {
            const share = await page.inputValue(`//label[contains(text(), "Share ${i + 1}")]/following-sibling::input`);
            shares.push(share);
        }
        console.log('Captured shares:', shares);
        expect(shares.length).toBe(5);

        // Save Content and Download
        await page.click('text=Proceed to Content');

        // Test File Removal/Re-addition (Corner Case)
        // Add a dummy file first
        const dummyFile = {
            name: 'dummy.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('dummy content')
        };
        const fileInput = page.locator('#file-input');
        await fileInput.setInputFiles(dummyFile);

        // Verify it's there
        await expect(page.locator('#file-preview')).toContainText('dummy.txt');

        // Remove it
        const removeBtn = page.locator('button.btn-danger', { hasText: 'Remove' });
        await expect(removeBtn).toBeVisible();
        await removeBtn.click();
        await expect(page.locator('#file-preview')).not.toContainText('dummy.txt');

        // Add real test file
        const testFile = {
            name: 'secret.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('Super secret content')
        };
        await fileInput.setInputFiles(testFile);
        await expect(page.locator('#file-preview')).toContainText('secret.txt');

        // Instruction Text
        await page.fill('#edit-text', 'These are the secret instructions.');

        const downloadPromise = page.waitForEvent('download');
        await page.click('#btn-save-content');
        const download = await downloadPromise;

        await download.saveAs(downloadedFilePath);
        expect(fs.existsSync(downloadedFilePath)).toBeTruthy();

        // 2. User Flow (Original File)
        await page.goto('/secure-instructions.html');
        await page.click('text=Access Content'); // Opens the last created (which is ours, assuming clean state or appended)
        // NOTE: In a real persistent app, we'd need to identify *which* content. But here we just added one. 
        // If there are many, we might need to match by text.
        // Let's assume we click the button inside the card that has our title.
        // Reload to be safe and find by text
        await page.goto('/secure-instructions.html');
        const contentCard = page.locator('.content-item', { hasText: 'E2E Test Content' });
        await contentCard.locator('button').click();

        // Corner Case: Insufficient Shares
        // Enter only 1 share
        await page.fill('#password-0', shares[0]);
        await page.click('text=Decrypt Content');
        // Expect failure (error message)
        // Note: The app currently might just fail silently or show an error. 
        // Based on code: ui.showError(error.message)
        // Secrets.js throws if fewer than required.
        const errorMessage = page.locator('.error');
        // We might need to wait for it.
        // Actually the UI might require all inputs to be filled if they have 'required' attribute.
        // Let's check if the browser validation stops us.
        // Or if we fill garbage in others.
        // Let's try filling 2 correct shares and 1 empty? 
        // Logic: "Please enter all required passwords" throws if empty.

        // Let's try filling 3 inputs, but one is wrong.
        await page.fill('#password-1', 'wrongshare');
        await page.fill('#password-2', shares[2]);
        await page.click('text=Decrypt Content');
        await expect(errorMessage).toBeVisible();
        // "Invalid or insufficient shares" or similar from secrets.js

        // Valid Decryption
        await page.fill('#password-0', shares[0]);
        await page.fill('#password-1', shares[1]);
        await page.fill('#password-2', shares[2]);
        await page.click('text=Decrypt Content');

        // Verify Content
        await expect(page.locator('#content-text')).toContainText('These are the secret instructions.');
        await expect(page.locator('#content-files')).toContainText('secret.txt');

        // 3. User Flow (Downloaded File)
        // We open the file:// URL of the downloaded file
        await page.goto(`file://${downloadedFilePath}`);

        // Verify Content Existence
        const downloadedCard = page.locator('.content-item', { hasText: 'E2E Test Content' });
        await expect(downloadedCard).toBeVisible();

        // Access and Decrypt
        await downloadedCard.locator('button').click();

        await page.fill('#password-0', shares[0]);
        await page.fill('#password-1', shares[3]); // Use different combination
        await page.fill('#password-2', shares[4]);
        await page.click('text=Decrypt Content');

        await expect(page.locator('#content-text')).toContainText('These are the secret instructions.');
        await expect(page.locator('#content-files')).toContainText('secret.txt');
    });
});
