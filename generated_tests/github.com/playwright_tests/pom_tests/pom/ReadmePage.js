/*
 * ReadmePage.js
 * Page Object Model for https://github.com/[owner]/[repo]/blob/main/README.md
 * ES Module, type: module
 */

import { BasePage } from './BasePage.js';

export class ReadmePage extends BasePage {
  constructor(page) {
    super(page);
    // No unique selectors required for basic navigation
  }

  /**
   * Returns to repository root page
   * @returns {Promise<void>}
   */
  async returnToRepositoryRoot() {
    await this.page.goto(this.page.url().replace(/\/blob\/main\/README\.md.*/, ''), { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForURL(/\/[^\/]+\/[^\/]+$/, { timeout: 60000 });
    return this;
  }
}
