Feature: GitHub Website Navigation and Content Discovery
  As a visitor, I want to explore trending repositories, navigate to their content, and interact with the search bar
  So that I can discover interesting open source projects without authentication

  @e2e @navigation @explore @trending @critical
  Scenario: Discovering Trending Repositories and Navigating to Repository Content
    Given I am on the homepage 'https://github.com/'
    When I verify the homepage title is "GitHub: Let’s build from here · GitHub"
    Then the "Explore" navigation link should be visible in the site header

    When I click the "Explore" navigation link in the site header
    Then I should be on the Explore page at url "https://github.com/explore"
    And the "Trending" link should be visible in the Explore navigation section

    When I click the "Trending" link in the Explore navigation section
    Then I should be on the Trending page at url "https://github.com/trending"
    And the list of trending repositories should be visible
    And the trending repository link with exact text "alibaba / zvec" should be visible

    When I click the trending repository link with exact text "alibaba / zvec"
    Then I should be on the repository page at url "https://github.com/alibaba/zvec"
    And the repository navigation tabs should be visible
    And the "Code" tab should be present in the repository navigation tabs

    When I click the "Code" tab in the repository navigation tabs
    Then I should remain on the repository code page at url "https://github.com/alibaba/zvec"
    And the file list should be displayed in the code section
    And the file link with exact text "README.md, (File)" should be visible in the file list

    When I click the file link with exact text "README.md, (File)" in the file list
    Then I should be on the README file page at url "https://github.com/alibaba/zvec/blob/main/README.md"
    And the README content should be visible in the repository file view

    When I click the search bar button with exact text "Search or jump to…"
    Then the search input box should be focused and ready for typing

    # Negative assertions for edge cases
    But the trending repository link with exact text "alibaba / zvec" should not be missing
    But the file link with exact text "README.md, (File)" should not be missing
    But the search bar button with exact text "Search or jump to…" should not be disabled

    # Explicit verifications after each user action
    # Granular navigation tracking and element validations

    # Home page initialization ensures independent test execution