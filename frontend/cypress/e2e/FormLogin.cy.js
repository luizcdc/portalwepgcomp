describe('Componente do Formulário de Login', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.fixture('usuarios').as('userData');
    });
  
    it('Deve renderizar o formulário com todos os campos', () => {
      cy.wait(2000);
      cy.get('form').should('exist');
      cy.get('input#email').should('exist').and('have.attr', 'type', 'email');
      cy.get('input#password').should('exist').and('have.attr', 'type', 'password');
      cy.get('button[type="submit"]').should('exist').and('contain', 'Entrar');
    });
  
    it('Não deve permitir o login com credenciais inválidas', () => {
      cy.wait(2000);
      // Preencher o formulário com dados inválidos
      cy.get('input#email').type('joao.silva@ufba.br');
      cy.get('input#password').type('SenhaInvalida123!');
      cy.get('button[type="submit"]').click();

      cy.contains('Email ou senha inválido').should('be.visible');

    });
  
    it('Deve exibir o botão "Esqueceu sua senha?"', () => {
      cy.wait(2000);
      cy.get('.button-password').should('exist').and('contain', 'Esqueceu sua senha?');
    });
      
    it('Deve permitir o login com credenciais válidas de doutorando', function () {
      const { doutorando } = this.userData;
      cy.wait(2000);
  
      // Preencher o formulário
      cy.get('input#email').type(doutorando.email);
      cy.get('input#password').type(doutorando.senha);
      cy.get('button[type="submit"]').click();
       
      // Verifica redirecionamento
      cy.location('pathname').should('eq', '/home');
    });
  
    it('Deve permitir o login com credenciais válidas de professor', function () {
      const { professor } = this.userData;
      cy.wait(2000);
  
      cy.get('input#email').type(professor.email);
      cy.get('input#password').type(professor.senha);
      cy.get('button[type="submit"]').click();
      
      cy.location('pathname').should('eq', '/home');
    });
  
    it('Deve permitir o login com credenciais válidas de ouvinte', function () {
      const { ouvinte } = this.userData;
      cy.wait(2000);
  
      cy.get('input#email').type(ouvinte.email);
      cy.get('input#password').type(ouvinte.senha);
      cy.get('button[type="submit"]').click();
        
      cy.location('pathname').should('eq', '/home');
    });
  });
  