import { test, expect } from '@playwright/test';
import { LoginPage } from '../lib/login.spec'; 

test('Login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  // Récupération directe des variables d'environnement gérées par la config globale
  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;

  if (!email || !password) {
    throw new Error("Les variables USER_EMAIL ou USER_PASSWORD ne sont pas chargées !");
  }

  await loginPage.login(email, password);

  await expect(page).toHaveURL(/account/);
});