describe('Componente do Formulário de Alterar Senha', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Deve clicar no Link "Esqueceu sua senha?"', () => {

    cy.visit('/login');
    cy.get('.button-password').click();
    cy.get('#modal-alterar-senha').should('be.visible');
    cy.get('.modal-alterar-senha').click({force:true});    
    cy.get('#email-alterar-senha').type('joao.silva@ufba.br');
    cy.get('.submit-button').click();


  });

});