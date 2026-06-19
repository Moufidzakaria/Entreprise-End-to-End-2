import { test, expect } from '@playwright/test';

test.describe('API Testing - Toolshop Backend Validation', () => {

  // Test 1: Validate fetching the products list via HTTP GET
  test('GET /products - Should return status 200 and list products', async ({ request }) => {
    // Point directly to the API subdomain URL
    const response = await request.get('https://api.practicesoftwaretesting.com/products');
    
    // Assert that the HTTP response status code is 200 OK
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    
    // Assert that the response contains data array and it is not empty
    expect(responseBody.data).toBeDefined();
    expect(responseBody.data.length).toBeGreaterThan(0);
  });

  // Test 2: Validate authentication rejection with wrong credentials via HTTP POST
  test('POST /users/login - Should fail with invalid credentials', async ({ request }) => {
    // Point directly to the API subdomain URL
    const response = await request.post('https://api.practicesoftwaretesting.com/users/login', {
      data: {
        email: 'invalid-customer@practicesoftwaretesting.com',
        password: 'wrongpassword123'
      }
    });

    // Assert that server rejects request with 401 Unauthorized or 422 Unprocessable Entity
    expect([401, 422]).toContain(response.status());
  });
});