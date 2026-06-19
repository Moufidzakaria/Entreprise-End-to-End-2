# Playwright End-to-End & API Automation Test Suite

This repository contains a professional automated testing framework built using **Playwright with TypeScript**. It validates both the frontend User Interface (UI) and backend REST API endpoints for the **Practice Software Testing (Toolshop)** platform.

The project is fully integrated with **GitHub Actions** for Continuous Integration (CI), executing the complete test suite automatically on every push or pull request.

---

## 🚀 Key Features

* **E-Commerce Flow Automation:** End-to-end testing of authentication, profile updates, interaction with dynamic category dropdowns, and adding items to the shopping cart.
* **API Testing:** Direct backend validation handling HTTP `GET` and `POST` requests, checking status codes, and inspecting JSON response structures.
* **Page Object Model (POM) Architecture:** Designed with scalable, reusable selectors and neat abstraction layers.
* **CI/CD Integration:** Implemented continuous testing using an automated GitHub Actions workflow pipeline.
* **Robust Locator Strategies:** Prioritizes resilient user-facing locators (`getByRole`, `getByText`) to prevent test flakiness.
* **Artifact Generation:** Configured to automatically capture screenshots, videos, and trace logs for visual debugging.

---

## 📁 Project Structure

```text
playwright-ts/
├── .github/workflows/
│   └── playwright.yml     # GitHub Actions CI workflow configuration
├── lib/
│   └── login.ts           # Page Object Model (POM) implementation
├── tests/
│   ├── api.spec.ts        # Isolated REST API validation tests
│   ├── categories.spec.ts # Dynamic UI workflow & cart management tests
│   ├── login.spec.ts      # Admin dashboard authentication scenarios
│   └── register.spec.ts   # New user registration test cases
├── playwright.config.ts   # Core Playwright configuration file
└── package.json           # Project dependencies and script shortcuts
🛠️ Installation & Setup
Clone the Repository:

Bash


git clone [https://github.com/Moufidzakaria/playwright-ts-.git](https://github.com/Moufidzakaria/playwright-ts-.git)
cd playwright-ts-
Install Node.js Dependencies:

Bash


npm install
Install Required Playwright Browsers & System Binaries:

Bash


npx playwright install --with-deps
🏃 Run the Test Suite
Execute the following commands in your terminal to control and run the test runner:

Run all tests in headless mode (Fast CI style):

Bash


npx playwright test
Run a specific test file with visible browser UI (Headed):

Bash


npx playwright test tests/categories.spec.ts --headed
Run tests using a direct string match/keyword filter:

Bash


npx playwright test categories --headed
Open the interactive Playwright UI Dashboard:

Bash


npx playwright test --ui
📊 Generating HTML Reports
Playwright records detailed logs of all test executions. To safely spin up the built-in HTML report server locally on an available port, run:

Bash


npx playwright show-report --port 9330
