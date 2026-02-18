/*
 * BasePage.js - Common functionality for all page objects
 * Provides shared methods for navigation, waiting, and error handling
 */

export class BasePage {
  /**
   * @param {import('playwright').Page} page - Playwright page instance
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigates to a given URL and waits for DOMContentLoaded
   * @param {string} url
   * @returns {Promise<void>}
   */
  async goto(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    return this;
  }

  /**
   * Waits for a selector to be visible
   * @param {string} selector
   * @param {number} timeout
   * @returns {Promise<void>}
   */
  async waitForVisible(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Waits for navigation to a URL pattern
   * @param {RegExp|string} urlPattern
   * @param {number} timeout
   * @returns {Promise<void>}
   */
  async waitForURL(urlPattern, timeout = 60000) {
    await this.page.waitForURL(urlPattern, { timeout });
  }
}
