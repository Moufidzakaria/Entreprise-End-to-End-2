import { test, expect } from '@playwright/test';

test('Connexion admin et consultation de la facture', async ({ page }) => {
  // 1. Go to login page
  await page.goto('/auth/login');

  // 2. Use stable data-test selectors to avoid CI issues
  const emailInput = page.locator('[data-test="email"]').first();
  await expect(emailInput).toBeVisible({ timeout: 15000 });
  await emailInput.fill('admin@practicesoftwaretesting.com');

  // FIX: Using robust data-test for password instead of getByLabel
  const passwordInput = page.locator('[data-test="password"]').first();
  await expect(passwordInput).toBeVisible({ timeout: 10000 });
  await passwordInput.fill('welcome01');
  
  // Click the sign-in button
  const signInButton = page.locator('[data-test="login-submit"]').first();
  await signInButton.click();

  // STABILITY FIX: Explicitly wait for the Admin Menu to be visible (No networkidle)
  const adminMenu = page.getByTestId('nav-admin-menu');
  await expect(adminMenu).toBeVisible({ timeout: 20000 });
  await adminMenu.click();

  // Navigate to invoices section
  const adminInvoices = page.getByTestId('nav-admin-invoices');
  await expect(adminInvoices).toBeVisible({ timeout: 15000 });
  await adminInvoices.click();

  // 4. FIX: Dynamically select the first available invoice row link
  const firstInvoiceLink = page.locator('table tbody tr').first().getByRole('link');
  await expect(firstInvoiceLink).toBeVisible({ timeout: 20000 });
  await firstInvoiceLink.click();

  // 5. Final assertion
  await expect(page).toHaveURL(/.*orders/, { timeout: 15000 });
});