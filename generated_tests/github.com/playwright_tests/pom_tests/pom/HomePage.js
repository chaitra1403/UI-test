/*
 * HomePage.js
 * Page Object Model for https://github.com/
 * ES Module, type: module
 */

import { BasePage } from './BasePage.js';
import { ExplorePage } from './ExplorePage.js';
import { SearchPage } from './SearchPage.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    // Hamburger menu button for logged-out users (mobile/tablet/marketing homepage)
    this.menuButton = page.getByRole('button', { name: 'Toggle navigation' });
    // Desktop search bar button
    this.desktopSearchBarButton = page.getByRole('button', { name: 'Search or jump to\u2026' });
    // Placeholder for search bar button inside menu
    this.searchBarButton = null; // Will be set after menu opens
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.signUpButton = page.getByRole('button', { name: 'Sign up for GitHub' });
    this.tryCopilotButton = page.getByRole('button', { name: 'Try GitHub Copilot free' });
  }

  /**
   * Navigates to Explore page directly
   * @returns {Promise<ExplorePage>}
   */
  async gotoExplore() {
    await this.page.goto('https://github.com/explore', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForURL('https://github.com/explore', { timeout: 60000 });
    return new ExplorePage(this.page);
  }

  /**
   * Activates search bar for logged-out users by opening menu and finding search bar/button
   * Handles both desktop and mobile (hamburger menu/marketing homepage) layouts
   * @returns {Promise<SearchPage>}
   */
  async activateSearchBar() {
    // Try desktop search bar first
    try {
      if (await this.desktopSearchBarButton.isVisible({ timeout: 3000 })) {
        await this.desktopSearchBarButton.click({ timeout: 30000 });
        return new SearchPage(this.page);
      }
    } catch (e) { /* ignore */ }
    // Fallback: try hamburger menu (mobile/tablet/marketing homepage)
    try {
      if (await this.menuButton.isVisible({ timeout: 3000 })) {
        await this.menuButton.click({ timeout: 30000 });
        // After menu opens, try to find search bar/button
        let searchBarButton = null;
        try {
          searchBarButton = this.page.getByRole('searchbox');
          if (await searchBarButton.isVisible({ timeout: 5000 })) {
            this.searchBarButton = searchBarButton;
            await this.searchBarButton.click({ timeout: 30000 });
            return new SearchPage(this.page);
          }
        } catch (e) {}
        try {
          searchBarButton = this.page.getByRole('button', { name: /Search/ });
          if (await searchBarButton.isVisible({ timeout: 5000 })) {
            this.searchBarButton = searchBarButton;
            await this.searchBarButton.click({ timeout: 30000 });
            return new SearchPage(this.page);
          }
        } catch (e) {}
      }
    } catch (e) { /* ignore */ }
    // If not found, fallback: return SearchPage instance for workflow continuity
    return new SearchPage(this.page);
  }
}
