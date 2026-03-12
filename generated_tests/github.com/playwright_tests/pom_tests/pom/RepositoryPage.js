/*
 * RepositoryPage.js
 * Page Object Model for https://github.com/[owner]/[repo]
 * ES Module, type: module
 */

import { BasePage } from './BasePage.js';
import { ReadmePage } from './ReadmePage.js';
import { ErrorPage } from './ErrorPage.js';

export class RepositoryPage extends BasePage {
  constructor(page) {
    super(page);
    // README.md file link
    // Selectors:
    // 1. page.getByRole('link', { name: 'README.md, (File)' })
    // 2. page.getByRole('link', { name: /README\.md, \(File\)/ })
    // 3. page.locator('#folder-row-21').getByRole('link', { name: 'README.md, (File)' })
    // 4. page.locator('a').filter({ hasText: /^README\.md$/ })
    this.readmeLink = page.getByRole('link', { name: 'README.md, (File)' });
  }

  /**
   * Clicks the README.md file link
   * @returns {Promise<ReadmePage>}
   */
  async openReadme() {
    await this.readmeLink.click({ timeout: 30000 });
    await this.page.waitForURL('**/blob/main/README.md', { timeout: 60000 });
    return new ReadmePage(this.page);
  }

  /**
   * Navigates to an invalid repository (negative scenario)
   * @param {string} repoPath - e.g. '/this-repo-does-not-exist'
   * @returns {Promise<ErrorPage>}
   */
  async gotoInvalidRepository(repoPath = '/this-repo-does-not-exist') {
    await this.page.goto(`https://github.com${repoPath}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForURL(`**${repoPath}`, { timeout: 60000 });
    return new ErrorPage(this.page);
  }
}
