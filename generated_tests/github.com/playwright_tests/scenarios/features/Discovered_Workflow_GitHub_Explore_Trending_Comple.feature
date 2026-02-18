Feature: Explore Trending Repositories and Repository Navigation on GitHub
  As a visitor
  I want to browse trending repositories and interact with repository navigation
  So that I can discover interesting open source projects without authentication

  @navigation @e2e @critical
  Scenario: Discovered Workflow: GitHub Explore & Trending - Complete User Journey
    # Home and Explore
    Given I am on the homepage 'https://github.com/'
    Then the page title should be 'GitHub: Let’s build from here · GitHub'
    And the "Explore" navigation link with text "Explore" should be visible in the site header

    When I click the "Explore" navigation link with text "Explore" in the site header
    Then I should be on the Explore page at URL 'https://github.com/explore'
    And the heading "Explore GitHub" should be visible
    And the "Trending" link with role "link" and text "Trending" should be visible in the Explore navigation

    # Trending Repositories
    When I click the "Trending" link with role "link" and text "Trending" in the Explore navigation
    Then I should be on the Trending page at URL 'https://github.com/trending'
    And the page heading "Trending" should be visible
    And a repository link with full name "alibaba / zvec" should be present in the trending repositories list

    # Trending Repository
    When I click the repository link with text "alibaba / zvec" in the trending repositories list
    Then I should be on the repository page at URL 'https://github.com/alibaba/zvec'
    And the repository title "alibaba / zvec" should be visible in the repository header
    And the navigation tab with role "link" and text "Code" should be visible

    # Code Tab
    When I click the "Code" tab with role "link" and text "Code" in the repository navigation
    Then I should remain on the page with URL 'https://github.com/alibaba/zvec'
    And the file list should be displayed in the repository content area
    And the "README.md" file link with role "link" and label "README.md, (File)" should be visible in the file list

    # README.md
    When I click the "README.md" file link with role "link" and label "README.md, (File)" in the file list
    Then I should be on the README.md page at URL matching 'https://github.com/alibaba/zvec/blob/main/README.md'
    And the README.md content section should be visible

    # Search Bar
    When I click the "Search or jump to…" button with role "button" in the site header
    Then the search input should be focused and ready for input

    # Error checks and resilience
    And there should be no error messages or unexpected UI states present on the page

  @edge @slowNetwork
  Scenario: Trending repository is missing or unavailable
    Given I am on the homepage 'https://github.com/'
    When I click the "Explore" navigation link with text "Explore" in the site header
    And I click the "Trending" link with role "link" and text "Trending" in the Explore navigation
    Then the repository link with text "alibaba / zvec" should not be present in the trending repositories list
    And a message "No trending repositories found" or similar notice should be displayed

  @edge @slowNetwork
  Scenario: README.md file is missing in the trending repository
    Given I am on the homepage 'https://github.com/'
    When I click the "Explore" navigation link with text "Explore" in the site header
    And I click the "Trending" link with role "link" and text "Trending" in the Explore navigation
    And I click the repository link with text "alibaba / zvec" in the trending repositories list
    And I click the "Code" tab with role "link" and text "Code" in the repository navigation
    Then the "README.md" file link with role "link" and label "README.md, (File)" should not be visible in the file list
    And a message "README.md not found" or similar notice should be displayed

  @edge @slowNetwork
  Scenario: Search bar is not interactable
    Given I am on the homepage 'https://github.com/'
    When I click the "Explore" navigation link with text "Explore" in the site header
    And I click the "Trending" link with role "link" and text "Trending" in the Explore navigation
    And I click the repository link with text "alibaba / zvec" in the trending repositories list
    And I click the "README.md" file link with role "link" and label "README.md, (File)" in the file list
    When I attempt to click the "Search or jump to…" button with role "button" in the site header
    Then the search input should not be focused
    And a message or visual indication that the search bar is disabled or unavailable should be displayed

  # Data requirements, network resilience and prerequisites are assumed controlled by the automation test runner/environment.