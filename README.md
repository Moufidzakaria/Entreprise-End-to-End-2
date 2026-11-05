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
* ✅ Chromium Testing in CI
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
├── utils/
├── security/
├── .github/workflows/
├── playwright.config.ts
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
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

npm ci
```

---

# ▶️ Run Tests

Run all tests:

```bash
npm test
```

Run the same suite in CI mode:

```bash
npm run test:ci
```

Run Login tests:

```bash
npx playwright test tests/login.spec.ts
```

Run Register tests:

```bash
npx playwright test tests/register.spec.ts
```

Run UI end-to-end tests:

```bash
npm run test:e2e
```

Run API tests:

```bash
npm run test:api
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

# 🔐 OWASP ZAP Security Scan

GitHub Actions and Azure DevOps run an OWASP ZAP **passive baseline scan**
against a temporary OWASP Juice Shop container. The scan crawls the local
training target and checks the observed responses; it does not run active
attack rules or scan the external `BASE_URL` used by the Playwright tests.

The scan plan is maintained in [`security/zap.yaml`](./security/zap.yaml). Both
CI providers publish the HTML and JSON reports in a `zap-security-report`
artifact. Low, medium, and informational alerts are reported; high or critical
alerts fail the ZAP job. The ZAP job runs independently of the Playwright job.

To run the same scan locally, start the Juice Shop training target:

```bash
docker run --detach --name juice-shop --network host bkimminich/juice-shop:latest
```

Wait until `http://127.0.0.1:3000` responds, then run ZAP from the repository
root:

```bash
mkdir -p security/reports
cp security/zap.yaml security/reports/zap.yaml
docker run --rm --network host \
  -v "$PWD/security/reports:/zap/wrk/:rw" \
  ghcr.io/zaproxy/zaproxy:stable \
  zap.sh -cmd -config proxy.port=18080 -autorun /zap/wrk/zap.yaml
```

The generated reports are written under `security/reports/`. Stop the local
training container when finished:

```bash
docker rm --force juice-shop
```

Only run security scans against systems you own or are explicitly authorized
to test. This configuration targets the local Juice Shop container only.

---

# 🚀 CI Pipelines

GitHub Actions ([`.github/workflows/playwright.yml`](./.github/workflows/playwright.yml))
and Azure DevOps ([`azure-pipelines.yml`](./azure-pipelines.yml)) automatically:

* Install Node.js dependencies and Chromium.
* Run Playwright tests and publish reports and failure artifacts.
* Run the OWASP ZAP passive scan defined in [`security/zap.yaml`](./security/zap.yaml) against a temporary local OWASP Juice Shop container.
* Publish the ZAP HTML and JSON reports as the `zap-security-report` artifact.

The ZAP job scans only the local Juice Shop container; it does not scan
`BASE_URL` or any external website. Medium, low, and informational alerts are
reported; high or critical alerts fail the security job. The Playwright and
ZAP jobs run independently. These pipelines run CI checks; they do not deploy
the test framework or application to Azure. Generated reports are published as
pipeline artifacts rather than committed to the repository.

The UI-login test depends on an account on a public demo website. Both CI
pipelines enable it by default and skip it if `LOGIN_EMAIL` and
`LOGIN_PASSWORD` are not configured. These must be credentials for an
existing account on the UI test site configured by `BASE_URL`
(`https://automationexercise.com` by default); credentials for the separate
Practice Software Testing API are not valid for this UI login. Configure the
values in the CI provider that runs the workflow; secrets configured in one
provider are not shared with another:

* **GitHub Actions:** open the repository's **Settings → Secrets and variables
  → Actions**, create repository secrets named `LOGIN_EMAIL` and
  `LOGIN_PASSWORD`, then rerun the workflow.
* **Azure DevOps:** add `LOGIN_EMAIL` and `LOGIN_PASSWORD` as secret pipeline
  variables (or in a linked variable group). The pipeline sets
  `RUN_UI_LOGIN_TEST=true` by default. If a pipeline UI variable with the same
  name already exists, change it to `true` or remove it so it does not override
  the YAML value.
* **Jenkins:** create Secret text credentials with the IDs
  `playwright-login-email` and `playwright-login-password`.

Do not commit credentials or `.env` files. CI reads credentials only from
pipeline secrets; local `.env` files are loaded only for non-CI runs.

The successful API-login test is separate from the UI-login test and is also
opt-in: set `RUN_API_LOGIN_TEST=true` and configure `API_LOGIN_EMAIL` and
`API_LOGIN_PASSWORD` as secrets for a valid Practice Software Testing API
account. By default this test is skipped because the public demo API can lock
accounts. A `401 Unauthorized` response
means the API rejected the submitted credentials; do not treat it as a
successful login. Without these API secrets, the positive API-login test is
skipped while the invalid-credentials test continues to verify rejection.
The invalid-credentials test uses a unique, non-existing email so repeated CI
runs do not lock a shared demo account. HTTP `423 Locked` on the successful
login test indicates the configured API account is locked; use an unlocked
test account before rerunning.
In Azure DevOps, add `API_LOGIN_EMAIL` and `API_LOGIN_PASSWORD` as secret
variables under **Pipelines → Edit → Variables** (or in a linked variable
group), and set the non-secret `RUN_API_LOGIN_TEST` variable to `true`. In
GitHub Actions, configure the API credentials under **Settings → Secrets and
variables → Actions** and edit the workflow opt-in flag when you want to run
the test. These API credentials are separate from the UI login secrets.

Some UI and API tests depend on public demo services. If those services return
HTTP 429 or 5xx, or display their queue-full page, the affected test is reported
as skipped rather than timing out; inspect the Playwright report and rerun when
the service is available.

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
