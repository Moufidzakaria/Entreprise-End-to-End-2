# 🚀 Playwright QA Automation Framework

A modern **QA Automation Framework** built with **Playwright + TypeScript**, featuring End-to-End Testing, API Testing, Authentication, Cookies & Sessions, Docker, and Azure DevOps CI/CD.

## ✨ Features

* ✅ Playwright with TypeScript
* ✅ End-to-End (E2E) Testing
* ✅ Login & Registration Testing
* ✅ API Testing
* ✅ Cookie & Session Management
* ✅ Page Object Model (POM)
* ✅ HTML Test Reports
* ✅ Screenshots on Failure
* ✅ Parallel Test Execution
* ✅ Cross-Browser Testing (Chromium, Firefox, WebKit)
* ✅ Docker & Docker Compose Support
* ✅ Azure DevOps CI/CD Pipeline
* ✅ GitHub Version Control
* ✅ Clean and Scalable Project Structure

---

# 📁 Project Structure

```text
.
├── tests/
├── pages/
├── api/
├── fixtures/
├── utils/
├── playwright.config.ts
├── package.json
├── Dockerfile
├── docker-compose.yml
├── azure-pipelines.yml
└── README.md
```

---

# 🛠 Tech Stack

* Playwright
* TypeScript
* Node.js
* Docker
* Docker Compose
* Azure DevOps Pipelines
* Git
* GitHub

---

# ⚙️ Installation

```bash
git clone https://github.com/your-username/your-repository.git

cd your-repository

npm install
```

---

# ▶️ Run Tests

Run all tests:

```bash
npx playwright test
```

Run Login tests:

```bash
npx playwright test tests/login.spec.ts
```

Run Register tests:

```bash
npx playwright test tests/register.spec.ts
```

Run API tests:

```bash
npx playwright test tests/api
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

---

# 📊 Generate HTML Report

```bash
npx playwright show-report
```

---

# 🐳 Docker

Build Docker image:

```bash
docker build -t playwright-tests .
```

Run Docker container:

```bash
docker run playwright-tests
```

Using Docker Compose:

```bash
docker compose up --build
```

---

# 🚀 Azure DevOps CI/CD

The project includes an Azure DevOps Pipeline that automatically:

* Install dependencies
* Install Playwright browsers
* Run Playwright tests and publish JUnit/HTML reports
* Run the OWASP ZAP passive scan defined in [`security/zap.yaml`](./security/zap.yaml) against a temporary local OWASP Juice Shop container
* Publish the ZAP HTML and JSON reports as the `zap-security-report` artifact

The ZAP job scans only the local Juice Shop container; it does not scan
`BASE_URL` or any external website. Medium, low, and informational alerts are
reported; high or critical alerts fail the security job. The Playwright and
ZAP jobs run independently. This pipeline runs CI checks and does not deploy
the test framework to Azure. Generated reports are published as pipeline
artifacts rather than committed to the repository.

The login test runs only when `LOGIN_EMAIL` and `LOGIN_PASSWORD` are available;
without them, Playwright reports that test as skipped and continues with the
other tests and the independent ZAP job. To run the login test, configure these
values in the CI provider that runs the workflow; secrets configured in one
provider are not shared with another:

* **GitHub Actions:** open the repository's **Settings → Secrets and variables
  → Actions**, create repository secrets named `LOGIN_EMAIL` and
  `LOGIN_PASSWORD`, then rerun the workflow.
* **Azure DevOps:** add `LOGIN_EMAIL` and `LOGIN_PASSWORD` as secret pipeline
  variables (or in a linked variable group).
* **Jenkins:** create Secret text credentials with the IDs
  `playwright-login-email` and `playwright-login-password`.

Use credentials for the account on the configured test site. Do not commit
credentials to pipeline files.

For local runs, set both environment variables before starting the tests:

```bash
export LOGIN_EMAIL="your-test-account-email"
export LOGIN_PASSWORD="your-test-account-password"
npx playwright test
```

---

# 🧪 Test Coverage

### UI Testing

* User Login
* User Registration
* Logout
* Authentication
* Forms Validation
* Navigation

### API Testing

* GET Requests
* POST Requests
* PUT Requests
* DELETE Requests
* Response Validation
* Status Code Validation

### Browser Testing

* Chromium
* Firefox
* WebKit

---

# 📈 Reports

The framework automatically generates:

* HTML Report
* Screenshots on Failure
* Execution Logs

---

# 📌 Best Practices

* Page Object Model (POM)
* Reusable Components
* Clean Code
* TypeScript Support
* Maintainable Architecture
* Fast Execution
* CI/CD Ready

---

# 👨‍💻 Author

**Zakaria Moufid**

QA Automation Engineer

* LinkedIn: https://www.linkedin.com/in/moufid-zakaria-5294082a1/
* GitHub: https://github.com/Moufidzakaria

---

# ⭐ If you like this project

Please consider giving it a ⭐ on GitHub.

It helps support the project and motivates future improvements.
