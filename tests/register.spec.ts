import { test, expect } from '@playwright/test';

test('Should register a new user successfully', async ({ page }) => {
  // 1. Navigate using shorthand and wait only until the network commit
  await page.goto('/auth/register', { waitUntil: 'commit' });

  // 2. Fill in the profile information
  await page.locator('[data-test="first-name"]').fill('john');
  await page.locator('[data-test="last-name"]').fill('doe');
  
  // Date of birth formatted as YYYY-MM-DD
  await page.locator('[data-test="dob"]').fill('1999-05-05');

  // 3. Fill in the address and contact details
  await page.locator('[data-test="country"]').selectOption('AI');
  await page.locator('[data-test="postal_code"]').fill('300');
  await page.locator('[data-test="house_number"]').fill('23');
  await page.locator('[data-test="phone"]').fill('07889233223');

  // 4. Fill in login credentials (Email and Password)
  // TIP: parameters altered slightly to ensure it's a unique fresh user
  await page.locator('[data-test="email"]').fill('zakaria_test_99@practicesoftwaretesting.com');
  await page.locator('[data-test="password"]').fill('Moufid567Img$');

  // 5. Click the registration submit button
  await page.locator('[data-test="register-submit"]').click();
});