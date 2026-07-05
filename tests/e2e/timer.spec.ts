import { test, expect } from "@playwright/test";

test.describe("Pomodoro Timer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the timer", async ({ page }) => {
    await expect(page.getByText(/focus session/i)).toBeVisible();
    await expect(page.getByText(/25:00/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /start/i })).toBeVisible();
  });

  test("should start the timer on click", async ({ page }) => {
    await page.click('button:has-text("Start")');
    await expect(page.getByText(/pause/i)).toBeVisible();
  });

  test("should pause the timer", async ({ page }) => {
    await page.click('button:has-text("Start")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Pause")');
    await expect(page.getByText(/resume/i)).toBeVisible();
  });

  test("should resume the timer", async ({ page }) => {
    await page.click('button:has-text("Start")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Pause")');
    await page.click('button:has-text("Resume")');
    await expect(page.getByText(/pause/i)).toBeVisible();
  });

  test("should reset the timer", async ({ page }) => {
    await page.click('button:has-text("Start")');
    await page.waitForTimeout(500);
    await page.click('button[aria-label="Reset timer"]');
    await expect(page.getByText(/25:00/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /start/i })).toBeVisible();
  });

  test("should navigate to tasks page", async ({ page }) => {
    await page.click('a[href="/tasks"]');
    await expect(page).toHaveURL(/\/tasks/);
    await expect(page.getByPlaceholder(/add a new task/i)).toBeVisible();
  });

  test("should navigate to analytics page", async ({ page }) => {
    await page.click('a[href="/analytics"]');
    await expect(page).toHaveURL(/\/analytics/);
    await expect(page.getByText(/statistics/i)).toBeVisible();
  });

  test("should navigate to settings page", async ({ page }) => {
    await page.click('a[href="/settings"]');
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByText(/timer duration/i)).toBeVisible();
  });

  test("should add a task", async ({ page }) => {
    await page.click('a[href="/tasks"]');
    await page.fill('input[aria-label="New task title"]', "Test Task");
    await page.click('button[aria-label="Add task"]');
    await expect(page.getByText("Test Task")).toBeVisible();
  });

  test("should complete a task", async ({ page }) => {
    await page.click('a[href="/tasks"]');
    await page.fill('input[aria-label="New task title"]', "Task to complete");
    await page.click('button[aria-label="Add task"]');
    await page.click('button[role="checkbox"]');
    await expect(page.getByText("Task to complete").locator("..")).toHaveClass(/line-through/);
  });
});
