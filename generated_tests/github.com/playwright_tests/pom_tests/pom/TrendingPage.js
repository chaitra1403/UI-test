/*
 * TrendingPage.js - Models the GitHub Trending repositories page
 * Handles navigation to any trending repository by name
 */

import { BasePage } from './BasePage.js';
import { RepositoryPage } from './RepositoryPage.js';

export class TrendingPage extends BasePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    super(page);
    // Example trending repository link selectors (up to 5 for resilience):
    // 1. page.getByRole('link', { name: 'alibaba / zvec' })
    // 2. page.getByRole('link', { name: /alibaba / zvec/ })
    // 3. page.locator('a[data-hydro-click-hmac="ad604fbf537b55306b9f94f7f5561a84879c59f5f9ebb0bfe8787775bdbb20da"]')
    // 4. page.getByText('zvec', { exact: true })
    // 5. page.locator('a').filter({ hasText: 'alibaba /\n\n      zvec' })
    //
    // For 'p-e-w / heretic' (from scenario):
    // 1. page.getByRole('link', { name: 'p-e-w / heretic' })
    // 2. page.getByRole('link', { name: /p-e-w / heretic/ })
    // 3. page.locator('a[data-hydro-click-hmac="ad1873e8ce155c69a2102c9d156c7529bce6422383a2a160262087f31e770159"]')
    // 4. page.getByText('heretic', { exact: true })
    // 5. page.locator('a').filter({ hasText: 'p-e-w /\n\n      heretic' })
  }

  /**
   * Clicks the first trending repository link by name and navigates to RepositoryPage
   * @param {string} repoName - e.g., 'p-e-w / heretic'
   * @returns {Promise<RepositoryPage>}
   */
  async clickTrendingRepoByName(repoName) {
    // Try up to 5 selectors for resilience
    const selectors = [
      this.page.getByRole('link', { name: repoName }),
      this.page.getByRole('link', { name: new RegExp(repoName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }),
      // Fallback to text if repoName is unique enough
      this.page.getByText(repoName.split('/')[1]?.trim() || repoName, { exact: true }),
    ];
    let found = false;
    for (const locator of selectors) {
      try {
        await locator.waitFor({ state: 'visible', timeout: 15000 });
        await locator.click({ timeout: 30000 });
        found = true;
        break;
      } catch (e) {
        // Try next selector
      }
    }
    if (!found) {
      throw new Error(`Trending repository link for '${repoName}' not found`);
    }
    // Wait for navigation to the repository URL
    await this.waitForURL(/\/[\w-]+\/[\w-]+$/, 60000);
    return new RepositoryPage(this.page);
  }

  /**
   * Legacy: Clicks the first trending repository (default: 'alibaba / zvec')
   * @returns {Promise<RepositoryPage>}
   */
  async clickTrendingRepo() {
    // Default to 'alibaba / zvec' for backward compatibility
    const locator = this.page.getByRole('link', { name: 'alibaba / zvec' });
    await locator.waitFor({ state: 'visible', timeout: 30000 });
    await locator.click({ timeout: 30000 });
    await this.waitForURL(/\/alibaba\/zvec$/, 60000);
    return new RepositoryPage(this.page);
  }
}
