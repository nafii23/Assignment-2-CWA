import { test, expect } from '@playwright/test';

test.describe('Escape Room - Stage Completion', () => {
  test('should load escape room page', async ({ page }) => {
    await page.goto('http://localhost:3001/escape-room');
    await page.waitForLoadState('networkidle');
    
    // Just verify page loads
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveTitle(/./); // Has any title
  });

  test('should verify database save functionality via API', async ({ request }) => {
    // Create test escape room output
    const response = await request.post('http://localhost:3001/api/escape-room', {
      data: {
        title: 'Stage Completion Test - Easy Mode',
        htmlContent: '<div>Test HTML output</div>',
        timeSpent: 120,
        stagesCompleted: 2,
      },
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    
    // Verify it has the right properties
    expect(data).toHaveProperty('id');
    expect(data.title).toContain('Stage Completion');
    expect(data.stagesCompleted).toBe(2);
    expect(data.timeSpent).toBe(120);
  });
});