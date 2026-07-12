import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; 
import fs from 'fs';
import path from 'path';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
   // Check if the (.auth) directory exists, if not, create it automatically
   const dir = path.dirname(authFile);
   if (!fs.existsSync(dir)){
       fs.mkdirSync(dir, { recursive: true });
   }

   const loginPage = new LoginPage(page); 
   
   // Hardcoded direct target URL to ensure Azure DevOps/GitHub pipelines don't crash on blank baseURL
   await page.goto('https://automationexercise.com', { waitUntil: 'domcontentloaded' });
   
   // Dynamic credential loading with secure fallbacks for local and cloud agent runs
   const email = process.env.LOGIN_EMAIL || 'customer@practicesoftwaretesting.com';
   const password = process.env.LOGIN_PASSWORD || 'Moufid567Img$';
   
   // Execute the modular login flow
   await loginPage.login(email, password);
   
   // Verify successful login by checking the visibility of the Logout link
   await expect(page.getByRole('link', { name: /Logout/i })).toBeVisible({ timeout: 10000 });

   // Save storage state (cookies and tokens) to reuse across tests smoothly
   await page.context().storageState({ path: authFile });
});