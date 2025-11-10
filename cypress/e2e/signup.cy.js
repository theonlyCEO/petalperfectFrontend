describe('Navbar Signup Flow - Successful Signup', () => {
  // Define test data
  const validUser = {
    username: 'Bond',
    email: 'jameBond@gmail.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  };

  beforeEach(() => {
    // Visit the homepage where the Navbar is rendered
    cy.visit('http://localhost:5173');
  });

  it('should successfully sign up with valid credentials', () => {
    // Mock the successful API response
    cy.intercept('POST', '**/signup', {
      statusCode: 201,
      body: {
        userName: validUser.username,
        email: validUser.email,
        message: 'Signup successful',
      },
    }).as('signupRequest');

    // Open the signup modal
    cy.get('.account').click();
    cy.get('.account-dropdown .register').click();

    // Verify the signup modal is visible
    cy.get('.modal-overlay').should('be.visible');
    cy.get('.modal-content').should('contain', 'Sign Up');

    // Fill out the signup form
    cy.get('.modal-content input[placeholder="Username"]').type(validUser.username);
    cy.get('.modal-content input[placeholder="Email"]').type(validUser.email);
    cy.get('.modal-content input[placeholder="Password"]').type(validUser.password);
    cy.get('.modal-content input[placeholder="Confirm Password"]').type(validUser.confirmPassword);

    // Submit the form
    cy.get('.modal-content button[type="submit"]').click();

    // Verify the API request was made
    cy.wait('@signupRequest').its('request.body').should('deep.equal', {
      userName: validUser.username,
      email: validUser.email,
      password: validUser.password,
      confirmPassword: validUser.confirmPassword,
    });

    // Verify the success alert
    cy.on('window:alert', (text) => {
      expect(text).to.contain(`Signup successful! Welcome, ${validUser.username}!`);
    });

    // Verify the modal closes
    cy.get('.modal-overlay').should('not.exist');

    // Verify navigation to the redirect target (default '/')
    cy.url().should('eq', 'http://localhost:5173/');
  });
});