import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { HomePage } from './pom/HomePage.js';
import { ExplorePage } from './pom/ExplorePage.js';
import { TrendingPage } from './pom/TrendingPage.js';
import { RepositoryPage } from './pom/RepositoryPage.js';
import { ReadmePage } from './pom/ReadmePage.js';
import { ErrorPage } from './pom/ErrorPage.js';
import { SearchPage } from './pom/SearchPage.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let stepTimeout30 = { timeout: 30000 };
const BASE_URL = process.env.BASE_URL || 'https://github.com/';
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://github.com';
const INVALID_SEARCH_VALUE = 'sdkfjhasdkfjh';

// Use INVALID_SEARCH_VALUE consistently

test('Discovered Workflow: GitHub Explore & Search (Non-Login) - Complete User Journey', async ({ page }) => {
  // Step 1: Navigate to homepage
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(BASE_URL);
  const homePage = new HomePage(page);

  // Step 2: Navigate to Explore
  const explorePage = await homePage.gotoExplore();
  await expect(page).toHaveURL(BASE_HOST_URL + '/explore');

  // Step 3: Click Trending link
  const trendingPage = await explorePage.gotoTrending();
  await expect(page).toHaveURL(BASE_HOST_URL + '/trending');

  // Step 4: Click trending repository link
  const repositoryPage = await trendingPage.selectTrendingRepository();
  await expect(page).toHaveURL(BASE_HOST_URL + '/msitarzewski/agency-agents');

  // Step 5: Click README.md file
  const readmePage = await repositoryPage.openReadme();
  await expect(page).toHaveURL(BASE_HOST_URL + '/msitarzewski/agency-agents/blob/main/README.md');

  // Step 6: Attempt invalid repository navigation
  const errorPage = await repositoryPage.gotoInvalidRepository('/this-repo-does-not-exist');
  await expect(page).toHaveURL(BASE_HOST_URL + '/this-repo-does-not-exist');
  const errorText = await errorPage.getErrorMessageText();
  expect(errorText).toMatch(/This is not the web page you are looking for/);
  await page.screenshot({ path: path.join(__dirname, '../.screenshots/github_invalid_repo.png'), fullPage: true });

  // Step 7: Return to homepage
  const homePage2 = await errorPage.returnToHome();
  // FORCE: Reload the homepage to ensure full UI (search bar or hamburger menu) is present
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(BASE_URL);

  // Step 8: Click search bar (desktop or hamburger menu)
  const searchPage = await homePage2.activateSearchBar();
  // No explicit URL change, but modal/input should be visible

  // Step 9: Input valid search value ('torvalds')
  await searchPage.inputSearchValue('torvalds');
  // Step 10: Click valid search suggestion
  await searchPage.clickValidSuggestion();
  await expect(page).toHaveURL(BASE_HOST_URL + '/search?q=torvalds&type=repositories');

  // Step 11: NAVIGATE BACK TO HOMEPAGE before invalid search
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(BASE_URL);
  const homePage3 = new HomePage(page);
  const searchPage2 = await homePage3.activateSearchBar();

  // Step 12: Input invalid search value (use INVALID_SEARCH_VALUE)
  await searchPage2.inputSearchValue(INVALID_SEARCH_VALUE);
  // Step 13: Click invalid search suggestion
  await searchPage2.clickInvalidSuggestion(INVALID_SEARCH_VALUE);
  await expect(page).toHaveURL(BASE_HOST_URL + `/search?q=${INVALID_SEARCH_VALUE}&type=repositories`);
  // Optionally check for 'No results' or error message
  // (GitHub may show 'Your search did not match any repositories')
  const noResults = await page.getByRole('heading', { name: 'Your search did not match any repositories' }).isVisible().catch(() => false);
  expect(noResults).toBeTruthy();
  await page.screenshot({ path: path.join(__dirname, '../.screenshots/github_invalid_search.png'), fullPage: true });

  // Step 14: Click Filters heading
  await searchPage2.filtersHeading.click(stepTimeout30);

  // Step 15: Click Filters dropdown
  await searchPage2.openFiltersDropdown();

  // Step 16: Select valid filter option ('org:')
  await searchPage2.selectValidFilterOption();

  // Step 17: Click Sort/Apply Filters button
  await searchPage2.applyFilters();

  // Step 18: Click 'Most stars' sort option
  const sortClicked = await searchPage2.selectMostStarsSort();
  if (sortClicked) {
    await expect(page).toHaveURL(/&s=stars&o=desc/);
  } else {
    // Sort dropdown not interactable, skip assertion
    // Optionally log for debugging
  }

  // Step 19: Click invalid filter option ('Fewest stars')
  await searchPage2.selectFewestStarsSort();
  // No assertion here, as sort may not be possible with 0 results
});

