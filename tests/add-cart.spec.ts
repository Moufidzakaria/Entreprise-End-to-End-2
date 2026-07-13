import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

test.beforeEach(async ({ page }) => {
  // Bloque les overlays de cookies et scripts publicitaires
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.includes('googleads') || url.includes('doubleclick') || url.includes('fundingchoicesmessages') || url.includes('pagead')) {
      return route.abort();
    }
    return route.continue();
  });
});

test.describe('Cart Tests', () => {
  test('Login, add 3 products and checkout', async ({ page }) => {
    const cartPage = new CartPage(page);

    await page.goto('/');

    await cartPage.navigateToCart();
    await cartPage.clearCart();

    await cartPage.addTopProductsToCart(3);

    await cartPage.goToCartViaHeader();

    await expect(cartPage.getCartItemsCount()).toHaveCount(3);
    
    await expect(page.locator('#cart_info_table')).toHaveScreenshot('cart-table-baseline.png', {
      maxDiffPixelRatio: 0.05 
    });    
    
    await cartPage.proceedToCheckout();
  });
});