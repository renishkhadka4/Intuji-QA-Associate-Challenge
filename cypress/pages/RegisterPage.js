class RegisterPage {
    visit() {
      cy.visit('https://automationexercise.com');
    }
  
    goToSignupPage() {
      // Wait for the link to be visible before clicking
      cy.contains('Signup / Login', { timeout: 8000 }).should('be.visible').click();
    }
  
    fillSignupForm(name, email) {
      cy.get('[data-qa="signup-name"]').should('be.visible').type(name);
      cy.get('[data-qa="signup-email"]').should('be.visible').type(email);
      cy.get('[data-qa="signup-button"]').click();
    }
  
    completeAccountDetails(password, day, month, year) {
      cy.get('#id_gender1').check();
      cy.get('#password').type(password);
      cy.get('#days').select(day);
      cy.get('#months').select(month);
      cy.get('#years').select(year);
    }
  
    fillAddressInfo(firstName, lastName, address, country, state, city, zipcode, mobile) {
      cy.get('#first_name').type(firstName);
      cy.get('#last_name').type(lastName);
      cy.get('#address1').type(address);
      cy.get('#country').select(country);
      cy.get('#state').type(state);
      cy.get('#city').type(city);
      cy.get('#zipcode').type(zipcode);
      cy.get('#mobile_number').type(mobile);
    }
  
    submitAccount() {
      cy.get('[data-qa="create-account"]').click();
    }
  
    verifyAccountCreated() {
      cy.contains('Account Created!', { timeout: 8000 }).should('be.visible');
      cy.get('[data-qa="continue-button"]').click();
    }
  
    verifyUserLoggedIn(name) {
      cy.contains(`Logged in as ${name}`, { timeout: 8000 }).should('be.visible');
    }
  
    verifyEmailAlreadyExistsError() {
      cy.contains('Email Address already exist!', { timeout: 5000 })
        .should('be.visible')
        .then(() => {
          cy.log(' Duplicate email error shown.');
        });
    }
  
    verifyDuplicateEmailError() {
      cy.get('form .signup-form')
        .find('p')
        .should('have.text', 'Email Address already exist!');
    }
  }
  
  export default new RegisterPage();
  