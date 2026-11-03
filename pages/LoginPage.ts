import { Page, Locator, expect } from '@playwright/test';

// Correction : Utilisation d'un export nommé au lieu d'un export par défaut
export class LoginPage {
  private page: Page;
  private signUpLoginLink: Locator;
  private loginEmailInput: Locator;
  private loginPasswordInput: Locator;
  private loginButton: Locator;
  private signupNameInput: Locator;
  private signupEmailInput: Locator;
  private signupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Définition des sélecteurs natifs de Playwright
    this.signUpLoginLink = page.getByRole('link', { name: /Signup \/ Login/i });
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.signupNameInput = page.getByPlaceholder('Name');
    this.signupEmailInput = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
    this.signupButton = page.getByRole('button', { name: 'Signup' });
  }
// Navigation to the homepage
async navigate(): Promise<boolean> {
  const response = await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  const queueFull = this.page.getByRole('heading', { name: /under heavy load \(queue full\)/i });

  if ((response && (response.status() === 429 || response.status() >= 500)) || await queueFull.isVisible()) {
    return false;
  }

  if (!response?.ok()) {
    throw new Error(`Homepage request failed with HTTP ${response?.status() ?? 'no response'}.`);
  }

  return true;
}
  // Flux de connexion
  async login(email: string, password: string): Promise<boolean> {
    const loginResponsePromise = this.page.waitForResponse(
      response => response.request().isNavigationRequest() && new URL(response.url()).pathname === '/login',
      { timeout: 15000 }
    ).catch(() => null);

    await this.signUpLoginLink.click();
    const loginResponse = await loginResponsePromise;
    const queueFull = this.page.getByRole('heading', { name: /under heavy load \(queue full\)/i });

    if (
      (loginResponse && (loginResponse.status() === 429 || loginResponse.status() >= 500)) ||
      await queueFull.isVisible()
    ) {
      return false;
    }

    if (loginResponse && !loginResponse.ok()) {
      throw new Error(`Login page request failed with HTTP ${loginResponse.status()}.`);
    }

    await expect(this.loginEmailInput.or(queueFull)).toBeVisible({ timeout: 15000 });
    if (await queueFull.isVisible()) {
      return false;
    }

    await this.loginEmailInput.fill(email);   
    await this.loginPasswordInput.fill(password); 
    await this.loginButton.click();         
    return true;
  }

  // Flux d'initialisation de l'inscription
  async startSignup(name: string, email: string): Promise<boolean> {
    const response = await this.page.goto('/signup', { waitUntil: 'domcontentloaded' });
    const queueFull = this.page.getByRole('heading', { name: /under heavy load \(queue full\)/i });

    if ((response && (response.status() === 429 || response.status() >= 500)) || await queueFull.isVisible()) {
      return false;
    }

    if (!response?.ok()) {
      throw new Error(`Signup page request failed with HTTP ${response?.status() ?? 'no response'}.`);
    }

    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();

    const accountInformation = this.page.getByText('Enter Account Information');
    await expect(accountInformation.or(queueFull)).toBeVisible({ timeout: 15000 });
    return !(await queueFull.isVisible());
  }
}