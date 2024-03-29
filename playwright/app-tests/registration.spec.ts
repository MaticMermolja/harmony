import { test, expect } from '@playwright/test';
import { registerUser } from './utils';

test('registration test', async ({ page }) => {
  console.log('Starting registration test...');
  // Generate unique login data for this test
  const username = `user${new Date().getTime()}@example.com`;
  const password = 'admin';

  await registerUser(page, username, password);
});
