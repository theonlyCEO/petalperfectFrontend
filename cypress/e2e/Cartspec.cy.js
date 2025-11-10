describe('Cart Page Access with Authentication', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('http://localhost:5173/');
  });

  it('should sign in, add a product to the cart from the homepage, and open the cart via the navbar link', () => {
    // Wait for the homepage to load
    cy.get('.homepage', { timeout: 10000 }).should('be.visible');

    // Wait for the real products API response from MongoDB
    cy.intercept('GET', 'http://localhost:3000/products').as('getProducts');
    cy.wait('@getProducts', { timeout: 15000 }).its('response.statusCode').should('be.oneOf', [200, 304]);

    // Verify that the products section is visible
    cy.get('.products').should('be.visible');
    cy.get('.product-grid .product-card').should('have.length.greaterThan', 0);

    // Store the first product's title for verification
    let productTitle;
    cy.get('.product-grid .product-card').first().within(() => {
      cy.get('h3').invoke('text').then((title) => {
        productTitle = title.trim();
      });
    });

    // Sign in to authenticate the user
    cy.get('.navbar .icons .account').click();
    cy.get('.account-dropdown .sign-in').click();
    cy.get('.modal-content').should('be.visible');
    cy.get('.flower-form input[type="email"]').type('darwin@gmail.com');
    cy.get('.flower-form input[type="password"]').type('password123');

    // Mock the sign-in API response to simulate successful login
    cy.intercept('POST', 'http://localhost:3000/checkpassword', {
      statusCode: 200,
      body: {
        userName: 'Darwin',
        email: 'darwin@gmail.com',
      },
    }).as('signIn');

    // Submit the sign-in form
    cy.get('.flower-form button[type="submit"]').click();
    cy.wait('@signIn', { timeout: 10000 });

    // Verify sign-in success (modal closes, user is updated in navbar)
    cy.get('.modal-content').should('not.exist');
    cy.get('.navbar .icons .account .label').should('have.text', 'Darwin');

    // Add the first product to the cart
    cy.get('.product-grid .product-card').first().within(() => {
      cy.get('button').contains('Add to Cart').click();
    });

    // Navigate to the Cart page via the navbar link
    cy.get('.nav-links a').contains('Cart').click();

    // Verify navigation to the Cart page
    cy.url().should('include', '/cart');
    cy.get('.cart-page', { timeout: 5000 }).should('be.visible');

    // Verify basic Cart page content
    // cy.get('.cart-title').contains('Cart').should('be.visible');
    // cy.get('.cart-products .cart-product').should('have.length', 1);
    // cy.get('.cart-product').first().within(() => {
    //   cy.get('h4').should('have.text', productTitle);
    // });

    // Ensure no unexpected authentication modals are open
    cy.get('.modal-content').should('not.exist');
  });

  it('should sign in, add a product, and open the Cart page via the mobile menu navbar link', () => {
    // Set viewport to mobile size
    cy.viewport('iphone-6');

    // Wait for the homepage to load
    cy.get('.homepage', { timeout: 10000 }).should('be.visible');

    // Wait for the real products API response from MongoDB
    cy.intercept('GET', 'http://localhost:3000/products').as('getProducts');
    cy.wait('@getProducts', { timeout: 15000 }).its('response.statusCode').should('be.oneOf', [200, 304]);

    // Store the first product's title
    let productTitle;
    cy.get('.product-grid .product-card').first().within(() => {
      cy.get('h3').invoke('text').then((title) => {
        productTitle = title.trim();
      });
    });

    // Sign in to authenticate the user
    cy.get('.navbar .burger-menu').click();
    cy.get('.nav-links.open').should('be.visible');
    cy.get('.navbar .icons .account').click();
    cy.get('.account-dropdown .sign-in').click();
    cy.get('.modal-content').should('be.visible');
    cy.get('.flower-form input[type="email"]').type('darwin@gmail.com');
    cy.get('.flower-form input[type="password"]').type('password123');

    // Mock the sign-in API response
    cy.intercept('POST', 'http://localhost:3000/checkpassword', {
      statusCode: 200,
      body: {
        userName: 'Darwin',
        email: 'darwin@gmail.com',
      },
    }).as('signIn');

    // Submit the sign-in form
    cy.get('.flower-form button[type="submit"]').click();
    cy.wait('@signIn', { timeout: 10000 });

    // Verify sign-in success
    cy.get('.modal-content').should('not.exist');
    cy.get('.navbar .icons .account .label').should('have.text', 'Darwin');

    // Add the first product to the cart
    cy.get('.product-grid .product-card').first().within(() => {
      cy.get('button').contains('Add to Cart').click();
    });

    // Navigate to the Cart page via the mobile menu navbar link
    cy.get('.navbar .burger-menu').click();
    cy.get('.nav-links.open').should('be.visible');
    cy.get('.nav-links a').contains('Cart').click();

    // Verify navigation to the Cart page
    cy.url().should('include', '/cart');
    cy.get('.cart-page', { timeout: 5000 }).should('be.visible');

    

    // Ensure no unexpected authentication modals are open
    cy.get('.modal-content').should('not.exist');
  });
});