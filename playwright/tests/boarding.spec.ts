import { test, expect } from '@playwright/test';
import { registerUser, loginUser, completeBoarding } from './utils';

test('boarding test', async ({ page }) => {
  const username = `user${new Date().getTime()}@example.com`;
  const password = 'password123';

  await registerUser(page, username, password);
  await loginUser(page, username, password);
  await completeBoarding(page);
});