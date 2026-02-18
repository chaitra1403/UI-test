import 'dotenv/config';
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

let stepTimeout30 = { timeout: 30000 };
let stepTimeout10 = { timeout: 10000 };

test('Discovered Workflow: GitHub Explore & Trending - Complete User Journey', async ({ page }) => {
  // Step 1: Navigate to Explore page
  await test.step('Navigate to Explore page', async () => {
    await page.goto(`${BASE_URL || BASE_HOST_URL}explore`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/explore/);
    // Verify Trending link is visible
    // Captured selectors:
    //   1. page.getByRole('link', { name: 'Trending', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
    await expect(page.getByRole('link', { name: 'Trending', exact: true })).toBeVisible(stepTimeout10);
  });

  // Step 2: Click 'Trending' link
  await test.step("Click 'Trending' link", async () => {
    // Captured selectors:
    //   1. page.getByRole('link', { name: 'Trending', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.getByRole('link', { name: 'Trending' }) (confidence: 85%, strategy: role_name, unique: false)
    //   3. page.locator('a[data-hydro-click-hmac="03487116570e400898e62bd80f54e4762d40c73421fb11fcdc176710e518405c"]') (confidence: 85%, strategy: data_attr_hydro-click-hmac, unique: true)
    //   4. page.locator('a[data-selected-links="/trending /trending/developers /trending/developers /trending /trending"]') (confidence: 85%, strategy: data_attr_selected-links, unique: true)
    //   5. page.locator('a').filter({ hasText: /^Trending$/ }) (confidence: 74%, strategy: link_filter_exact, unique: false)
    await page.getByRole('link', { name: 'Trending', exact: true }).click(stepTimeout30);
    await expect(page).toHaveURL(/\/trending/);
  });

  // Step 3: Click first trending repository
  await test.step('Click first trending repository', async () => {
    // Captured selectors:
    //   1. page.getByRole('link', { name: 'alibaba / zvec' }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.getByRole('link', { name: /alibaba / zvec/ }) (confidence: 95%, strategy: role_name_regex, unique: true)
    //   3. page.locator('a[data-hydro-click-hmac="ad604fbf537b55306b9f94f7f5561a84879c59f5f9ebb0bfe8787775bdbb20da"]') (confidence: 85%, strategy: data_attr_hydro-click-hmac, unique: true)
    //   4. page.getByText('zvec', { exact: true }) (confidence: 80%, strategy: text_exact_extracted, unique: true)
    //   5. page.locator('a').filter({ hasText: 'alibaba /\n\n      zvec' }) (confidence: 69%, strategy: tag_filter_text, unique: true)
    await page.getByRole('link', { name: 'alibaba / zvec' }).click(stepTimeout30);
    await expect(page).toHaveURL(/\/alibaba\/zvec/);
    // Verify navigation tabs visible (e.g., Code tab)
    await expect(page.getByRole('link', { name: 'Code', exact: true })).toBeVisible(stepTimeout10);
  });

  // Step 4: Click 'Code' tab
  await test.step("Click 'Code' tab", async () => {
    // Captured selectors:
    //   1. page.getByRole('link', { name: 'Code', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.locator('a[data-tab-item="i0code-tab"]') (confidence: 85%, strategy: data_attr_tab-item, unique: true)
    //   3. page.locator('a[data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches repo_packages repo_deployments repo_attestations /alibaba/zvec"]') (confidence: 85%, strategy: data_attr_selected-links, unique: true)
    //   4. page.locator('a[data-hotkey="g c"]') (confidence: 85%, strategy: data_attr_hotkey, unique: true)
    //   5. page.locator('a[data-react-nav="code-view"]') (confidence: 85%, strategy: data_attr_react-nav, unique: true)
    await page.getByRole('link', { name: 'Code', exact: true }).click(stepTimeout30);
    // Verify file list is displayed (README.md should be visible)
    await expect(page.getByRole('link', { name: 'README.md, (File)' })).toBeVisible(stepTimeout10);
  });

  // Step 5: Click 'README.md' link
  await test.step("Click 'README.md' link", async () => {
    // Captured selectors:
    //   1. page.getByRole('link', { name: 'README.md, (File)' }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.getByRole('link', { name: /README\.md, \(File\)/ }) (confidence: 96%, strategy: aria_label_regex, unique: false)
    //   3. page.getByRole('link', { name: /README\.md, \(File\)/ }) (confidence: 95%, strategy: role_name_regex, unique: false)
    //   4. page.getByText('README.md') (confidence: 88%, strategy: text, unique: false)
    //   5. page.locator('#folder-row-17').getByRole('link', { name: 'README.md, (File)' }) (confidence: 82%, strategy: parent_id_role, unique: false)
    await page.getByRole('link', { name: 'README.md, (File)' }).click(stepTimeout30);
    await expect(page).toHaveURL(/\/blob\/main\/README\.md/);
    await expect(page.getByRole('main')).toBeVisible(stepTimeout10);
  });

  // Step 6: Click Search Bar (SKIPPED FOR NOAUTH: search bar not visible to logged-out users)
});
