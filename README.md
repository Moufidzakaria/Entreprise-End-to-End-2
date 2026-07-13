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
* Execute automated tests
* Generate HTML reports
* Publish test artifacts

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
