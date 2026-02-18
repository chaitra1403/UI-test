Feature: Explore Trending Repositories and Verify Error Handling on GitHub
  As an anonymous user,
  I want to explore trending repositories from the homepage,
  access repository documentation,
  and verify that invalid repositories display proper error feedback,
  so that I can confidently browse and trust GitHub's discoverability and robustness.

  @navigation @explore @trending @repository @error-handling @critical
  Scenario: Complete user journey from homepage to trending repository README and error page

    # ===== INITIALIZATION =====
    Given I am on the homepage 'https://github.com/'
    Then the page URL should be 'https://github.com/'
    And the header should contain a link with the exact text 'Explore'

    # ===== NAVIGATE TO EXPLORE =====
    When I click the 'Explore' link in the navigation bar
    Then the page URL should be 'https://github.com/explore'
    And the 'Explore' page title should be displayed
    And the main section should contain 'Trending repositories' text

    # ===== NAVIGATE TO TRENDING =====
    When I click the 'Trending' link in the Explore navigation sidebar
    Then the page URL should be 'https://github.com/trending'
    And the heading 'Trending repositories' should be visible
    And a list of trending repositories should be present

    # ===== OPEN A SPECIFIC TRENDING REPOSITORY =====
    When I click the repository link with the exact text 'alibaba / zvec'
    Then the page URL should be 'https://github.com/alibaba/zvec'
    And the repository title 'alibaba/zvec' should be visible
    And the repository file list should be displayed

    # ===== OPEN THE README FILE =====
    When I click the file link with the name 'README.md' in the repository file list
    Then the page URL should contain '/alibaba/zvec/blob/main/README.md'
    And the file viewer should display the heading 'README.md'
    And the README content should be visible

    # ===== ATTEMPT TO ACCESS AN INVALID REPOSITORY =====
    When I navigate directly to the URL 'https://github.com/invalid-repo-xyz'
    Then the page URL should be 'https://github.com/invalid-repo-xyz'
    And an error message with the text 'Repository not found' or a 404 page should be displayed

    # ===== GENERAL WORKFLOW VERIFICATION =====
    And no unexpected errors or crashes should occur throughout the workflow