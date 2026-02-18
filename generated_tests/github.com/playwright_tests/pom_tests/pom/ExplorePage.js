/*
 * ExplorePage.js - Models the GitHub Explore page
 * Handles navigation to Trending repositories
 */

import { BasePage } from './BasePage.js';
import { TrendingPage } from './TrendingPage.js';

export class ExplorePage extends BasePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    super(page);
    // 'Trending' link selectors (up to 5 for resilience):
    // 1. page.getByRole('link', { name: 'Trending', exact: true })
    // 2. page.getByRole('link', { name: 'Trending' })
    // 3. page.locator('a[data-hydro-click-hmac="03487116570e400898e62bd80f54e4762d40c73421fb11fcdc176710e518405c"]')
    // 4. page.locator('a[data-selected-links="/trending /trending/developers /trending/developers /trending /trending"]')
    // 5. page.locator('a').filter({ hasText: /^Trending$/ })
    this.trendingLink = this.page.getByRole('link', { name: 'Trending', exact: true });
  }

  /**
   * Clicks the 'Trending' link and navigates to TrendingPage
   * @returns {Promise<TrendingPage>}
   */
  async clickTrending() {
    await this.trendingLink.waitFor({ state: 'visible', timeout: 30000 });
    await this.trendingLink.click({ timeout: 30000 });
    await this.waitForURL(/\/trending$/, 60000);
    return new TrendingPage(this.page);
  }
}
