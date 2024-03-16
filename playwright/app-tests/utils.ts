import { Page, expect } from '@playwright/test';

export async function registerUser(page: Page, username: string, password: string) {
    page.on('console', message => console.log(`Browser console: ${message.text()}`));
    page.on('requestfailed', request => console.log(`Failed request: ${request.url()}`));
    await page.waitForTimeout(1000);
    console.log('Starting registerUser');
    await page.goto('http://frontend:4200/');

    console.log('Data registerUser, username = [', username, '] password = [', password, ']');
    console.log('Entering data registerUser');

    await page.getByRole('link', { name: 'Register' }).click();

    // Visibility check
    console.log('Waiting for Email* to be visible ... ');
    await page.getByLabel('Email*').waitFor({ state: 'visible' });
    console.log('Email* IS VISIBLE!');

    // Enter data
    await page.getByLabel('First Name*').click();
    await page.getByLabel('First Name*').fill('SomeName');
    await page.getByLabel('First Name*').press('Tab');
    await page.getByLabel('Last Name*').fill('SomeSurname');
    await page.getByLabel('Last Name*').press('Tab');
    await page.getByLabel('Email*').fill(username);
    await page.getByLabel('Email*').press('Tab');
    await page.getByLabel('Password*').fill(password);
    page.getByRole('button', { name: 'Register' }).click(),
    console.log('Current URL:', page.url());
    console.log('Registration finished');  
}

export async function loginUser(page: Page, username: string, password: string) {
    await page.waitForTimeout(1000);
    console.log('Starting loginUser, entering data');
    let currentUrl = page.url();
    console.log(currentUrl);
    console.log('Data loginUser, username = [', username, '] password = [', password, ']');
    console.log('Waiting for Email* to be visible ... ');
    await page.getByLabel('Email*').waitFor({ state: 'visible' });
    console.log('Email* IS VISIBLE!');
    await page.getByLabel('Email*').click();
    await page.getByLabel('Email*').fill(username);
    await page.getByLabel('Email*').press('Tab');
    await page.getByLabel('Password*').fill(password);
    page.getByRole('button', { name: 'Login' }).click(),
    console.log('Current URL:', page.url());
}

export async function completeBoarding(page: Page) {
    await page.waitForTimeout(1000);
    console.log('Starting completeBoarding');
    let currentUrl = page.url();
    console.log(currentUrl);
    await page.getByLabel('Do you workout, run, or').waitFor({ state: 'visible' });
    await page.getByLabel('Do you workout, run, or').fill('27');
    await page.getByLabel('Do you eat healthy?').fill('43');
    await page.getByLabel('Do you feel like having').fill('87');
    await page.getByLabel('Do you often talk to people').fill('68');
    page.getByRole('button', { name: 'Next step' }).click(),
    console.log('completeBoarding step 2');
    await page.waitForTimeout(200);
    currentUrl = page.url();
    console.log(currentUrl);

    await page.getByLabel('Do you have active social').fill('28');
    await page.getByLabel('Do you have good relations').fill('70');
    await page.getByLabel('Do you enjoy what you are').fill('38');
    await page.getByLabel('Do you have hobbies you like').fill('61');
    page.getByRole('button', { name: 'Next step' }).click(),
    console.log('completeBoarding step 3');
    await page.waitForTimeout(200);
    currentUrl = page.url();
    console.log(currentUrl);

    await page.getByLabel('Do you feel loved?').fill('73');
    await page.getByLabel('Do you want to learn new').fill('86');
    await page.getByLabel('Do you have own projects you').fill('73');
    await page.getByLabel('Do you enjoy yourself?').fill('77');
    page.getByRole('button', { name: 'Next step' }).click(),
    console.log('completeBoarding step 4');
    await page.waitForTimeout(200);
    currentUrl = page.url();
    console.log(currentUrl);

    await page.getByRole('button', { name: 'Show me results' }).click();
}

