import 'dotenv/config';
import { test, expect } from '@playwright/test';
import path from 'path';

// Use process.cwd() for ES6 compatibility
const screenshotDir = process.cwd();

test.use({ storageState: { cookies: [], origins: [] } });

const stepTimeout30 = { timeout: 30000 };

test('Explore Repositories - Complete User Journey', async ({ page }) => {
  // Step 1: Navigate to Explore page
  await page.goto('https://github.com/explore', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL('https://github.com/explore', stepTimeout30);
  await expect(page.getByRole('navigation', { name: 'Explore navigation' })).toBeVisible(stepTimeout30);
  await page.screenshot({ path: path.join(screenshotDir, 'explore_page.png'), fullPage: true });

  // Step 2: Click 'Explore' in navigation bar
  await page.getByRole('link', { name: 'Explore' }).click(stepTimeout30);
  await expect(page).toHaveURL('https://github.com/explore', stepTimeout30);

  // Step 3: Click 'Trending' link
  await page.getByRole('link', { name: 'Trending', exact: true }).click(stepTimeout30);
  await expect(page).toHaveURL('https://github.com/trending', stepTimeout30);
  await page.screenshot({ path: path.join(screenshotDir, 'trending_page.png'), fullPage: true });

  // Step 4: Click trending repository link
  const trendingRepoLink = page.getByRole('link', { name: 'alibaba / zvec' });
  await trendingRepoLink.click(stepTimeout30);
  await expect(page).toHaveURL(/\/alibaba\/zvec/, stepTimeout30);

  // Step 5: Click README.md file link
  const readmeLink = page.getByRole('link', { name: /README\.md/ });
  await readmeLink.click(stepTimeout30);
  await expect(page).toHaveURL(/\/alibaba\/zvec\/blob\/.*\/README\.md/, stepTimeout30);

  // Step 6: Navigate to invalid repository URL
  await page.goto('https://github.com/invalid-repo-xyz', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL('https://github.com/invalid-repo-xyz', stepTimeout30);

  // Assert presence of search box input unique to 404 page
  const searchInput = page.getByLabel('Find code, projects, and people on GitHub:');
  await expect(searchInput).toBeVisible(stepTimeout30);
  await page.screenshot({ path: path.join(screenshotDir, 'invalid_repo_404.png'), fullPage: true });
});
