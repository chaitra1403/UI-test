/*
 * TrendingPage.js
 * Page Object for GitHub Trending page (/trending)
 */

import { BasePage } from './BasePage.js';

export class TrendingPage extends BasePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    super(page);
    // 'alibaba / zvec' trending repository link selectors (up to 5 for robustness):
    // 1. page.getByRole('link', { name: 'alibaba / zvec' })
    // 2. page.getByRole('link', { name: /alibaba / zvec/ })
    // 3. page.locator('a[data-hydro-click-hmac="ad604fbf537b55306b9f94f7f5561a84879c59f5f9ebb0bfe8787775bdbb20da"]')
    // 4. page.getByText('zvec', { exact: true })
    // 5. page.locator('a').filter({ hasText: 'alibaba /\n\n      zvec' })
    this.trendingRepoLink = this.page.getByRole('link', { name: 'alibaba / zvec' });
  }

  /**
   * Clicks the trending repository link (e.g., 'alibaba / zvec').
   * Navigates to RepositoryPage.
   * @param {number} [timeout=45000]
   * @returns {Promise<RepositoryPage>}
   */
  async clickTrendingRepo(timeout = 45000) {
    await this.trendingRepoLink.click({ timeout });
    // RepositoryPage is defined in RepositoryPage.js
    const { RepositoryPage } = await import('./RepositoryPage.js');
    return new RepositoryPage(this.page);
  }
}
