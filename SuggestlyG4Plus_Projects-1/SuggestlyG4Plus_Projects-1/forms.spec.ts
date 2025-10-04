import { test, expect } from '@playwright/test';

test.describe('Veridian Form Submissions', () => {

  test.beforeEach(async ({ page }) => {
    // Go to the home page before each test
    await page.goto('/');
  });

  test('should successfully submit the main contact form', async ({ page }) => {
    // Mock the API endpoint for the contact form
    await page.route('**/api/contact', async route => {
      const json = { success: true, message: 'Mock success! Your inquiry was received.' };
      await route.fulfill({ json });
    });

    // Scroll to the contact form
    await page.locator('#contactForm').scrollIntoViewIfNeeded();

    // Fill out the form
    await page.locator('#fullName').fill('Test User');
    await page.locator('#email').fill('test.user@example.com');
    await page.locator('#serviceInterest').selectOption({ label: '💎 Veridian Premium Services' });
    await page.locator('#message').fill('This is a test message from Playwright.');

    // Click the submit button
    await page.locator('#contactForm button[type="submit"]').click();

    // Assert that the success notification is visible
    const successNotification = page.locator('.notification-success');
    await expect(successNotification).toBeVisible();
    await expect(successNotification).toContainText('Mock success! Your inquiry was received.');
  });

  test('should successfully submit the membership request modal form', async ({ page }) => {
    // Mock the API endpoint for the membership form
    await page.route('**/api/membership', async route => {
      const json = { success: true, message: 'Mock success! Your membership request is being reviewed.' };
      await route.fulfill({ json });
    });

    // Click the button to open the modal
    await page.locator('button:has-text("Request Access")').first().click();

    // Wait for the modal to be visible
    const modal = page.locator('#modal');
    await expect(modal).toBeVisible();

    // Fill out the modal form
    await modal.locator('#modal-name').fill('Elite Member');
    await modal.locator('#modal-email-request').fill('elite.member@example.com');
    await modal.locator('#modal-membership').selectOption('elite');

    // Click the submit button within the modal
    await modal.locator('#requestAccessForm button[type="submit"]').click();

    // Assert that the success notification is visible
    const successNotification = page.locator('.notification-success');
    await expect(successNotification).toBeVisible();
    await expect(successNotification).toContainText('Mock success! Your membership request is being reviewed.');

    // Assert that the modal closes after submission
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });

  test('should successfully handle the forgot password flow', async ({ page }) => {
    // Mock the API endpoint for the forgot password form
    await page.route('**/api/auth/forgot-password', async route => {
      const json = { success: true, message: 'Mock success! If an account exists, a reset link has been sent.' };
      await route.fulfill({ json });
    });

    // Click the "Sign In" button to open the modal
    await page.locator('button:has-text("Sign In")').first().click();

    // Wait for the modal to be visible
    const modal = page.locator('#modal');
    await expect(modal).toBeVisible();

    // Click the "Forgot Password?" link
    await modal.locator('#forgotPasswordLink').click();

    // Assert that the title changes and the correct form is visible
    await expect(modal.locator('.modal-title')).toHaveText('Reset Password');
    await expect(modal.locator('#forgotPasswordForm')).toBeVisible();

    // Fill out the forgot password form
    await modal.locator('#modal-email-forgot').fill('forgot.password@example.com');

    // Click the submit button
    await modal.locator('#forgotPasswordForm button[type="submit"]').click();

    // Assert that the success notification is visible
    const successNotification = page.locator('.notification-success');
    await expect(successNotification).toBeVisible();
    await expect(successNotification).toContainText('Mock success! If an account exists, a reset link has been sent.');
  });

});
