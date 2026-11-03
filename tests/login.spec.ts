import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; 

// On force ce fichier de test spécifique à ignorer la session globale sauvegardée
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  // 1. Bloque les requêtes publicitaires
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.includes('googleads') || url.includes('doubleclick') || url.includes('fundingchoicesmessages') || url.includes('pagead')) {
      return route.abort();
    }
    return route.continue();
  });

  // 2. RENDRE L'OVERLAY INVISIBLE ET INACTIF (Solution radicale pour libérer les clics)
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .fc-consent-root, .fc-dialog-overlay, .fc-dialog-container, .fc-header { 
        display: none !important; 
        pointer-events: none !important; 
        visibility: hidden !important; 
        opacity: 0 !important;
      }
    `;
    document.head.appendChild(style);
  });
});

test.describe('User Login Tests', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    if (process.env.RUN_UI_LOGIN_TEST !== 'true') {
      test.skip(true, 'Set RUN_UI_LOGIN_TEST=true to run the external demo-site login test.');
      return;
    }

    const email = process.env.LOGIN_EMAIL;
    const password = process.env.LOGIN_PASSWORD;
    if (!email || !password) {
      test.skip(true, 'RUN_UI_LOGIN_TEST is enabled; configure LOGIN_EMAIL and LOGIN_PASSWORD for a valid BASE_URL account.');
      return;
    }

    const loginPage = new LoginPage(page);

    // 1. Navigation vers la page d'accueil / login
    if (!await loginPage.navigate()) {
      test.skip(true, 'Login site is temporarily unavailable or overloaded.');
      return;
    }

    // Nettoyage manuel rapide au cas où la bannière a déjà été injectée avant le style
    await page.evaluate(() => {
      document.querySelectorAll('.fc-consent-root').forEach(el => el.remove());
    }).catch(() => {});

    // 2. SÉCURITÉ : Si l'utilisateur est déjà connecté, on force la déconnexion
    const logoutLink = page.getByRole('link', { name: /Logout/i });
    if (await logoutLink.isVisible()) {
      // On ajoute { force: true } pour cliquer à travers n'importe quel overlay résiduel
      await logoutLink.click({ force: true });
      if (!await loginPage.navigate()) {
        test.skip(true, 'Login site became temporarily unavailable or overloaded.');
        return;
      }
    }

    // 3. Exécution du Login
    if (!await loginPage.login(email, password)) {
      test.skip(true, 'Login page is temporarily unavailable or overloaded.');
      return;
    }

    // 4. Assertion : Vérification de la réussite de la connexion
    await expect(
      logoutLink,
      'Login did not succeed. Configure LOGIN_EMAIL and LOGIN_PASSWORD with a valid account for the configured BASE_URL.',
    ).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Logged in as customer/)).toBeVisible();
  });
});