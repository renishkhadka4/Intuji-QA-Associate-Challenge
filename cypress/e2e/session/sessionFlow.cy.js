Cypress.on('uncaught:exception', () => false); // Prevent Cypress from failing due to app-side JS errors


// Session and Login/Logout Flow - Part 1
describe('Session and Login/Logout Flow Tests', () => {
  const email = 'judy@example.com';
  const password = 'password123';

  // Go to login page before each test
  beforeEach(() => {
    cy.visit('/login');
  });

  
  // TC-001: Logout and log back in with same user
  it('TC-001: Logout and Login with Same User', () => {
    cy.login(email, password);
    cy.contains('Logged in as').should('contain', 'Judy');
    cy.contains('Logout').click();
    cy.url().should('include', '/login');

    // Re-login and verify
    cy.login(email, password);
    cy.contains('Logged in as').should('contain', 'Judy');
  });

  
  // TC-002: Ensure cart items persist after logout and login
  it('TC-002: Cart Persistence After Re-login', () => {
    cy.login(email, password);
    cy.visit('/products');
    cy.get('.product-overlay').first().contains('Add to cart').click({ force: true });
    cy.contains('Continue Shopping').click();
    cy.contains('Logout').click();

    // Login again and verify cart
    cy.login(email, password);
    cy.visit('/view_cart');
    cy.get('.cart_info .cart_description').should('exist');
  });

  
  // TC-004: Simulate session expiration and attempt access to protected page
  it('TC-004: Session Expiry Behavior', () => {
    cy.login(email, password);
    cy.contains('Logged in as').should('exist');

    // Manually clear session data
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => win.sessionStorage.clear());

    // Try accessing a protected page
    cy.visit('/checkout');

    // Verify session is lost (UI no longer shows user)
    cy.contains('Logged in as').should('not.exist');
  });

  
  // TC-005: Attempt login with invalid credentials
  it('TC-005: Login with Invalid Credentials', () => {
    cy.get('[data-qa="login-email"]').type('wrong@example.com');
    cy.get('[data-qa="login-password"]').type('wrongpass');
    cy.get('[data-qa="login-button"]').click();

    // Verify error message is shown
    cy.contains('Your email or password is incorrect!').should('exist');
  });
});



// Session and Login Flow - Part 2
describe('Session and Login Flow Tests (Part 2)', () => {
  const email = 'judy@example.com';
  const password = 'password123';

  
  // TC-006: After login, redirect back to last visited page
  it('TC-006: Login Redirection to Last Page', () => {
    cy.visit('/products');
    cy.url().then((urlBeforeLogout) => {
      cy.login(email, password);
      cy.contains('Logout').click();
      cy.login(email, password);
      cy.url().should('eq', urlBeforeLogout);
    });
  });

  
  // TC-007: Verify login button disappears post-login
  it('TC-007: Login Button Hidden Post-Login', () => {
    cy.login(email, password);
    cy.contains('Signup / Login').should('not.exist');
    cy.contains('Logout').should('be.visible');
    cy.contains('Logged in as').should('be.visible');
  });

  
  // TC-008: Repeated logout/login cycles should work reliably
  it('TC-008: Multiple Logout/Login Cycles', () => {
    for (let i = 0; i < 3; i++) {
      cy.login(email, password);
      cy.contains('Logged in as').should('be.visible');
      cy.contains('Logout').click();
      cy.url().should('include', '/login');
    }
  });

  
  // TC-009: Attempt to access logout route when not logged in
  it('TC-009: Logout Without Being Logged In', () => {
    cy.clearCookies();
    cy.visit('/logout');
    cy.url().should('include', '/login'); // Should redirect safely
  });

  
  // TC-010: Try logging in with a deleted/nonexistent user
  it('TC-010: Login With Deleted User', () => {
    cy.visit('/login');
    cy.get('[data-qa="login-email"]').type('deleted@example.com');
    cy.get('[data-qa="login-password"]').type('somepassword');
    cy.get('[data-qa="login-button"]').click();

    // Verify error feedback
    cy.contains('Your email or password is incorrect!').should('be.visible');
  });

  
  // TC-011: Rapid login/logout loop (stress test for session handling)
  it('TC-011: Rapid Login/Logout Loop Stress Test', () => {
    const cycles = 5;
    for (let i = 0; i < cycles; i++) {
      cy.login(email, password);
      cy.contains('Logged in as').should('be.visible');
      cy.contains('Logout').click();
      cy.url().should('include', '/login');
    }
  });
});
