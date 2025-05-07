class CheckoutPage {
    // Fill out the payment form with provided card details
    fillCardDetails({ name, number, cvc, month, year }) {
      // Ensure the Place Order form is visible before entering card details
      cy.contains('Place Order').click({ force: true });
  
      // Conditionally fill fields (allow partial test cases for negative scenarios)
      if (name) cy.get('[data-qa="name-on-card"]').clear().type(name);
      if (number) cy.get('[data-qa="card-number"]').clear().type(number);
      if (cvc) cy.get('[data-qa="cvc"]').clear().type(cvc);
      if (month) cy.get('[data-qa="expiry-month"]').clear().type(month);
      if (year) cy.get('[data-qa="expiry-year"]').clear().type(year);
    }
  
    //  Submit the payment form
    submitPayment() {
      cy.get('[data-qa="pay-button"]').click({ force: true });
    }
  
    // Clear the shipping address field — useful for negative test cases
    clearAddressField() {
      cy.get('#address1').clear();
    }
  
    //  Check for a generic payment failure message (regex covers multiple variations)
    verifyPaymentFailure() {
      cy.contains(/invalid|failed|error/i).should('exist');
    }
  
    // Validate error message for empty address submission
    verifyBlankAddressError() {
      cy.contains('Address is required').should('exist');
    }
  
    //  Confirm that order placement was successful
    verifyOrderSuccessMessage() {
      cy.contains('Congratulations! Your order has been confirmed!').should('be.visible');
    }
  }
  
  export default new CheckoutPage();
  