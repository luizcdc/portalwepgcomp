/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      /**
       * Gera um token JWT para um usuário específico.
       * @param userId ID do usuário para gerar o token.
       */
      generateJwtToken(userId: string): Chainable<string>;
  
      /**
       * Realiza o login no sistema.
       * @param email O email do usuário.
       * @param password A senha do usuário.
       */
      login(email: string, password: string): Chainable<void>;
    }
  }
  