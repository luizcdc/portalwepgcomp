//import './commands';

describe('Componente do Formulário de Cadastro de Apresentação', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.fixture('usuarios').as('userData');
      cy.login('joao.silva@ufba.br', 'SenhaInvalida1234!');
      cy.visit('/cadastro-apresentacao');

    });
  
    it('Deve mostrar mensagens de erro para campos obrigatórios não preenchidos', function () {

      cy.get('button[type="submit"]').click();

      cy.get('button[type="submit"]').click();
  
      cy.contains('O título é obrigatório').should('be.visible');
      cy.contains('O abstract é obrigatório').should('be.visible');
      cy.contains('O orientador é obrigatório').should('be.visible');
      cy.contains('O celular deve conter 10 ou 11 dígitos').should('be.visible');
    });
  
    it('Deve permitir preencher e submeter o formulário com sucesso', function () {

      const { professor } = this.userData;
      cy.get('button[type="submit"]').click();
      cy.get('input[placeholder="Insira o título da pesquisa"]').type('Título de Teste');
      cy.get('textarea[placeholder="Insira o resumo da pesquisa"]').type('Resumo de teste para validação.');
      cy.get('#orientador-select').select(professor.nome); 
      cy.get('input[placeholder="(XX) XXXXX-XXXX"]').type('11987654321');
      cy.get('input[type="file"]').selectFile('cypress/fixtures/example.pdf');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('include', '/minha-apresentacao');
    });
  
  });
  