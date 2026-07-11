import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; 

test.describe('User Login Tests', () => {

  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Navigation vers la page d'accueil / login
    await loginPage.navigate();

    // 2. SÉCURITÉ : Si l'utilisateur est déjà connecté, on force la déconnexion
    const logoutLink = page.getByRole('link', { name: /Logout/i });
    if (await logoutLink.isVisible()) {
      await logoutLink.click();
      // Optionnel : s'assurer d'être revenu sur la bonne page après déconnexion
      await loginPage.navigate(); 
    }

    // 3. Exécution du Login
    await loginPage.login('customer@practicesoftwaretesting.com', 'Moufid567Img$');

    // 4. Assertion : Vérification de la réussite de la connexion
    await expect(logoutLink).toBeVisible();
    
    // Bonne pratique supplémentaire : Vérifier un élément textuel unique de confirmation
    await expect(page.getByText('Logged in as customer')).toBeVisible();
  });
});