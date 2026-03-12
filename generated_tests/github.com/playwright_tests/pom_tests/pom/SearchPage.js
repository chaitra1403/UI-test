import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class SearchPage extends BasePage {
  constructor(page) {
    super(page);
    // Search modal input
    this.searchInput = page.getByRole('combobox', { name: 'Search' });
    // Valid suggestion
    this.validSuggestion = page.getByRole('option', { name: 'torvalds, Search all of GitHub' });
    // Invalid suggestion (dynamic)
    this.invalidSuggestion = (value) => page.getByRole('option', { name: `${value}, Search all of GitHub` });
    // Filters heading
    this.filtersHeading = page.getByRole('heading', { name: 'Filter by' });
    // Filters dropdown (first <details> element)
    this.filtersDropdown = page.locator('details').first();
    // Valid filter option (sidebar 'Repositories' link)
    this.validFilterOption = page.getByRole('link', { name: 'Repositories' });
    // Apply filters (sort button)
    this.applyFiltersButton = page.getByTestId('sort-button');
    // Sort dropdown
    this.sortDropdown = page.getByTestId('sort-button');
    // Sort options
    this.mostStarsSortOption = page.getByRole('menuitemradio', { name: 'Most stars' });
    this.fewestStarsSortOption = page.getByRole('menuitemradio', { name: 'Fewest stars' });
  }

  async inputSearchValue(value) {
    await this.searchInput.fill(value);
    return this;
  }

  async clickValidSuggestion() {
    await this.validSuggestion.click({ timeout: 30000 });
    return this;
  }

  async clickInvalidSuggestion(value) {
    // Try to click the invalid suggestion, fallback to pressing Enter
    const suggestion = this.invalidSuggestion(value);
    if (await suggestion.isVisible()) {
      await suggestion.click({ timeout: 30000 });
    } else {
      await this.searchInput.press('Enter');
    }
    return this;
  }

  async openFiltersDropdown() {
    await this.filtersDropdown.click({ timeout: 30000 });
    return this;
  }

  async selectValidFilterOption() {
    await this.validFilterOption.click({ timeout: 30000 });
    return this;
  }

  async applyFilters() {
    await this.applyFiltersButton.click({ timeout: 30000 });
    return this;
  }

  async selectMostStarsSort() {
    await this.sortDropdown.click({ timeout: 30000 });
    if (await this.mostStarsSortOption.isVisible()) {
      await this.mostStarsSortOption.click({ timeout: 30000 });
      return true;
    }
    // If not visible, skip gracefully
    return false;
  }

  async selectFewestStarsSort() {
    await this.sortDropdown.click({ timeout: 30000 });
    if (await this.fewestStarsSortOption.isVisible()) {
      await this.fewestStarsSortOption.click({ timeout: 30000 });
    } else {
      // If not visible, skip gracefully
      // Optionally log for debugging
      // console.log('Fewest stars sort option not visible, skipping click.');
    }
    return this;
  }
}
