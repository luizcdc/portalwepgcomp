describe('Componente dos Formulários de Sessão', () => {
    beforeEach(() => {
      cy.fixture('usuarios').as('userData');
      cy.login('profsuperadmin@example.com', 'string'); // insert super-admin credentials
      cy.visit('/sessoes');
      cy.wait(2000);

    });

      it('Deve validar mensagens de erro para campos obrigatórios na Sessão de Apresentações', () => {
        cy.get('button[data-bs-target="#sessaoModal"]').contains('Incluir Sessão').click();
        cy.get('#sessao-tipo-radio-1').click();
        cy.get('button[type="submit"]').first().click();
        cy.get('.error-message').should('contain', 'Número de apresentações é obrigatório');
        cy.get('.error-message').should('contain', 'Sala é obrigatória');
        // cy.get('.error-message').should('contain', 'Data e horário de início são obrigatórios');
        
      });

      it('Deve validar mensagens de erro para campos obrigatórios na Sessão Geral', () => {
        cy.get('button[data-bs-target="#sessaoModal"]').contains('Incluir Sessão').click();
        cy.get('button[type="submit"]').first().click();
        cy.get('.error-message').should('contain', 'Título é obrigatório');
        cy.get('.error-message').should('contain', 'Sala é obrigatória');
        // cy.get('.error-message').should('contain', 'Data e horário de início são obrigatórios');
        // cy.get('.error-message').should('contain', 'Data e horário de final são obrigatórios');
        
      });

      it('Deve preencher e enviar o formulário de Sessão de Apresentações com sucesso', () => {
        cy.get('button[data-bs-target="#sessaoModal"]').contains('Incluir Sessão').click();
        cy.get('#sessao-tipo-radio-1').click();

        cy.get('input#sg-titulo-input').type('3');
        cy.get('select#sa-sala-select').select('Auditório Principal');
        cy.get('#sa-inicio-data').click();
        cy.get('.react-datepicker__day--020').click();
        cy.get('.react-datepicker__time-list-item')
        .contains('14:00')
        .click(); 
    
        cy.get('button[type="submit"]').first().click();
    
        cy.contains('Cadastro de sessão realizado com sucesso!').should('be.visible');

      });

      it('Deve preencher e enviar o formulário de Sessão Geral com sucesso', () => {
        cy.get('button[data-bs-target="#sessaoModal"]').contains('Incluir Sessão').click();

        cy.get('input#sg-titulo-input').type('Sessão de Teste ' + Math.floor(Math.random() * 1000));
        cy.get('input#sg-nome-input').type('Palestrante de Teste ' + Math.floor(Math.random() * 1000));
        cy.get('select#sg-sala-select').select('Auditório Principal');
        cy.get('#sg-inicio-data').click();
        cy.get('.react-datepicker__day--019').click();
        cy.get('.react-datepicker__time-list-item')
        .contains('14:00')
        .click(); 
        cy.get('#sg-final-data').click();
        cy.get('.react-datepicker__day--019').click();
        cy.get('.react-datepicker__time-list-item')
        .contains('16:00')
        .click(); 
    
        cy.get('button[type="submit"]').first().click();
    
        cy.contains('Cadastro de sessão realizado com sucesso!').should('be.visible');

      });

      it('Deve editar e enviar o formulário de uma sessão com sucesso', () => {
        cy.wait(5000);
        cy.get('.listagem-template-cards')
            .find('.card-listagem')
            .first()
            .find('#edit-button')
            .click(); 
            
        cy.get('#sa-inicio-data').click();
        cy.get('.react-datepicker__day--020').click();
        cy.get('.react-datepicker__time-list-item')
        .contains('14:30')
        .click(); 

        cy.get('button[type="submit"]').first().click();

        cy.contains('Atualização de sessão realizada com sucesso!').should('be.visible');
      });


  
  });
  