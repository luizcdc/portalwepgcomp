describe('Componente do Formulário de Cadastro de Apresentação', () => {
    beforeEach(() => {
      cy.fixture('usuarios').as('userData');
    });
  
    it('Deve mostrar mensagens de erro para campos obrigatórios não preenchidos', function () {
      const { doutorando } = this.userData;

      cy.login(doutorando.email, doutorando.senha); // insert doctoral student credentials
      cy.visit('/cadastro-apresentacao');

      cy.get('button[type="submit"]').click();

      cy.get('button[type="submit"]').click();
  
      cy.contains('O título é obrigatório').should('be.visible');
      cy.contains('O abstract é obrigatório').should('be.visible');
      cy.contains('O orientador é obrigatório').should('be.visible');
      cy.contains('O celular deve conter 10 ou 11 dígitos').should('be.visible');
    });
    // uncomment when the issue was fixed
    // it('Deve permitir ao doutorando preencher e submeter o formulário com sucesso', function () {
    //   const num = Math.floor(Math.random() * 1000);
    //   const { professor, doutorando } = this.userData;

    //   cy.login(doutorando.email, doutorando.senha); // insert doctoral student credentials
    //   cy.visit('/cadastro-apresentacao');

    //   cy.get('button[type="submit"]').click();
    //   cy.get('input[placeholder="Insira o título da pesquisa"]').type('Título de Teste ' + num);
    //   cy.get('textarea[placeholder="Insira o resumo da pesquisa"]').type('Resumo de teste para validação.');
    //   cy.get('#orientador-select').select(professor.nome); 
    //   cy.get('input[placeholder="(XX) XXXXX-XXXX"]').type('11987654321');
    //   cy.get('input[type="file"]').selectFile('cypress/fixtures/example.pdf');
    //   cy.get('button[type="submit"]').click();
    
    //   cy.contains('Apresentação cadastrada com sucesso!').should('be.visible');
    //   cy.url().should('include', '/minha-apresentacao');
    // });
    // uncomment when the issue was fixed
    // it('Deve permitir ao doutorando editar e submeter o formulário com sucesso', function () {
    //   const { doutorando } = this.userData;
      
    //   cy.login(doutorando.email, doutorando.senha); // insert doctoral student credentials
    //   cy.visit('/minha-apresentacao');

    //   cy.get('.listagem-template-cards')
    //       .find('.card-listagem')
    //       .first()
    //       .find('#edit-button')
    //       .click();

    //   cy.get('button[type="submit"]').click();
    //   cy.get('input[placeholder="Insira o nome do coorientador"]').type('Coorientador de Teste');
    //   cy.get('button[type="submit"]').click();
    
    //   cy.contains('Apresentação cadastrada com sucesso!').should('be.visible');
    //   cy.url().should('include', '/minha-apresentacao');
    // });

    it('Deve permitir a um admin preencher e submeter um formulário com sucesso', function () {
      const num = Math.floor(Math.random() * 1000);

      cy.login('profsuperadmin@example.com', 'string'); // insert admin credentials
      cy.visit('/cadastro-apresentacao');

      const { professor } = this.userData;
      cy.get('#doutorando-select').select('Ernesto Reis'); // insert doctoral student name 
      cy.get('button[type="submit"]').click();
      cy.get('input[placeholder="Insira o título da pesquisa"]').type('Título de Teste ' + num);
      cy.get('textarea[placeholder="Insira o resumo da pesquisa"]').type('Resumo de teste para validação.');
      cy.get('#orientador-select').select(professor.nome); 
      cy.get('input[placeholder="(XX) XXXXX-XXXX"]').type('11987654321');
      cy.get('input[type="file"]').selectFile('cypress/fixtures/example.pdf');
      cy.get('button[type="submit"]').click();

      cy.contains('Apresentação cadastrada com sucesso!').should('be.visible');  
      // cy.url().should('include', '/apresentacoes');
    });

    it('Deve permitir a um admin editar e submeter um formulário com sucesso', function () {
      cy.login('profsuperadmin@example.com', 'string'); // insert admin credentials
      cy.visit('/apresentacoes');

      cy.wait(5000);
      cy.get('.listagem-template-cards')
          .find('.card-listagem')
          .first()
          .find('#edit-button')
          .click();

      cy.get('input[placeholder="Insira o nome do coorientador"]').type('Coorientador de Teste');
      cy.get('button[type="submit"]').click();

      cy.contains('Apresentação editada com sucesso!').should('be.visible');
      cy.url().should('include', '/apresentacoes');
    });
  
  });
  