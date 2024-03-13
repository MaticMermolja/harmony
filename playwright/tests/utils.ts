import { Page, expect } from '@playwright/test';

export async function registerUser(page: Page, username: string, password: string) {
    await page.goto('http://frontend:4200/');  
    await page.goto('http://frontend:4200/auth/login');

    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByLabel('First Name*').click();
    await page.getByLabel('First Name*').fill('SomeName');
    await page.getByLabel('First Name*').press('Tab');
    await page.getByLabel('Last Name*').fill('SomeSurname');
    await page.getByLabel('Last Name*').press('Tab');
    await page.getByLabel('Email*').fill(username);
    await page.getByLabel('Email*').press('Tab');
    await page.getByLabel('Password*').fill(password);
    await page.getByRole('button', { name: 'Register' }).click();
}

export async function loginUser(page: Page, username: string, password: string) {
    await page.goto('http://frontend:4200/');
    await page.goto('http://frontend:4200/auth/login');

    await page.getByLabel('Email*').click();
    await page.getByLabel('Email*').fill(username);
    await page.getByLabel('Email*').press('Tab');
    await page.getByLabel('Password*').fill(password);
    await page.getByLabel('Password*').press('Enter');
}

export async function completeBoarding(page: Page) {
    await page.getByLabel('Do you workout, run, or').fill('27');
    await page.getByLabel('Do you eat healthy?').fill('43');
    await page.getByLabel('Do you feel like having').fill('87');
    await page.getByLabel('Do you often talk to people').fill('68');
    await page.getByRole('button', { name: 'Next step' }).click();

    await page.getByLabel('Do you have active social').fill('28');
    await page.getByLabel('Do you have good relations').fill('70');
    await page.getByLabel('Do you enjoy what you are').fill('38');
    await page.getByLabel('Do you have hobbies you like').fill('61');
    await page.getByRole('button', { name: 'Next step' }).click();

    await page.getByLabel('Do you feel loved?').fill('73');
    await page.getByLabel('Do you want to learn new').fill('86');
    await page.getByLabel('Do you have own projects you').fill('73');
    await page.getByLabel('Do you enjoy yourself?').fill('77');
    await page.getByRole('button', { name: 'Next step' }).click();

    await page.getByRole('button', { name: 'Show me results' }).click();
}

