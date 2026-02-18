/*
 * BasePage.js
 * Common base class for all GitHub Page Objects
 * Provides shared Playwright page reference and common utilities
 */

export class BasePage {
  /**
   * @param {import('playwright').Page} page - Playwright page instance
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigates to a given URL and waits for DOM content to be loaded.
   * @param {string} url
   * @param {number} [timeout=60000] - Timeout in ms (default: 60s)
   * @returns {Promise<this>}
   */
  async goto(url, timeout = 60000) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout });
    return this;
  }

  /**
   * Takes a screenshot and saves to the given path.
   * @param {string} path
   * @param {number} [timeout=30000]
   * @returns {Promise<void>}
   */
  async takeScreenshot(path, timeout = 30000) {
    await this.page.screenshot({ path, timeout });
  }
}
