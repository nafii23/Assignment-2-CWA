import { test, expect } from '@playwright/test';

test.describe('Escape Room API - Database Operations', () => {
  test('should create new escape room output via POST', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/escape-room', {
      data: {
        title: 'Test Escape Room',
        htmlContent: '<div>Test Content</div>',
        timeSpent: 300,
        stagesCompleted: 3,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('Test Escape Room');
    expect(data.timeSpent).toBe(300);
    expect(data.stagesCompleted).toBe(3);
  });

  test('should fetch all escape room outputs via GET', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/escape-room');
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    expect(Array.isArray(data)).toBeTruthy();
  });
});