# Testing Guide

This project uses [Playwright](https://playwright.dev) for End-to-End (E2E) testing. The tests simulate user interactions to verify:
- Admin content creation, file attachment/removal, and encryption.
- File integrity after saving (checking the downloaded file).
- User decryption with valid and invalid shares.
- Corner cases (missing shares, etc.).

## Prerequisites

- Node.js (v14+)
- npm

## Running Tests Locally

1.  **Install Dependencies:**
    ```bash
    npm install
    npx playwright install --with-deps chromium
    ```

2.  **Run Tests:**
    ```bash
    # Run all tests in headless mode
    npx playwright test

    # Run tests with UI (visual debugger)
    npx playwright test --ui

    # Run in a specific browser (e.g., Firefox)
    npx playwright test --project=firefox
    ```

3.  **View Report:**
    ```bash
    npx playwright show-report
    ```

## CI/CD Integration

The project includes configurations for both GitHub Actions and GitLab CI to run tests automatically on push/MR.

### GitHub Actions
- Configuration: `.github/workflows/playwright.yml`
- Triggers on push/PR to main branches.
- Uploads HTML report as an artifact.

### GitLab CI
- Configuration: `.gitlab-ci.yml`
- Uses official Playwright Docker image.
- Uploads HTML report and JUnit XML results.
