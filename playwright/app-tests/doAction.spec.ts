
import { test, expect } from '@playwright/test';
import { registerUser, loginUser, completeBoarding } from './utils';

test('do action test', async ({ page }) => {
    console.log('Starting do action test...');
    const username = `user${new Date().getTime()}@example.com`;
    const password = 'password123';

    await registerUser(page, username, password);
    await loginUser(page, username, password);
    await completeBoarding(page);

    await page.locator('app-single-action').filter({ hasText: 'Read a BookImmerse yourself' }).getByRole('button').click();

    // Step 1: Extract the initial "Body" stat value
    const initialBodyStatElement = await page.locator('#bodyStat');
    const initialBodyStatText = await initialBodyStatElement.textContent();
    if (initialBodyStatText === null) throw new Error('Body stat text is null');
    const initialValue = parseInt(initialBodyStatText, 10);
    console.log(`Initial Body Stat: ${initialValue}`);

    // Step 2: Perform the click action
    await page.locator('app-single-action').filter({ hasText: 'Take a Walk in NatureSpend' }).getByRole('button').click();

    // Step 3: Verify the "Body" stat value has changed
    await page.waitForFunction((initialValue) => {
        const bodyStat = document.querySelector('#bodyStat');
        return bodyStat && parseInt(bodyStat.textContent || '', 10) !== initialValue;
    }, initialValue);

    const updatedBodyStatText = await initialBodyStatElement.textContent();
    if (updatedBodyStatText === null) throw new Error('Updated body stat text is null');
    const updatedValue = parseInt(updatedBodyStatText, 10);
    console.log(`Updated Body Stat: ${updatedValue}`);

    expect(updatedValue).not.toBe(initialValue);
    await page.getByRole('link', { name: 'Logout' }).click();
});