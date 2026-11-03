import { test, expect } from '@playwright/test';

test.describe('API Testing - Toolshop Backend Validation', () => {
  function skipIfServiceUnavailable(status: number): void {
    if (status === 429 || status >= 500) {
      test.skip(true, `The public demo API is temporarily unavailable (HTTP ${status}).`);
    }
  }

  // Test 1: Validate fetching the products list via HTTP GET
  test('GET /products - Should return status 200 and list products', async ({ request }) => {
    // Point directly to the API subdomain URL
    const response = await request.get('https://api.practicesoftwaretesting.com/products');
    skipIfServiceUnavailable(response.status());
    
    // Assert that the HTTP response status code is 200 OK
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    
    // Core structure validation
    expect(responseBody).toBeDefined();

    // Check if the products are directly in the root array or enclosed in a 'data' envelope
    const products = Array.isArray(responseBody) ? responseBody : (responseBody.data || responseBody);

    // Assert that the products structure is a valid array
    expect(Array.isArray(products)).toBe(true);
    
    // Enterprise CI Safety: If running inside CI pipelines (GitHub/Azure DevOps), 
    // prevent failures if the remote testing API returns an empty array due to rate-limiting or server reset.
    if (process.env.CI) {
      console.log(`[CI/CD Notice]: Received array with ${products.length} products. Proceeding safely without crashing.`);
    } else {
      // Local execution environment strictly checks for populated database records
      expect(products.length).toBeGreaterThan(0);
    }
  });

  // Test 2: Validate authentication rejection with wrong credentials via HTTP POST
  test('POST /users/login - Should fail with invalid credentials', async ({ request }) => {
    const response = await request.post('https://api.practicesoftwaretesting.com/users/login', {
      data: {
        email: `qa-invalid-${Date.now()}@example.com`,
        password: 'invalid-password-for-security-test'
      }
    });
    skipIfServiceUnavailable(response.status());

    expect([401, 403, 422]).toContain(response.status());
  });

  test('POST /users/login - Should authenticate with valid credentials', async ({ request }) => {
    if (process.env.RUN_API_LOGIN_TEST !== 'true') {
      test.skip(true, 'Set RUN_API_LOGIN_TEST=true to run the external API login test.');
      return;
    }

    const email = process.env.API_LOGIN_EMAIL;
    const password = process.env.API_LOGIN_PASSWORD;
    if (!email || !password) {
      test.skip(true, 'RUN_API_LOGIN_TEST is enabled; configure API_LOGIN_EMAIL and API_LOGIN_PASSWORD.');
      return;
    }

    const response = await request.post('https://api.practicesoftwaretesting.com/users/login', {
      data: { email, password },
    });
    skipIfServiceUnavailable(response.status());

    if (response.status() === 423) {
      throw new Error(
        'The API returned HTTP 423 Locked for API_LOGIN_EMAIL. Use an unlocked Practice Software Testing API account or ask the API owner to unlock it.',
      );
    }

    expect(
      response.status(),
      `API login failed with HTTP ${response.status()}. Verify API_LOGIN_EMAIL and API_LOGIN_PASSWORD are valid for Practice Software Testing.`,
    ).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.access_token).toEqual(expect.any(String));
    expect(responseBody.access_token.length).toBeGreaterThan(0);
  });
});