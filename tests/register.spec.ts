import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Désormais correct et aligné avec l'export nommé
import { RegisterPage } from '../pages/RegisterPage';
// On force ce fichier de test spécifique à ignorer la session globale sauvegardée
test.use({ storageState: { cookies: [], origins: [] } });
test.describe('User Registration', () => {
  test('should register a new user successfully', async ({ page }) => {
    // L'instanciation fonctionne correctement
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    const user = {
      name: 'Zakaria',
      email: `zakaria${Date.now()}@example.com`,
      password: 'Moufid567Img$',
      firstName: 'Zakaria',
      lastName: 'Moufid',
      company: 'Instelc',
      address1: 'Hay 2',
      address2: 'Apartment 10',
      country: 'Canada',
      state: 'Quebec',
      city: 'Montreal',
      zipcode: '3000',
      mobile: '0688611005',
      day: '18',
      month: '12',
      year: '2011',
    };

    // 1. Démarrer l'inscription via LoginPage
    await loginPage.startSignup(user.name, user.email);
    await expect(page.getByText('Enter Account Information')).toBeVisible();

    // 2. Remplir les informations via RegisterPage
    await registerPage.fillAccountInformation(user.password, user.day, user.month, user.year);
    await registerPage.fillAddressInformation(user);
    
    // 3. Valider la création du compte
    await registerPage.submitRegistration();
    await expect(page.getByText('Account Created!')).toBeVisible();

    // 4. Finaliser et valider la connexion automatique
    await registerPage.clickContinue();
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();
  });
});