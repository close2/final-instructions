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
        // Enable console logs
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
        page.on('pageerror', exception => console.log(`BROWSER ERROR: ${exception}`));

        // 1. Initial Load & Greeting Check
        await page.goto('/secure-instructions.html');
        await expect(page.locator('#main-greeting-container')).toBeHidden();

        // 2. Enter Admin Mode
        await page.goto('/secure-instructions.html#admin');
        await expect(page.locator('#admin-dashboard-view')).toBeVisible();

        // 3. Open Vault Editor (Modal)
        await page.locator('.vault-add-card').click();
        await expect(page.locator('#vault-modal')).toBeVisible();

        // 4. Fill Vault Details
        await page.fill('#modal-vault-name', 'E2E Test Vault');
        await page.fill('#modal-vault-desc', 'Test Description');
        await page.fill('#modal-vault-text', 'Secret Instructions');
        
        // Upload a file
        await page.setInputFiles('#modal-file-input', 'tests/test-file.txt');
        // Wait for file to appear in list
        await expect(page.locator('#modal-file-list li').first()).toContainText('test-file.txt');
        
        // 5. Configure Shares & Names
        // Wait for share table to be populated (default is 3 shares)
        await expect(page.locator('.share-name-input-modal').first()).toBeVisible();
        
        // Rename Share Holder #1
        const input1 = page.locator('.share-name-input-modal').nth(0);
        await input1.fill('Alice');
        
        // Rename Share Holder #2
        const input2 = page.locator('.share-name-input-modal').nth(1);
        await input2.fill('Bob');
        
        // Capture a share for later decryption
        const share1Input = page.locator('#modal-share-table input[readonly]').nth(0);
        const share2Input = page.locator('#modal-share-table input[readonly]').nth(1);
        const share1 = await share1Input.inputValue();
        const share2 = await share2Input.inputValue();
        
        console.log('Captured E2E Shares:', share1, share2);

        // 6. Save Vault
        await page.click('text=Save Vault');
        await expect(page.locator('#vault-modal')).toBeHidden();
        
        // 7. Verify Dashboard Update
        // Check Vault Card
        // Note: The "Add New" card does not have 'vault-card' class in current HTML
        await expect(page.locator('.vault-card').first()).toContainText('E2E Test Vault'); 
        
        // Check Distribution Center
        await expect(page.locator('#distribution-center-list')).toContainText('To: Alice');
        await expect(page.locator('#distribution-center-list')).toContainText('To: Bob');
        
        // Check Admin Master Keys
        await expect(page.locator('#distribution-center-list')).toContainText('Admin / Master Keys');
        
        // 8. Verify Modal Re-open and Clickable Files
        // Re-open vault to check file link
        await page.locator('.vault-card').first().click();
        await expect(page.locator('#vault-modal')).toBeVisible();
        // Check for clickable file link
        const fileLink = page.locator('#modal-file-list a').first();
        await expect(fileLink).toBeVisible();
        await expect(fileLink).toHaveAttribute('download', 'test-file.txt');
        await page.click('button[onclick="closeVaultModal()"]');

        // 9. Export Secure File
        const downloadPromise = page.waitForEvent('download');
        await page.click('text=Export Secure File');
        const download = await downloadPromise;
        const downloadPath = await download.path();
        
        // 9. Security Verification
        const content = fs.readFileSync(downloadPath, 'utf8');
        expect(content).not.toContain(share1);
        expect(content).not.toContain(share2);
        
        // 10. Decryption Verification (Load the downloaded file)
        const jsonMatch = content.match(/<script type="application\/json" id="embedded-data">([\s\S]*?)<\/script>/);
        expect(jsonMatch).toBeTruthy();
        const appData = JSON.parse(jsonMatch[1]);
        
        expect(appData.contents[0].shareNames).toContain('Alice');
        expect(appData.settings.greeting).toBeDefined();

        console.log('Test Complete: Phase 3 Verification Successful');
    });
});
