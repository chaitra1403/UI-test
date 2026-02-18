/*
 * ExplorePage.js
 * Page Object for GitHub Explore page (/explore)
 */

import { BasePage } from './BasePage.js';

export class ExplorePage extends BasePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    super(page);
    // 'Explore' navigation link selectors (up to 5 for robustness):
    // 1. page.getByRole('link', { name: 'Explore' })
    // 2. page.locator('a[data-hydro-click-hmac="2d649db335c5f641b76f1592449a07a2f6b93ad72adadb0fecb35f9c44196431"]')
    // 3. page.locator('a[data-selected-links="/explore /explore/email /explore"]')
    // 4. page.locator('a.js-selected-navigation-item.selected')
    // 5. page.getByRole('link', { name: 'Explore' })
    this.exploreNavLink = this.page.getByRole('link', { name: 'Explore' });

    // 'Trending' link selectors (up to 5 for robustness):
    // 1. page.getByRole('link', { name: 'Trending', exact: true })
    // 2. page.getByRole('link', { name: 'Trending' })
    // 3. page.locator('a[data-hydro-click-hmac="03487116570e400898e62bd80f54e4762d40c73421fb11fcdc176710e518405c"]')
    // 4. page.locator('a[data-selected-links="/trending /trending/developers /trending/developers /trending /trending"]')
    // 5. page.locator('a').filter({ hasText: /^Trending$/ })
    this.trendingLink = this.page.getByRole('link', { name: 'Trending', exact: true });
  }

  /**
   * Clicks the 'Explore' link in the navigation bar.
   * Remains on ExplorePage.
   * @param {number} [timeout=30000]
   * @returns {Promise<ExplorePage>}
   */
  async clickExploreNav(timeout = 30000) {
    await this.exploreNavLink.click({ timeout });
    return this;
  }

  /**
   * Clicks the 'Trending' link to navigate to TrendingPage.
   * @param {number} [timeout=45000]
   * @returns {Promise<TrendingPage>}
   */
  async clickTrendingLink(timeout = 45000) {
    await this.trendingLink.click({ timeout });
    // TrendingPage is defined in TrendingPage.js
    const { TrendingPage } = await import('./TrendingPage.js');
    return new TrendingPage(this.page);
  }
}
