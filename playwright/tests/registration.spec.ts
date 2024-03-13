import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.goto('http://localhost:4200/auth/login');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByLabel('First Name*').click();
  await page.getByLabel('First Name*').fill('SomeName');
  await page.getByLabel('First Name*').press('Tab');
  await page.getByLabel('Last Name*').fill('SomeSurname');
  await page.getByLabel('Last Name*').press('Tab');
  await page.getByLabel('Email*').fill('some@mail.com');
  await page.getByLabel('Email*').press('Tab');
  await page.getByLabel('Password*').fill('Geslo123');
  await page.getByRole('button', { name: 'Register' }).click();
});