/*
 * RepositoryReadmePage.js - Models the README.md file view of a repository
 * Handles interaction with the search bar
 */

import { BasePage } from './BasePage.js';

export class RepositoryReadmePage extends BasePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    super(page);
    // Updated: Target the visible input field with placeholder 'Go to file' as the search bar
    this.searchBarInput = this.page.getByPlaceholder('Go to file');
  }

  /**
   * Focuses the search bar for input
   * @returns {Promise<this>}
   */
  async focusSearchBar() {
    await this.searchBarInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.searchBarInput.click({ timeout: 30000 });
    return this;
  }
}
