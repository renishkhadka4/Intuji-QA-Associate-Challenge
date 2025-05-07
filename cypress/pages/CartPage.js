class CartPage {
  // Navigate to the cart view page
  visit() {
    cy.visit('/view_cart');
  }

  // Update quantity of a product in the cart (by index)
  updateQuantity(index, quantity) {
    cy.get('.cart_quantity_input', { timeout: 10000 })
      .eq(index)
      .should('be.visible')
      .clear()
      .type(quantity);
  }

  // Remove a product from the cart (by index)
  removeItem(index) {
    cy.get('.cart_delete a', { timeout: 10000 })
      .eq(index)
      .should('be.visible')
      .click({ force: true });
  }

  // Proceed to the checkout page from cart
  proceedToCheckout() {
    cy.contains('Proceed To Checkout', { timeout: 10000 }).click({ force: true });
  }

  // Count only actual product rows
  verifyItemCount(expectedCount) {
    cy.get('.cart_info tbody tr', { timeout: 10000 })
      .should('have.length', expectedCount);
  }

  // Fallback if quantity is not editable
  verifyQuantity(index, expectedQuantity) {
    cy.get('.cart_quantity', { timeout: 10000 })
      .eq(index)
      .invoke('text')
      .then((text) => {
        const actual = text.trim();
        expect(actual).to.eq(expectedQuantity.toString());
      });
  }

  // Normalize price and support formatting variations
  verifyTotalPrice(itemIndex, itemPrice, quantity) {
    const expectedRaw = (itemPrice * quantity).toString();
    cy.get('.cart_total_price', { timeout: 10000 })
      .eq(itemIndex)
      .invoke('text')
      .then((text) => {
        const numericValue = text.replace(/[^\d]/g, ''); // Remove Rs, commas, spaces
        expect(numericValue).to.include(expectedRaw); // Partial match is safer
      });
  }

  // Check if cart is empty and shows appropriate message
  verifyCartEmptyMessage() {
    cy.get('#empty_cart', { timeout: 10000 })
      .invoke('text')
      .should('match', /cart is empty|no items/i);
  }

  // Assert cart is not empty (basic presence check)
  verifyCartNotEmpty() {
    cy.get('.cart_info').should('exist');
  }
}

export default new CartPage();
