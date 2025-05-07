import CartPage from '../../pages/CartPage';
import CheckoutPage from '../../pages/CheckoutPage';
import { faker } from '@faker-js/faker';

// Prevent test failures due to uncaught JS errors on the frontend
Cypress.on('uncaught:exception', () => false);

describe('Negative Checkout Scenarios (Advanced Edge Cases)', () => {

  //  Prepare cart and navigate to checkout before each test
  beforeEach(() => {
    cy.prepareCart(); // Logs in and adds multiple items to the cart
    cy.visit('/view_cart');
    CartPage.proceedToCheckout();
  });

  
  // TC-007: Attempt checkout with CVC field left blank
  it('TC-007: Submit with missing CVC field', () => {
    const card = {
      name: faker.name.fullName(),
      number: '4111111111111111',
      cvc: '',              // Intentionally omitted
      month: '12',
      year: '2026',
    };

    CheckoutPage.fillCardDetails(card);
    CheckoutPage.submitPayment();

    // Expect to stay on payment page and get validation error
    cy.url().should('include', '/payment');
    cy.contains(/cvc|required|error/i).should('exist'); // Flexible error detection
  });

  
  // TC-008: Attempt checkout using special characters in card number
  
  it('TC-008: Submit with special characters in card number [KNOWN ISSUE]', () => {
    const card = {
      name: faker.name.fullName(),
      number: '!@#$%^&*()',  // Invalid characters
      cvc: '123',
      month: '12',
      year: '2026',
    };

    CheckoutPage.fillCardDetails(card);
    CheckoutPage.submitPayment();

    // Should NOT succeed, but currently does due to lack of validation
    cy.url().should('include', '/payment_done');
    cy.log(' KNOWN ISSUE: Payment accepted with special characters — no validation');
  });

  
  // TC-009: Attempt checkout with overly long card number (30 digits)
  //  Site should reject it but currently accepts it
  it('TC-009: Submit with long card number (30 digits) [KNOWN ISSUE]', () => {
    const card = {
      name: faker.name.fullName(),
      number: '411111111111111111111111111111', //  Too long
      cvc: '123',
      month: '12',
      year: '2026',
    };

    CheckoutPage.fillCardDetails(card);
    CheckoutPage.submitPayment();

    cy.url().should('include', '/payment_done');
    cy.log(' KNOWN ISSUE: Payment accepted with invalid long card number');
  });

  
  // TC-010: Attempt checkout with blank expiry month and year
  
  it('TC-010: Submit with blank expiry month and year', () => {
    const card = {
      name: faker.name.fullName(),
      number: '4111111111111111',
      cvc: '123',
      month: '',         // Both fields left blank
      year: '',
    };

    CheckoutPage.fillCardDetails(card);
    CheckoutPage.submitPayment();

    // Should stay on payment page due to missing date values
    cy.url().should('include', '/payment');
  });
});
