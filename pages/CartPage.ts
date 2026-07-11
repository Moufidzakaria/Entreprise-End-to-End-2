import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly cartRows: Locator;
  readonly deleteButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly productBlocks: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartLink = page.getByRole('link', { name: /Cart/i });
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.deleteButtons = page.locator('.cart_quantity_delete');
    
    // Cibler précisément le bouton dans la fenêtre modale
    this.continueShoppingButton = page.locator('.modal-content button:has-text("Continue Shopping")');
    this.checkoutButton = page.getByText('Proceed To Checkout');
    
    // Utiliser la structure de la grille de produits globale
    this.productBlocks = page.locator('.features_items .col-sm-4');
  }

  async navigateToCart() {
    await this.page.goto('/view_cart');
  }

  async clearCart() {
    // Attendre que la page soit stable avant de compter
    await this.page.waitForLoadState('networkidle');
    const count = await this.deleteButtons.count();
    for (let i = 0; i < count; i++) {
      // On clique toujours sur le premier bouton restant
      await this.deleteButtons.first().click();
      // Petite attente pour laisser le produit disparaître en AJAX
      await this.page.waitForTimeout(500); 
    }
  }

  async addTopProductsToCart(count: number) {
    await this.page.goto('/');

    for (let i = 0; i < count; i++) {
      // Cibler le bloc du i-ème produit dans la liste
      const product = this.productBlocks.nth(i);
      
      // Cibler le bouton "Add to cart" visible (souvent le premier dans le bloc)
      const addToCartButton = product.locator('.add-to-cart').first();
      
      await product.scrollIntoViewIfNeeded();
      await addToCartButton.click();

      // MEILLEURE PRATIQUE : Attendre que la modale soit visible avant de cliquer sur Continuer
      await this.continueShoppingButton.waitFor({ state: 'visible' });
      await this.continueShoppingButton.click();
      
      // Attendre que la modale disparaisse pour ne pas bloquer le clic suivant
      await this.continueShoppingButton.waitFor({ state: 'hidden' });
    }
  }

  async goToCartViaHeader() {
    await this.cartLink.click();
  }

  getCartItemsCount() {
    return this.cartRows;
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}