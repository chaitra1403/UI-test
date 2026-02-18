/*
 * RepositoryPage.js
 * Page Object for a GitHub repository page (e.g., /alibaba/zvec)
 */

import { BasePage } from './BasePage.js';

export class RepositoryPage extends BasePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    super(page);
    // README.md file link selectors (up to 5 for robustness):
    // 1. page.getByRole('link', { name: 'README.md, (File)' })
    // 2. page.getByRole('link', { name: /README\.md, \(File\)/ })
    // 3. page.getByText('README.md')
    // 4. page.locator('#folder-row-17').getByRole('link', { name: 'README.md, (File)' })
    // 5. page.getByRole('link', { name: /README\.md, \(File\)/ })
    this.readmeFileLink = this.page.getByRole('link', { name: 'README.md, (File)' });
  }

  /**
   * Clicks the README.md file link in the repository file list.
   * Navigates to the README file page (still RepositoryPage context).
   * @param {number} [timeout=45000]
   * @returns {Promise<RepositoryPage>}
   */
  async clickReadmeFile(timeout = 45000) {
    await this.readmeFileLink.click({ timeout });
    return this;
  }
}
