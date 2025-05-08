// Import and initialize the image snapshot command for visual regression testing
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';
addMatchImageSnapshotCommand();

//Custom Command: Login

Cypress.Commands.add('login', (email, password) => {
  cy.visit('https://automationexercise.com/login');
  cy.get('[data-qa="login-email"]').type(email);
  cy.get('[data-qa="login-password"]').type(password);
  cy.get('[data-qa="login-button"]').click();

  // Verify login success by checking for user greeting
  cy.contains('Logged in as', { timeout: 10000 }).should('be.visible');
});


  //Custom Command: prepareCart
  //Logs in as a test user, navigates to products, and adds two items (Women > Dress, Men > Tshirts) to cart.
  //Useful for pre-checkout flows and multi-product cart validation.
 
Cypress.Commands.add('prepareCart', () => {
  // Log in with predefined test credentials
  cy.login('judy@example.com', 'password123');

  // Navigate to products page
  cy.visit('/products');

  // Wait for navigation menu to load completely
  cy.get('.nav.navbar-nav', { timeout: 10000 }).should('be.visible');

  // Add a Women's Dress to the cart
  cy.contains('Women', { timeout: 10000 }).should('be.visible').click({ force: true });
  cy.contains('Dress', { timeout: 10000 }).should('be.visible').click({ force: true });
  cy.get('.product-overlay').eq(0).contains('Add to cart').click({ force: true });
  cy.contains('Continue Shopping').click({ force: true });

  // Add a Men's Tshirt to the cart
  cy.contains('Men', { timeout: 10000 }).should('be.visible').click({ force: true });
  cy.contains('Tshirts', { timeout: 10000 }).should('be.visible').click({ force: true });
  cy.get('.product-overlay').eq(0).contains('Add to cart').click({ force: true });
  cy.contains('Continue Shopping').click({ force: true });
});

  //Custom Command: verifyProduct
 //Verifies that a product with the given tag/label is present in the overlay.

Cypress.Commands.add('verifyProduct', (tag) => {
  cy.get('.product-overlay').should('exist');
  cy.contains(tag).should('exist');
});


Cypress.Commands.add('verifyProductDetails', () => {
  cy.get('.product-information h2').should('be.visible'); // Product title
  cy.get('.product-information span span').should('contain.text', 'Rs'); // Price format
  cy.contains('Availability:').should('be.visible'); // Stock availability
  cy.contains('.product-information p', 'Condition:').should('contain.text', 'New'); // Product condition
});

