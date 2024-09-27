import fs from 'fs';
import { BasePage } from './pages/page';

export function loadTestData(filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export async function authenticate(pageObject: BasePage): Promise<void> {
    const cookies = parseCookies();
    const storageData = parseLocalStorage();

    console.log('Loading cookies and local storage...');
    await pageObject.page.context().addCookies(cookies);
    await pageObject.page.context().addInitScript((storage: Record<string, string>) => {
        Object.keys(storage).forEach(key => window.localStorage.setItem(key, storage[key]));
    }, storageData);
    await pageObject.page.context().storageState(storageData);
  
    console.log('Reloading page to ensure storage is recognized...');
    await pageObject.page.reload();
}

function parseCookies(): any[] {
    console.log('Grabbing cookies...');
    // Parse cookies from GH Secrets, or from /auth folder
    return process.env.CI ? JSON.parse(process.env.COOKIES_JSON || '[]')
        : JSON.parse(fs.readFileSync('tests/auth/cookies.json', 'utf8'));
}

function parseLocalStorage(): Record<string, string> {
    console.log('Grabbing storage...');
    // Parse Local Storage from GH Secrets, or from /auth folder
    return process.env.CI ? JSON.parse(process.env.LOCAL_STORAGE_JSON || '{}')
        : JSON.parse(fs.readFileSync('tests/auth/localStorage.json', 'utf8'));
}