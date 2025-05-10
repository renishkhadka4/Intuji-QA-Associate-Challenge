# Intuji QA Associate Challenge – Cypress Test Automation

This repository contains the Cypress-based test automation suite developed as part of the Intuji QA Associate assessment. It is designed to test key user flows on [https://automationexercise.com](https://automationexercise.com), including registration, product filtering, cart and quantity management, session handling, and visual regression.

All scripts follow industry-standard practices such as the Page Object Model (POM), use of dynamic test data, and API request interception to ensure modularity, reusability, and reliability.

---

## Setup Instructions

### Prerequisites

- Node.js (version 14 or above recommended)
- Git

### Steps to Set Up the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/renishkhadka4/Intuji-QA-Associate-Challenge.git
   cd Intuji-QA-Associate-Challenge

2. **Install project dependencies**
   ```bash
   npm install

3. **Open Cypress Test Runner (GUI)**
   ```bash
   npx cypress open

4. **Run all tests headlessly**
   ```bash
   npx cypress run

### Running Specific Tests
To run targeted tests based on functional areas:
1. **Registration Flow**
   ```bash
   npx cypress run --spec "cypress/e2e/registration.cy.js"

2. **Product Filtering Validation**
   ```bash
   npx cypress run --spec "cypress/e2e/product_filtering_validation.cy.js"

3. **Cart and Quantity Management**
   ```bash
   npx cypress run --spec "cypress/e2e/cart_quantity.cy.js"

4. **Checkout and Payment Flows**
   ```bash
    npx cypress run --spec "cypress/e2e/checkout/checkoutFlow.cy.js"
    npx cypress run --spec "cypress/e2e/checkout/paymentFlow.cy.js"

5. **Session Handling (Login, Logout, Re-login**
   ```bash
   npx cypress run --spec "cypress/e2e/session/sessionFlow.cy.js"

6. **Session Handling (Login, Logout, Re-login**
   ```bash
   npx cypress run --spec "cypress/e2e/visual.cy.js"


### Tools and Plugins Used
The following tools and plugins were integrated into the project to enhance test coverage, maintainability, and accuracy:
  - Cypress: End-to-end testing framework.
  - Faker.js: Used to generate dynamic and realistic test data.
  - cypress-image-snapshot: Enables pixel-level visual regression testing.
  - Cypress Intercepts (cy.intercept): Used to stub, wait for, and validate API requests.
  - Page Object Model (POM): Modularizes test logic and enhances reusability.
  - Custom Commands: Defined in cypress/support/commands.js for reusable test actions.

### Known Limitations
- Third-party dependency: Tests rely on the public site automationexercise.com, which may introduce external instability or latency.
- No real payment processing: Payment flow is simulated and does not involve actual transactions.
- Visual testing sensitivity: Minor UI changes (e.g., font rendering differences) may cause visual snapshot tests to fail unexpectedly.
- Test data constraints: Repeated test execution may require cleanup or fresh data to avoid duplication errors.
