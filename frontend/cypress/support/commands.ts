/// <reference types="cypress" />
// ***********************************************

Cypress.Commands.add("generateJwtToken", (userId: string) => {
    cy.request({
      method: "GET",
      url: `http://localhost:3001/auth/generate-token/${userId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      return response.body.token; // Retorna o token JWT gerado
    });
  });

  Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login');
    cy.wait(2000);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
  