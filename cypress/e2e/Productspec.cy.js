describe('Product Page Access via Navbar', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('http://localhost:5173/');
  });

  it('should navigate to the Category page from the navbar and verify products display without authentication', () => {
    // Wait for the navbar to be visible
    cy.get('.navbar').should('be.visible');

    // Find and click the "Category" link in the navbar
    cy.get('.nav-links a').contains('Category').click();

    // Verify navigation to the Category page
    cy.url().should('include', '/Category');

    // Wait for the loading state to disappear (since the Category page takes time to load)
    cy.get('.category-page', { timeout: 10000 }).should('be.visible'); // Adjust timeout as needed

    // Check that the loading component (FlowerLoader) is not present after loading
    cy.get('.flower-loader').should('not.exist');

    // Verify that the Category page content is displayed
    cy.get('.category-page h2').contains('Shop All Flowers').should('be.visible');

    // Verify that products are displayed in the category grid
    cy.get('.category-grid .category-card').should('have.length.greaterThan', 0);

    // Optionally, check for specific elements in a product card
    cy.get('.category-card').first().within(() => {
      cy.get('.product-image-container img').should('be.visible');
      cy.get('.product-info h3').should('be.visible');
      cy.get('.price-section .regular-price').should('be.visible');
      cy.get('.add-cart-btn').should('be.visible');
      cy.get('.wishlist-btn').should('be.visible');
    });

    // Verify that no authentication modals (SignIn/Signup) are triggered
    cy.get('.signin-modal').should('not.exist');
    cy.get('.signup-modal').should('not.exist');
  });

  it('should verify mobile menu navigation to Category page', () => {
    // Set viewport to mobile size
    cy.viewport('iphone-6');

    // Wait for the navbar to be visible
    cy.get('.navbar').should('be.visible');

    // Click the burger menu to open the mobile menu
    cy.get('.burger-menu').click();

    // Verify that the mobile menu is open
    cy.get('.nav-links.open').should('be.visible');

    // Click the "Category" link in the mobile menu
    cy.get('.nav-links a').contains('Category').click();

    // Verify navigation to the Category page
    cy.url().should('include', '/Category');

    // Wait for the loading state to disappear
    cy.get('.category-page', { timeout: 10000 }).should('be.visible');

    // Check that the loading component is not present
    cy.get('.flower-loader').should('not.exist');

    // Verify that the Category page content is displayed
    cy.get('.category-page h2').contains('Shop All Flowers').should('be.visible');

    // Verify that products are displayed
    cy.get('.category-grid .category-card').should('have.length.greaterThan', 0);
  });
});