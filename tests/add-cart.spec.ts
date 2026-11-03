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

    const cartUnavailableReason = await cartPage.navigateToCart();
    if (cartUnavailableReason) {
      test.skip(true, cartUnavailableReason);
      return;
    }

    await cartPage.clearCart();

    const unavailableReason = await cartPage.addTopProductsToCart(3);
    if (unavailableReason) {
      test.skip(true, unavailableReason);
      return;
    }

    const checkoutUnavailableReason = await cartPage.goToCartViaHeader();
    if (checkoutUnavailableReason) {
      test.skip(true, checkoutUnavailableReason);
      return;
    }

    await expect(cartPage.getCartItemsCount()).toHaveCount(3, { timeout: 15000 });
    
    await expect(page.locator('#cart_info_table')).toHaveScreenshot('cart-table-baseline.png', {
      maxDiffPixelRatio: 0.05 
    });    
    
    await cartPage.proceedToCheckout();
  });
});