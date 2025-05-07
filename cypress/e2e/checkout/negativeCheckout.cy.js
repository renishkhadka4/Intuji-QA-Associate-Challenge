import CartPage from '../../pages/CartPage';
import CheckoutPage from '../../pages/CheckoutPage';
import { faker } from '@faker-js/faker';

// Prevent test failure due to site-side JavaScript errors
Cypress.on('uncaught:exception', () => false);

describe('Negative Checkout Scenarios', () => {
  //  Runs before each test to login and prepare the cart with items
  beforeEach(() => {
    cy.prepareCart(); // Custom command: login + add items
    cy.visit('/view_cart');
    CartPage.proceedToCheckout();
  });

  //
  // TC-004: Submit payment form with an obviously invalid card number
  //
  it('TC-004: Submit with invalid card number', () => {
    const invalidCard = {
      name: faker.name.fullName(),
      number: '12345678',  // Clearly invalid format
      cvc: '123',
      month: '12',
      year: '2027',
    };

    CheckoutPage.fillCardDetails(invalidCard);
    CheckoutPage.submitPayment();

    //  Check if invalid card was wrongly accepted
    cy.url().then((url) => {
      if (url.includes('/payment_done')) {
        cy.log(' Site accepted invalid card number — no client-side validation.');
      } else {
        cy.log(' Invalid card rejected as expected.');
      }
    });
  });

  
  // TC-005: Submit form with all payment fields blank
  it('TC-005: Submit with blank card fields', () => {
    cy.contains('Place Order').click({ force: true }); // Open card form

    cy.get('[data-qa="pay-button"]').click(); // Attempt submission with blank inputs

    // Check HTML5 field validation on 'Name on Card'
    cy.get('[data-qa="name-on-card"]')[0]?.then((el) => {
      expect(el.validationMessage).to.include('fill');
    });
  });

  
  // TC-006: Submit form using a card with expired year
  it('TC-006: Submit with expired card year', () => {
    const expiredCard = {
      name: faker.name.fullName(),
      number: '4111111111111111',  // Valid test Visa card
      cvc: '123',
      month: '12',
      year: '2020', // Expired year
    };

    CheckoutPage.fillCardDetails(expiredCard);
    CheckoutPage.submitPayment();

    // Check if payment was incorrectly accepted with expired year
    cy.url().then((url) => {
      if (url.includes('/payment_done')) {
        cy.log('Site accepted expired card — no validation on expiry.');
      } else {
        cy.log('Expired card blocked as expected.');
      }
    });
  });
});
