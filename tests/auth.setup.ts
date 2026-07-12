import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; 
import fs from 'fs';
import path from 'path';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
   const dir = path.dirname(authFile);
   if (!fs.existsSync(dir)){
       fs.mkdirSync(dir, { recursive: true });
   }

   const loginPage = new LoginPage(page); 
   
   // Hardcoded target URL for the specific platform
   await page.goto('https://automationexercise.com', { waitUntil: 'domcontentloaded' });
   
   // Target site-specific credentials for automationexercise.com
   // Fallback configuration using a reliable test account if environment variables are blank
   const email = process.env.LOGIN_EMAIL || 'testautomationmoufid@gmail.com'; 
   const password = process.env.LOGIN_PASSWORD || 'Zakaria2026';
   
   // Execute modular login sequence
   await loginPage.login(email, password);
   
   // Assert successful session initialization by validating visibility of the Logout anchor link
   await expect(page.getByRole('link', { name: /Logout/i })).toBeVisible({ timeout: 15000 });

   // Cache validated storage state context tokens
   await page.context().storageState({ path: authFile });
});