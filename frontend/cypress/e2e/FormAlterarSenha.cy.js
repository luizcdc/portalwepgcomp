describe('Componente do Formulário de Alterar Senha', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Deve clicar no Link "Esqueceu sua senha?"', () => {

    cy.visit('http://localhost:3000/Login');
    cy.get('.button-password').click();
    cy.get('.modal-alterar-senha').click();
    cy.get('#senha').clear().type('NovaSenha123!');
    cy.get('#confirmaSenha').clear().type('NovaSenha123!');
    cy.get('.submit-button').click();


  });

});