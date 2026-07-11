import { test, expect } from '@playwright/test';

test.describe('API Testing - Full User Lifecycle', () => {
  const baseUrl = 'https://automationexercise.com/api';

  const userEmail = `zakaria_${Date.now()}@example.com`;
  const userPassword = 'Moufid567Img$';

  test('Should handle full user lifecycle successfully', async ({ request }) => {

    // ==========================
    // CREATE USER
    // ==========================
    const createResponse = await request.post(`${baseUrl}/createAccount`, {
      form: {
        name: 'Zakaria',
        email: userEmail,
        password: userPassword,
        firstname: 'Zakaria',
        lastname: 'Moufid',
        company: 'QA Automation',
        address1: '123 Main Street',
        address2: 'Apartment 10',
        country: 'United States',
        state: 'California',
        city: 'Los Angeles',
        zipcode: '90001',
        mobile_number: '1234567890'
      }
    });

    expect(createResponse.status()).toBe(200);

    const createBody = await createResponse.json();

    expect(createBody.responseCode).toBe(201);
    expect(createBody.message).toBe('User created!');

    // ==========================
    // GET USER
    // ==========================
    const getResponse = await request.get(
      `${baseUrl}/getUserDetailByEmail`,
      {
        params: {
          email: userEmail
        }
      }
    );

    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();

    expect(getBody.responseCode).toBe(200);
    expect(getBody.user).toBeDefined();
    expect(getBody.user.name).toBe('Zakaria');

    // ==========================
    // UPDATE USER
    // ==========================
    const updateResponse = await request.put(`${baseUrl}/updateAccount`, {
      form: {
        name: 'Zakaria Updated',
        email: userEmail,
        password: userPassword,
        firstname: 'Zakaria',
        lastname: 'Updated',
        company: 'Playwright',
        address1: '456 New Street',
        address2: 'Suite 20',
        country: 'United States',
        state: 'California',
        city: 'San Francisco',
        zipcode: '94101',
        mobile_number: '9876543210'
      }
    });

    expect(updateResponse.status()).toBe(200);

    const updateBody = await updateResponse.json();

    expect(updateBody.responseCode).toBe(200);
    expect(updateBody.message).toBe('User updated!');

    // ==========================
    // DELETE USER
    // ==========================
    const deleteResponse = await request.delete(`${baseUrl}/deleteAccount`, {
      form: {
        email: userEmail,
        password: userPassword
      }
    });

    expect(deleteResponse.status()).toBe(200);

    const deleteBody = await deleteResponse.json();

    expect(deleteBody.responseCode).toBe(200);
    expect(deleteBody.message).toBe('Account deleted!');
  });
});