
import { test, expect } from '@playwright/test';
import { registerUser, loginUser, completeBoarding } from './utils';

test('search and do action test', async ({ page }) => {
  // Generate unique login data for this test
  const username = `user${new Date().getTime()}@example.com`;
  const password = 'admin';

  await registerUser(page, username, password);
  await loginUser(page, username, password);
  await completeBoarding(page);
  await page.getByPlaceholder('Search for actions...').click();
  await page.getByPlaceholder('Search for actions...').fill('take a walk in nature');
  await page.getByRole('button', { name: 'Done' }).click();
  await page.getByPlaceholder('Search for actions...').click();
  await page.getByPlaceholder('Search for actions...').fill('');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByPlaceholder('Search for actions...').click();
  await page.getByPlaceholder('Search for actions...').fill('volunteer for a cause');
  await page.getByRole('button', { name: 'Done' }).click();
  await page.getByText('Show graph').click();
});

