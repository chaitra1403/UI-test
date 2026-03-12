/*
 * BasePage.js
 * Common functionality for all GitHub POMs
 * ES Module, type: module
 */

export class BasePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Waits for navigation to a given URL pattern
   * @param {string|RegExp} urlPattern
   * @param {number} timeoutMs - default 60000
   */
  async waitForUrl(urlPattern, timeoutMs = 60000) {
    await this.page.waitForURL(urlPattern, { timeout: timeoutMs });
    return this;
  }

  /**
   * Waits for selector to appear
   * @param {string} selector
   * @param {number} timeoutMs - default 30000
   */
  async waitForSelector(selector, timeoutMs = 30000) {
    await this.page.waitForSelector(selector, { timeout: timeoutMs });
    return this;
  }

  /**
   * Returns the underlying Playwright page object
   */
  getPage() {
    return this.page;
  }
}
