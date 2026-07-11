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
   await loginPage.navigate();
   
   // Ensure credentials are correct or loaded from environment variables
   await loginPage.login('customer@practicesoftwaretesting.com', 'Moufid567Img$');
   
   // Verify successful login by checking the visibility of the Logout link
   await expect(page.getByRole('link', { name: /Logout/i })).toBeVisible();

   // Save storage state (cookies and tokens) to reuse across tests
   await page.context().storageState({ path: authFile });
});