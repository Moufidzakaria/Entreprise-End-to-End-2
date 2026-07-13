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
   
   // 1. Read targeted domain from cloud environment or use default fallback
   const targetUrl = process.env.BASE_URL || 'https://automationexercise.com';
   await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
   
   // 2. Load safe validation credentials injected from active pipeline variables
   const email = process.env.LOGIN_EMAIL || 'testautomationmoufid@gmail.com'; 
   const password = process.env.LOGIN_PASSWORD || 'Zakaria2026';
   
   // 3. Trigger authentication submission flow
   await loginPage.login(email, password);
   
   // 4. Validate successful session authorization (Extended timeout for slow CI VMs)
   await expect(page.getByRole('link', { name: /Logout/i })).toBeVisible({ timeout: 15000 });

   // 5. Serialize global session state tokens
   await page.context().storageState({ path: authFile });
});