import { test, expect } from '@playwright/test';
import { LoginPage } from '../lib/login.spec';

test('Login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  const email = 'customer@practicesoftwaretesting.com';
  const password = 'welcome01';

  await loginPage.goto();
  await loginPage.login(email, password);

  await expect(page).toHaveURL(/account/);
});