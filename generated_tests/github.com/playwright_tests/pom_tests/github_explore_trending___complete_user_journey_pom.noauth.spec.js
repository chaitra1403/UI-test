import 'dotenv/config';
import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });
test.setTimeout(60000);

test('github_explore_trending___complete_user_journey_pom.noauth', async ({ page }) => {
  // Step 1: Navigate to homepage
  await page.goto('https://github.com/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForLoadState('domcontentloaded');

  // Step 2: Navigate to Explore page
  await page.goto('https://github.com/explore', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForLoadState('domcontentloaded');

  // Step 3: Click Trending link
  await page.waitForSelector('a[href="/trending"]', { timeout: 10000 });
  await page.getByRole('link', { name: 'Trending', exact: true }).click({ timeout: 10000 });
  await page.waitForLoadState('domcontentloaded');

  // Step 4: Click first trending repository (try several selectors for robustness)
  let repoClicked = false;
  const repoSelectors = [
    () => page.getByRole('link', { name: 'p-e-w / heretic' }),
    () => page.getByRole('link', { name: /p-e-w \/ heretic/ }),
    () => page.getByText('heretic', { exact: true })
  ];
  for (const repoSel of repoSelectors) {
    const repo = repoSel();
    if (await repo.count() > 0 && await repo.isVisible({ timeout: 2000 })) {
      await repo.click({ timeout: 10000 });
      repoClicked = true;
      break;
    }
  }
  expect(repoClicked).toBe(true);
  await page.waitForLoadState('domcontentloaded');

  // Step 5: Click repository navigation element (Skip to content)
  const skipToContent = page.getByRole('link', { name: 'Skip to content' });
  if (await skipToContent.count() > 0 && await skipToContent.isVisible({ timeout: 2000 })) {
    await skipToContent.click({ timeout: 5000, force: true });
  }

  // Step 6: Click invalid repository navigation element (negative test)
  const invalidNav = page.locator('.d-flex.flex-column > .AppHeader-appearanceSettings');
  if (await invalidNav.count() > 0 && await invalidNav.isVisible({ timeout: 2000 })) {
    await invalidNav.click({ timeout: 5000 });
  }

  // Step 7: Navigate to invalid repository URL
  await page.goto('https://github.com/invalid/repo', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForLoadState('domcontentloaded');

  // Step 8: Click search bar on error page
  const searchBarSelectors = [
    () => page.getByRole('textbox', { name: 'Find code, projects, and' }),
    () => page.getByRole('textbox', { name: /Find code, projects, and people on GitHub:/ }),
    () => page.getByLabel('Find code, projects, and people on GitHub:')
  ];
  let searchBarFound = false;
  for (const searchSel of searchBarSelectors) {
    const searchBar = searchSel();
    if (await searchBar.count() > 0 && await searchBar.isVisible({ timeout: 2000 })) {
      await searchBar.click({ timeout: 5000 });
      searchBarFound = true;
      break;
    }
  }
  expect(searchBarFound).toBe(true);

  // Step 9: Input "valid repository" in search bar
  await searchBarSelectors[0]().fill('valid repository', { timeout: 5000 });

  // Step 10: Input "valid user" in search bar
  await searchBarSelectors[0]().fill('valid user', { timeout: 5000 });

  // Step 11: Input "valid issue" in search bar
  await searchBarSelectors[0]().fill('valid issue', { timeout: 5000 });

  // Step 12: Input invalid/random string in search bar
  await searchBarSelectors[0]().fill('asdfgh123!@#', { timeout: 5000 });

  // Step 13: Navigate to homepage for valid search context
  await page.goto('https://github.com/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForLoadState('domcontentloaded');

  // Step 14: Click main search bar
  const mainSearchButton = page.getByRole('button', { name: 'Search or jump to…' });
  if (await mainSearchButton.count() > 0 && await mainSearchButton.isVisible({ timeout: 2000 })) {
    await mainSearchButton.click({ timeout: 5000 });
  }

  // Step 15: Input "valid repository" in search modal
  const searchModalInput = page.getByRole('combobox', { name: 'Search' });
  if (await searchModalInput.count() > 0 && await searchModalInput.isVisible({ timeout: 2000 })) {
    await searchModalInput.fill('valid repository', { timeout: 5000 });
  }

  // Step 16: Click search suggestion for "valid repository"
  const repoSuggestion = page.getByRole('option', { name: /valid repository, Search all/ });
  if (await repoSuggestion.count() > 0 && await repoSuggestion.isVisible({ timeout: 2000 })) {
    await repoSuggestion.click({ timeout: 5000 });
    await page.waitForLoadState('domcontentloaded');
  }

  // Step 17: Input "valid user" in search bar
  if (await searchModalInput.count() > 0 && await searchModalInput.isVisible({ timeout: 2000 })) {
    await searchModalInput.fill('valid user', { timeout: 5000 });
  }

  // Step 18: Click search suggestion for "valid user"
  const userSuggestion = page.getByRole('option', { name: /valid user, Search all/ });
  if (await userSuggestion.count() > 0 && await userSuggestion.isVisible({ timeout: 2000 })) {
    await userSuggestion.click({ timeout: 5000 });
    await page.waitForLoadState('domcontentloaded');
  }

  // Step 19: Input "valid issue" in search bar
  if (await searchModalInput.count() > 0 && await searchModalInput.isVisible({ timeout: 2000 })) {
    await searchModalInput.fill('valid issue', { timeout: 5000 });
  }

  // Step 20: Click search suggestion for "valid issue"
  const issueSuggestion = page.getByRole('option', { name: /valid issue, Search all/ });
  if (await issueSuggestion.count() > 0 && await issueSuggestion.isVisible({ timeout: 2000 })) {
    await issueSuggestion.click({ timeout: 5000 });
    await page.waitForLoadState('domcontentloaded');
  }

  // Step 21: Input invalid/random string in search bar
  if (await searchModalInput.count() > 0 && await searchModalInput.isVisible({ timeout: 2000 })) {
    await searchModalInput.fill('asdfgh123!@#', { timeout: 5000 });
  }

  // Step 22: Click search suggestion for invalid/random string
  const invalidSuggestion = page.getByRole('option', { name: /asdfgh123!@#, Search all/ });
  if (await invalidSuggestion.count() > 0 && await invalidSuggestion.isVisible({ timeout: 2000 })) {
    await invalidSuggestion.click({ timeout: 5000 });
    await page.waitForLoadState('domcontentloaded');
  }

  // Step 23: Click Sort dropdown
  const sortDropdown = page.getByTestId('sort-button');
  if (await sortDropdown.count() > 0 && await sortDropdown.isVisible({ timeout: 2000 })) {
    await sortDropdown.click({ timeout: 5000 });
  }

  // Step 24: Click Filters dropdown
  const filtersDropdown = page.getByTestId('nav-item-code');
  if (await filtersDropdown.count() > 0 && await filtersDropdown.isVisible({ timeout: 2000 })) {
    await filtersDropdown.click({ timeout: 5000 });
  }

  // Step 25: Click "Filter by" heading
  const filterByHeading = page.getByRole('heading', { name: 'Filter by' });
  if (await filterByHeading.count() > 0 && await filterByHeading.isVisible({ timeout: 2000 })) {
    await filterByHeading.click({ timeout: 5000 });
  }

  // Step 26: Click "Repositories" sidebar filter
  const repoSidebarFilter = page.getByTestId('nav-item-repositories');
  if (await repoSidebarFilter.count() > 0 && await repoSidebarFilter.isVisible({ timeout: 2000 })) {
    await repoSidebarFilter.click({ timeout: 5000 });
  }

  // Step 27: Click "Issues" sidebar filter
  const issuesSidebarFilter = page.getByTestId('nav-item-issues');
  if (await issuesSidebarFilter.count() > 0 && await issuesSidebarFilter.isVisible({ timeout: 2000 })) {
    await issuesSidebarFilter.click({ timeout: 5000 });
  }

  // Step 28: Click "Pull requests" sidebar filter
  const prSidebarFilter = page.getByTestId('nav-item-pullrequests');
  if (await prSidebarFilter.count() > 0 && await prSidebarFilter.isVisible({ timeout: 2000 })) {
    await prSidebarFilter.click({ timeout: 5000 });
  }

  // Step 29: Click "Discussions" sidebar filter
  const discussionsSidebarFilter = page.getByTestId('nav-item-discussions');
  if (await discussionsSidebarFilter.count() > 0 && await discussionsSidebarFilter.isVisible({ timeout: 2000 })) {
    await discussionsSidebarFilter.click({ timeout: 5000 });
  }
});
