//import './commands';

describe('Cadastro de Apresentação', () => {
    beforeEach(() => {
      // Reutiliza a sessão de login para cada teste
      cy.session('login', () => {
        cy.login('docadmin@example.com', '1234$Ad@');
      });
    });
  
    it('deve cadastrar uma apresentação com sucesso', () => {
      cy.visit('/CadastroApresentacao');
     
      // Navega para a área de cadastro
      cy.get('.dropdown-toggle').click();
      cy.get('li:nth-child(2) > .dropdown-item').click();
      cy.get('.listagem-template-user-area img').click();
  
      // Preenchendo o formulário de cadastro
      cy.get('.col-12:nth-child(1) > .form-control')
        .click()
        .type('Trabalho para apresentar no Wepgcomp');
  
      cy.get('.col-12:nth-child(2) > .form-control')
        .click()
        .type('{leftarrow}{backspace}')
        .type('Trabalho de pós-graduação para apresentar Wepgcomp.');
  
      cy.get('#orientador-select').click().type('orientador1').click();
  
      cy.get('.col-12:nth-child(4) > .form-control')
        .click()
        .type('Rodrigo Rocha');
  
      cy.get('#sa-inicio-data').click(); // Configurar data se necessário
  
      cy.get('.col-12:nth-child(6) > .form-control').attachFile(
        'A disponibilização de vocabulário controlado aos usuários para a recuperação da informação.pdf'
      );
  
      cy.get('.col-12:nth-child(7) > .form-control')
        .click()
        .type('71999999999');
  
      // Submete o formulário
      cy.get('.fs-5').click();
      cy.get('.row').submit();
  
      // Confirmação de sucesso
      cy.get('.btn-primary').click();
  
      // Validação de sucesso (ajuste conforme feedback esperado da aplicação)
      cy.contains('Cadastro realizado com sucesso!').should('be.visible');
    });
  });
  