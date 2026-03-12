/*
 * ErrorPage.js
 * Page Object Model for https://github.com/this-repo-does-not-exist
 * ES Module, type: module
 */

import { BasePage } from './BasePage.js';
import { HomePage } from './HomePage.js';

export class ErrorPage extends BasePage {
  constructor(page) {
    super(page);
    // Error message for invalid repository (image accessible name)
    // Selectors:
    // 1. page.getByRole('img', { name: /This is not the web page you are looking for/ })
    this.errorMessage = page.getByRole('img', { name: /This is not the web page you are looking for/ });
  }

  /**
   * Returns to homepage
   * @returns {Promise<HomePage>}
   */
  async returnToHome() {
    await this.page.goto('https://github.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForURL('https://github.com/', { timeout: 60000 });
    return new HomePage(this.page);
  }

  /**
   * Gets the error message text (image accessible name)
   * @returns {Promise<string>}
   */
  async getErrorMessageText() {
    await this.errorMessage.waitFor({ timeout: 30000 });
    return await this.errorMessage.getAttribute('alt');
  }
}
