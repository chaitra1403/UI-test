/*
 * TrendingPage.js - Models the GitHub Trending repositories page
 * Handles navigation to the first trending repository
 */

import { BasePage } from './BasePage.js';
import { RepositoryPage } from './RepositoryPage.js';

export class TrendingPage extends BasePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    super(page);
    // First trending repository link selectors (up to 5 for resilience):
    // 1. page.getByRole('link', { name: 'alibaba / zvec' })
    // 2. page.getByRole('link', { name: /alibaba / zvec/ })
    // 3. page.locator('a[data-hydro-click-hmac="ad604fbf537b55306b9f94f7f5561a84879c59f5f9ebb0bfe8787775bdbb20da"]')
    // 4. page.getByText('zvec', { exact: true })
    // 5. page.locator('a').filter({ hasText: 'alibaba /\n\n      zvec' })
    this.firstRepoLink = this.page.getByRole('link', { name: 'alibaba / zvec' });
  }

  /**
   * Clicks the first trending repository link and navigates to RepositoryPage
   * @returns {Promise<RepositoryPage>}
   */
  async clickTrendingRepo() {
    await this.firstRepoLink.waitFor({ state: 'visible', timeout: 30000 });
    await this.firstRepoLink.click({ timeout: 30000 });
    await this.waitForURL(/\/alibaba\/zvec$/, 60000);
    return new RepositoryPage(this.page);
  }
}
