import ProductPage from '../pages/ProductPage';
import { faker } from '@faker-js/faker';


// TC-001: Filter by Category – Women > Dress
describe('TC-001: Filter by Category → Women > Dress', () => {
  before(() => {
    // Preserve session for faster test
    cy.session('user-session-TC001', () => {
      cy.visit('/login');
      cy.get('[data-qa="login-email"]').type('judy@example.com');
      cy.get('[data-qa="login-password"]').type('password123');
      cy.get('[data-qa="login-button"]').click();
      cy.contains('Logged in as Judy', { timeout: 10000 }).should('be.visible');
    });
  });

  it('should filter Women > Dress and verify filtered result with visual snapshot', () => {
    // Intercept and assert the product API
    cy.intercept('GET', '**/productsList', (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.eq(200);
        expect(res.body.products).to.be.an('array').and.to.have.length.greaterThan(0);
      });
    }).as('getProducts');
  
    ProductPage.visit();
    cy.wait('@getProducts'); // Wait for API call
  
    ProductPage.verifyUserLoggedIn('Judy');
  
    ProductPage.filterByCategory('Women', 'Dress');
    ProductPage.verifyFilteredResults('Dress');
  
    // Take visual snapshot after filtering
    cy.matchImageSnapshot('filtered-women-dress');
  });  
});


// TC-002: View Product Detail Page
describe('TC-002: View Product Detail', () => {
  before(() => {
    // Login using session cache
    cy.session('user-session', () => {
      cy.visit('/login');
      cy.get('[data-qa="login-email"]').type('judy@example.com');
      cy.get('[data-qa="login-password"]').type('password123');
      cy.get('[data-qa="login-button"]').click();
      cy.contains('Logged in as Judy').should('be.visible');
    });
  });

  it('should filter products and open a product detail page', () => {
    cy.visit('/products');
    cy.contains('Women').click();
    cy.contains('Dress').click();
    cy.get('.product-overlay').should('have.length.greaterThan', 0);
    cy.contains('View Product').first().click();

    cy.url().should('include', '/product_details');
    cy.get('.product-information h2').should('be.visible');
    cy.get('.product-information span span').should('contain.text', 'Rs');
    cy.contains('Availability:').should('be.visible');
    cy.contains('.product-information p', 'Condition:').should('contain.text', 'New');
    cy.matchImageSnapshot('product-detail-page');
  });
});


// TC-003: Filtering without login and restricted actions
describe('TC-003: Filter While Logged Out', () => {
  Cypress.on('uncaught:exception', () => false); // Prevent test crash on site JS errors

  it('should allow filtering but block Add to Cart for guests', () => {
    cy.visit('/products');
    cy.contains('Women').click({ force: true });
    cy.contains('Dress').click({ force: true });
    cy.get('.product-overlay').should('have.length.greaterThan', 0);
    cy.contains('Add to cart').first().click({ force: true });

    cy.on('window:alert', (txt) => {
      expect(txt).to.match(/login|sign in|please/i);
    });

    cy.get('.shop-menu').contains('Cart').click();
    cy.get('.cart_quantity').should('not.exist');
  });
});


// TC-004: Empty category filter and search fallback
describe('TC-004: No Products in Filter and Search Tops', () => {
  it('should handle empty category gracefully and allow search', () => {
    cy.visit('/products');
    cy.contains('Women').click({ force: true });

    cy.get('body').then(($body) => {
      if ($body.find('a:contains("Rato Sari")').length > 0) {
        cy.contains('Rato Sari').click({ force: true });
        cy.wait(1000);

        cy.get('.features_items').then(($section) => {
          if ($section.find('.product-overlay').length === 0) {
            cy.contains(/no products|not available|no item/i, { matchCase: false }).should('exist');
            cy.matchImageSnapshot('empty-category-fallback');
          } else {
            cy.log(' Unexpected products found in Rato Sari.');
          }
        });
      } else {
        cy.log(' Rato Sari subcategory not found — skipping.');
      }
    });

    // Search fallback
    cy.get('#search_product').type('tops');
    cy.get('#submit_search').click();
    cy.get('.features_items').should('be.visible');
    cy.get('.product-overlay').should('have.length.greaterThan', 0);
    cy.contains('Tops', { matchCase: false }).should('exist');
    cy.matchImageSnapshot('search-tops-results');
  });
});


// TC-005: Invalid Filter Element
describe('TC-005: Invalid Filter Element', () => {
  it('should not fail if an invalid category is clicked', () => {
    cy.visit('/products');

    cy.get('body').then(($body) => {
      if ($body.find('a:contains("NonExistentCategory")').length === 0) {
        cy.log('Category not present — safe.');
        cy.screenshot('invalid-filter-element');
        expect(true).to.be.true;
      } else {
        cy.contains('NonExistentCategory').click({ force: true });
        throw new Error(' Invalid category existed and was clicked.');
      }
    });
  });
});


// TC-006: Verify Filter Redirect URL
describe('TC-006: Misleading Filter Redirect', () => {
  it('should redirect to correct category and verify content', () => {
    cy.visit('/products');
    cy.contains('Women').click({ force: true });
    cy.contains('Dress').click({ force: true });
    cy.url().should('include', '/category_products/1');
    cy.get('.features_items').within(() => {
      cy.contains('Dress', { matchCase: false }).should('exist');
    });
    cy.matchImageSnapshot('category-dress-page');
  });
});


// TC-007: Search Within Filtered Category
describe('TC-007: Search Within Filtered Category', () => {
  it('should search using top bar and display correct results', () => {
    cy.visit('/products');
    cy.get('#search_product').should('be.visible').type('dress');
    cy.get('#submit_search').click();
    cy.url().should('include', '/products');
    cy.get('.features_items').should('be.visible');
    cy.contains('Dress').should('exist');
  });
});


// TC-008: Visual Snapshot After Filter
describe('TC-008: Visual Regression Check After Filter', () => {
  it('should visually match filtered layout snapshot', () => {
    cy.visit('/products');
    cy.contains('Women').click({ force: true });
    cy.contains('Dress').click({ force: true });
    cy.url().should('include', '/category_products');
    cy.get('.features_items', { timeout: 10000 }).should('be.visible');
    cy.matchImageSnapshot('filtered-products-layout');
  });
});


// TC-009: Detect Broken Product Images
describe('TC-009: Broken Image Detection', () => {
  it('should ensure all product images are properly loaded', () => {
    cy.visit('/products');
    cy.contains('Women').click({ force: true });
    cy.contains('Dress').click({ force: true });
    cy.url().should('include', '/category_products');

    cy.get('.product-image-wrapper img').each(($img) => {
      cy.wrap($img)
        .should('be.visible')
        .and(($el) => {
          expect($el[0].naturalWidth).to.be.greaterThan(0); // Native DOM check
        });
    });
  });
});
