/*
 * SearchPage.js - Models the GitHub search results and search/filter UI
 * Handles search bar, autocomplete, filters, and sorting interactions
 */

import { BasePage } from './BasePage.js';

export class SearchPage extends BasePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    super(page);
    // Search bar input selectors (up to 5 for resilience):
    // 1. page.getByRole('textbox', { name: 'Find code, projects, and' })
    // 2. page.locator('form[action*="search"]').getByRole('textbox', { name: /Find code, projects, and people on GitHub:/ })
    // 3. page.getByRole('textbox', { name: /Find code, projects, and people on GitHub:/ })
    // 4. page.getByLabel('Find code, projects, and people on GitHub:')
    // 5. page.getByLabel('Find code, projects, and people on GitHub:')
    this.headerSearchInput = this.page.getByRole('textbox', { name: 'Find code, projects, and' });

    // Main search bar button (homepage):
    // 1. page.getByRole('button', { name: 'Search or jump to…' })
    this.mainSearchBarButton = this.page.getByRole('button', { name: 'Search or jump to…' });

    // Search modal combobox input (after clicking main search bar):
    // 1. page.getByRole('combobox', { name: 'Search' })
    this.searchModalInput = this.page.getByRole('combobox', { name: 'Search' });

    // Autocomplete suggestion selectors (up to 5 for resilience):
    // 1. page.getByRole('option', { name: /.+, Search all/ })
    // 2. page.locator('[role="presentation"]').getByRole('option')
    // 3. page.locator('li[data-type="command-result"]')
    this.suggestionOptions = this.page.getByRole('option');

    // Sort dropdown selectors:
    // 1. page.getByTestId('sort-button')
    this.sortDropdown = this.page.getByTestId('sort-button');

    // Filters dropdown selectors:
    // 1. page.getByTestId('nav-item-code')
    this.codeFilter = this.page.getByTestId('nav-item-code');
    // 2. page.getByTestId('nav-item-repositories')
    this.repositoriesFilter = this.page.getByTestId('nav-item-repositories');
    // 3. page.getByTestId('nav-item-issues')
    this.issuesFilter = this.page.getByTestId('nav-item-issues');
    // 4. page.getByTestId('nav-item-pullrequests')
    this.pullRequestsFilter = this.page.getByTestId('nav-item-pullrequests');
    // 5. page.getByTestId('nav-item-discussions')
    this.discussionsFilter = this.page.getByTestId('nav-item-discussions');

    // 'Filter by' heading
    // 1. page.getByRole('heading', { name: 'Filter by' })
    this.filterByHeading = this.page.getByRole('heading', { name: 'Filter by' });
  }

  /**
   * Focuses the header search input (error page)
   * @returns {Promise<this>}
   */
  async focusHeaderSearchInput() {
    await this.headerSearchInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.headerSearchInput.click({ timeout: 30000 });
    return this;
  }

  /**
   * Types a query into the header search input
   * @param {string} query
   * @returns {Promise<this>}
   */
  async typeInHeaderSearch(query) {
    await this.headerSearchInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.headerSearchInput.fill(query, { timeout: 15000 });
    return this;
  }

  /**
   * Focuses the main search bar button (homepage)
   * @returns {Promise<this>}
   */
  async focusMainSearchBar() {
    await this.mainSearchBarButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.mainSearchBarButton.click({ timeout: 30000 });
    return this;
  }

  /**
   * Types a query into the search modal input
   * @param {string} query
   * @returns {Promise<this>}
   */
  async typeInSearchModal(query) {
    await this.searchModalInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.searchModalInput.fill(query, { timeout: 15000 });
    return this;
  }

  /**
   * Clicks an autocomplete suggestion by visible text
   * @param {string} suggestionText
   * @returns {Promise<this>}
   */
  async clickSuggestion(suggestionText) {
    // Try up to 3 selectors for resilience
    const optionLocators = [
      this.page.getByRole('option', { name: suggestionText }),
      this.page.getByRole('option', { name: new RegExp(suggestionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }),
      this.page.locator('li[data-type="command-result"]').filter({ hasText: suggestionText }),
    ];
    let found = false;
    for (const locator of optionLocators) {
      try {
        await locator.waitFor({ state: 'visible', timeout: 15000 });
        await locator.click({ timeout: 30000 });
        found = true;
        break;
      } catch (e) {
        // Try next
      }
    }
    if (!found) {
      throw new Error(`Autocomplete suggestion '${suggestionText}' not found`);
    }
    return this;
  }

  /**
   * Clicks the sort dropdown
   * @returns {Promise<this>}
   */
  async clickSortDropdown() {
    await this.sortDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await this.sortDropdown.click({ timeout: 30000 });
    return this;
  }

  /**
   * Clicks the code filter in the filters sidebar
   * @returns {Promise<this>}
   */
  async clickCodeFilter() {
    await this.codeFilter.waitFor({ state: 'visible', timeout: 15000 });
    await this.codeFilter.click({ timeout: 30000 });
    return this;
  }

  /**
   * Clicks the repositories filter in the filters sidebar
   * @returns {Promise<this>}
   */
  async clickRepositoriesFilter() {
    await this.repositoriesFilter.waitFor({ state: 'visible', timeout: 15000 });
    await this.repositoriesFilter.click({ timeout: 30000 });
    return this;
  }

  /**
   * Clicks the issues filter in the filters sidebar
   * @returns {Promise<this>}
   */
  async clickIssuesFilter() {
    await this.issuesFilter.waitFor({ state: 'visible', timeout: 15000 });
    await this.issuesFilter.click({ timeout: 30000 });
    return this;
  }

  /**
   * Clicks the pull requests filter in the filters sidebar
   * @returns {Promise<this>}
   */
  async clickPullRequestsFilter() {
    await this.pullRequestsFilter.waitFor({ state: 'visible', timeout: 15000 });
    await this.pullRequestsFilter.click({ timeout: 30000 });
    return this;
  }

  /**
   * Clicks the discussions filter in the filters sidebar
   * @returns {Promise<this>}
   */
  async clickDiscussionsFilter() {
    await this.discussionsFilter.waitFor({ state: 'visible', timeout: 15000 });
    await this.discussionsFilter.click({ timeout: 30000 });
    return this;
  }

  /**
   * Clicks the 'Filter by' heading (for interaction)
   * @returns {Promise<this>}
   */
  async clickFilterByHeading() {
    await this.filterByHeading.waitFor({ state: 'visible', timeout: 15000 });
    await this.filterByHeading.click({ timeout: 30000 });
    return this;
  }
}
