import { test, expect } from '@playwright/test';
import { registerUser, loginUser, completeBoarding } from './utils';

test('boarding test', async ({ page }) => {



  console.log('Starting boarding test...');
  const username = `user${new Date().getTime()}@example.com`;
  const password = 'password123';
  console.log('Username', username);
  console.log('Password', password);

  await registerUser(page, username, password);
  await loginUser(page, username, password);
  await completeBoarding(page);
  await page.getByRole('link', { name: 'Logout' }).click();
});