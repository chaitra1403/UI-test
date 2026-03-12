/*
 * ExplorePage.js
 * Page Object Model for https://github.com/explore
 * ES Module, type: module
 */

import { BasePage } from './BasePage.js';
import { TrendingPage } from './TrendingPage.js';

export class ExplorePage extends BasePage {
  constructor(page) {
    super(page);
    // 'Trending' navigation link
    // Selectors:
    // 1. page.getByRole('link', { name: 'Trending', exact: true })
    // 2. page.getByRole('link', { name: 'Trending' })
    // 3. page.locator('a[data-hydro-click-hmac="03487116570e400898e62bd80f54e4762d40c73421fb11fcdc176710e518405c"]')
    // 4. page.locator('a[data-selected-links="/trending /trending/developers /trending/developers /trending /trending"]')
    // 5. page.locator('a').filter({ hasText: /^Trending$/ })
    this.trendingLink = page.getByRole('link', { name: 'Trending', exact: true });
  }

  /**
   * Navigates to the Trending page
   * @returns {Promise<TrendingPage>}
   */
  async gotoTrending() {
    await this.trendingLink.click({ timeout: 30000 });
    await this.page.waitForURL('**/trending', { timeout: 60000 });
    return new TrendingPage(this.page);
  }
}
