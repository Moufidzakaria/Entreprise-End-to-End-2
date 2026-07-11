import { test, expect } from '@playwright/test';
// Importation entourée d'accolades pour correspondre à l'export nommé
import { CartPage } from '../pages/CartPage';

test.describe('Cart Tests', () => {
  test('Login, add 3 products and checkout', async ({ page }) => {
    // L'instanciation fonctionne maintenant correctement
    const cartPage = new CartPage(page);

    await page.goto('/');

    await cartPage.navigateToCart();
    await cartPage.clearCart();

    await cartPage.addTopProductsToCart(3);

    await cartPage.goToCartViaHeader();

    await expect(cartPage.getCartItemsCount()).toHaveCount(3);
    await expect(page).toHaveScreenshot('cart-page-baseline.png');
    await cartPage.proceedToCheckout();
  });
});