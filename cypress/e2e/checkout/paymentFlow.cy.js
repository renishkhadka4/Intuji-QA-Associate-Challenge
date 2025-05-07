import CartPage from '../../pages/CartPage';
import CheckoutPage from '../../pages/CheckoutPage';
import { faker } from '@faker-js/faker';

//  Prevent Cypress from failing on frontend JavaScript errors
Cypress.on('uncaught:exception', () => false);

describe('Positive Checkout Scenarios', () => {
  //  Generate dynamic cardholder name using Faker
  const validCard = {
    name: faker.name.fullName(),
    number: '4111111111111111',  // Commonly used Visa test card
    cvc: '123',
    month: '12',
    year: '2027',
  };

  //  Reuse logic before every test to login and prepare cart
  beforeEach(() => {
    cy.prepareCart(); // Login and add products to cart
    cy.visit('/view_cart'); // Navigate to cart page
    CartPage.proceedToCheckout(); // Proceed to checkout page
  });

  
  // TC-001: Complete an order successfully with valid card data
  
  it('TC-001: Complete order with valid card details', () => {
    CheckoutPage.fillCardDetails(validCard);
    CheckoutPage.submitPayment();

    // Optional wait to allow UI to render confirmation
    cy.wait(2000);
    CheckoutPage.verifyOrderSuccessMessage();
  });

  
  // TC-002: Validate success message visually using snapshot
  it('TC-002: Validate success message visually', () => {
    CheckoutPage.fillCardDetails(validCard);
    CheckoutPage.submitPayment();
    CheckoutPage.verifyOrderSuccessMessage();

    // Take visual snapshot for regression testing
    cy.matchImageSnapshot('checkout-success-message');
  });

  
  // TC-003: Ensure payment form appears after clicking "Place Order"
  it('TC-003: Verify card form appears on Place Order', () => {
    cy.contains('Place Order').click({ force: true });

    // Confirm card form fields are visible
    cy.get('[data-qa="name-on-card"]').should('be.visible');
    cy.get('[data-qa="card-number"]').should('be.visible');
    cy.get('[data-qa="cvc"]').should('be.visible');
  });
});
