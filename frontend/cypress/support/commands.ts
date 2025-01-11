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