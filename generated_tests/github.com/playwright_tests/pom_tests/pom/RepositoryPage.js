/*
 * RepositoryPage.js - Models a GitHub repository page
 * Handles navigation to the Code tab and README.md file
 */

import { BasePage } from './BasePage.js';
import { RepositoryReadmePage } from './RepositoryReadmePage.js';

export class RepositoryPage extends BasePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    super(page);
    // 'Code' tab selectors (up to 5 for resilience):
    // 1. page.getByRole('link', { name: 'Code', exact: true })
    // 2. page.locator('a[data-tab-item="i0code-tab"]')
    // 3. page.locator('a[data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches repo_packages repo_deployments repo_attestations /alibaba/zvec"]')
    // 4. page.locator('a[data-hotkey="g c"]')
    // 5. page.locator('a[data-react-nav="code-view"]')
    this.codeTabLink = this.page.getByRole('link', { name: 'Code', exact: true });

    // 'README.md' file link selectors (up to 5 for resilience):
    // 1. page.getByRole('link', { name: 'README.md, (File)' })
    // 2. page.getByRole('link', { name: /README\.md, \(File\)/ })
    // 3. page.getByText('README.md')
    // 4. page.locator('#folder-row-17').getByRole('link', { name: 'README.md, (File)' })
    this.readmeLink = this.page.getByRole('link', { name: 'README.md, (File)' });
  }

  /**
   * Clicks the 'Code' tab in the repository navigation
   * @returns {Promise<this>}
   */
  async clickCodeTab() {
    await this.codeTabLink.waitFor({ state: 'visible', timeout: 30000 });
    await this.codeTabLink.click({ timeout: 30000 });
    await this.waitForURL(/\/alibaba\/zvec$/, 60000);
    return this;
  }

  /**
   * Clicks the 'README.md' file link and navigates to RepositoryReadmePage
   * @returns {Promise<RepositoryReadmePage>}
   */
  async clickReadme() {
    await this.readmeLink.waitFor({ state: 'visible', timeout: 30000 });
    await this.readmeLink.click({ timeout: 30000 });
    await this.waitForURL(/\/alibaba\/zvec\/blob\/main\/README\.md$/, 60000);
    return new RepositoryReadmePage(this.page);
  }
}
