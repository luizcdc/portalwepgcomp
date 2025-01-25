/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      generateJwtToken(userId: string): Chainable<string>;
    }
  }
  