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
    const loginPage = new LoginPage(page);

    // 1. Navigation vers la page d'accueil / login
    await loginPage.navigate();

    // Nettoyage manuel rapide au cas où la bannière a déjà été injectée avant le style
    await page.evaluate(() => {
      document.querySelectorAll('.fc-consent-root').forEach(el => el.remove());
    }).catch(() => {});

    // 2. SÉCURITÉ : Si l'utilisateur est déjà connecté, on force la déconnexion
    const logoutLink = page.getByRole('link', { name: /Logout/i });
    if (await logoutLink.isVisible()) {
      // On ajoute { force: true } pour cliquer à travers n'importe quel overlay résiduel
      await logoutLink.click({ force: true });
      await loginPage.navigate(); 
    }

    // 3. Exécution du Login
    await loginPage.login('customer@practicesoftwaretesting.com', 'Moufid567Img$');

    // 4. Assertion : Vérification de la réussite de la connexion
    await expect(logoutLink).toBeVisible();
    await expect(page.getByText('Logged in as customer')).toBeVisible();
  });
});