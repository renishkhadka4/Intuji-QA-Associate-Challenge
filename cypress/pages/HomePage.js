class HomePage {
    verifyLoggedIn(username) {
        cy.get('body', { timeout: 10000 })
          .contains(new RegExp(`Logged in as\\s*${username}`, 'i'))
          .should('be.visible');
      }
      
  
    logout() {
      cy.contains('Logout').click({ force: true });
    }
  }
  
  export default new HomePage();
  