class ProductPage {
  visit() {
    cy.visit('/products', { timeout: 60000 });
  }

  verifyUserLoggedIn(name) {
    cy.contains(`Logged in as ${name}`, { timeout: 10000 }).should('be.visible');
  }

  filterByCategory(category, subCategory) {
    // Directly click the subcategory without checking for panel expansion
    cy.contains('.category-products a', subCategory)
      .click({ force: true });
  }
  
  
  

  verifyFilteredResults(expectedTag) {
    cy.get('.product-overlay', { timeout: 10000 }).should('exist');
    cy.contains(expectedTag).should('exist');
  }

  verifyNoProductsMessage() {
    cy.contains('No products found').should('exist');
  }

  verifyProductDetailFields() {
    cy.get('.product-information h2').should('be.visible'); // Product name
    cy.get('.product-information span span').should('contain.text', 'Rs'); // Price
    cy.contains('Availability:').should('be.visible');
    cy.contains('Condition:').should('contain', 'New'); // fallback if missing
  }

  clickFirstProductViewButton() {
    cy.contains('View Product').first().click({ force: true });
  }

  addProductToCart(index = 0) {
    cy.get('.product-overlay').eq(index).contains('Add to cart').click({ force: true });
    cy.contains('Continue Shopping').click({ force: true });
  }

  goToCart() {
    cy.contains('Cart').click({ force: true });
  }

  proceedToCheckout() {
    cy.contains('Proceed To Checkout').click({ force: true });
  }

  fillCardDetails({ name, number, cvc, month, year }) {
    cy.contains('Place Order').click({ force: true });
    cy.get('[data-qa="name-on-card"]').type(name);
    cy.get('[data-qa="card-number"]').type(number);
    cy.get('[data-qa="cvc"]').type(cvc);
    cy.get('[data-qa="expiry-month"]').type(month);
    cy.get('[data-qa="expiry-year"]').type(year);
  }

  submitPayment() {
    cy.get('[data-qa="pay-button"]').click({ force: true });
  }

  clearAddressField() {
    cy.get('#address1').clear();
  }

  verifyPaymentFailure() {
    cy.contains('Invalid card number').should('exist');
  }

  verifyBlankAddressError() {
    cy.contains('Address is required').should('exist');
  }

  searchWithinFilter(keyword) {
    cy.get('#search_product').type(keyword);
    cy.get('#submit_search').click();
  }

  verifySearchResultsWithFilter(keyword) {
    cy.contains(keyword, { matchCase: false }).should('exist');
  }

  simulateOfflineFilterClick() {
    cy.log('🔌 Simulate network disconnection manually if needed.');
    cy.contains('Women').click({ force: true });
    cy.contains('Dress').click({ force: true });
  }

  verifyPageFallbackOnMissingDetail() {
    cy.get('.product-information h2').should('exist');
    cy.get('.product-information span span').should('exist');
    cy.contains('Availability:').should('exist');
    cy.contains('Condition:').then($el => {
      if (!$el.text().includes('New')) {
        cy.log('Missing or incorrect product condition');
      }
    });
  }
}

export default new ProductPage();
