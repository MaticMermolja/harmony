
import { test, expect } from '@playwright/test';
import { registerUser, loginUser, completeBoarding } from './utils';

test('logout test', async ({ page }) => {
    console.log('Starting logout test...');
    const username = `user${new Date().getTime()}@example.com`;
    const password = 'password123';

    await registerUser(page, username, password);
    await loginUser(page, username, password);
    await completeBoarding(page);

    // Perform logout action
    await page.getByRole('link', { name: 'Logout' }).click();

    // Check if user is logged out successfully
    await expect(page.getByText('Email*Password*Login')).toBeVisible();
    await expect(page.getByRole('list')).toContainText('Login');
    await expect(page.getByRole('list')).toContainText('Register');
});