describe('Componente do Formulário de Cadastro de Edição', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.fixture('usuarios').as('userData');
      cy.login('profsuperadmin@example.com', 'string'); // insert super-admin credentials
      cy.visit('/cadastro-edicao');

    });
    // uncomment when the issue was fixed
    //   it('Deve validar mensagens de erro para campos obrigatórios', () => {
    //     cy.get('button.submit-button').click();
    //     cy.get('button.submit-button').click();
        
    //     cy.get('#nomeEvento').next('.error-message').should('contain', 'Nome do evento é obrigatório!');
    //     cy.get('#descricao').next('.error-message').should('contain', 'Descrição do evento é obrigatório!');
    //     cy.get('#ed-inicio-data').parent().next('.error-message').should('contain', 'Data e horário de início são obrigatórios!');
    //     cy.get('#ed-final-data').parent().next('.error-message').should('contain', 'Data e horário de fim são obrigatórios!');
    //     cy.get('#local').next('.error-message').should('contain', 'Local do Evento é obrigatório!');
    //     cy.get('#submissao').next('.error-message').should('contain', 'O texto para submissão é obrigatório!');
    //     cy.get('#ed-deadline-data').parent().next('.error-message').should('contain', 'A data limite para submissão é obrigatória!');
    //   });

      it('Deve preencher e enviar o formulário com sucesso', () => {
        cy.get('button.submit-button').click();
        cy.get('#nomeEvento').type('Evento de Teste Cypress');
        cy.get('#descricao').type('Descrição do evento de teste Cypress');
        
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
  
  });
  