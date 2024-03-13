import { test, expect } from '@playwright/test';
import { registerUser, loginUser } from './utils';

test('wrong login test', async ({ page }) => {
    console.log('Starting wrong login test...');
    await page.goto('http://frontend:4200/');
    await page.goto('http://frontend:4200/auth/login');

    // Wrong combination of username and password
    // Rejection message: Login failed. Please check your credentials and try again.
    await page.getByLabel('Email*').click();
    await page.getByLabel('Email*').fill('wrong@mail.com');
    await page.getByLabel('Email*').press('Tab');
    await page.getByLabel('Password*').fill('definitelyWrong');
    await page.getByLabel('Password*').press('Enter');
    await expect(page.locator('form')).toContainText('Login failed. Please check your credentials and try again.');

    // Wrong email format
    // Rejection message: Email is required and format should be correct.
    await page.getByLabel('Email*').click();
    await page.getByLabel('Email*').fill('wrong');
    await expect(page.locator('form')).toContainText('Email is required and format should be correct.');

    // Wrong passwrod format
    // Rejection message: Email is required and format should be correct.
    await page.getByLabel('Password*').click();
    await page.getByLabel('Password*').fill('wron');
    await expect(page.locator('form')).toContainText('Password is required and must be at least 5 characters long.');
});
