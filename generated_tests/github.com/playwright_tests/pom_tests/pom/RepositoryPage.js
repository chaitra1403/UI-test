/*
 * RepositoryPage.js - Models a GitHub repository page
 * Handles navigation to the Code tab, README.md file, 'Skip to content', and invalid repo UI elements
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

    // 'Skip to content' link selectors (up to 5 for resilience):
    // 1. page.getByRole('link', { name: 'Skip to content' })
    // 2. page.getByRole('link', { name: /Skip to content/ })
    // 3. page.getByText('Skip to content')
    // 4. page.locator('a[data-skip-target-assigned="false"]')
    // 5. page.locator('a.px-2.py-4')
    this.skipToContentLink = this.page.getByRole('link', { name: 'Skip to content' });

    // Invalid repository UI element selectors (up to 5 for resilience):
    // 1. page.locator('.d-flex.flex-column > .AppHeader-appearanceSettings')
    // 2. page.locator('div.AppHeader-appearanceSettings')
    // 3. page.locator('xpath=html/body/div[1]/div[2]/header/div/div[2]/div/div/div[2]')
    this.invalidRepoUiElement = this.page.locator('.d-flex.flex-column > .AppHeader-appearanceSettings');
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

  /**
   * Clicks the 'Skip to content' link for accessibility
   * @returns {Promise<this>}
   */
  async clickSkipToContent() {
    await this.skipToContentLink.waitFor({ state: 'visible', timeout: 15000 });
    await this.skipToContentLink.click({ timeout: 30000 });
    // No navigation expected
    return this;
  }

  /**
   * Clicks the invalid repository UI element (for negative test)
   * @returns {Promise<this>}
   */
  async clickInvalidRepoUiElement() {
    await this.invalidRepoUiElement.waitFor({ state: 'visible', timeout: 15000 });
    await this.invalidRepoUiElement.click({ timeout: 15000 });
    // No navigation expected; error or no-op
    return this;
  }
}
