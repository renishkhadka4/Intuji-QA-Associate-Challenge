describe('AutomationExercise API Testing Suite', () => {

    const baseUrl = 'https://automationexercise.com/api';
  
    // API 1
    it('API 1: GET All Products List', () => {
      cy.request(`${baseUrl}/productsList`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include('products');
      });
    });
  
    // API 2
    it('API 2: POST to All Products List (Invalid Method)', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/productsList`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200); // Actual behavior
        expect(res.body).to.include('This request method is not supported');
      });
    });
  
    // API 3
    it('API 3: GET All Brands List', () => {
      cy.request(`${baseUrl}/brandsList`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include('brands');
      });
    });
  
    // API 4
    it('API 4: PUT to All Brands List (Invalid Method)', () => {
      cy.request({
        method: 'PUT',
        url: `${baseUrl}/brandsList`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.include('This request method is not supported');
      });
    });
  
    // API 5
    it('API 5: POST to Search Product', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/searchProduct`,
        form: true,
        body: { search_product: 'top' },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.include('products');
      });
    });
  
    // API 6
    it('API 6: POST to Search Product (missing parameter)', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/searchProduct`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200); // Site behavior
        expect(res.body).to.include('Bad request, search_product parameter is missing');
      });
    });
  
    // API 7
    it('API 7: Verify Login with valid details', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/verifyLogin`,
        form: true,
        body: {
          email: 'testuser@example.com',
          password: 'testpass123',
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.include('User exists');
      });
    });
  
    // API 8
    it('API 8: Verify Login (missing email)', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/verifyLogin`,
        form: true,
        failOnStatusCode: false,
        body: {
          password: 'testpass123',
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.include('email or password parameter is missing');
      });
    });
  
    // API 9
    it('API 9: DELETE to Verify Login', () => {
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}/verifyLogin`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.include('This request method is not supported');
      });
    });
  
    // API 10
    it('API 10: Verify Login with invalid credentials', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/verifyLogin`,
        form: true,
        failOnStatusCode: false,
        body: {
          email: 'invalid@example.com',
          password: 'wrongpass',
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.include('User not found');
      });
    });
  
    // API 11
    it('API 11: Create/Register User', () => {
      const random = Math.floor(Math.random() * 10000);
      cy.request({
        method: 'POST',
        url: `${baseUrl}/createAccount`,
        form: true,
        body: {
          name: `Test${random}`,
          email: `test${random}@mail.com`,
          password: 'testpass123',
          title: 'Mr',
          birth_date: '1',
          birth_month: 'January',
          birth_year: '1990',
          firstname: 'Test',
          lastname: 'User',
          company: 'TestCorp',
          address1: '123 Main St',
          address2: 'Suite 100',
          country: 'Canada',
          zipcode: '12345',
          state: 'TestState',
          city: 'TestCity',
          mobile_number: '1234567890',
        },
      }).then((res) => {
        expect(res.status).to.eq(200); // Site returns 200 not 201
        expect(res.body).to.include('User created');
      });
    });
  
    // API 12
    it('API 12: Delete User Account', () => {
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}/deleteAccount`,
        form: true,
        body: {
          email: 'testuser@example.com',
          password: 'testpass123',
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.include('Account deleted');
      });
    });
  
    // API 13
    it('API 13: Update User Account', () => {
      cy.request({
        method: 'PUT',
        url: `${baseUrl}/updateAccount`,
        form: true,
        body: {
          name: 'Updated Name',
          email: 'testuser@example.com',
          password: 'testpass123',
          title: 'Mr',
          birth_date: '1',
          birth_month: 'January',
          birth_year: '1990',
          firstname: 'Updated',
          lastname: 'User',
          company: 'UpdatedCorp',
          address1: 'New Address 1',
          address2: 'New Address 2',
          country: 'Canada',
          zipcode: '54321',
          state: 'UpdatedState',
          city: 'UpdatedCity',
          mobile_number: '9876543210',
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.include('User updated');
      });
    });
  
    // API 14
    it('API 14: Get User Detail by Email', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/getUserDetailByEmail?email=testuser@example.com`,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.include('user');
      });
    });
  
  });
  