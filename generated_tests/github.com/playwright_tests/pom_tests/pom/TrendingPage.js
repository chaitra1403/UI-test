/*
 * TrendingPage.js
 * Page Object Model for https://github.com/trending
 * ES Module, type: module
 */

import { BasePage } from './BasePage.js';
import { RepositoryPage } from './RepositoryPage.js';

export class TrendingPage extends BasePage {
  constructor(page) {
    super(page);
    // Trending repository link (example: msitarzewski/agency-agents)
    // Selectors:
    // 1. page.getByRole('link', { name: 'msitarzewski / agency-agents' })
    // 2. page.getByRole('link', { name: /msitarzewski / agency-agents/ })
    // 3. page.locator('a[data-hydro-click-hmac="37fb949f4975b15a05501ec314afb6693d56685c5447ceadbecb134d66e60258"]')
    // 4. page.locator('a').filter({ hasText: 'msitarzewski /\n\n      agency-agents' })
    // 5. page.locator('xpath=html/body/div[1]/div[5]/main/div[3]/div/div[2]/article[1]/h2/a')
    this.trendingRepoLink = page.getByRole('link', { name: 'msitarzewski / agency-agents' });
  }

  /**
   * Clicks the trending repository link
   * @returns {Promise<RepositoryPage>}
   */
  async selectTrendingRepository() {
    await this.trendingRepoLink.click({ timeout: 30000 });
    await this.page.waitForURL('**/msitarzewski/agency-agents', { timeout: 60000 });
    return new RepositoryPage(this.page);
  }
}
