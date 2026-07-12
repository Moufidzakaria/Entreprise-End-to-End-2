import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

test.describe('Cart Tests', () => {
  test('Login, add 3 products and checkout', async ({ page }) => {
    const cartPage = new CartPage(page);

    await page.goto('/');

    await cartPage.navigateToCart();
    await cartPage.clearCart();

    await cartPage.addTopProductsToCart(3);

    await cartPage.goToCartViaHeader();

    // ... reste du code au-dessus ...
    await expect(cartPage.getCartItemsCount()).toHaveCount(3);
    
    // Remplacer la ligne problématique par ceci :
 await expect(page.locator('#cart_info_table')).toHaveScreenshot('cart-table-baseline.png', {
  maxDiffPixelRatio: 0.05 
});    
    
    await cartPage.proceedToCheckout();
  });
});
 