describe('Navbar Sign-In Flow - Successful Sign-In', () => {
  // Define test data
  const validUser = {
    email: 'thando@gmail.com',
    password: 'Password123!',
  };

  beforeEach(() => {
    // Visit the homepage where the Navbar is rendered
    cy.visit('http://localhost:5173');
  });

  it('should successfully sign in with valid credentials', () => {
    // Mock the successful API response
    cy.intercept('POST', '**/checkpassword', {
      statusCode: 200,
      body: {
        userName: 'Thando',
        email: validUser.email,
        message: 'Login successful',
      },
    }).as('signinRequest');

    // Open the sign-in modal
    cy.get('.account').click();
    cy.get('.account-dropdown .sign-in').click();

    // Verify the sign-in modal is visible
    cy.get('.modal-overlay').should('be.visible');
    cy.get('.modal-content').should('contain', 'Sign In');

    // Fill out the sign-in form
    cy.get('.modal-content input[placeholder="Email"]').type(validUser.email);
    cy.get('.modal-content input[placeholder="Password"]').type(validUser.password);

    // Submit the form
    cy.get('.modal-content button[type="submit"]').click();

    // Verify the API request was made
    cy.wait('@signinRequest').its('request.body').should('deep.equal', {
      email: validUser.email,
      password: validUser.password,
    });

    // Verify the success alert
    cy.on('window:alert', (text) => {
      expect(text).to.contain('Login successful! Welcome, Thando!');
    });

    // Verify the modal closes
    cy.get('.modal-overlay').should('not.exist');

    // Verify navigation to the redirect target (default '/')
    cy.url().should('eq', 'http://localhost:5173/');
  });
});