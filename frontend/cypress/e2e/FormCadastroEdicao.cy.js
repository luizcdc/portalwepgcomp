describe('Componente do Formulário de Cadastro de Edição', () => {
    beforeEach(() => {
      cy.fixture('usuarios').as('userData');
      cy.login('profsuperadmin@example.com', 'string'); // insert super-admin credentials

    });

      it('Deve validar mensagens de erro para campos obrigatórios', () => {
        cy.visit('/cadastro-edicao');
        cy.wait(2000);
        cy.get('button.submit-button').click();
        
        cy.get('#nomeEvento').next('.error-message').should('contain', 'Nome do evento é obrigatório!');
        cy.get('#descricao').next('.error-message').should('contain', 'Descrição do evento é obrigatório!');
        // cy.get('#ed-inicio-data').parent().next('.error-message').should('contain', 'Data e horário de início são obrigatórios!');
        // cy.get('#ed-final-data').parent().next('.error-message').should('contain', 'Data e horário de fim são obrigatórios!');
        cy.get('#local').next('.error-message').should('contain', 'Local do Evento é obrigatório!');
        cy.get('#submissao').next('.error-message').should('contain', 'O texto para submissão é obrigatório!');
        // cy.get('#ed-deadline-data').parent().next('.error-message').should('contain', 'A data limite para submissão é obrigatória!');
      });

      it('Deve preencher e enviar o formulário com sucesso', () => {
        const num = Math.floor(Math.random() * 1000);
        cy.visit('/cadastro-edicao');
        cy.get('button.submit-button').click();
        cy.get('#nomeEvento').type('Evento de Teste Cypress');
        cy.get('#descricao').type('Descrição do evento de teste Cypress ' + num);
        
        cy.get('#ed-inicio-data').click();
        cy.get('.react-datepicker__day--015').click();
    
        cy.get('#ed-final-data').click();
        cy.get('.react-datepicker__day--020').click();
    
        cy.get('#local').type('Auditório Principal');
        
        cy.get('#comissao-select').click().type('{enter}'); // Simula seleção de opções
        cy.get('#apoio-select').click().type('{enter}');
        cy.get('#apoioAd-select').click().type('{enter}');
        cy.get('#comunicacao-select').click().type('{enter}');
    
        cy.get('#quantidadeSessão').clear().type('5');
        cy.get('#sessao').clear().type('30');
    
        cy.get('#submissao').type('Texto para chamada de submissão de trabalhos');
        
        cy.get('#ed-deadline-data').click();
        cy.get('.react-datepicker__day--025').click();
    
        cy.get('button.submit-button').click();
    
        cy.url().should('include', '/home'); 
      });

      it('Deve editar e enviar o formulário com sucesso', () => {
        cy.visit('/edicoes');
        cy.get('.listagem-template-cards')
          .find('.card-listagem')
          .first()
          .find('#edit-button')
          .click();
          cy.wait(2000);
        cy.get('#nomeEvento').clear().type('Evento de Teste Cypress');
        cy.get('button.submit-button').click();
        cy.contains('Edição atualizada com sucesso!').should('be.visible');
        
      });
  
  });
  