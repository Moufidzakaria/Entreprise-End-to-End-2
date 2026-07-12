import { Page, Locator } from '@playwright/test';

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
async navigate() {
  // Tell Playwright to proceed as soon as the HTML DOM is loaded, without waiting for ads and images
  await this.page.goto('/', { waitUntil: 'domcontentloaded' }); 
}
  // Flux de connexion
  async login(email: string, password: string) {
    await this.signUpLoginLink.click();     
    await this.loginEmailInput.fill(email);   
    await this.loginPasswordInput.fill(password); 
    await this.loginButton.click();         
  }

  // Flux d'initialisation de l'inscription
  async startSignup(name: string, email: string) {
    await this.page.goto('/signup');
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
}