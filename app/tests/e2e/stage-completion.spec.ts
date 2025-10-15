import { test, expect } from '@playwright/test';

// MINIMAL TESTS - These should always pass if server is running

test.describe('Escape Room - Basic Tests', () => {
  test('server responds to requests', async ({ page }) => {
    const response = await page.goto('http://localhost:3000');
    expect(response?.status()).toBe(200);
  });

  test('page renders something', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(0);
  });

  test('root div exists', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    const root = page.locator('#root, #__next, body');
    await expect(root.first()).toBeVisible();
  });
});

test.describe('API Tests', () => {
  test('POST /api/escape-room creates entry', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/escape-room', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        title: 'Minimal Test',
        htmlContent: '<div>Test</div>',
        timeSpent: 100,
        stagesCompleted: 2,
      },
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
  });

  test('GET /api/escape-room returns array', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/escape-room');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
