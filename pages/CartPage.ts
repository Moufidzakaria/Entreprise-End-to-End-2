import { Page, Locator, Response, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly cartRows: Locator;
  readonly deleteButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly productBlocks: Locator;
  readonly queueFullHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartLink = page.getByRole('link', { name: /Cart/i });
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.deleteButtons = page.locator('.cart_quantity_delete');
    
    // Cibler précisément le bouton dans la fenêtre modale
    this.continueShoppingButton = page.locator('.modal-content button:has-text("Continue Shopping")');
    this.checkoutButton = page.getByText('Proceed To Checkout');
    this.queueFullHeading = page.getByRole('heading', { name: /under heavy load \(queue full\)/i });
    
    // Utiliser la structure de la grille de produits globale
    this.productBlocks = page.locator('.features_items .col-sm-4');
  }

  async navigateToCart(): Promise<string | undefined> {
    return this.navigateToShopPage('/view_cart');
  }

  async clearCart() {
    const count = await this.deleteButtons.count();
    for (let i = 0; i < count; i++) {
      // On clique toujours sur le premier bouton restant
      await this.deleteButtons.first().click();
      await expect(this.deleteButtons).toHaveCount(count - i - 1);
    }
  }

  async addTopProductsToCart(count: number): Promise<string | undefined> {
    const unavailable = await this.navigateToShopPage('/');
    if (unavailable) {
      return unavailable;
    }

    await expect(this.productBlocks.first()).toBeVisible();

    for (let i = 0; i < count; i++) {
      // Cibler le bloc du i-ème produit dans la liste
      const product = this.productBlocks.nth(i);
      await expect(product).toBeVisible();

      // Cibler le bouton "Add to cart" visible (souvent le premier dans le bloc)
      const addToCartButton = product.locator('.add-to-cart').first();
      
      await product.scrollIntoViewIfNeeded();

      let failedResponse: Response | undefined;
      const currentOrigin = new URL(this.page.url()).origin;
      const captureServiceFailure = (serviceResponse: Response) => {
        if (
          new URL(serviceResponse.url()).origin === currentOrigin &&
          (serviceResponse.status() === 429 || serviceResponse.status() >= 500)
        ) {
          failedResponse = serviceResponse;
        }
      };

      this.page.on('response', captureServiceFailure);
      try {
        await addToCartButton.click();

        await expect.poll(async () =>
          failedResponse !== undefined ||
          await this.queueFullHeading.isVisible() ||
          await this.continueShoppingButton.isVisible(),
        { timeout: 15000 }).toBe(true);

        if (failedResponse) {
          return `The demo shop returned HTTP ${failedResponse.status()}.`;
        }

        if (await this.queueFullHeading.isVisible()) {
          return 'The demo shop is displaying its queue-full page.';
        }

        await this.continueShoppingButton.click();
        await expect(this.continueShoppingButton).toBeHidden();
      } finally {
        this.page.off('response', captureServiceFailure);
      }
    }

    return undefined;
  }

  private getUnavailableReason(response: Response | null): string | undefined {
    if (!response) {
      return 'The demo shop did not return a page response.';
    }

    if (response.status() === 429 || response.status() >= 500) {
      return `The demo shop returned HTTP ${response.status()}.`;
    }

    if (!response.ok()) {
      throw new Error(`Shop page request failed with HTTP ${response.status()}.`);
    }

    return undefined;
  }

  private async navigateToShopPage(path: string): Promise<string | undefined> {
    let response: Response | null;
    try {
      response = await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      const transientNetworkError =
        error instanceof Error &&
        /net::ERR_(NAME_NOT_RESOLVED|INTERNET_DISCONNECTED|CONNECTION_TIMED_OUT|CONNECTION_RESET|ADDRESS_UNREACHABLE|TIMED_OUT)/.test(error.message);
      if (transientNetworkError) {
        return 'The public demo shop is unreachable from this test runner.';
      }

      if (error instanceof Error && /Timeout \d+ms exceeded/.test(error.message)) {
        return 'The public demo shop did not respond before the navigation timed out.';
      }

      throw error;
    }

    const unavailable = this.getUnavailableReason(response);
    if (unavailable) {
      return unavailable;
    }

    if (await this.queueFullHeading.isVisible()) {
      return 'The demo shop is displaying its queue-full page.';
    }

    return undefined;
  }

  async goToCartViaHeader(): Promise<string | undefined> {
    const responsePromise = this.page.waitForResponse(response =>
      response.request().isNavigationRequest() &&
      new URL(response.url()).pathname.replace(/\/$/, '') === '/view_cart',
    );
    await this.cartLink.click();

    const response = await responsePromise;
    const unavailable = this.getUnavailableReason(response);
    if (unavailable) {
      return unavailable;
    }

    if (await this.queueFullHeading.isVisible()) {
      return 'The demo shop is displaying its queue-full page.';
    }

    return undefined;
  }

  getCartItemsCount() {
    return this.cartRows;
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}