import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { ExplorePage } from './pom/ExplorePage.js';
import { TrendingPage } from './pom/TrendingPage.js';
import { RepositoryPage } from './pom/RepositoryPage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://github.com';
const BASE_URL = process.env.BASE_URL || BASE_HOST_URL;

let stepTimeout30 = { timeout: 30000 };
let stepTimeout45 = { timeout: 45000 };

test('Discovered Workflow: Explore Repositories - Complete User Journey', async ({ page }) => {
  // Step 1: Navigate to Explore page
  await page.goto(`${BASE_HOST_URL}/explore`, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(`${BASE_HOST_URL}/explore`);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '01_explore_page.png'), fullPage: true }).catch(() => {});

  // Step 2: Click 'Explore' in navigation bar (should remain on Explore)
  const explorePage = new ExplorePage(page);
  await explorePage.clickExploreNav(stepTimeout30.timeout);
  await expect(page).toHaveURL(`${BASE_HOST_URL}/explore`);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '02_explore_nav_clicked.png'), fullPage: true }).catch(() => {});

  // Step 3: Click 'Trending' link
  const trendingPage = await explorePage.clickTrendingLink(stepTimeout45.timeout);
  await expect(page).toHaveURL(`${BASE_HOST_URL}/trending`);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '03_trending_page.png'), fullPage: true }).catch(() => {});

  // Step 4: Click trending repository link (alibaba/zvec)
  const repoPage = await trendingPage.clickTrendingRepo(stepTimeout45.timeout);
  await expect(page).toHaveURL(`${BASE_HOST_URL}/alibaba/zvec`);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '04_repo_page.png'), fullPage: true }).catch(() => {});

  // Step 5: Click README.md file link
  await repoPage.clickReadmeFile(stepTimeout45.timeout);
  await expect(page).toHaveURL(`${BASE_HOST_URL}/alibaba/zvec/blob/main/README.md`);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '05_readme_page.png'), fullPage: true }).catch(() => {});

  // Step 6: Navigate to invalid repository URL
  await page.goto(`${BASE_HOST_URL}/invalid-repo-xyz`, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(`${BASE_HOST_URL}/invalid-repo-xyz`);
  // Check for 404 illustration or image element
  const errorImg = page.getByRole('img', { name: /404/i });
  await expect(errorImg).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '06_invalid_repo_404.png'), fullPage: true }).catch(() => {});
});
