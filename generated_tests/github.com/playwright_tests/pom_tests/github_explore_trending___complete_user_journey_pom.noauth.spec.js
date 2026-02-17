import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { ExplorePage } from './pom/ExplorePage.js';
import { TrendingPage } from './pom/TrendingPage.js';
import { RepositoryPage } from './pom/RepositoryPage.js';
import { RepositoryReadmePage } from './pom/RepositoryReadmePage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL;
const BASE_HOST_URL = process.env.BASE_HOST_URL;
let stepTimeout30 = { timeout: 30000 };

test('Discovered Workflow: GitHub Explore & Trending - Complete User Journey', async ({ page }) => {
  // Step 1: Navigate to Explore page
  await page.goto((BASE_URL || BASE_HOST_URL) + 'explore', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(new RegExp(BASE_HOST_URL + '/explore'));

  // Step 2: Click 'Trending' link
  const explorePage = new ExplorePage(page);
  const trendingPage = await explorePage.clickTrending();
  await expect(page).toHaveURL(new RegExp(BASE_HOST_URL + '/trending'));

  // Step 3: Click first trending repository (alibaba/zvec)
  const repositoryPage = await trendingPage.clickTrendingRepo();
  await expect(page).toHaveURL(new RegExp(BASE_HOST_URL + '/alibaba/zvec'));

  // Step 4: Click 'Code' tab
  await repositoryPage.clickCodeTab();
  await expect(page).toHaveURL(new RegExp(BASE_HOST_URL + '/alibaba/zvec'));

  // Step 5: Click 'README.md' link
  const repositoryReadmePage = await repositoryPage.clickReadme();
  await expect(page).toHaveURL(new RegExp(BASE_HOST_URL + '/alibaba/zvec/blob/main/README.md'));

  // Step 6: Click Search Bar
  await repositoryReadmePage.focusSearchBar();
  // No further assertion as focusing is UI state
});
