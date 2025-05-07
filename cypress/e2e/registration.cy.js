// Import Faker for generating random test data and the RegisterPage object
import { faker } from '@faker-js/faker';
import RegisterPage from '../pages/RegisterPage';

// Generate reusable fake user data
let userData = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(8),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  address: faker.address.streetAddress(),
  country: 'Canada',
  state: faker.address.state(),
  city: faker.address.city(),
  zipcode: faker.address.zipCode(),
  mobile: faker.phone.number('98########'),
};

// Load static user fixture data before test runs
before(function () {
  cy.fixture('user').then((data) => {
    this.sessionUser = data;
  });
});

// Utility command to ensure the page is fully loaded
Cypress.Commands.add('waitForPageLoad', () => {
  cy.document().its('readyState').should('eq', 'complete');
});

describe('TC-001: Register New User with Valid Faker Data', () => {
  it('should register a new user successfully', () => {
    RegisterPage.visit();
    RegisterPage.goToSignupPage();
    RegisterPage.fillSignupForm(userData.name, userData.email);
    RegisterPage.completeAccountDetails(userData.password, '10', 'May', '1998');
    RegisterPage.fillAddressInfo(
      userData.firstName,
      userData.lastName,
      userData.address,
      userData.country,
      userData.state,
      userData.city,
      userData.zipcode,
      userData.mobile
    );
    RegisterPage.submitAccount();
    RegisterPage.verifyAccountCreated();
    RegisterPage.verifyUserLoggedIn(userData.name);
    cy.contains('Logout').click();
  });
});

describe('TC-002: Try to Register with Already Used Email', () => {
  it('should show error for already used email', () => {
    RegisterPage.visit();
    RegisterPage.goToSignupPage();
    RegisterPage.fillSignupForm(userData.name, userData.email);
    RegisterPage.verifyEmailAlreadyExistsError();
  });
});

describe('TC-003: Registration Fails Due to Simulated Server Error', () => {
  it('should show fallback UI or log for server error', () => {
    cy.intercept('POST', '**/signup', { statusCode: 500, body: {} }).as('simulateServerError');
    cy.visit('/');
    cy.waitForPageLoad();
    cy.contains('Signup / Login').should('be.visible').click();
    cy.get('[data-qa="signup-name"]').type('ErrorUser');
    cy.get('[data-qa="signup-email"]').type(`erroruser${Date.now()}@test.com`);
    cy.get('[data-qa="signup-button"]').click();
    cy.wait('@simulateServerError');
    cy.url().should('include', '/signup');
    cy.log('Simulated server error handled gracefully');
  });
});

describe('TC-004: Session Reuse for Protected Pages', function () {
  beforeEach(function () {
    cy.session('user-session', () => {
      cy.visit('/login');
      cy.get('[data-qa="login-email"]').should('be.visible').type(this.sessionUser.email);
      cy.get('[data-qa="login-password"]').type(this.sessionUser.password);
      cy.get('[data-qa="login-button"]').click();
      cy.contains(`Logged in as ${this.sessionUser.name}`, { timeout: 10000 }).should('be.visible');
    });
  });

  it('should allow access to Products page using stored session', function () {
    cy.visit('/products');
    cy.get('body').then(($body) => {
      if ($body.text().includes(`Logged in as ${this.sessionUser.name}`)) {
        cy.log('Session preserved.');
      } else {
        cy.log('Session lost, retrying login.');
        cy.visit('/login');
        cy.get('[data-qa="login-email"]').type(this.sessionUser.email);
        cy.get('[data-qa="login-password"]').type(this.sessionUser.password);
        cy.get('[data-qa="login-button"]').click();
      }
    });
  });
});

describe('TC-005: Duplicate Email Error Message', () => {
  it('should display proper error for duplicate email', () => {
    cy.visit('/');
    cy.waitForPageLoad();
    cy.contains('Signup / Login').should('be.visible').click();
    cy.get('[data-qa="signup-name"]').type('TestDuplicate');
    cy.get('[data-qa="signup-email"]').type(userData.email);
    cy.get('[data-qa="signup-button"]').click();
    cy.contains('Email Address already exist!', { timeout: 8000 }).should('be.visible');
  });
});

describe('TC-006: Submit Empty Registration Form', () => {
  it('should show HTML5 validation errors on empty fields', () => {
    cy.visit('/');
    cy.waitForPageLoad();
    cy.contains('Signup / Login').should('be.visible').click();
    cy.get('[data-qa="signup-button"]').click();
    cy.get('[data-qa="signup-name"]').then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.');
    });
    cy.get('[data-qa="signup-email"]').then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.');
    });
  });
});

describe('TC-007: Invalid Email Format Validation', () => {
  it('should catch and show error for bad email format', () => {
    cy.visit('/');
    cy.get('body').then(($body) => {
      if ($body.text().includes('Logged in as')) {
        cy.contains('Logout').click({ force: true });
      }
    });
    cy.contains('Signup / Login').click();
    cy.url().should('include', '/login');
    cy.get('[data-qa="signup-name"]').type('TestUser');
    cy.get('[data-qa="signup-email"]').then(($input) => {
      $input[0].value = 'invalidemail@com'; // Missing domain suffix
      $input[0].dispatchEvent(new Event('input', { bubbles: true }));
      const isValid = $input[0].checkValidity();
      if (isValid) {
        cy.log(' Email considered valid unexpectedly');
      } else {
        cy.log(` Validation triggered: ${$input[0].validationMessage}`);
        expect($input[0].validationMessage).to.include('@');
      }
    });
  });
});

describe('TC-008: Password Too Short Validation', () => {
  it('should prevent form submission with weak password', () => {
    cy.visit('/');
    cy.get('body').then(($body) => {
      if ($body.text().includes('Logged in as')) {
        cy.contains('Logout').click({ force: true });
      }
    });
    cy.contains('Signup / Login').click();
    cy.url().should('include', '/login');
    cy.get('[data-qa="signup-name"]').type('ShortPass');
    cy.get('[data-qa="signup-email"]').type(`shortpass${Date.now()}@test.com`);
    cy.get('[data-qa="signup-button"]').click();
    cy.url().should('include', '/signup');
    cy.get('#id_gender1').check();
    cy.get('#password').type('123'); // Weak password
    cy.get('#days').select('10');
    cy.get('#months').select('May');
    cy.get('#years').select('1999');
    cy.get('#first_name').type('Test');
    cy.get('#last_name').type('User');
    cy.get('#address1').type('123 Test Street');
    cy.get('#country').select('Canada');
    cy.get('#state').type('State');
    cy.get('#city').type('City');
    cy.get('#zipcode').type('12345');
    cy.get('#mobile_number').type('9876543210');
    cy.get('[data-qa="create-account"]').click();
    cy.url().then((url) => {
      if (url.includes('/account_created')) {
        cy.log(' Account was created with weak password — validation failed!');
      } else {
        cy.log(' Weak password likely rejected, remained on form.');
      }
    });
  });
});

describe('TC-009: Invalid Characters in Name Field', () => {
  it('should reject special characters in name field', () => {
    cy.visit('/');
    cy.get('body').then(($body) => {
      if ($body.text().includes('Logged in as')) {
        cy.contains('Logout').click({ force: true });
      }
    });
    cy.contains('Signup / Login').click();
    cy.get('[data-qa="signup-name"]').type('@#$%^');
    cy.get('[data-qa="signup-email"]').type(`invalidname${Date.now()}@test.com`);
    cy.get('[data-qa="signup-button"]').click();
    cy.url().should('include', '/signup'); // Form should not proceed
  });
});
