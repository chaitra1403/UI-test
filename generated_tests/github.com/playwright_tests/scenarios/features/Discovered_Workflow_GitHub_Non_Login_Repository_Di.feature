@e2e @navigation @search @filters @github @guest @critical
Feature: Guest User Repository Discovery and Search Workflow on GitHub

  As a guest user,
  I want to navigate the GitHub website, explore trending repositories,
  conduct searches with various terms, and validate negative/error handling,
  so I can efficiently discover content and see helpful feedback without logging in.

  Background:
    Given I am on the homepage 'https://github.com/'
    Then the page title should be 'GitHub: Let’s build from here · GitHub'

  @basic_navigation
  Scenario: Guest user navigates through Explore and Trending, selects a repository, and verifies repository page accessibility
    When I click on the link with text 'Explore'
    Then I should be on the Explore page at 'https://github.com/explore'
    And the heading 'Explore GitHub' should be visible

    When I click on the link with exact text 'Trending' in the Explore navigation
    Then I should be on the Trending Repositories page at 'https://github.com/trending'
    And the heading 'Trending' should be visible

    When I click on the repository link with text 'p-e-w / heretic'
    Then I should be on the repository page at 'https://github.com/p-e-w/heretic'
    And the repository title 'heretic' should be visible

    When I click on the 'Skip to content' link in the repository navigation
    Then focus should move to the main content area
    And the element with label 'Repository content' should be visible

  @negative_navigation
  Scenario: Guest user attempts to access invalid repository link and receives proper error feedback
    Given I am on the repository page at 'https://github.com/p-e-w/heretic'
    When I click on the UI element with selector '.d-flex.flex-column > .AppHeader-appearanceSettings'
    Then there should be no navigation away from 'https://github.com/p-e-w/heretic#start-of-content'
    And an error message or no UI change should be present

    When I navigate directly to the URL 'https://github.com/invalid/repo'
    Then I should be on the error page at 'https://github.com/invalid/repo'
    And an error message stating 'Repository not found' should be visible

  @search_bar_on_error
  Scenario: Guest user uses the search bar from an error page with valid and invalid queries
    Given I am on the error page at 'https://github.com/invalid/repo'
    When I focus the search bar input with placeholder 'Find code, projects, and people on GitHub:'
    Then the search bar should be focused

    When I fill in the 'Find code, projects, and people on GitHub:' field with 'valid repository'
    Then the search bar should contain the value 'valid repository'

    When I clear the 'Find code, projects, and people on GitHub:' field
    And I fill in the 'Find code, projects, and people on GitHub:' field with 'valid user'
    Then the search bar should contain the value 'valid user'

    When I clear the 'Find code, projects, and people on GitHub:' field
    And I fill in the 'Find code, projects, and people on GitHub:' field with 'valid issue'
    Then the search bar should contain the value 'valid issue'

    When I clear the 'Find code, projects, and people on GitHub:' field
    And I fill in the 'Find code, projects, and people on GitHub:' field with 'asdfgh123!@#'
    Then the search bar should contain the value 'asdfgh123!@#'
    And if search is submitted, an error or empty results state should be displayed

  @main_search_workflow
  Scenario: Guest user returns to homepage, uses global search modal, and follows through autocomplete suggestions with valid and invalid inputs
    Given I am on the homepage 'https://github.com/'
    When I click the main search bar button with the label 'Search or jump to…'
    Then the search modal dialog should be visible

    When I fill in the 'Search' combobox in the modal with 'valid repository'
    Then the autocomplete suggestion 'valid repository, Search all' should be visible

    When I select the autocomplete suggestion 'valid repository, Search all'
    Then I should be on the search results page at 'https://github.com/search?q=valid%20repository&type=repositories'
    And the search results heading should contain 'repository'

    When I click the main search bar button with the label 'Search or jump to…'
    Then the search modal dialog should be visible

    When I fill in the 'Search' combobox in the modal with 'valid user'
    Then the autocomplete suggestion 'valid user, Search all of' should be visible

    When I select the autocomplete suggestion 'valid user, Search all of'
    Then I should be on the search results page at 'https://github.com/search?q=valid+user&type=repositories'
    And the search results heading should contain 'user'

    When I click the main search bar button with the label 'Search or jump to…'
    Then the search modal dialog should be visible

    When I fill in the 'Search' combobox in the modal with 'valid issue'
    Then the autocomplete suggestion 'valid issue, Search all of' should be visible

    When I select the autocomplete suggestion 'valid issue, Search all of'
    Then I should be on the search results page at 'https://github.com/search?q=valid+issue&type=repositories'
    And the search results heading should contain 'issue'

    When I click the main search bar button with the label 'Search or jump to…'
    Then the search modal dialog should be visible

    When I fill in the 'Search' combobox in the modal with 'asdfgh123!@#'
    Then the autocomplete suggestion 'asdfgh123!@#, Search all of' should be visible

    When I select the autocomplete suggestion 'asdfgh123!@#, Search all of'
    Then I should be on the search results page at 'https://github.com/search?q=asdfgh123%21%40%23&type=repositories'
    And an error message or empty results state should be displayed

  @filter_and_sort
  Scenario: Guest user interacts with search filter sidebar and sorting after a search
    Given I am on the search results page at 'https://github.com/search?q=asdfgh123%21%40%23&type=repositories'

    When I click on the sort dropdown with test id 'sort-button'
    Then the sort dropdown options should be displayed

    When I click on the filters dropdown with test id 'nav-item-code'
    Then the filters dropdown options should be visible

    When I click on the heading with text 'Filter by'
    Then the filters panel should be present

    When I click on the sidebar link with test id 'nav-item-repositories'
    Then the repositories filter should be applied
    And the URL should update to include 'type=code'

    When I click on the sidebar link with test id 'nav-item-issues'
    Then the issues filter should be applied
    And the URL should update to include 'type=code'

    When I click on the sidebar link with test id 'nav-item-pullrequests'
    Then the pull requests filter should be applied
    And the URL should update to include 'type=issues'

    When I click on the sidebar link with test id 'nav-item-discussions'
    Then the discussions filter should be applied
    And the URL should update to include 'type=pullrequests'

  # Edge cases and general assertions
  @robustness
  Scenario: Guest user workflows remain robust under negative and edge conditions
    Given I am on the homepage 'https://github.com/'
    When I simulate slow network conditions while navigating to 'https://github.com/explore'
    Then the Explore page should eventually load without UI errors

    When I trigger an overlay or popup by resizing the window or other means
    Then the critical navigation and search elements should remain accessible

    When I attempt invalid or random input in any search bar (e.g., 'asdfgh123!@#')
    Then the system should display helpful error messages or guidance without crashing